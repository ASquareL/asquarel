# Database Plan — A Square L Innovate

**Version:** 1.0
**Status:** Draft
**Last Updated:** 2026

---

## 1. Purpose

This document defines how data is stored, accessed, and eventually migrated
across the A Square L Innovate ecosystem. It covers:

- The initial Backend-as-a-Service (BaaS) choice
- The data schema for the Academy and future apps
- The migration path to a self-hosted PostgreSQL database
- Security and access rules

**This document is a planning artifact.** No implementation begins until the
Academy UI is complete. Static mock data is used in the UI until then.

---

## 2. Decision

### Chosen BaaS: Supabase

**Why Supabase over Firebase:**

| Factor | Supabase | Firebase |
| :--- | :--- | :--- |
| Database engine | PostgreSQL (SQL) | Firestore (NoSQL) |
| Migration to own PostgreSQL | Direct dump/restore | Complex ETL rewrite |
| Pricing | Flat tiers ($25/mo Pro) | Pay-as-you-go (unpredictable) |
| Open source | Yes, self-hostable | No, proprietary |

Supabase is PostgreSQL under the hood. When we migrate to our own
PostgreSQL later, the process is:

```bash
supabase db dump --db-url "..." -f schema.sql
supabase db dump --db-url "..." -f data.sql --data-only
psql --single-transaction -f schema.sql
psql --single-transaction -f data.sql
```

Application code (SQL queries) stays largely unchanged.

---

## 3. Data Ownership Map

| Data Category | Storage | Sensitivity |
| :--- | :--- | :--- |
| Identity (email, password hash) | Supabase Auth | 🔴 Very High |
| Profile (name, reg no, avatar, bio) | Supabase `profiles` table | 🟡 Medium |
| Course catalog (titles, lessons) | Static files / CDN | 🟢 Low |
| Enrollment (which courses a student is in) | Supabase `enrollments` table | 🟢 Low |
| Progress (lesson completion, %) | Supabase `progress` table | 🟢 Low |
| Quiz attempts & scores | Supabase `quiz_attempts` table | 🟢 Low |
| Certificates | Supabase `certificates` table | 🟢 Low |
| Payments | Payment provider (Stripe/Paystack) | 🔴 Very High |
| Media (avatars, materials) | Supabase Storage | 🟡 Medium |
| Analytics | Provider (Plausible) | 🟢 Low |

**Rule:** No payment card data ever touches our database. Payment providers
handle PCI compliance.

---

## 4. Initial Schema (Supabase / PostgreSQL)

### 4.1 `auth.users` (managed by Supabase)

Supabase manages this table automatically. We do not modify it directly.

### 4.2 `profiles`

Extends `auth.users` with Academy-specific fields.

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | uuid (PK, FK to auth.users) | |
| `full_name` | text | |
| `registration_number` | text unique | e.g. `ASL-2026-00042` |
| `avatar_url` | text | Supabase Storage URL |
| `bio` | text | Optional |
| `level` | integer | 1, 2, 3... |
| `plan` | text | `free`, `pro`, `mentorship` |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### 4.3 `courses`

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | uuid (PK) | |
| `slug` | text unique | e.g. `web-development` |
| `title` | text | |
| `description` | text | |
| `icon` | text | Font Awesome class |
| `total_lessons` | integer | |
| `estimated_weeks` | integer | |
| `created_at` | timestamptz | |

### 4.4 `lessons`

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | uuid (PK) | |
| `course_id` | uuid (FK to courses) | |
| `slug` | text | e.g. `lesson-01` |
| `title` | text | |
| `order_index` | integer | Sort order |
| `content_url` | text | Static HTML path |
| `duration_minutes` | integer | |

### 4.5 `enrollments`

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | uuid (PK) | |
| `user_id` | uuid (FK to profiles) | |
| `course_id` | uuid (FK to courses) | |
| `enrolled_at` | timestamptz | |
| `completed_at` | timestamptz | Nullable |
| UNIQUE | (user_id, course_id) | |

