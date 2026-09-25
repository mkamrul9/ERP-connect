<h1 align="center">ERP-connect</h1>

<p align="center">
  <strong>Enterprise Resource Planning — Internal Operations Platform</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/Express-5-blue?logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Database-SQLite%20%2F%20PostgreSQL-003B57?logo=sqlite&logoColor=white" alt="Database">
  <img src="https://img.shields.io/badge/Node.js-%3E%3D20.0.0-339933?logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Notifications-Email%20Only%20(Brevo)-7952B3" alt="Email">
</p>

---

## Overview

**ERP-connect** is a modern, enterprise-grade internal operations platform built as a multi-tenant SaaS ERP for small and medium businesses. It eliminates the need for disjointed external tools by providing a unified, role-based web application for HR, attendance, finance, tender management, client management, and more.

Built on a **Hybrid Headless Architecture**: a Next.js frontend communicates exclusively with an Express/TypeScript backend via REST APIs. The same data layer can power future mobile applications without any backend rewrites.

> **Notification Channel**: Email only, via [Brevo](https://www.brevo.com/). No Telegram or WhatsApp integrations.

---

## Table of Contents

- [Modules](#modules)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Deployment (Render)](#deployment-render)

---

## Modules

| Module | Description |
|---|---|
| **Daily Tasks Dashboard** | Task tracking with priority system (Red / Orange / Green), deadline management, auto-status calculations, and assignee-based filtering. |
| **HR & Attendance** | 1-click Check-In / Check-Out, monthly attendance calendar, late arrival detection, leave request management with Admin approval flow, and auto Wi-Fi / laptop attendance. |
| **Accounts & Expenses** | Full expense tracking with category budgets, monthly P&L summaries, top spending heads, and payment method tracking. |
| **Tender Management** | Track government and private tenders with deadline reminders, status pipeline (UPCOMING → SUBMITTED → WON/LOST), and document links. |
| **Meetings & Contacts** | Schedule and manage external meetings with configurable email reminders (days / hours / minutes before). |
| **Credentials Vault** | Securely store software licenses, API keys, and service credentials with expiry-based email reminders. |
| **CRM** | Client relationship tracking, pipeline management, and contact history. |
| **Inventory** | Asset and resource tracking for hardware and software. |
| **Workflow Automations** | Custom trigger-action rules that automate tasks, send notifications, and log system events. |
| **In-App Notifications** | Real-time notification bell with unread badge, navigation links, and admin-scoped alerts. |

---

## Architecture

### Dual-Database Mode

ERP-connect auto-selects the database at startup based on environment variables:

| Mode | Trigger | Database |
|---|---|---|
| **Local / Dev** | `DATABASE_URL` not set | SQLite (`erp.db` or `SQLITE_DB_PATH`) |
| **Production** | `DATABASE_URL` is set | PostgreSQL (via `pg.Pool`) |

The same query helpers (`dbAll`, `dbGet`, `dbRun`) transparently wrap both drivers.

### Email Reminders

All notifications are sent via the **Brevo Transactional Email API**. Reminder scheduling supports:
- **24h & 15h before deadline** — automatic for tasks and leaves with deadlines.
- **Custom offsets** — configurable in days, hours, and minutes on each entity.
- **Cron engine** — runs every 60 seconds inside the Express server to evaluate and fire due reminders.

---

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Custom CSS Variables — Slate/Blue enterprise palette (no Tailwind)
- **Icons**: Lucide React
- **Charts**: Recharts

### Backend
- **Server**: Express 5
- **Language**: TypeScript
- **Database**: SQLite (local) / PostgreSQL (production)
- **Authentication**: JWT (`jsonwebtoken`) + `bcryptjs`
- **Email**: Brevo Transactional API

---

## Getting Started

### Prerequisites
- **Node.js**: v20.0.0 or higher
- **npm**

### Installation

```bash
git clone https://github.com/mkamrul9/ERP-connect.git
cd ERP-connect
npm install
```

### Seed Demo Data

Populate the database with realistic demo records for all modules:

```bash
node scripts/seed_dummy_data.cjs
```

### Run the App

```bash
npm run dev
```

The application starts at `http://localhost:3000`.

**Default login credentials:**
- **Admin**: `admin@erp.com` / `admin123`
- **Employee**: `employee@erp.com` / `emp123`

---

## Environment Variables

Only **two variables** are required for a minimal production deployment. Everything else has safe defaults.

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | Optional | *(SQLite)* | PostgreSQL connection string. If absent, SQLite is used. |
| `JWT_SECRET` | Recommended | *(built-in fallback)* | JWT signing secret. Set a strong custom value in production. |
| `BREVO_API_KEY` | Optional | *(set via UI)* | Brevo API key for email notifications. Can also be set from the Admin Settings page without a restart. |
| `SQLITE_DB_PATH` | Optional | `./erp.db` | Custom path for the SQLite database file (e.g. `/data/erp.db` on Render persistent disk). |
| `PORT` | Optional | `3000` | HTTP port for the server. |

> **No Telegram or WhatsApp credentials are needed or used.**

---

## Project Structure

```
ERP-connect/
├── app/                    # Next.js App Router (frontend pages & components)
│   ├── components/         # Shared UI components (Sidebar, Topbar)
│   ├── dashboard/          # Daily Tasks Dashboard
│   ├── hr/                 # HR & Attendance
│   ├── accounts/           # Expenses & Finance
│   ├── tenders/            # Tender Management
│   ├── meetings/           # Meetings & Contacts
│   ├── credentials/        # Credentials Vault
│   ├── crm/                # CRM
│   ├── inventory/          # Inventory
│   └── globals.css         # Global design system (CSS variables)
├── src/
│   ├── backend.ts          # Express API server (all routes, auth, cron)
│   ├── brevo.ts            # Brevo email client & reminder scheduler
│   └── db.ts               # Database abstraction (SQLite + PostgreSQL)
├── scripts/
│   ├── seed_dummy_data.cjs # Demo data seeder
│   └── seed_credentials.cjs# Credentials demo data seeder
├── public/                 # Static assets (icons, manifests)
├── server.ts               # App entry point (Next.js + Express hybrid)
├── render.yaml             # Render deployment configuration
└── package.json
```

---

## Deployment (Render)

The repository includes a `render.yaml` for one-click deployment on [Render](https://render.com/).

**Minimum environment variables to set on Render:**

```
JWT_SECRET=<your-strong-secret>
SQLITE_DB_PATH=/data/erp.db
```

A persistent disk is mounted at `/data` (configured in `render.yaml`) to preserve the SQLite database across deploys.

After the first deploy, navigate to **Admin → Settings → Email** in the application UI to enter your Brevo API key — no redeploy required.

---

> ERP-connect is designed for internal organisational use. All demo data generated by the seed script is fictional.
