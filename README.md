# Auth App (Vue + Node/Express)

A real signup/login flow: Vue 3 frontend, Express backend, SQLite storage,
bcrypt password hashing, JWT sessions. UI is styled to match the reference
login screen (email/phone tabs, remember password, forgot password link,
terms checkbox).

## Structure

```
auth-app/
  backend/    Express API (signup, login, /me)
  frontend/   Vue 3 + Vite app
```

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# open .env and set JWT_SECRET to a long random string
npm run dev
```

Runs on http://localhost:4000. Uses a local SQLite file (`auth.db`) —
passwords are hashed with bcrypt before storage, never stored in plaintext.

## 2. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Runs on http://localhost:5173 and talks to the backend at
`http://localhost:4000` by default. To point it elsewhere, create a
`.env` file in `frontend/` with:

```
VITE_API_BASE=https://your-api-domain.com
```

## Notes on going to production

- Serve the frontend and API over HTTPS only.
- Set a strong, unique `JWT_SECRET` and keep it out of version control.
- Tighten `CORS_ORIGIN` in `backend/.env` to your real frontend domain.
- Consider adding email verification and a real "forgot password" email flow
  (the button currently routes to `/forgot-password`, which isn't built yet).
- The rate limiter in `server.js` is a basic brute-force guard — for
  production, pair it with monitoring/alerting.
