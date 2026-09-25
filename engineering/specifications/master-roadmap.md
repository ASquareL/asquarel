# A SQUARE L INNOVATE — MASTER ROADMAP
# Version: 2.0
# Last updated: after Academy auth pages (login + register) shipped
# Purpose: Standalone reference. If a chat hits a length limit, paste this
#          file at the start of the new chat. No other context needed.

================================================================================
1. PROJECT IDENTITY
================================================================================

Org              A Square L Innovate (ASL)
Repo             A-Square-L-Innovate/  (monorepo)
Design System    ASLDS v1.1 Stable
Primary color    --primary-gold  #D4AF37
Font             Nunito
Icons            Font Awesome 6.5.1
Theme            Dark default · light + auto supported
Frontend host    Netlify (planned)
Database         Supabase first → custom backend later
Location         Kano, Nigeria

================================================================================
2. REPOSITORY MAP (locked)
================================================================================

A-Square-L-Innovate/
├── README.md · LICENSE · CHANGELOG.md · ROADMAP.md
├── CONTRIBUTING.md · CODE_OF_CONDUCT.md · SECURITY.md · .gitignore
│
├── apps/
│   ├── public-site/      ✅ DONE (13 pages, flat structure)
│   ├── academy/          🔄 IN PROGRESS
│   │   ├── index.html           ✅ done (onboarding — "Pick Your Path")
│   │   ├── login.html           ✅ done (split-screen auth)
│   │   ├── register.html        ✅ done (split-screen auth)
│   │   ├── dashboard.html       ▶️ NEXT
│   │   ├── profile.html         pending
│   │   ├── settings.html        pending
│   │   ├── subscribed.html      pending
│   │   └── courses/
│   │       ├── index.html                        (catalog — exists, needs path fix)
│   │       ├── web-development/index.html + lessons/
│   │       ├── crypto-blockchain/index.html + lessons/
│   │       └── smartphone-graphic-design/index.html + lessons/
│   ├── ai/               ⏸️ RESERVED
│   ├── business-os/      ⏸️ RESERVED
│   ├── portfolio/        ⏸️ RESERVED
│   └── admin/            ⏸️ RESERVED
│
├── packages/aslds/       ✅ DONE (v1.1 Stable)
├── backend/              ⏸️ DEFERRED (Supabase first, custom later)
├── docs/                 ⏸️ SCAFFOLDED
├── engineering/          ⏸️ SCAFFOLDED (specifications/, prompts/, adr/, rfc/,
│                                            standards/, sprint-plans/)
├── scripts/              ⏸️ SCAFFOLDED
├── tests/                ⏸️ SCAFFOLDED
├── deployment/           ⏸️ SCAFFOLDED
└── .github/workflows/    ⏸️ SCAFFOLDED

================================================================================
3. COMPLETED WORK — DO NOT REBUILD
================================================================================

--------------------------------------------------------------------------------
3.1  ASLDS — Design System v1.1 Stable                    ✅ COMPLETE
--------------------------------------------------------------------------------

CORE CSS (6)
    reset.css · variables.css · typography.css
    layout.css · utilities.css · animations.css

COMPONENT CSS (16 existing + auth.css new = 17 total)
    buttons.css · cards.css · forms.css · navbar.css · sidebar.css
    dashboard.css · footer.css · badge.css · alert.css · progress.css
    avatar.css · dropdown.css · modal.css · toast.css · table.css · tabs.css
    auth.css  ← NEW (added when login + register were built)

JS MODULES (11) — canonical load order
    1.  app.js          runtime
    2.  navbar.js
    3.  sidebar.js
    4.  tabs.js
    5.  dropdown.js
    6.  modal.js
    7.  theme.js
    8.  playground.js   (showcase-only — never on app pages)
    9.  search.js
    10. animations.js
    11. toast.js

SHOWCASE SITE — packages/aslds/showcase/
    foundations/  colors · typography · spacing · layout · shadows ·
                  borders · icons · animations
    components/   buttons · cards · forms · navbar · sidebar · dashboard ·
                  alerts · badges · progress · avatars · dropdowns · modals ·
                  tables · tabs · toast · footer
    guides/       accessibility · engineering · roadmap · changelog
    playground.html · index.html · getting-started.html · installation.html

