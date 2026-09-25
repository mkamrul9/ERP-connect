<h1 align="center">ERP-connect</h1>

<p align="center">
  <strong>Enterprise Resource Planning — Internal Operations Platform</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/Express-5-blue?logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/TypeScript-7-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Database-SQLite%20%2F%20PostgreSQL-003B57?logo=sqlite&logoColor=white" alt="Database">
  <img src="https://img.shields.io/badge/Node.js-%3E%3D20.0.0-339933?logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Deploy-Render-46E3B7?logo=render&logoColor=white" alt="Render">
</p>

---

## Overview

**ERP-connect** is a modern, multi-tenant internal operations platform for small and medium businesses. It replaces a collection of disjointed tools with a single, role-based web application covering HR, attendance, finance, tender management, CRM, inventory, and more.

**Architecture:** A Next.js frontend communicates exclusively with an Express/TypeScript backend via REST APIs. The same backend can power future mobile or desktop clients without changes.

> **Notification channel:** Email only, via [Brevo](https://www.brevo.com/). No Telegram or WhatsApp integrations.

---

## Modules

| Module | Description |
|---|---|
| **Daily Tasks** | Task tracking with Red / Orange / Green priority, deadlines, auto-status calculations, and per-assignee filtering. |
| **HR & Attendance** | 1-click Check-In/Out, monthly calendar view, late detection, leave requests with Admin approval flow. |
| **Accounts & Finance** | Expense tracking with category budgets, monthly P&L summaries, and payment method breakdown. |
| **Tender Management** | Government and private tender pipeline (UPCOMING → SUBMITTED → WON / LOST) with deadline reminders. |
| **Meetings** | Schedule external meetings with configurable email reminders (days / hours / minutes before). |
| **Credentials Vault** | Store software licenses, API keys, and credentials with expiry-based email reminders. |
| **CRM** | Client pipeline, contact history, and relationship tracking. |
| **Inventory** | Hardware and software asset tracking. |
| **Automations** | Custom trigger-action workflow rules that automate tasks and system events. |
| **In-App Notifications** | Real-time bell with unread badge, scoped per role. |

---

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Pure CSS Variables — no Tailwind
- **Icons**: Lucide React
- **Charts**: Recharts

### Backend
- **Server**: Express 5
- **Language**: TypeScript (run via `tsx`)
- **Auth**: JWT + `bcryptjs`
- **Database**: SQLite (dev) / PostgreSQL (production) — dual-mode, same query API
- **Email**: Brevo Transactional API

---

## Getting Started

### Prerequisites
- **Node.js** v20+
- **npm**

### Install

```bash
git clone https://github.com/mkamrul9/ERP-connect.git
cd ERP-connect
npm install
```

### Seed Demo Data

```bash
node scripts/seed_dummy_data.cjs
```

### Run

```bash
npm run dev
```

App starts at **http://localhost:3000**

**Default login credentials:**

| Role | Email | Password |
|---|---|---|
| Admin | `admin@erp.com` | `admin123` |
| Employee | `employee@erp.com` | `emp123` |

---

## Environment Variables

All variables are optional — the app runs with zero configuration for local development.

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | *(SQLite)* | PostgreSQL connection string. If absent, SQLite is used automatically. |
| `JWT_SECRET` | *(built-in fallback)* | JWT signing secret. Always set a strong value in production. |
| `BREVO_API_KEY` | *(set via UI)* | Brevo API key. Can also be entered from Admin → Settings → Email without a restart. |
| `SQLITE_DB_PATH` | `./erp.db` | Custom SQLite path (e.g. `/data/erp.db` for Render persistent disk). |
| `PORT` | `3000` | HTTP port. |

---

## Project Structure

```
ERP-connect/
├── app/                        # Next.js App Router
│   ├── components/             # Shared UI (Sidebar, Topbar)
│   ├── context/                # React context providers
│   ├── dashboard/              # Daily Tasks
│   ├── hr/                     # HR & Attendance
│   ├── accounts/               # Finance & Expenses
│   ├── tenders/                # Tender Management
│   ├── meetings/               # Meetings
│   ├── credentials/            # Credentials Vault
│   ├── crm/                    # CRM
│   ├── inventory/              # Inventory
│   ├── automations/            # Workflow Automations
│   ├── admin/                  # Admin panel
│   ├── chat/                   # Internal chat
│   ├── login/                  # Auth page
│   ├── globals.css             # Design system (CSS variables)
│   └── layout.tsx              # Root layout
├── src/
│   ├── backend.ts              # All Express API routes, auth, cron
│   ├── brevo.ts                # Email client & reminder scheduler
│   └── db.ts                   # DB abstraction (SQLite + PostgreSQL)
├── scripts/
│   ├── seed_dummy_data.cjs     # Demo data seeder
│   └── seed_credentials.cjs   # Credentials demo seeder
├── public/                     # Static assets
├── server.ts                   # Entry point (Next.js + Express hybrid)
├── render.yaml                 # Render one-click deploy config
├── next.config.mjs
├── tsconfig.json
└── package.json
```

---

## Deployment (Render)

The repo includes [`render.yaml`](./render.yaml) for one-click deployment.

1. Push to GitHub
2. On [Render](https://render.com) → **New → Web Service** → connect repo
3. Render auto-detects `render.yaml` — no manual config needed
4. **Zero environment variables required** — `JWT_SECRET` is auto-generated, SQLite disk is pre-configured

After the first deploy, go to **Admin → Settings → Email** to enter your Brevo API key — no redeploy needed.

---

> ERP-connect is designed for internal organisational use. All demo data is fictional.
