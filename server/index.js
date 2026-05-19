/**
 * server/index.js — Echo Systems Contact Form API
 *
 * Runs as a standalone Express server on PORT (default 4000),
 * separate from the Vite dev server (3000).
 * Vite proxies /api/* → this server in development.
 *
 * NOTE on replyTo vs from:
 *   Gmail (and most SMTP providers) only allow sending FROM addresses
 *   that belong to the authenticated account. Setting `from` to the
 *   visitor's email would either be rejected or silently overridden.
 *   Instead we set:
 *     from:    "Website Contact" <GMAIL_USER>   ← always our own address
 *     replyTo: visitor's email                  ← so "Reply" in any mail
 *                                                  client goes back to them
 *   This is the correct, RFC-compliant pattern for contact forms.
 */

'use strict';

import 'dotenv/config';
import express from 'express';
import nodemailer from 'nodemailer';

const app = express();
const PORT = parseInt(process.env.PORT ?? '4000', 10);

// ── CORS (development only — in prod requests come through the same origin) ──
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:4173', // vite preview
  ];
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json({ limit: '16kb' }));

// ── In-memory rate limiter (no external deps) ────────────────────────────────
// Allows MAX_REQUESTS per IP within WINDOW_MS.
const WINDOW_MS     = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS  = 5;

/** @type {Map<string, { count: number, resetAt: number }>} */
const rateLimitStore = new Map();

function rateLimit(req, res, next) {
  const ip  = req.headers['x-forwarded-for']?.split(',')[0].trim() ?? req.socket.remoteAddress ?? 'unknown';
  const now = Date.now();
  const rec = rateLimitStore.get(ip);

  if (!rec || now > rec.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return next();
  }

  if (rec.count >= MAX_REQUESTS) {
    console.warn(`[rate-limit] IP ${ip} hit limit`);
    return res.status(429).json({ ok: false, message: 'Too many requests. Please try again later.' });
  }

  rec.count += 1;
  next();
}

// Cleanup stale entries every 30 minutes so the Map doesn't grow forever
setInterval(() => {
  const now = Date.now();
  for (const [ip, rec] of rateLimitStore) {
    if (now > rec.resetAt) rateLimitStore.delete(ip);
  }
}, 30 * 60 * 1000);

// ── Nodemailer transporter ───────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password, NOT your account password
  },
});

