# TechHub

A full end-to-end e-commerce platform for tech and electronics — a complete customer storefront paired with a live admin back office, built on a layered architecture from the database up.

**Live:** [techhub.vercel.app](https://techhub-shop.vercel.app)

---

## Overview

TechHub isn't just a storefront — it's a full application stack. Every feature runs through a consistent layering: **models** (raw SQL query builders) → **services** (business logic, validation) → **controllers** (HTTP request/response handling) → **routes** (Next.js API endpoints), with the customer-facing app and the admin dashboard sharing the same backend.

## Features

### Customer-facing
- Product browsing, search, and category filtering
- Cart and checkout, with COD and online payment support (PayMongo)
- Real-time order status tracking, from `pending` through `delivered`
- Verified purchase reviews — customers can only review items from their own completed orders, scoped per order item (not just per product)
- Real-time notifications via Server-Sent Events (order updates, etc.)
- AI-powered chat assistant (Groq)
- Light/dark mode

### Admin dashboard
- Live revenue analytics — 7-day and 6-month trend charts with week-over-week comparison
- Order management with status tracking and full order detail views
- Inventory / product management (create, edit, image upload via Cloudinary)
- Customer management and insights (top spenders, order history)
- Sales reports — best sellers, revenue by category, monthly trends
- Unreviewed-item tracking for post-purchase follow-up
- Role-gated access — admin routes are inaccessible to non-admin accounts, enforced server-side on every request

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| UI | React, Tailwind CSS |
| Database | PostgreSQL |
| Auth | Auth0 (role-based access control) |
| AI | Groq API |
| Media | Cloudinary |
| Payments | PayMongo |
| Real-time | Server-Sent Events (SSE) |

## Architecture

```
app/
├── (customer pages)        — storefront, cart, checkout, orders
├── admin/                  — admin dashboard pages
└── api/                    — Next.js route handlers (thin, delegate to controllers)

lib/
├── controllers/             — request/response handling, auth checks
├── services/                — business logic, orchestration
├── models/                  — raw SQL query builders
├── auth/                    — Auth0 session + role helpers
└── database/                — connection pool

components/
├── admin/                   — dashboard, charts, tables
└── ui/                      — shared customer-facing components
```

Each layer has one job: **models** build SQL, **services** call models and apply business rules (ownership checks, validation), **controllers** translate service results into HTTP responses, and **routes** are thin wrappers that just call a controller. This keeps auth and ownership checks (e.g. "can this user review this specific order item?") centralized in services rather than scattered across route handlers.

## Getting Started

```bash
git clone https://github.com/ehrvayn/TechHub.git
cd TechHub
npm install
```

Create a `.env.local` with the required environment variables (database connection string, Auth0 credentials, Cloudinary, PayMongo, and Groq API keys).

```bash
npm run dev
```

App runs at `http://localhost:3000`.

## Database

PostgreSQL, with role-based users (`role = 'admin'` vs. regular customer accounts) and a schema covering products, orders, order items, reviews (scoped to `order_item_id` so a customer can review the same product separately across different purchases), notifications, and categories.

## License

MIT
