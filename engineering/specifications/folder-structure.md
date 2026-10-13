# A SQUARE L INNOVATE — FOLDER STRUCTURE
Last updated: Oct 2026 (after Phase 1–4 cleanup)

================================================================================
ROOT
================================================================================
A-Square-L-Innovate/
├── README.md
├── LICENSE
├── CHANGELOG.md
├── ROADMAP.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── .gitignore
├── netlify.toml
│
├── apps/
├── packages/
├── backend/
├── engineering/
├── scripts/
├── docs/                     (empty — reserved)
├── tests/                    (empty — reserved)
├── deployment/               (empty — reserved)
└── .github/
    └── workflows/            (empty — reserved)

================================================================================
APPS
================================================================================
apps/
├── public-site/              ✅ DONE
│   ├── assets/images/        favicon.png · logo.png · founder.png
│   ├── index.html
│   ├── about.html
│   ├── products.html
│   ├── academy.html
│   ├── ai.html
│   ├── business-os.html
│   ├── developer-portal.html
│   ├── careers.html
│   ├── blog.html
│   ├── contact.html
│   ├── privacy.html
│   ├── terms.html
│   └── subscribed.html
│
├── academy/                  ✅ DONE (Phase 1–3)
│   ├── assets/images/        favicon.png · logo.png · founder.png
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── profile.html
│   ├── settings.html
│   ├── certificate.html
│   ├── verify.html                ← public, no auth
│   ├── feedback.html
│   ├── subscribed.html
│   └── courses/
│       ├── index.html             ← course catalog
│       ├── lesson.html            ← SHARED — ?course={slug}&id={lesson}
│       ├── quiz.html              ← SHARED — ?course={slug}&id={quiz}
│       ├── quizzes.html           ← SHARED — ?course={slug}
│       ├── web-development/
│       │   └── index.html
│       ├── crypto-blockchain/
│       │   └── index.html
│       └── smartphone-graphic-design/
│           └── index.html
│
├── admin/                    ✅ DONE
│   ├── assets/images/        favicon.png
│   ├── index.html
│   ├── login.html
│   ├── lessons.html
│   ├── lesson-edit.html
│   └── feedback.html
│
├── ai/                       (reserved — empty)
├── business-os/              (reserved — empty)
└── portfolio/                (reserved — empty)

================================================================================
PACKAGES
================================================================================
packages/
│
├── aslds/                    ✅ Design System v1.1 Stable
│   │
│   ├── css/
│   │   ├── reset.css
│   │   ├── variables.css
│   │   ├── typography.css
│   │   ├── layout.css
│   │   ├── utilities.css
│   │   ├── animations.css
│   │   ├── showcase.css           (docs only)
│   │   └── components/
│   │       ├── buttons.css
│   │       ├── cards.css
│   │       ├── forms.css
│   │       ├── navbar.css
│   │       ├── sidebar.css
│   │       ├── dashboard.css
│   │       ├── footer.css
│   │       ├── badge.css
│   │       ├── alert.css
│   │       ├── progress.css
│   │       ├── avatar.css
│   │       ├── dropdown.css
│   │       ├── modal.css
│   │       ├── toast.css
│   │       ├── table.css
│   │       ├── tabs.css
│   │       ├── auth.css
│   │       ├── lesson-content.css    ← lesson + quiz UI
│   │       └── certificate.css
│   │
│   ├── js/
│   │   ├── app.js                    runtime (load FIRST)
│   │   ├── theme-boot.js             ← in <head>, before CSS
│   │   ├── navbar.js
│   │   ├── sidebar.js
│   │   ├── tabs.js
│   │   ├── dropdown.js
│   │   ├── modal.js
│   │   ├── theme.js
│   │   ├── playground.js             (showcase only)
│   │   ├── search.js
│   │   ├── animations.js
│   │   └── toast.js
│   │
│   ├── showcase/
│   │   ├── index.html
│   │   ├── getting-started.html
│   │   ├── installation.html
│   │   ├── playground.html
│   │   ├── README.md
│   │   ├── foundations/
│   │   │   ├── colors.html
│   │   │   ├── typography.html
│   │   │   ├── spacing.html
│   │   │   ├── layout.html
│   │   │   ├── shadows.html
│   │   │   ├── borders.html
│   │   │   ├── icons.html
│   │   │   └── animations.html
│   │   ├── components/
│   │   │   ├── buttons.html
│   │   │   ├── cards.html
│   │   │   ├── forms.html
│   │   │   ├── navbar.html
│   │   │   ├── sidebar.html
│   │   │   ├── dashboard.html
│   │   │   ├── alerts.html
│   │   │   ├── badges.html
│   │   │   ├── progress.html
│   │   │   ├── avatars.html
│   │   │   ├── dropdowns.html
│   │   │   ├── modals.html
│   │   │   ├── tables.html
│   │   │   ├── tabs.html
│   │   │   ├── toast.html
│   │   │   └── footer.html
│   │   └── guides/
│   │       ├── accessibility.html
│   │       ├── engineering.html
│   │       ├── roadmap.html
│   │       └── changelog.html
│   │
│   ├── images/                (currently empty)
│   ├── icons/                 (currently empty)
│   └── fonts/                 (currently empty)
│
└── shared/
    └── js/
        ├── core/
        │   ├── supabase-config.js     initializes Supabase + beta badge
        │   └── auth.js                auth helpers + form wiring
        ├── pages/
        │   ├── dashboard.js
        │   ├── profile.js
        │   ├── settings.js
        │   ├── courses.js
        │   ├── course-landing.js
        │   ├── lesson.js
        │   ├── quizzes-list.js
        │   ├── quiz-take.js
        │   ├── certificate.js
        │   ├── verify.js
        │   └── feedback.js
        └── admin/
            ├── admin.js
            ├── admin-login.js
            ├── admin-index.js
            ├── admin-lessons.js
            ├── admin-lesson-edit.js
            └── admin-feedback.js

