import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

interface IntroScreenProps {
  onDone: () => void;
}

export default function IntroScreen({ onDone }: IntroScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activated, setActivated] = useState(false);
  const [exiting, setExiting] = useState(false);
  const doneCalledRef = useRef(false);

  // Lock body scroll for the entire duration of the intro
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const dismiss = useCallback(() => {
    if (doneCalledRef.current) return;
    doneCalledRef.current = true;
    setExiting(true);
  }, []);

  // Activate on first mouse move or scroll
  useEffect(() => {
    const activate = () => {
      if (activated) return;
      setActivated(true);
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    };
    window.addEventListener("mousemove", activate, { once: true, passive: true });
    window.addEventListener("wheel", activate, { once: true, passive: true });
    window.addEventListener("touchstart", activate, { once: true, passive: true });
    return () => {
      window.removeEventListener("mousemove", activate);
      window.removeEventListener("wheel", activate);
      window.removeEventListener("touchstart", activate);
    };
  }, [activated]);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {!exiting && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
        >
          {/* Video — always mounted, plays after first interaction */}
          <video
            ref={videoRef}
            preload="auto"
            playsInline
            muted
            onEnded={dismiss}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ pointerEvents: "none" }}
          >
            {/* Local file (dev / self-hosted) */}
            <source src="/intro.mp4" type="video/mp4" />
            {/* Google Drive streaming fallback (production) */}
            <source
              src="https://drive.usercontent.google.com/download?id=1a5ATyFVYfLtoXFT_QYB3VJvw0rX51IYa&export=download&authuser=0&confirm=t"
              type="video/mp4"
            />
          </video>

          {/* Dark vignette overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)",
            }}
          />

          {/* Idle hint — shown before activation */}
          <AnimatePresence>
            {!activated && (
              <motion.div
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none select-none"
              >
                {/* Subtle pulse ring */}
                <motion.div
                  className="w-16 h-16 rounded-full border border-white/30"
                  animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0.1, 0.5] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                />
                <p className="text-white/40 text-[11px] uppercase tracking-[0.35em] font-semibold">
                  Move to begin
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Skip button — bottom-center, shown after activation */}
          <AnimatePresence>
            {activated && (
              <motion.button
                key="skip"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.55, ease: "easeOut", delay: 0.3 }}
                onClick={dismiss}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 group flex items-center gap-2.5 px-6 py-3 rounded-full border border-white/15 bg-white/5 backdrop-blur-md text-white/60 text-[11px] font-semibold uppercase tracking-[0.25em] hover:bg-white/10 hover:border-white/30 hover:text-white transition-all cursor-pointer select-none"
                style={{ WebkitBackdropFilter: "blur(12px)" }}
              >
                Skip
                <svg
                  className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M6 4l4 4-4 4M11 4v8"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