// ── POST /api/contact ────────────────────────────────────────────────────────
app.post('/api/contact', rateLimit, async (req, res) => {
  const { name, email, subject, message, _hp } = req.body ?? {};

  // Honeypot check — bots fill hidden fields, legitimate users never do.
  // We return 200 to avoid revealing the trap to scrapers.
  if (_hp) {
    console.log('[honeypot] bot submission silently ignored');
    return res.status(200).json({ ok: true });
  }

  // ── Server-side input sanitisation ──
  const safeName    = String(name    ?? '').trim();
  const safeEmail   = String(email   ?? '').trim().toLowerCase();
  const safeSubject = String(subject ?? '').trim();
  const safeMessage = String(message ?? '').trim();

  // ── Server-side validation ───────────────────────────────────────────────
  const errors = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!safeName)                          errors.push('Name is required.');
  if (safeName.length > 100)              errors.push('Name must be ≤ 100 characters.');
  if (!safeEmail)                         errors.push('Email is required.');
  if (!emailRegex.test(safeEmail))        errors.push('Email is not valid.');
  if (safeEmail.length > 150)            errors.push('Email must be ≤ 150 characters.');
  if (!safeSubject)                       errors.push('Subject is required.');
  if (safeSubject.length > 150)          errors.push('Subject must be ≤ 150 characters.');
  if (!safeMessage)                       errors.push('Message is required.');
  if (safeMessage.length > 5000)         errors.push('Message must be ≤ 5000 characters.');

  if (errors.length > 0) {
    return res.status(400).json({ ok: false, message: errors.join(' ') });
  }

  // ── Build email ──────────────────────────────────────────────────────────
  const sentAt = new Date().toLocaleString('en-GB', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Europe/Warsaw',
  });

  const textBody = [
    `New contact form submission — Echo Systems`,
    ``,
    `Name:    ${safeName}`,
    `Email:   ${safeEmail}`,
    `Subject: ${safeSubject}`,
    `Sent:    ${sentAt}`,
    ``,
    `--- Message ---`,
    safeMessage,
  ].join('\n');

  const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><style>
  body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
  .wrap { max-width: 600px; margin: 32px auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,.08); }
  .header { background: #0c0c0c; padding: 28px 32px; }
  .header h1 { color: #fff; font-size: 20px; margin: 0; letter-spacing: -.5px; }
  .header span { color: rgba(255,255,255,.4); font-size: 12px; display: block; margin-top: 4px; }
  .body { padding: 32px; }
  .field { margin-bottom: 20px; }
  .label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 4px; }
  .value { font-size: 15px; color: #111; word-break: break-word; }
  .msg-box { background: #f9f9f9; border-left: 3px solid #0c0c0c; padding: 16px 20px; border-radius: 4px; font-size: 15px; color: #333; white-space: pre-wrap; line-height: 1.6; }
  .footer { border-top: 1px solid #eee; padding: 16px 32px; font-size: 11px; color: #aaa; }
</style></head>
<body>
<div class="wrap">
  <div class="header">
    <h1>New Contact Form Submission</h1>
    <span>Echo Systems — echo.systems</span>
  </div>
  <div class="body">
    <div class="field"><div class="label">Name</div><div class="value">${escapeHtml(safeName)}</div></div>
    <div class="field"><div class="label">Email</div><div class="value"><a href="mailto:${escapeHtml(safeEmail)}" style="color:#0c0c0c">${escapeHtml(safeEmail)}</a></div></div>
    <div class="field"><div class="label">Subject</div><div class="value">${escapeHtml(safeSubject)}</div></div>
    <div class="field"><div class="label">Sent</div><div class="value">${sentAt}</div></div>
    <div class="field">
      <div class="label">Message</div>
      <div class="msg-box">${escapeHtml(safeMessage)}</div>
    </div>
  </div>
  <div class="footer">This email was sent via the contact form on echo.systems. Reply directly to respond to the sender.</div>
</div>
</body></html>`;

  // ── Send ─────────────────────────────────────────────────────────────────
  try {
    await transporter.sendMail({
      // from must be our own Gmail address — SMTP providers reject foreign addresses in from.
      // replyTo is set to the visitor's email so that "Reply" in any mail client
      // goes directly back to the person who filled the form.
      // to: we send back to GMAIL_USER itself (same inbox that sends the mail).
      from:    `"Website Contact" <${process.env.GMAIL_USER}>`,
      replyTo: `"${safeName}" <${safeEmail}>`,
      to:      process.env.GMAIL_USER,
      subject: `[Contact Form] ${safeSubject}`,
      text:    textBody,
      html:    htmlBody,
    });

    console.log(`[contact] mail sent | from: ${safeEmail} | subject: ${safeSubject}`);
    return res.status(200).json({ ok: true });

  } catch (err) {
    // Do NOT expose internal SMTP error details to the client
    console.error('[contact] mail send failed:', err?.message ?? err);
    return res.status(500).json({ ok: false, message: 'Failed to send message. Please try again later.' });
  }
});

// ── HTML entity escaping (no external deps) ──────────────────────────────────
function escapeHtml(str) {
  return str
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#39;');
}

// ── Start ────────────────────────────────────────────────────────────────────
transporter.verify((err) => {
  if (err) {
    console.error('[smtp] transporter verification failed:', err.message);
    console.error('       Check GMAIL_USER and GMAIL_APP_PASSWORD in .env');
  } else {
    console.log('[smtp] transporter ready ✓');
  }
});

app.listen(PORT, () => {
  console.log(`[server] Echo Systems API listening on http://localhost:${PORT}`);
});
