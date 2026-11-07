# Eligify – security notes (step 1: encrypted vault)

## What changed
- `src/services/vault.js` – zero-knowledge crypto (PBKDF2-SHA256 600k → HKDF → AES-256-GCM; random data key wrapped by password and by a one-time recovery key). Run `npm run test:vault`.
- `src/services/vaultStore.js` – encrypted-only IndexedDB persistence (one record per account).
- `src/services/session.js` – data key lives in memory only; auto-locks after 5 min idle.
- `src/components/AuthGate.jsx` – sign up / unlock / recovery-key reset.
- `src/App.jsx` – root gate; `src/Workspace.jsx` – the previous app, now fed from the decrypted vault.
- Old plaintext `localStorage` keys are deleted on first load.

## Before production
1. Run `npm install && npm run build` (the zip's node_modules were Windows binaries; rebuild `dist/`).
2. Swap PBKDF2 for Argon2id (WASM) when you have network access; the KDF params are stored per account so you can migrate on login.
3. Self-host Tesseract language data (`createWorker('eng', 1, { langPath: '/tessdata' })`) so no request leaves the origin, then drop jsDelivr from the CSP.
4. Self-host the Google Fonts.
5. Serve with HTTPS + HSTS and add `frame-ancestors 'none'` via HTTP header (not possible in a meta tag).

## Known limits
- Forgotten password + lost recovery key = data unrecoverable (by design).
- Encryption protects data at rest; malware/XSS while unlocked can still read it.
- Client-side failed-login delay is cosmetic; the real brake is KDF cost (the server will add rate limiting).