================================================================================
BACKEND
================================================================================
backend/
└── database/
    └── migrations/
        ├── 001-extensions.sql
        ├── 002-tables.sql
        ├── 003-triggers-views.sql
        ├── 004-rls.sql
        ├── 005-seed.sql
        ├── 006-lock-views.sql
        ├── 007-learning-prefs.sql
        ├── 008-email-verify.sql       (deferred — Jan 2027)
        ├── 009-certificate.sql
        └── 010-feedback.sql

(reserved — empty subfolders)
backend/api/
backend/auth/
backend/storage/
backend/notifications/
backend/payments/
backend/analytics/
backend/services/

================================================================================
ENGINEERING
================================================================================
engineering/
├── specifications/
│   ├── aslds-reference.md              full design system docs
│   ├── aslds-quickref.md               session cheat sheet
│   ├── database-schema.md              full DB schema
│   ├── database-reference.md           quick DB cheat sheet
│   ├── course-system.md                course structure spec
│   ├── master-roadmap.md               strategic plan
│   ├── PROJECT-STATE.md                complete handoff doc
│   ├── folder-structure.md             ← this file
│   └── otp-and-domain-plan.md          deferred email verification plan
│
├── prompts/
│   └── content-writer.md               master prompt for lessons
│
├── adr/                        (empty — reserved)
├── rfc/                        (empty — reserved)
├── standards/                  (empty — reserved)
└── sprint-plans/               (empty — reserved)

================================================================================
SCRIPTS
================================================================================
scripts/
├── build.js                    copies apps + packages → dist/
└── _redirects                  Netlify routing rules

================================================================================
DEPLOYMENT PIPELINE
================================================================================
git push
  → Netlify webhook
  → runs "node scripts/build.js"
  → copies apps/ + packages/ into dist/
  → copies scripts/_redirects into dist/
  → serves dist/ as site root

================================================================================
KEY ARCHITECTURAL DECISIONS
================================================================================

1. apps/* are independent apps, each with own assets/images/
2. packages/aslds is the design system — shared by ALL apps
3. packages/shared/js holds app-level code (Supabase, auth, page loaders)
4. lesson.html · quiz.html · quizzes.html are SHARED at courses/ root —
   they read course from ?course= URL param
5. Course landing pages are per-course (different copy, same shell)
6. Admin app references its own assets (no cross-app dependency)
7. Backend migrations are saved as .sql files — SQL Editor is scratchpad only

================================================================================
END OF FOLDER STRUCTURE
================================================================================