QUICKREF
    engineering/specifications/aslds-reference.md (full)
    ASLDS QUICKREF cheat sheet (session starter)

--------------------------------------------------------------------------------
3.2  Public Site — apps/public-site/                       ✅ COMPLETE
--------------------------------------------------------------------------------

13 pages, flat structure:
    index.html · about.html · products.html · academy.html
    ai.html · business-os.html · developer-portal.html · careers.html
    blog.html · contact.html · privacy.html · terms.html · subscribed.html

Last page built: terms.html

--------------------------------------------------------------------------------
3.3  Academy — apps/academy/                               🔄 IN PROGRESS
--------------------------------------------------------------------------------

DONE:
    index.html      Onboarding / app entry page
                    Hero panel shows "Pick Your Path" (3 tracks — no fake progress)
                    7 sections: Hero · What's Inside · Learning Journey ·
                    Meet the Mentor · Student Stats · FAQ · Final CTA

    login.html      Split-screen auth layout
                    Brand panel (left) + form panel (right)
                    Google Sign-In button (placeholder — needs backend)
                    Email + password form, action="#"
                    Minimal JS: app.js · theme.js · toast.js · modal.js

    register.html   Same split-screen layout
                    Name + email + password + terms checkbox
                    Google Sign-Up button (placeholder — needs backend)
                    Form action="#" — NOT a Netlify Form (security)
                    Minimal JS: app.js · theme.js · toast.js · modal.js

NEXT:
    dashboard.html  The biggest Academy page — sidebar + progress + widgets

REMAINING:
    profile.html · settings.html · subscribed.html
    courses/index.html (exists — needs path depth fix)
    courses/{slug}/index.html × 3
    courses/{slug}/lessons/lesson-NN.html × 3 tracks

--------------------------------------------------------------------------------
3.4  Database Decision                                     ✅ RESOLVED
--------------------------------------------------------------------------------

Chosen:    Supabase (Auth + Postgres + Storage + RLS)
Later:     Custom backend/ on Railway / Fly.io when paying customers
           require custom logic, WebSockets, cron, or queues.
Sequence:  UI first → schema second → wire third.
Rationale: You don't know what shape the data needs to be until the UI shows you.

Supabase free tier covers: 500MB DB · 50k MAU · file storage · RLS.

Migration path when outgrown:
    Export Postgres (standard SQL) → own Postgres → zero data loss.
    Frontend points at own API. No rebuild.

Payments:  Stripe or Paystack — no card data ever touches our servers.

================================================================================
4. KNOWN TECH DEBT (logged, not blocking)
================================================================================

| Issue                                    | File                          | Severity |
|------------------------------------------|-------------------------------|----------|
| --shadow-xl referenced but undefined     | variables.css                 | Medium   |
| Modal z-index 2000 hardcoded             | modal.css                     | Low      |
| .progress-circle 68% hardcoded           | progress.css                  | Medium   |
| .alert-info cyan ≠ --info                | alert.css                     | Low      |
| .form-control 56px ≠ --input-height 52px | forms.css                     | Low      |
| .switch input{display:none} breaks kbd   | forms.css                     | HIGH a11y|
| Footer --container-xl undefined          | footer.css                    | Low      |
| .card:hover always lifts                 | cards.css                     | Medium   |
| Search index hardcoded                   | search.js                     | Medium   |
| Dashboard duplicates layout + sidebar    | dashboard.css                 | Medium   |
| Google Sign-In is placeholder            | login.html / register.html    | Tracked  |
| Login form action="#"                    | login.html                    | Tracked  |
| Register form action="#"                 | register.html                 | Tracked  |
| courses/index.html path depth            | courses/index.html            | Medium   |
| QuickRef missing auth.css                | ASLDS QuickRef                | Doc      |

Rule: fix only when it blocks the current page. Do not derail Academy UI for
cleanup.

================================================================================
5. PHASE PLAN
================================================================================

--------------------------------------------------------------------------------
PHASE 1 — Academy UI                                           🔄 CURRENT
--------------------------------------------------------------------------------
Goal: every Academy page looks premium, uses static mock data, zero backend.

