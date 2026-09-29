# MIKANDA — Base44 Dev Notes

## Stack
- Frontend-only React 19 + Vite 7 + TailwindCSS 4 (via `@tailwindcss/vite`).
- No backend, no database. Auth, data, and storage are simulated via LocalStorage and mock data in `src/data/`.
- React Router 7 for routing.

## Running
- `docker compose -f docker-compose.base44.yml up -d` — starts Vite dev server on port 5173, mapped to host port 3000.
- Vite binds 0.0.0.0; `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` is passed from the environment so the preview proxy host is allowed.
- Dependencies install on container startup via `npm install` (lockfile preserved). `node_modules` lives in a named volume to avoid clobbering.
- `vite.config.js` has `open: true` which causes a harmless `xdg-open ENOENT` error in the container — can be ignored.

## Optional env vars (all have mock fallbacks)
- `VITE_TRANSLATION_API_URL` — enables real translation; without it, `translationService.js` uses mock mode.
- `VITE_TTS_API_URL` — enables cloud text-to-speech; without it, `audioService.js` uses `window.speechSynthesis`.
- `VITE_GOOGLE_CLIENT_ID` — for future Google OAuth (not yet implemented).
- None are required to boot.

## Demo admin account
- Email: `admin@mikanda.cd`, Password: `Admin2024!` (auto-created on first load if absent).
