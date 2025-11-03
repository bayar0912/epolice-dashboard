# Deploy with PostgreSQL (Free via Neon)

This guide shows how to use Neon (free Postgres) instead of paid MySQL.

## 1) Create a Neon DB (free tier)
- Go to https://neon.tech and sign up
- Create a project and a database named `epolice_db`
- Copy the connection string; ensure it ends with `?sslmode=require`

## 2) Configure env locally
```powershell
copy .env.postgres.example .env
notepad .env  # paste your Neon connection string
```

## 3) Push schema and seed (Postgres)
```powershell
npm run prisma:gen:pg
npm run prisma:push:pg
npm run prisma:seed:pg
```

## 4) Vercel environment variables
- DATABASE_URL = your Neon connection string
- JWT_SECRET = long random secret

Then redeploy on Vercel.

Notes:
- We keep MySQL schema for cPanel/PlanetScale users; Postgres uses `prisma/schema.postgres.prisma`.
- Seeds are DB-agnostic and will work for Postgres.
- If you previously deployed using MySQL, switching providers will create fresh empty tables in Postgres; migrate data if needed.
