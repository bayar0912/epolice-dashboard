# SQLite Dev Mode (Alongside MySQL)

This repo supports both MySQL (production) and SQLite (local/testing).

## Quick start (SQLite)

1) Copy the example env:
```powershell
copy .env.sqlite.example .env
```

2) Generate client and create tables for SQLite:
```powershell
npm run prisma:gen:sqlite
npm run prisma:push:sqlite
```

3) Run the app:
```powershell
npm run dev
```

Notes:
- `.env` now points to `file:./dev.db` so Prisma uses SQLite.
- To switch back to MySQL, restore your `.env` with a MySQL `DATABASE_URL` and use the default scripts (`npx prisma generate`, `npx prisma db push`).
- The MySQL schema remains in `prisma/schema.prisma`. SQLite schema is in `prisma/schema.sqlite.prisma`.

## CI/GitHub Codespaces
- Use `.env.sqlite.example` as the base; copy to `.env` in your setup step.
- Then run the two SQLite scripts above to prep the DB file.

## Why two schemas?
Prisma does not allow parameterizing the `provider` via env vars. Keeping two schema files lets you use SQLite locally without affecting MySQL in production.