### 4.6 `progress`

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | uuid (PK) | |
| `user_id` | uuid (FK to profiles) | |
| `lesson_id` | uuid (FK to lessons) | |
| `completed` | boolean | |
| `completed_at` | timestamptz | Nullable |
| UNIQUE | (user_id, lesson_id) | |

### 4.7 `quiz_attempts`

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | uuid (PK) | |
| `user_id` | uuid (FK to profiles) | |
| `lesson_id` | uuid (FK to lessons) | |
| `score` | integer | 0–100 |
| `attempted_at` | timestamptz | |

### 4.8 `certificates`

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | uuid (PK) | |
| `user_id` | uuid (FK to profiles) | |
| `course_id` | uuid (FK to courses) | |
| `issued_at` | timestamptz | |
| `certificate_url` | text | Storage URL |

---

## 5. Row-Level Security (RLS) Rules

Supabase enforces access at the database level. Rules:

| Table | Rule |
| :--- | :--- |
| `profiles` | Users can read/update their own row only |
| `enrollments` | Users can read their own enrollments only |
| `progress` | Users can read/write their own progress only |
| `quiz_attempts` | Users can read/write their own attempts only |
| `certificates` | Users can read their own certificates only |
| `courses` | Public read (anyone can browse catalog) |
| `lessons` | Read only if enrolled in the parent course |

This means the frontend can query the database directly and safely —
RLS ensures a user can never see another user's data.

---

## 6. Auth Flow

1. User signs up via Supabase Auth (email or Google)
2. Supabase creates the user in `auth.users`
3. A Postgres trigger inserts a new row into `profiles`
4. Frontend queries `profiles` + `enrollments` + `progress` for the dashboard
5. RLS ensures only the current user's data is returned

**Google Sign-In:** Supabase Auth supports Google OAuth out of the box.
Requires a Google Cloud Console project and client ID.

---

## 7. Migration Path to Self-Hosted PostgreSQL

### Phase 1 — Supabase (now)

- Use Supabase for auth, database, storage
- Frontend queries Supabase directly via the JS client

### Phase 2 — Supabase + Custom Backend (future)

- Build `backend/` with Node.js (Express/Fastify/NestJS)
- Backend connects to the same Supabase PostgreSQL
- Frontend starts calling the backend instead of Supabase directly
- Auth moves from Supabase Auth to custom JWT sessions

### Phase 3 — Self-Hosted PostgreSQL (final)

- Export from Supabase: `supabase db dump`
- Restore to your own PostgreSQL (Railway, Neon, Fly.io, or self-managed)
- Point the backend at the new database
- Decommission Supabase

**Because Supabase is PostgreSQL, Phase 3 is a data operation, not a rewrite.**

---

## 8. What This Means For The UI Today

**We build the Academy UI with static mock data.**

- `dashboard.html` shows a hardcoded student name, reg number, progress bars
- No API calls yet
- No Supabase client loaded
- No environment variables needed

This is correct sequencing. We cannot design the UI well if we're simultaneously
wrestling with database schemas. UI first, data wiring second.

**When to start database work:** After `dashboard.html`, `profile.html`,
`settings.html`, and all course pages are complete and visually approved.

---

## 9. Environment Variables (Future)

When Supabase is wired up, these will be needed:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```

The `anon` key is safe to expose in the frontend — RLS protects data.
The `service_role` key is NEVER exposed — only used in backend/server code.

---

## 10. Open Questions (To Resolve Before Database Work)

- [ ] Which Google Cloud project will hold the OAuth client?
- [ ] Which payment provider? (Stripe, Paystack, Flutterwave)
- [ ] Where will certificates be generated? (backend function or serverless)
- [ ] Will course content be in the DB or static files?
- [ ] What is the maximum expected concurrent users for free tier sizing?

---

## 11. Decision Log

| Date | Decision | Reason |
| :--- | :--- | :--- |
| 2026 | Use Supabase over Firebase | PostgreSQL-native, easier migration to self-hosted |
| 2026 | Build UI with static data first | Correct sequencing — UI before DB |
| 2026 | Do not use Netlify Forms for auth | Passwords must never touch a form-to-email service |

---

**End of Document**
```

---