| # | Page                                     | Status      |
|---|------------------------------------------|-------------|
| 1 | academy/index.html                       | ✅ done     |
| 2 | academy/login.html                       | ✅ done     |
| 3 | academy/register.html                    | ✅ done     |
| 4 | academy/dashboard.html                   | ▶️ NEXT     |
| 5 | academy/profile.html                     | pending     |
| 6 | academy/settings.html                    | pending     |
| 7 | academy/subscribed.html                  | pending     |
| 8 | courses/index.html                       | pending     |
| 9 | courses/{slug}/index.html × 3            | pending     |
|10 | courses/{slug}/lessons/lesson-NN.html    | pending     |

Rule: ASLDS components only. Zero inline CSS. Zero inline JS.

Deliverable: complete Academy UI with realistic static data.

--------------------------------------------------------------------------------
PHASE 2 — Database & Auth                          ⏸️ after Phase 1
--------------------------------------------------------------------------------

1.  Create Supabase project (free tier)
2.  Write engineering/specifications/database-plan.md
3.  Design schema: users · profiles · enrollments · courses · lessons ·
                    lesson_progress · quiz_attempts · certificates · sessions
4.  Configure Supabase Auth (email + Google)
5.  Write RLS policies per table
6.  Build ASLDS.Supabase.* client wrapper in packages/aslds/js/
7.  Wire login.html + register.html → real auth
8.  Wire dashboard.html → real profiles + enrollments + progress
9.  Wire courses + lessons → real content + progress tracking
10. Wire profile.html + settings.html → real profile CRUD
11. File storage → avatars + course materials
12. Payments → Stripe or Paystack
13. Wire Google Sign-In (was placeholder)

Deliverable: Academy is a real, working product.

--------------------------------------------------------------------------------
PHASE 3 — AI Platform (apps/ai/)                    ⏸️
--------------------------------------------------------------------------------
Scaffold from Academy pattern · API integration · usage metering · premium UI.

--------------------------------------------------------------------------------
PHASE 4 — Business OS (apps/business-os/)           ⏸️
--------------------------------------------------------------------------------
Dashboard-first · ERP-style modules · multi-tenant from day one.

--------------------------------------------------------------------------------
PHASE 5 — Portfolio (apps/portfolio/)               ⏸️
--------------------------------------------------------------------------------
Public showcase · links to ASLDS showcase.

--------------------------------------------------------------------------------
PHASE 6 — Admin (apps/admin/)                       ⏸️
--------------------------------------------------------------------------------
Internal tools · user mgmt · content mgmt · analytics.

--------------------------------------------------------------------------------
PHASE 7 — Custom Backend                            ⏸️ only when needed
--------------------------------------------------------------------------------
Trigger: paying customers + custom logic + WebSockets/cron/queues.
1. Node.js on Railway / Fly.io
2. Migrate Supabase Postgres → own Postgres (SQL export, zero loss)
3. Rebuild auth in backend/auth/
4. Move business logic out of frontend
5. Point frontend at own API

================================================================================
6. ORDER OF OPERATIONS (non-negotiable)
================================================================================

1.  ASLDS                    ✅ done
2.  Public site              ✅ done
3.  Academy UI               🔄 in progress  ← WE ARE HERE
4.  Database schema          ⏸️ after UI
5.  Wire UI to data          ⏸️ after schema
6.  AI platform              ⏸️
7.  Business OS              ⏸️
8.  Portfolio                ⏸️
9.  Admin                    ⏸️
10. Custom backend           ⏸️ only when needed

Why UI before DB: you don't know what shape the data needs to be until the UI
shows you what it needs. Building the DB first means guessing.

================================================================================
7. PAGE BUILD STANDARD
================================================================================

--------------------------------------------------------------------------------
7.1  DATA HONESTY RULE — public vs app pages
--------------------------------------------------------------------------------

Public / marketing pages show VALUE, never fictional user data.
App pages (authenticated) show real or static-mock user data.

| Page type            | May show                            | Must NOT show                        |
|----------------------|-------------------------------------|--------------------------------------|
| Public / marketing   | Track names · features · value props| Fake progress · fake notifications   |
|                      |                                     | fake user data · fake avatars/names  |
| App / authenticated  | User profile · progress · enrollments| — (real or clearly mock-labeled)    |

