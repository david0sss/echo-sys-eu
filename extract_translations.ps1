$appPath   = "src\App.tsx"
$transPath = "src\translations.ts"

$content = [System.IO.File]::ReadAllText($appPath)

# ── Markers ───────────────────────────────────────────────────────────────────
$TRANS_OPEN  = "const translations: Record<string, Record<string, string>> = {"
$LANG_START  = "let activeLanguage = 'en';"
$T_FUNC_END  = "};" + [char]13 + [char]10 + [char]13 + [char]10 + "const LanguageSwitcher"

# ── Locate indices ─────────────────────────────────────────────────────────────
$transIdx   = $content.IndexOf($TRANS_OPEN)
$langIdx    = $content.IndexOf($LANG_START)
$tFuncEndIdx = $content.IndexOf($T_FUNC_END)   # points to "};\r\n\r\nconst LanguageSwitcher"

if ($transIdx -lt 0 -or $langIdx -lt 0 -or $tFuncEndIdx -lt 0) {
    Write-Error ("Marker not found. transIdx=$transIdx langIdx=$langIdx tFuncEndIdx=$tFuncEndIdx")
    exit 1
}

# The block we want in translations.ts:
#   [transIdx .. tFuncEndIdx + 2]  (the closing "};\r\n" of the t() function, NOT "const LanguageSwitcher")
$blockEnd = $tFuncEndIdx + 3   # include the "};" and \r\n

$extractedBlock = $content.Substring($transIdx, $blockEnd - $transIdx).TrimEnd()

# ── Write translations.ts ──────────────────────────────────────────────────────
$transFile = @"
import { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
//  ALL SITE TEXT LIVES HERE
//  Edit translations for any language below.
//  Supported languages: en | pl | uk | nl
// ─────────────────────────────────────────────────────────────────────────────

$extractedBlock
"@

[System.IO.File]::WriteAllText($transPath, $transFile, [System.Text.Encoding]::UTF8)
Write-Host "translations.ts written ($($transFile.Length) bytes)"

# ── Remove the block from App.tsx ──────────────────────────────────────────────
# We remove everything from `\r\nconst translations` up to and including the
# trailing `\r\n` after the closing `};` of the t() function
# i.e. from (transIdx - 2) to (blockEnd) — the leading \r\n before 'const translations'
$removeFrom = $transIdx - 2      # include the \r\n before the block
$removeTo   = $blockEnd          # after the "};" \r\n

$newApp = $content.Substring(0, $removeFrom) + [char]13 + [char]10 + $content.Substring($removeTo)

# ── Add import line after the first import line ────────────────────────────────
$reactImportEnd = $newApp.IndexOf([char]13 + [char]10 + "import LogoLoop")
$importLine = [char]13 + [char]10 + 'import { setLanguage, useLanguage, t } from "./translations";'
$newApp = $newApp.Substring(0, $reactImportEnd) + $importLine + $newApp.Substring($reactImportEnd)

[System.IO.File]::WriteAllText($appPath, $newApp, [System.Text.Encoding]::UTF8)
Write-Host "App.tsx cleaned ($($newApp.Length) bytes)"
