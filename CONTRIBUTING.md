# Contributing to ERP-connect

Thank you for your interest in contributing! Please read this guide before opening a pull request.

---

## Development Setup

```bash
git clone https://github.com/mkamrul9/ERP-connect.git
cd ERP-connect
npm install
npm run dev
```

The app runs at **http://localhost:3000** using SQLite by default — no database setup required.

---

## Project Structure

| Path | Purpose |
|---|---|
| `app/` | Next.js App Router pages and shared components |
| `src/backend.ts` | All Express API routes, auth middleware, and cron jobs |
| `src/db.ts` | Database abstraction layer (SQLite + PostgreSQL) |
| `src/brevo.ts` | Brevo email client and reminder scheduler |
| `server.ts` | Entry point — wires Next.js and Express together |
| `scripts/` | One-time seeders for demo data |

---

## Code Conventions

- **TypeScript** everywhere — no plain `.js` in `src/` or `app/`
- **No Tailwind** — use CSS variables defined in `app/globals.css`
- All API routes live in `src/backend.ts` inside `createBackendApp()`
- Database queries go through `dbAll` / `dbGet` / `dbRun` from `src/db.ts` — never use the driver directly
- Use `isPostgres()` guard when writing SQL that differs between SQLite and PostgreSQL

---

## Pull Request Guidelines

1. **One concern per PR** — keep changes focused
2. **Test locally** before opening a PR — run `npm run dev` and verify the affected module
3. **Update the README** if you add a new module or change environment variables
4. **No secrets in code** — API keys, passwords, and connection strings must use environment variables

---

## Reporting Issues

Open a GitHub Issue with:
- What you expected to happen
- What actually happened
- Steps to reproduce
- Node.js version (`node -v`)