Example: the Academy landing hero shows "Pick Your Path" with 3 tracks —
not a "Dashboard Preview" with fake progress bars. Progress bars only belong
inside dashboard.html, where the user is actually logged in.

--------------------------------------------------------------------------------
7.2  ACADEMY APP CONVENTIONS (different from public-site)
--------------------------------------------------------------------------------

1. Navbar is academy-scoped, not ecosystem:
       Ecosystem · Academy · Courses · About · Contact
   "Ecosystem" → ../public-site/index.html
   "About"     → ../public-site/academy.html (marketing)
   CTA: "Sign In" → login.html

2. Footer links back to public-site via ../public-site/... for all
   ecosystem links (About, Products, Business OS, Careers, Blog, Contact,
   Privacy, Terms).

3. Newsletter form action → ../public-site/subscribed.html
   (one confirmation page for the whole ecosystem)

4. Auth pages use minimal JS:
       app.js · theme.js · toast.js · modal.js
   (not all 11 modules)

5. Auth pages have NO navbar and NO footer. Focused full-screen experience.

--------------------------------------------------------------------------------
7.3  APP PAGE CHECKLIST
--------------------------------------------------------------------------------
[ ] <!DOCTYPE html> + <html lang="en" data-theme="dark">
[ ] meta viewport + description + author + theme-color
[ ] favicon + apple-touch-icon
[ ] Core CSS in order: reset → variables → typography → layout →
    utilities → animations
[ ] Component CSS as needed
[ ] NO showcase.css on app pages
[ ] Skip link is first element in body
[ ] .page-wrapper wraps everything
[ ] <header class="navbar"> + <main id="main-content" class="main-content">
    + <footer class="footer">
[ ] Accessibility regions: #live-region · #toast-region · #modal-root
[ ] app.js loaded FIRST
[ ] Scripts in canonical order
[ ] ZERO inline <style> for ASLDS-covered styles
[ ] ZERO inline <script> for component behavior
[ ] No hardcoded colors / sizes / z-indices
[ ] One <h1> per page
[ ] All images have alt
[ ] External links have rel="noopener"

One-line test: if a page has more than ~30 lines of inline CSS or any inline
JS manipulating a component → something is wrong.

--------------------------------------------------------------------------------
7.4  AUTH PAGE CHECKLIST
--------------------------------------------------------------------------------
[ ] Same <head> as app page
[ ] NO navbar · NO footer · NO .page-wrapper
[ ] <body> opens directly with .auth-layout
[ ] .auth-layout > .auth-brand (left) + .auth-form-panel (right)
[ ] .auth-brand hidden on mobile (≤992px)
[ ] Minimal JS: app.js · theme.js · toast.js · modal.js
[ ] Accessibility regions present
[ ] Forms use action="#" (backend placeholder — NOT Netlify Forms)

================================================================================
8. PATH RULES
================================================================================

