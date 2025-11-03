# Deploy to cPanel (Shared Hosting)

This project is a Next.js 14 (App Router) app using Prisma + MySQL. On cPanel, run it as a Node.js app using the standalone build.

## 1) Prep locally (optional)

```powershell
# Windows PowerShell
npm ci
npm run build
# Result: .next/standalone + .next/static + public
```

You can upload the whole repo and build on the server too (recommended for clean install).

## 2) cPanel → Setup Node.js App

1. Open cPanel → "Setup Node.js App" (Application Manager)
2. Create Application:
   - Application mode: Production
   - Node.js version: 18+ (LTS)
   - Application root: e.g. `epolice-dashboard`
   - Application URL: choose your domain/subdomain
   - Application startup file: `server.js`
3. Create application.

## 3) Upload code

- Use cPanel File Manager or Git (Clone from GitHub) to place the project in the Application root folder.
- Ensure these files exist on the server:
  - `package.json`
  - `next.config.js` (has `output: 'standalone'`)
  - `server.js`
  - `prisma/` + `node_modules/` (node_modules will be created by install)

## 4) Install and Build on server

In the Node.js App page:
- Click "Run NPM Install"
- Then click "Run Script" → choose `build`
  - This generates `.next/standalone` and `.next/static`

## 5) Environment variables

In the Node.js App page → Environment Variables:

```
DATABASE_URL = mysql://USER:PASS@HOST:3306/epolice_db
JWT_SECRET   = a_strong_random_secret
PORT         = 3000
HOST         = 0.0.0.0
```

- If using PlanetScale or another managed MySQL, paste its full connection string into `DATABASE_URL`.
- Do NOT commit `.env` to the server; use cPanel env var UI.

## 6) Start the app

In the Node.js App page:
- Application startup file: `server.js`
- Start/Restart the app

`server.js` simply boots the compiled server at `.next/standalone/server.js` and respects PORT/HOST.

## 7) Database schema (first deploy)

From your local machine or any machine with access to the database, run:

```powershell
# One-time to create tables according to prisma/schema.prisma
npx prisma db push
```

If you must run from the server, you can add a temporary SSH session and run the same command in the app directory (ensure `DATABASE_URL` is set in the environment).

## 8) Logs & troubleshooting

- cPanel → Node.js App → "View Logs" for runtime errors
- If you see Prisma engine errors, set this env var: `PRISMA_CLIENT_ENGINE_TYPE=binary`
- If port conflicts occur, change `PORT` and restart

## Plesk (similar)

- Websites & Domains → Node.js → Enable Node.js for the domain
- Document Root: your app folder
- Application Startup file: `server.js`
- Add Environment variables as above
- Run `npm install` then `npm run build` from the Plesk UI or SSH
- Restart the app

## Notes

- This is a server-rendered app (API routes included), so `next export` (static) is not applicable.
- Vercel remains the easiest deployment, but cPanel/Plesk works with the standalone build.
