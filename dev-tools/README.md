# dev-tools/

These scripts are for local development and translation workflow only.
They are not part of the production build and are never bundled by Vite.

Run all scripts from the **repository root**, e.g.:

```bash
python dev-tools/fix_dict.py
python dev-tools/find_text.py
python dev-tools/translate.py
```

## Scripts

| Script | Purpose |
|---|---|
| `fix_dict.py` | Replaces the entire `translations` block in `src/App.tsx` with a clean baseline |
| `fix_dict2.py` | Alternate/updated version of `fix_dict.py` |
| `add_translations.py` | Appends new i18n keys to all four language blocks in `src/App.tsx` |
| `translate.py` | Adds new translation keys and replaces hardcoded strings with `t()` calls |
| `add_specs_translations.py` | Adds spec/value translation keys for Series A, B, C to all languages |
| `replace_specs.py` | Replaces hardcoded spec values in JSX with `t('key')` calls |
| `find_text.py` | Scans `src/App.tsx` for untranslated English strings, outputs `dev-tools/untranslated.txt` |

## Notes

- All scripts use paths relative to the **repository root** (e.g. `src/App.tsx`).
- Always run from the repo root, not from inside `dev-tools/`.
- `untranslated.txt` is a generated output file and is excluded from git.
- `metadata.json` is project metadata tracked in git.