--------------------------------------------------------------------------------
8.1  CSS / JS paths
--------------------------------------------------------------------------------
apps/{app}/*.html
    ../../packages/aslds/css/...
    ../../packages/aslds/js/...

apps/academy/courses/index.html
    ../../../packages/aslds/css/...
    ../../../packages/aslds/js/...

apps/academy/courses/{slug}/index.html
    ../../../../packages/aslds/css/...
    ../../../../packages/aslds/js/...

apps/academy/courses/{slug}/lessons/*.html
    ../../../../../packages/aslds/css/...
    ../../../../../packages/aslds/js/...

packages/aslds/showcase/*.html
    ../css/...  ../js/...  ../images/...

packages/aslds/showcase/{foundations,components,guides}/*.html
    ../../css/...  ../../js/...  ../../images/...

--------------------------------------------------------------------------------
8.2  Asset paths
--------------------------------------------------------------------------------
apps/{app}/*.html
    assets/images/favicon.png
    assets/images/logo.png

apps/academy/courses/index.html
    ../assets/images/...

apps/academy/courses/{slug}/*.html
    ../../assets/images/...

apps/academy/courses/{slug}/lessons/*
    ../../../assets/images/...

================================================================================
9. CANONICAL TEMPLATES
================================================================================

--------------------------------------------------------------------------------
9.1  APP PAGE TEMPLATE (marketing-style pages inside an app)
--------------------------------------------------------------------------------
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="…" />
    <meta name="author" content="A Square L Innovate" />
    <meta name="theme-color" content="#050505" />
    <title>Page — A Square L Academy</title>

    <link rel="icon" type="image/png" href="assets/images/favicon.png" />
    <link rel="apple-touch-icon" href="assets/images/favicon.png" />

    <!-- Core CSS -->
    <link rel="stylesheet" href="../../packages/aslds/css/reset.css" />
    <link rel="stylesheet" href="../../packages/aslds/css/variables.css" />
    <link rel="stylesheet" href="../../packages/aslds/css/typography.css" />
    <link rel="stylesheet" href="../../packages/aslds/css/layout.css" />
    <link rel="stylesheet" href="../../packages/aslds/css/utilities.css" />
    <link rel="stylesheet" href="../../packages/aslds/css/animations.css" />

    <!-- Component CSS (add as needed) -->
    <link rel="stylesheet" href="../../packages/aslds/css/components/navbar.css" />
    <link rel="stylesheet" href="../../packages/aslds/css/components/buttons.css" />
    <link rel="stylesheet" href="../../packages/aslds/css/components/cards.css" />
    <link rel="stylesheet" href="../../packages/aslds/css/components/forms.css" />
    <link rel="stylesheet" href="../../packages/aslds/css/components/footer.css" />
    <link rel="stylesheet" href="../../packages/aslds/css/components/badge.css" />
    <link rel="stylesheet" href="../../packages/aslds/css/components/avatar.css" />
    <link rel="stylesheet" href="../../packages/aslds/css/components/alert.css" />
    <link rel="stylesheet" href="../../packages/aslds/css/components/dropdown.css" />
    <link rel="stylesheet" href="../../packages/aslds/css/components/modal.css" />
    <link rel="stylesheet" href="../../packages/aslds/css/components/toast.css" />
    <link rel="stylesheet" href="../../packages/aslds/css/components/progress.css" />
    <link rel="stylesheet" href="../../packages/aslds/css/components/tabs.css" />

    <!-- Fonts + Icons -->
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800;900&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
</head>
<body>
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <div class="page-wrapper">
        <header class="navbar" role="banner">
            <div class="container navbar-container">
                <!-- academy navbar: Ecosystem · Academy · Courses · About · Contact -->
            </div>
        </header>

        <main id="main-content" class="main-content">
            <!-- sections -->
        </main>

        <footer class="footer" role="contentinfo">
            <!-- footer with ../public-site/ links -->
        </footer>
    </div>

    <div id="live-region" class="sr-only" aria-live="polite" aria-atomic="true"></div>
    <section id="toast-region" aria-live="polite" aria-label="Toast Notifications"></section>
    <dialog id="modal-root" aria-label="Application Modal"></dialog>

    <script src="../../packages/aslds/js/app.js"></script>
    <script src="../../packages/aslds/js/navbar.js"></script>
    <script src="../../packages/aslds/js/sidebar.js"></script>
    <script src="../../packages/aslds/js/tabs.js"></script>
    <script src="../../packages/aslds/js/dropdown.js"></script>
    <script src="../../packages/aslds/js/modal.js"></script>
    <script src="../../packages/aslds/js/theme.js"></script>
    <script src="../../packages/aslds/js/search.js"></script>
    <script src="../../packages/aslds/js/animations.js"></script>
    <script src="../../packages/aslds/js/toast.js"></script>
</body>
</html>

--------------------------------------------------------------------------------
9.2  DASHBOARD PAGE TEMPLATE (dashboard.html · admin · business-os)
--------------------------------------------------------------------------------
Same as 9.1, but <main> uses:

<main id="main-content" class="main-content">
    <div class="dashboard-layout">
        <aside class="sidebar">
            <div class="sidebar-header">…</div>
            <div class="sidebar-user">…</div>
            <nav class="sidebar-nav">
                <ul class="sidebar-menu">
                    <li class="sidebar-item">
                        <a class="sidebar-link active" href="dashboard.html" aria-current="page">
                            <i class="fa-solid fa-home"></i> Dashboard
                        </a>
                    </li>
                    <!-- more links -->
                </ul>
            </nav>
            <div class="sidebar-footer">…</div>
        </aside>

        <main class="dashboard-content">
            <header class="dashboard-header">
                <h1 class="dashboard-title">Dashboard</h1>
                <p class="dashboard-subtitle">…</p>
            </header>
            <div class="dashboard-body">
                <!-- stats · widgets · activity -->
            </div>
        </main>
    </div>
</main>

--------------------------------------------------------------------------------
9.3  AUTH PAGE TEMPLATE (login.html · register.html)
--------------------------------------------------------------------------------
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="…" />
    <meta name="author" content="A Square L Innovate" />
    <meta name="theme-color" content="#050505" />
    <title>Sign In — A Square L Academy</title>

    <link rel="icon" type="image/png" href="assets/images/favicon.png" />
    <link rel="apple-touch-icon" href="assets/images/favicon.png" />

    <!-- Core + Component CSS (include auth.css) -->
    <!-- … same as app page, plus: -->
    <link rel="stylesheet" href="../../packages/aslds/css/components/auth.css" />

    <!-- Fonts + Icons -->
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800;900&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
</head>
<body>

    <div class="auth-layout">

        <aside class="auth-brand">
            <a href="index.html" class="auth-brand-logo">
                A SQUARE L <span>ACADEMY</span>
            </a>
            <div>
                <h2 class="auth-brand-tagline">…</h2>
                <p class="auth-brand-description">…</p>
                <div class="auth-feature">…</div>
                <div class="auth-feature">…</div>
                <div class="auth-feature">…</div>
            </div>
            <div class="auth-brand-footer">&copy; 2026 A Square L Innovate</div>
        </aside>

        <main id="main-content" class="auth-form-panel">
            <div class="auth-card">
                <header class="auth-card-header">
                    <h1 class="auth-card-title">…</h1>
                    <p class="auth-card-subtitle">…</p>
                </header>

                <button type="button" class="btn-google" aria-label="Continue with Google">
                    <i class="fa-brands fa-google"></i> Continue with Google
                </button>

                <div class="auth-divider">or continue with email</div>

                <form class="form" action="#" method="POST">
                    <!-- fields -->
                </form>

                <p class="auth-footer-note">
                    Don't have an account? <a href="register.html">Create one</a>
                </p>
            </div>
        </main>

    </div>

    <div id="live-region" class="sr-only" aria-live="polite" aria-atomic="true"></div>
    <section id="toast-region" aria-live="polite" aria-label="Toast Notifications"></section>
    <dialog id="modal-root" aria-label="Application Modal"></dialog>

    <script src="../../packages/aslds/js/app.js"></script>
    <script src="../../packages/aslds/js/theme.js"></script>
    <script src="../../packages/aslds/js/toast.js"></script>
    <script src="../../packages/aslds/js/modal.js"></script>
</body>
</html>

================================================================================
10. ASLDS QUICK REFERENCE (condensed)
================================================================================

GOLDEN RULES
    1. Tokens first.        var(--primary-gold), not #D4AF37.
    2. Components first.    Use .btn/.card/.navbar — never rebuild.
    3. Modules only.        Never duplicate JS behavior a module handles.
    4. One pattern.         Every module = IIFE + ASLDS.register().
    5. No page CSS.         A page adds ZERO CSS for anything ASLDS covers.
    6. No page JS.          A page adds ZERO JS for anything a module handles.
    7. A11y default.        Keyboard-reachable, focus-visible, screen-reader safe.

TOKENS (key ones)
    --primary-gold  #D4AF37    --primary-gold-hover  #E5C158
    --background · --surface · --card-bg · --card-hover · --border-color
    --success #22C55E · --warning #FACC15 · --danger #EF4444 · --info #3B82F6
    --fs-xs 12 → --fs-6xl 64
    --space-1 8 → --space-11 120 (8px grid)
    --radius-sm 8 · --radius-md 12 · --radius-lg 18 · --radius-xl 24 · --radius-round 999
    --transition-fast .2s · --transition-normal .3s · --transition-slow .6s
    --z-navbar 1030 · --z-modal 1050 · --z-toast 1070

LAYOUT
    .container (max 1200) · .section (96px 0) · .section-sm · .section-lg
    .page-wrapper · .main-content
    .d-flex · .d-grid · .flex-column · .flex-wrap
    .align-center · .justify-between · .justify-center
    .gap-1..6 (8/16/24/32/40/48)
    .grid · .grid-2 · .grid-3 · .grid-4
    .hero · .hero-content · .hero-image
    .dashboard-layout · .sidebar · .dashboard-content
    .course-layout · .lesson-sidebar · .lesson-content
    .bg-glow-top · .bg-glow-hero · .bg-sheen-gold
    Skip link REQUIRED on every public/app page (not auth).

COMPONENTS (essential classes)
    .btn .btn-primary/.btn-secondary/.btn-outline/.btn-light/.btn-danger/.btn-icon
         .btn-sm/.btn-lg/.btn-block/.btn-group
    .card + .card-header/.card-body/.card-footer + .card-glass
         .course-card · .dashboard-card · .stat-card · .profile-card
         .pricing-card · .lesson-card · .certificate-card
    .form .form-group .form-row .form-label .form-control .form-text
    .checkbox .radio .switch .input-group .search-box
    .navbar .navbar-container .navbar-logo .nav-menu .nav-link .mobile-toggle
         .nav-actions .nav-search
    .sidebar .sidebar-header .sidebar-user .sidebar-nav .sidebar-menu
            .sidebar-item .sidebar-link.active .sidebar-footer
    .footer .footer-grid .footer-brand .footer-links .footer-newsletter
           .footer-bottom .footer-copy .social-links
    .modal .modal-dialog .modal-header .modal-body .modal-footer .modal-close
    .dropdown .dropdown-toggle .dropdown-menu .dropdown-item .dropdown-link
    .tabs .tab-list .tab-button.is-active .tab-content.is-active
    .badge (+ .badge-success/.badge-warning/.badge-danger/.badge-info)
    .alert (+ .alert-success/.alert-warning/.alert-danger/.alert-info)
    .progress .progress-header .progress-bar .progress-fill
    .avatar (+ .avatar-xs/sm/md/lg/xl) + .avatar-gold
    .table-wrapper + .table
    .dashboard .dashboard-sidebar .dashboard-content .dashboard-header
              .dashboard-stats .dashboard-grid .widget .quick-actions
              .activity-list
    .auth-layout .auth-brand .auth-form-panel .auth-card
    .auth-divider .auth-feature .auth-footer-note .btn-google

JS MODULES — the ones you'll actually call
    ASLDS.Toast.show({type, title, message, duration, position})
    ASLDS.Modal.open() / .close() / .toggle()
    ASLDS.Theme.setMode('auto'|'light'|'dark') / .toggle()
    ASLDS.Navbar.open() / .close() / .toggle()
    ASLDS.Sidebar.open() / .close() / .toggle()
    ASLDS.Dropdown.open(container) / .closeAll()
    ASLDS.Tabs.activateByIndex(container, i, focus)
    ASLDS.Search.open() / .close()
    ASLDS.Animations.trigger(element) / .refresh()

    Runtime auto-inits on window load. Pages NEVER call .init().

================================================================================
11. IMMEDIATE NEXT ACTION
================================================================================

Build:  apps/academy/dashboard.html

Spec:
    - Layout: .dashboard-layout (sidebar 280 + dashboard-content)
    - Sidebar: academy nav (Dashboard · Courses · Progress · Certificates ·
               Profile · Settings · Logout)
    - Header: "Welcome back, [Student Name]" + reg number + subtle actions
    - Stats row: 4 stat cards (enrolled courses · lessons complete · streak ·
                 hours learned)
    - Enrolled courses with real ASLDS .progress components
    - Activity feed (recent lessons, achievements)
    - Quick actions
    - Static / hardcoded mock data
    - ASLDS components only. Zero inline CSS. Zero inline JS.
    - Full script set (all 10 app-page modules)

When done: profile.html → settings.html → subscribed.html → courses/index.html
(path fix) → courses/{slug}/index.html × 3 → lessons.

================================================================================
12. RESUME PROTOCOL (if chat length limit hits)
================================================================================

1. Paste THIS roadmap into the new chat.
2. Say: "Continue from Section 11. Last completed: [page name]."
3. The assistant reads Section 5, Phase 1 table → picks the next `pending`
   page → builds it to Section 7 standard using the template in Section 9.

No other context needed.

================================================================================
END OF ROADMAP
================================================================================