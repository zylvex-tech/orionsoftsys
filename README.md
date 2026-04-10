# Orion Soft Systems — SaaS Platform

A production-ready AI-powered SaaS platform built with **Node.js + Express** (backend) and plain **HTML/CSS/JS** (frontend). It features user authentication, an AI chat assistant (OpenAI + DeepSeek fallback), multi-language support, and billing via Paystack and Stripe.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Billing & Payments](#billing--payments)
- [Deployment](#deployment)
- [Audit Report](#audit-report)

---

## Overview

| Feature | Details |
|---------|---------|
| Authentication | JWT-based register/login, 30-day tokens, 14-day free trial |
| AI Chat | OpenAI GPT-4o-mini with automatic DeepSeek fallback |
| Billing | Paystack (NGN) + Stripe (USD), webhook-driven subscription activation |
| Plans | Free · Starter · Professional · Enterprise |
| Languages | English, French, Spanish, Hausa, Yoruba, German |
| Database | PostgreSQL (auto-migrated from `schema.sql` on boot) |
| Deployment | Render-ready (`render.yaml`) |

---

## Architecture

```
Browser (HTML/CSS/JS)
       │
       │ HTTP / REST
       ▼
Express Server (server/server.js)
       │
       ├─ /api/auth      → JWT register, login, profile
       ├─ /api/chat      → AI chat (OpenAI → DeepSeek)
       ├─ /api/billing   → Paystack & Stripe checkout + webhooks
       ├─ /api/translate → i18n key/language lookup
       └─ /api/users     → user stats, admin dashboard
       │
       ├─ PostgreSQL  (pg pool, auto-schema via schema.sql)
       ├─ OpenAI API  (primary AI provider)
       ├─ DeepSeek API (fallback AI provider)
       ├─ Paystack    (NGN billing)
       └─ Stripe      (USD billing)
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js ≥ 18 |
| Web framework | Express 4 |
| Database | PostgreSQL (`pg`) |
| Auth | JWT (`jsonwebtoken`), bcrypt (`bcryptjs`) |
| Security | `helmet`, `cors`, `express-rate-limit`, `express-validator` |
| AI | OpenAI API, DeepSeek API |
| Payments | Paystack, Stripe |
| Deployment | Render (`render.yaml`) |

---

## Project Structure

```
orionsoftsys/
├── index.html              # Landing page
├── login.html
├── register.html
├── dashboard.html
├── pricing.html
├── projects.html
├── contact.html
├── about.html
├── download.html
├── assets/                 # CSS + JS assets
├── services/               # Service detail pages
├── products/               # Product pages
│
├── server/
│   ├── server.js           # Express app entry point
│   ├── db.js               # PostgreSQL pool + helpers
│   ├── schema.sql          # Auto-applied DB schema
│   ├── translations.js     # i18n strings
│   ├── .env.example        # Environment variable template
│   │
│   ├── middleware/
│   │   ├── rateLimiter.js  # General / auth / chat rate limits
│   │   └── errorHandler.js # Centralised error + 404 handler
│   │
│   ├── models/
│   │   ├── User.js         # User CRUD + plan limits
│   │   ├── Chat.js         # Chat session CRUD
│   │   └── Subscription.js # Subscription CRUD
│   │
│   ├── routes/
│   │   ├── auth.js         # POST /register, POST /login, GET|PUT /profile
│   │   ├── chat.js         # POST /, GET|DELETE /history
│   │   ├── billing.js      # POST /subscribe, webhooks, GET /subscription
│   │   ├── translate.js    # GET|POST /translate
│   │   └── users.js        # GET /stats, GET /admin/users
│   │
│   └── services/
│       ├── aiService.js    # OpenAI + DeepSeek + lead capture
│       └── billingService.js # Paystack + Stripe + subscription logic
│
├── render.yaml             # Render deployment config
└── DEPLOYMENT.md           # Detailed deployment guide
```

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp server/.env.example server/.env
# Edit server/.env — at minimum set DATABASE_URL and JWT_SECRET
```

### 3. Start the server

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

The app serves the frontend and API on `http://localhost:5000`.

---

## Environment Variables

Copy `server/.env.example` → `server/.env` and fill in all values.

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | Random 32+ char string for signing JWTs |
| `OPENAI_API_KEY` | ✅ | OpenAI API key |
| `OPENAI_MODEL` | — | Default: `gpt-4o-mini` |
| `DEEPSEEK_API_KEY` | — | Fallback AI provider key |
| `DEEPSEEK_MODEL` | — | Default: `deepseek-chat` |
| `PAYSTACK_SECRET_KEY` | — | Paystack secret key |
| `PAYSTACK_PUBLIC_KEY` | — | Paystack public key |
| `STRIPE_SECRET_KEY` | — | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | — | Stripe webhook signing secret |
| `FRONTEND_URL` | — | Frontend origin for CORS (defaults to localhost) |
| `ADMIN_EMAIL` | — | Email address granted admin access |
| `PORT` | — | Default: `5000` |
| `NODE_ENV` | — | `development` or `production` |

---

## API Reference

### Auth — `/api/auth`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | — | Create account, start 14-day trial |
| POST | `/login` | — | Login, receive JWT |
| GET | `/profile` | Bearer | Get current user profile + plan limits |
| PUT | `/profile` | Bearer | Update name, phone, businessType, password, aiContext |

### Chat — `/api/chat`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/` | Bearer | Send message, receive AI reply |
| GET | `/history` | Bearer | Get recent chat sessions |
| DELETE | `/history` | Bearer | Clear all chat history |

### Billing — `/api/billing`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/subscribe` | Bearer | Init Paystack or Stripe checkout |
| POST | `/verify/paystack` | — | Verify Paystack payment by reference |
| POST | `/webhook/stripe` | — | Stripe webhook (signature verified) |
| POST | `/webhook/paystack` | — | Paystack webhook (signature verified) |
| GET | `/subscription` | Bearer | Get active subscription details |
| POST | `/cancel` | Bearer | Cancel subscription at period end |

### Translate — `/api/translate`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | All translations (optionally filter by `?key=` or `?lang=`) |
| POST | `/` | Batch translate `{ keys: [...], lang: "fr" }` |
| GET | `/languages` | List supported languages |

### Users — `/api/users`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/stats` | Bearer | Current user stats |
| GET | `/admin/users` | Bearer (admin) | All users + aggregate stats |

### Utility

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check (used by Render) |
| GET | `/api/test-db` | Database connectivity check |

---

## Billing & Payments

### Plan Pricing

| Plan | Paystack (NGN) | Messages/day |
|------|---------------|--------------|
| Free | — | 10 |
| Starter | ₦299 | 500 |
| Professional | ₦599 | Unlimited |
| Enterprise | ₦1,999 | Unlimited |

### Stripe Setup

Update the `priceIds` map in `server/services/billingService.js` with your real Stripe Price IDs before going to production:

```js
const priceIds = {
  starter:      "price_xxxx",
  professional: "price_xxxx",
  enterprise:   "price_xxxx"
};
```

### Webhook URLs

Register these in your payment provider dashboards:

- **Paystack:** `https://yourdomain.com/api/billing/webhook/paystack`
- **Stripe:** `https://yourdomain.com/api/billing/webhook/stripe`

---

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full instructions (Render, Railway, VPS/Nginx).

Quick deploy on Render: push to GitHub and connect the repo — `render.yaml` handles everything automatically including provisioning a free PostgreSQL database.

---

## Audit Report

The following audit was performed on **2026-04-10** against the current codebase.

### 🔴 Critical (Fixed)

| # | Issue | File | Fix Applied |
|---|-------|------|-------------|
| 1 | **Paystack webhook had no signature verification** — any external party could POST a fake `charge.success` event to activate a subscription without payment | `server/routes/billing.js` | Added HMAC-SHA512 verification of `x-paystack-signature` header against raw request body |
| 2 | **SPA fallback used `includes("..")` for path-traversal guard** — encoded traversal sequences could bypass the check | `server/server.js` | Replaced with `path.resolve()` + prefix check against `frontendDir` |
| 3 | **CORS defaulted to `true` (all origins)** when `FRONTEND_URL` env var was not set | `server/server.js` | Falls back to `localhost:3000` and `localhost:5000` only |

### 🟡 Important (Fixed)

| # | Issue | File | Fix Applied |
|---|-------|------|-------------|
| 4 | **DEPLOYMENT.md referenced MongoDB throughout** — the codebase uses PostgreSQL | `DEPLOYMENT.md` | Updated all references, env table, and security checklist |
| 5 | **`ADMIN_EMAIL` env var undocumented** — admin route silently fails if var is unset | `server/.env.example` | Added `ADMIN_EMAIL` entry with comment |

### 🟠 Notable (Not Fixed — Recommendations)

| # | Issue | Recommendation |
|---|-------|---------------|
| 6 | **Stripe price IDs are placeholder strings** (`"price_starter_id_here"`) — Stripe checkout will fail in production | Replace with real Stripe Price IDs in `billingService.js` |
| 7 | **No shared auth middleware** — JWT token extraction is copy-pasted in `auth.js`, `chat.js`, `billing.js`, and `users.js` | Extract into `middleware/authenticate.js` and use `app.use(authenticate)` on protected routes |
| 8 | **Login error reveals user existence** — different messages for unknown email vs wrong password enable user enumeration | Return a generic "Invalid credentials" for both cases |
| 9 | **JWT tokens are 30-day, non-revocable** — no refresh token or token revocation mechanism | Consider shorter expiry + refresh tokens, or a token blocklist |
| 10 | **`db.js` `duration` variable calculated but never used** (line 31) | Remove unused variable or use it for slow-query logging |
| 11 | **No automated test suite** | Add unit tests for models and integration tests for API routes |
| 12 | **`subscription_status` defaults to `'trial'` for all new users** — expired trials are only detected on `/profile` fetch, not at login | Run trial-expiry check on login and on chat access |

### ✅ What's Well Done

- `helmet` and `morgan` applied globally
- `express-rate-limit` on all API routes, stricter limit on auth routes
- `express-validator` on auth inputs
- `bcryptjs` with cost factor 12 for password hashing
- All SQL queries use parameterised values (`$1`, `$2` …) — no SQL injection risk
- Stripe webhook uses `stripe.webhooks.constructEvent` (cryptographic verification)
- Schema uses `IF NOT EXISTS` — safe to re-run on every boot
- Environment variables validated at startup; server exits if required vars are missing
- Error handler strips internal error details in production
