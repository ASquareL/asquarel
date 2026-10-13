================================================================================
ASLDS QUICKREF — SESSION CHEAT SHEET
A Square L Innovate Design System · v1.1 Stable
Paste at the start of every page-building session.
Full docs: engineering/specifications/aslds-reference.md
================================================================================

GOLDEN RULES
--------------------------------------------------------------------------------
1. Tokens first      — var(--primary-gold), not #D4AF37
2. Components first  — .btn/.card/.navbar; never rebuild
3. Modules only      — never duplicate JS behavior a module handles
4. One pattern       — every module = IIFE + ASLDS.register()
5. No page CSS       — ZERO inline style for anything ASLDS covers
6. No page JS        — ZERO inline script for anything a module handles
7. A11y default      — keyboard-reachable, focus-visible, screen-reader safe

================================================================================
TOKENS  (packages/aslds/css/variables.css)
================================================================================

COLORS
    Brand    --primary-gold #D4AF37 · --primary-gold-hover #E5C158
             --dark-gold #B8860B · --gold-light #F5E7A1
    Surfaces --background · --surface · --card-bg · --card-hover · --border-color
             --black · --white
    Grays    --gray-100 → --gray-900
    Status   --success #22C55E · --warning #FACC15 · --danger #EF4444 · --info #3B82F6

TYPE
    --font-family 'Nunito', sans-serif
    --fs-xs 12 · sm 14 · md 16 · lg 18 · xl 20 · 2xl 24 · 3xl 30 · 4xl 36 · 5xl 48 · 6xl 64
    --fw-light 300 · normal 400 · medium 500 · semibold 600 · bold 700 · extrabold 800
    --lh-tight 1.2 · normal 1.6 · relaxed 1.8

SPACING (8px grid)
    --space-1 8 · 2 16 · 3 24 · 4 32 · 5 40 · 6 48 · 7 56 · 8 64 · 9 80 · 10 96 · 11 120

RADIUS
    --radius-sm 8 · md 12 · lg 18 · xl 24 · round 999

SHADOW
    --shadow-sm · md · lg · gold
    ⚠️ --shadow-xl referenced but NOT defined — avoid

GLOW (ambient tints)
    --gold-glow-strong rgba(212,175,55,.16)
    --gold-glow-medium rgba(212,175,55,.08)
    --gold-glow-soft   rgba(212,175,55,.04)

GLASS    --glass-bg · --glass-border · --glass-blur
TRANS    --transition-fast .2s · normal .3s · slow .6s
ANIM     --animation-fast .2s · normal .35s · slow .6s (animations.css only)

Z-INDEX
    --z-dropdown 1000 · sticky 1020 · navbar 1030 · modal 1050 · tooltip 1060
    --z-toast 1070 · loader 1200

DIMENSIONS
    --container-width 1200 · --container-padding 24
    --navbar-height 75 · --sidebar-width 280 · --lesson-sidebar-width 320
    --btn-height 50 · --input-height 52 · --progress-height 8 · --course-card-height 340

BREAKPOINTS (reference)
    --mobile 576 · --tablet 768 · --laptop 992 · --desktop 1200 · --wide 1400

================================================================================
LAYOUT  (layout.css)
================================================================================

CONTAINER / SECTIONS
    .container        max-width 1200, auto margins, 24px padding
    .section          96px vertical
    .section-sm       56px · .section-lg 120px
    .page-wrapper     flex column, min-height 100vh
    .main-content     flex:1

FLEX / GRID
    .d-flex .d-grid .d-block .d-inline
    .flex-row .flex-column · .align-center/start/end · .justify-between/center/around/evenly
    .gap-1..6 (8/16/24/32/40/48)
    .grid + .grid-2 / .grid-3 / .grid-4 / .grid-auto

WIDTH / HEIGHT  .w-100 .w-50 .w-auto .h-100 .min-vh
POSITION        .relative .absolute .fixed .sticky (includes top:0 + z-navbar)

HERO (app pages)   .hero · .hero-content · .hero-image
DASHBOARD LAYOUT   .dashboard-layout (grid 280px 1fr) · .sidebar · .dashboard-content
COURSE LAYOUT      .course-layout · .lesson-sidebar · .lesson-content

SKIP LINK — required on every public/app page (not auth pages):
    <a href="#main-content" class="skip-link">Skip to main content</a>

================================================================================
UTILITIES  (utilities.css)
================================================================================

DISPLAY (all !important)
    .d-none .d-block .d-inline .d-inline-block .d-flex .d-grid

FLEX
    .flex-row .flex-column .flex-wrap .flex-nowrap
    .items-start/center/end/stretch
    .justify-start/center/end/between/around/evenly

GAP      .gap-xs 4 · sm 8 · md 16 · lg 24 · xl 32
WIDTH    .w-25 .w-50 .w-75 .w-100 .h-100 .min-vh-100

MARGIN   .m-0 · .mt-1..5 (8/16/24/32/48) · .mb-1..5 · .mx-auto
         .ml-auto · .mr-auto                        (added Oct 2026)
PADDING  .p-0..5 (0/8/16/24/32/48) · .py-1..3 · .px-2..3
         .p-6 (40px) · .py-4 (32px) · .py-5 (40px)   (added Oct 2026)
         .px-4 (32px) · .px-5 (40px)                (added Oct 2026)

TEXT     .text-left/center/right · .text-white/gold/muted
         .text-success/danger/warning/info
WEIGHT   .fw-normal/medium/bold/extra-bold
BG       .bg-primary/card/surface/transparent

RADIUS   .rounded-sm .rounded .rounded-lg .rounded-xl .rounded-circle
SHADOW   .shadow-sm .shadow .shadow-lg
POSITION .position-relative/absolute/fixed · .top-0 .bottom-0 .left-0 .right-0
MISC     .overflow-hidden/auto · .cursor-pointer · .transition

LAYOUT HELPERS (added Oct 2026)
    .icon-fixed    width 20px, text-align center, flex-shrink 0
                   → consistent icon columns in generated lists
    .lesson-num    min-width 26px, inline-block, tabular-nums
                   → 2-digit lesson numbers in lesson sidebar
    .is-empty      padding 48/24, text-center, color --gray-500
                   → loading / no-data placeholders in tables & blocks

RESPONSIVE
    .mobile-hidden   hide ≤768
    .mobile-full     width 100% ≤768

GOLD GLOW (ambient — at most ONE per section, never stack hero+sheen)
    .bg-glow-top     radial from top (sections)
    .bg-glow-hero    pulsing center glow (hero)
    .bg-sheen-gold   diagonal gold wash (cards, CTA)

================================================================================
MOTION  (animations.css)
================================================================================

ENTRY (auto-triggered by animations.js on scroll)
    .fade-in/out · .slide-up/down/left/right · .scale-in · .page-enter
    .stagger > * (children fade in sequence, first 5 defined)

CONTINUOUS  .float 4s · .pulse 2s · .spin 1s · .glow 2s · .glow-pulse
ATTENTION   .shake · .bounce
LOADING     .skeleton
INTERACTION .ripple · .hover-lift · .hover-scale · .hover-rotate

REDUCED MOTION handled globally — never override

⚠️ Do NOT add .is-visible manually — animations.js handles it

================================================================================
COMPONENTS
================================================================================

BUTTONS
--------------------------------------------------------------------------------
    <button class="btn btn-primary">Label</button>
    <a class="btn btn-secondary" href="…">Label</a>

Variants  primary · secondary · outline · success · danger · warning · info
          light · glass · link · icon
Sizes     sm (40) · md (50 default) · lg (60) · xl (70)
Width     .btn-block
Shape     .rounded-pill · .rounded-circle
States    :active scale .98 · :disabled opacity .6 · .btn-loading
Group     .btn-group (flex gap 16)
FAB       .btn-fab

⚠️ Mobile ≤768: ALL .btn become 100% width — wrap in .btn-group or override

CARDS
--------------------------------------------------------------------------------
    <article class="card">
        <div class="card-header">Title + Subtitle</div>
        <div class="card-body">Content</div>
        <div class="card-footer">Actions</div>
    </article>

Base      .card (auto hover lift -8px translate)
Variants  .card-glass · .card-horizontal · .featured (POPULAR ribbon)
Special   .course-card · .dashboard-card · .stat-card · .profile-card
          .pricing-card · .lesson-card · .certificate-card · .download-card
Badge     .card-badge (absolute top-left)

⚠️ .card:hover ALWAYS lifts — bad for non-clickable cards
⚠️ .card { overflow:hidden } clips absolute badges/ribbons

FORMS
--------------------------------------------------------------------------------
    <form class="form">
        <div class="form-row">
            <div class="form-group">
                <label class="form-label" for="email">Email</label>
                <input id="email" class="form-control" type="email">
                <p class="form-text">Helper</p>
            </div>
        </div>
    </form>

Layout   .form (gap 40) · .form-row (2 col) · .form-row-3 (3 col) · .form-group
Controls .form-control (56px) · textarea.form-control (150px min)
         .form-control.textarea-code (code editor)
Groups   .input-group + .input-group-text
Special  .search-box · .checkbox · .radio · .switch + .slider · .file-upload
Valid    .is-success / .is-error / .is-warning
Text     .text-success / .text-error / .text-warning

⚠️ .form-control 56px ≠ --input-height (52px) — mismatch logged
⚠️ .switch input { display:none } breaks keyboard access — fix pending

NAVBAR
--------------------------------------------------------------------------------
    <header class="navbar">
        <div class="navbar-container">
            <a class="navbar-logo"><strong>ASL<span>INNOVATE</span></strong></a>
            <button class="mobile-toggle" aria-expanded="false" aria-controls="nav">
                <span></span><span></span><span></span>
            </button>
            <nav id="nav" aria-label="Primary">
                <ul class="nav-menu">
                    <li><a class="nav-link active" aria-current="page">Home</a></li>
                </ul>
            </nav>
            <div class="nav-actions">
                <button class="nav-search">Search</button>
                <button class="btn btn-outline" data-theme-toggle>Theme</button>
                <span class="badge">v1.1</span>
            </div>
        </div>
    </header>

⚠️ Never use .dropdown inside navbar — conflicts with dropdown.css
JS: navbar.js handles toggle + escape + outside click

SIDEBAR (dashboard pages)
--------------------------------------------------------------------------------
    <aside class="sidebar" id="dashboard-sidebar">
        <div class="sidebar-header">…</div>
        <div class="sidebar-user">
            <div class="avatar avatar-xl avatar-gold mb-3">
                <span class="avatar-initials" data-user-initials>??</span>
            </div>
            <div class="sidebar-name" data-user-name>Loading…</div>
            <div class="sidebar-role">Student</div>
            <span class="sidebar-level" data-user-reg>—</span>
        </div>
        <nav class="sidebar-nav">
            <ul class="sidebar-menu">
                <li class="sidebar-item">
                    <a class="sidebar-link active" href="…" aria-current="page">
                        <i class="fa-solid fa-home"></i> Dashboard
                    </a>
                </li>
            </ul>
        </nav>
        <div class="sidebar-progress">…</div>
        <div class="sidebar-footer">
            <a href="#" class="sidebar-link" data-signout>Logout</a>
        </div>
    </aside>

JS: sidebar.js handles toggle + auto-active + escape + outside click

FOOTER
--------------------------------------------------------------------------------
    <footer class="footer" role="contentinfo">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">…</div>
                <div class="footer-links">…</div>
                <div class="footer-newsletter">…</div>
            </div>
            <div class="footer-bottom">…</div>
        </div>
    </footer>

⚠️ --container-xl undefined in footer.css — breaks on 4K screens

MODAL
--------------------------------------------------------------------------------
    <div class="modal">
        <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="…">
            <div class="modal-header">…<button class="modal-close" aria-label="Close">×</button></div>
            <div class="modal-body">…</div>
            <div class="modal-footer">…</div>
        </div>
    </div>

Sizes  .modal-sm 420 · .modal-md 650 · .modal-lg 900 · .modal-xl 1200
       Size class goes on OUTER .modal, not .modal-dialog

⚠️ --shadow-xl undefined → modal has no shadow
⚠️ z-index 2000 hardcoded (bypasses z-token scale)

DROPDOWN
--------------------------------------------------------------------------------
    <div class="dropdown">
        <button class="dropdown-toggle" aria-expanded="false">Menu</button>
        <div class="dropdown-menu">
            <div class="dropdown-header">
                <div class="dropdown-title">…</div>
                <div class="dropdown-subtitle">…</div>
            </div>
            <ul class="dropdown-list">
                <li class="dropdown-item">
                    <a class="dropdown-link" href="…">Profile</a>
                </li>
            </ul>
            <div class="dropdown-divider"></div>
            <div class="dropdown-footer"><a href="…">Logout</a></div>
        </div>
    </div>

JS: dropdown.js — toggle + escape + outside click + arrow keys
Multiple dropdowns per page OK

TABS
--------------------------------------------------------------------------------
    <div class="tabs">
        <div class="tab-list" role="tablist">
            <button class="tab-button is-active" role="tab">Overview</button>
        </div>
        <div class="tab-content is-active" role="tabpanel">…</div>
    </div>

JS: tabs.js — click + arrows + Home/End + ARIA + IDs

TOAST (API only — no HTML)
--------------------------------------------------------------------------------
    ASLDS.Toast.show({
        type: 'success',    // success | error | warning | info
        title: 'Saved',
        message: 'Your changes have been saved.',
        duration: 3500,     // 0 = persistent
        position: 'top-right'
    });

Positions: top-right · top-left · bottom-right · bottom-left

BADGE
--------------------------------------------------------------------------------
    <span class="badge">Default (gold tint)</span>
    <span class="badge badge-success">Success</span>
    <span class="badge badge-warning">Warning</span>
    <span class="badge badge-danger">Danger</span>
    <span class="badge badge-info">Info</span>

Sizes   .badge-sm · .badge-md · .badge-lg
Styles  .badge-solid · .badge-outline · .badge-dot
Close   <button class="badge-close" aria-label="Remove">×</button>

ALERT
--------------------------------------------------------------------------------
    <div class="alert alert-success">
        <div class="alert-icon"><i class="fa-solid fa-check"></i></div>
        <div class="alert-content">
            <div class="alert-title">Success</div>
            <div class="alert-text">Message</div>
        </div>
        <button class="alert-close" aria-label="Close">×</button>
    </div>

Variants  .alert-success · warning · danger · info · primary
⚠️ .alert-info uses cyan #0dcaf0 — mismatch with --info #3B82F6

PROGRESS
--------------------------------------------------------------------------------
    <div class="progress">
        <div class="progress-header">
            <span class="progress-title">Progress</span>
            <span class="progress-value">68%</span>
        </div>
        <div class="progress-bar" role="progressbar" aria-valuenow="68" aria-valuemin="0" aria-valuemax="100">
            <div class="progress-fill" style="width: 68%"></div>
        </div>
    </div>

Sizes   .progress-sm/md/lg
Colors  .progress-success/warning/danger/info
Extra   .progress-striped · .progress-animated
Circle  .progress-circle > .progress-circle-inner  (⚠️ 68% hardcoded)
Steps   .progress-steps > .progress-step (.active)

⚠️ style="width: X%" on .progress-fill is the ONLY allowed inline style

AVATAR
--------------------------------------------------------------------------------
    <div class="avatar avatar-md"><span class="avatar-initials">JD</span></div>
    <div class="avatar avatar-md"><img src="…" alt="…"></div>

Sizes   .avatar-xs 28 · sm 40 · md 56 · lg 72 · xl 100
Border  .avatar-gold · success · danger · white
Extra   .avatar-badge (verified) · .avatar-glow · .avatar-group (stacked)
Status  .status-online/away/busy/offline

TABLE
--------------------------------------------------------------------------------
    <div class="table-wrapper">
        <table class="table">
            <caption class="sr-only">…</caption>
            <thead>…</thead>
            <tbody>…</tbody>
        </table>
    </div>

Variants  .table-striped · .table-bordered · .table-sm
Always wrap in .table-wrapper

DASHBOARD
--------------------------------------------------------------------------------
    <div class="dashboard-layout">
        <aside class="sidebar">…</aside>
        <div class="dashboard-content">
            <header class="dashboard-header">…</header>
            <div class="dashboard-body">
                <div class="dashboard-stats">…</div>
                <div class="dashboard-grid">
                    <div class="widget">…</div>
                </div>
                <div class="quick-actions">…</div>
                <div class="activity-list">…</div>
            </div>
        </div>
    </div>

⚠️ dashboard.css .dashboard duplicates layout.css .dashboard-layout — pick one

--------------------------------------------------------------------------------
LESSON CONTENT  (lesson-content.css)
--------------------------------------------------------------------------------
Used by: academy lesson viewer + admin lesson editor preview + quiz pages.

BODY
    .lesson-body                Reading column (72ch max) + typography
    .lesson-body h2/h3/p/ul/ol  Standard content
    .lesson-body code/pre       Monospace + scrollable blocks
    .lesson-body a              Gold underlined

BLOCKS (inside .lesson-body)
    .lesson-objectives          Gold-accent "What You'll Learn" list
    .lesson-activity            Bordered hands-on activity block
    .lesson-checklist           Green-checkmark list
    .lesson-figure              Figure wrapper (image + caption)
    .lesson-diagram             Text/ASCII diagram box

VIDEO
    .video-embed                16:9 aspect-ratio iframe wrapper
    .video-placeholder          Fallback when no video

SIDEBAR (lesson page only)
    .lesson-sidebar             Left column — sticky 100vh on desktop, fixed drawer on mobile
    .lesson-sidebar-section     Bordered section inside sidebar
    .lesson-module              Collapsible module wrapper
    .lesson-module.is-expanded  Expanded state
    .lesson-module-header       Clickable header button
    .lesson-module-num          "Module N" gold label
    .lesson-module-title        Module title
    .lesson-module-chevron      Rotates 180° when expanded
    .lesson-module-lessons      Hidden unless expanded

MOBILE DRAWER
    .lesson-mobile-toggle       Hamburger (shown ≤992px only)
    .lesson-backdrop            Dim overlay behind open drawer
    .lesson-backdrop.is-visible Visible state

ACTIONS
    .lesson-actions             Prev / Complete / Next row (stacks on mobile)

RESPONSIVE BEHAVIOR
    Desktop >992px  sidebar sticky, 100vh, own scroll
    Mobile ≤992px   sidebar becomes left drawer, toggle visible,
                    backdrop active, course-layout stacks

JS: pages/lesson.js (drawer + module collapse wiring)

--------------------------------------------------------------------------------
CERTIFICATE  (certificate.css)
--------------------------------------------------------------------------------
    .certificate              Printable cert wrapper (A4 landscape)
    .certificate-inner        Content above decoration
    .certificate-brand        "A SQUARE L ACADEMY" header
    .certificate-title        "Achievement Awarded" big title
    .certificate-name         Large student name
    .certificate-course       Course title
    .certificate-footer       Sign | Seal | Sign row
    .certificate-sign         Signature block
    .certificate-seal         Round gold seal
    .certificate-meta         Cert number + verify URL strip

PRINT: @media print styles hide .no-print and everything except .certificate
       Browser "Save as PDF" creates A4 landscape PDF

--------------------------------------------------------------------------------
FEEDBACK ITEM  (badge.css — was appended here)
--------------------------------------------------------------------------------
    .feedback-item            Expandable <details> row
    .feedback-summary         Clickable header
    .feedback-body            Expanded content
    .feedback-message         Message block
    .feedback-filters         Filter chip row
    .feedback-filter-chip     Category filter
    .sidebar-link-badge       Badge on sidebar link

⚠️ These belong in badge.css but feel out of place — flag for split into feedback.css

================================================================================
JAVASCRIPT MODULES
================================================================================

LOAD ORDER (non-negotiable — app.js first)
--------------------------------------------------------------------------------
    1. app.js          runtime (namespace, registry, event bus)
    2. navbar.js
    3. sidebar.js
    4. tabs.js
    5. dropdown.js
    6. modal.js
    7. theme.js
    8. playground.js   showcase-only — never on app pages
    9. search.js
    10. animations.js
    11. toast.js

Runtime auto-inits on window load. Pages never call .init().

PRIORITY TABLE  10 Theme · 50 Animations · 55 Search · 60 Playground · 70 Toast
                75 Dropdown · 80 Tabs · 85 Modal · 90 Sidebar · 100 Navbar

RUNTIME API  (app.js)
--------------------------------------------------------------------------------
    ASLDS.register(name, module, priority, dependencies)
    ASLDS.getModules() · .hasModule(name)
    ASLDS.events.on/off/emit
    ASLDS.utils.select/selectAll/exists/delegate/on/offAll
    ASLDS.utils.cacheElement/getCachedElement/clearCache
    ASLDS.accessibility.setExpanded/setHidden/focus
    ASLDS.storage.get/set/remove/clear (prefix "ASLDS::")
    ASLDS.logger.log/info/warn/error
    ASLDS.performance.mark/measure/now
    ASLDS.configure() · .refresh() · .destroy() · .reset()
    ASLDS.info() · .status() · .getVersion()

THEME  (theme.js) — priority 10
--------------------------------------------------------------------------------
Modes   auto → light → dark (toggle cycles in that order)
HTML    <html data-theme="dark" data-theme-mode="auto">
Trigger any [data-theme-toggle] button — auto-wired, label updates

    ASLDS.Theme.setMode(mode, instant) · .toggle(instant)
    ASLDS.Theme.getMode() · .getEffectiveTheme() · .getSystemTheme()
    ASLDS.Theme.isDark() · .isLight() · .isAuto()
    ASLDS.Theme.refresh() · .reset() · .info()

Events  theme:ready · theme:mode-changed · theme:effective-changed

THEME BOOT (theme-boot.js)
--------------------------------------------------------------------------------
Runs SYNCHRONOUSLY in <head> BEFORE CSS — prevents dark→light flash.
Reads ASLDS::theme-mode from localStorage, sets data-theme on <html>.
Must NOT be deferred, must NOT be async.

Load order per page:
    1. theme-boot.js (in <head>, before CSS)
    2. CSS links
    3. app.js + modules (end of <body>)
    4. theme.js (end of <body>)

NAVBAR  (navbar.js) — priority 100
--------------------------------------------------------------------------------
HTML contract  .navbar > .mobile-toggle + .nav-menu (.nav-link inside)
Handles        toggle · escape · outside click · resize · focus restore

    ASLDS.Navbar.open/close/toggle
    ASLDS.Navbar.isOpen/getState/getToggle/getMenu
Events  asl:navbar:init · :open · :close · :destroy

SIDEBAR  (sidebar.js) — priority 90
--------------------------------------------------------------------------------
HTML contract  .sidebar + .sidebar-link + .mobile-toggle (or [data-sidebar-toggle])
Handles        toggle · auto-active link · escape · outside click · resize

    ASLDS.Sidebar.open/close/toggle
    ASLDS.Sidebar.getState/getElement/getToggle
Events  asl:sidebar:init · :open · :close · :destroy

MODAL  (modal.js) — priority 85
--------------------------------------------------------------------------------
HTML contract  .modal > .modal-dialog > .modal-header/.modal-body/.modal-footer + .modal-close
Handles        open/close · focus trap · scroll lock · escape · outside click

    ASLDS.Modal.open/close/toggle
    ASLDS.Modal.getState/getElement/getDialog
Events  asl:modal:init · :open · :close · :destroy
Only ONE modal per page

DROPDOWN  (dropdown.js) — priority 75
--------------------------------------------------------------------------------
HTML contract  .dropdown > .dropdown-toggle + .dropdown-menu + .dropdown-link
Handles        toggle · arrows · escape · outside click · one-at-a-time
Multiple dropdowns per page OK

TABS  (tabs.js) — priority 80
--------------------------------------------------------------------------------
HTML contract  .tabs > .tab-list > .tab-button + .tab-content
Handles        click · arrows · Home/End · ARIA · IDs

TOAST  (toast.js) — priority 70
--------------------------------------------------------------------------------
No HTML contract — creates its own DOM

    ASLDS.Toast.show({ type, title, message, duration, position, showProgress, showIcon, closeButton })
    ASLDS.Toast.dismiss(toast, immediate) · .clear(immediate)
    ASLDS.Toast.configure(config) · .getConfig() · .getToasts() · .getContainer(position) · .info()

SEARCH  (search.js) — priority 55
--------------------------------------------------------------------------------
No HTML contract — creates overlay + injects CSS
Triggers  click .nav-search OR Ctrl+K / Cmd+K

    ASLDS.Search.open/close/toggle · .isOpen()
    ASLDS.Search.getResults/getIndex/setIndex/updateConfig

⚠️ NO search.css — styles injected by search.js
⚠️ Search index hardcoded inside search.js

ANIMATIONS  (animations.js) — priority 50
--------------------------------------------------------------------------------
Watches  [data-animate], .fade-in, .slide-up/down/left/right, .scale-in, .stagger > *
Adds     .is-visible when element enters viewport
Respects prefers-reduced-motion

    ASLDS.Animations.trigger(element) · .refresh() · .isReducedMotion()
    ASLDS.Animations.getObservedElements/getTriggeredElements/updateConfig

⚠️ Do NOT add .is-visible manually — module handles it

PLAYGROUND  (playground.js) — priority 60
--------------------------------------------------------------------------------
SHOWCASE-ONLY. Never load on app pages.
Wires [data-demo-toast] [data-demo-modal] [data-demo-dropdown] [data-demo-tab]
      + .btn-copy + theme label

================================================================================
SHARED JS — packages/shared/js/
================================================================================

core/
    supabase-config.js    Initializes Supabase client → window.SupabaseClient
                          Also injects beta badge on every page
    auth.js               Auth helpers + form auto-wiring
                          Email + Google OAuth + auth state listeners

pages/
    dashboard.js          Dashboard page loader
    profile.js            Profile page loader
    settings.js           Settings page loader
    courses.js            Courses index page loader
    course-landing.js     Course landing (enroll button + sidebar)
    lesson.js             Lesson viewer (drawer + modules + progress)
    quizzes-list.js       Quizzes list per course
    quiz-take.js          Quiz taking + grading
    certificate.js        Certificate view + print
    verify.js             Public certificate verification (no auth)
    feedback.js           Feedback form (works anonymous)

admin/
    admin.js              Shared admin gate + data helpers
    admin-login.js        Admin login page
    admin-index.js        Admin dashboard
    admin-lessons.js      Lessons list per course
    admin-lesson-edit.js  Single lesson editor
    admin-feedback.js     Feedback inbox

LOAD ORDER on every app page:
    1. Supabase SDK (CDN)
    2. core/supabase-config.js
    3. ASLDS modules (app.js first)
    4. core/auth.js  (if auth needed)
    5. pages/{page}.js OR admin/{page}.js

AUTH — LOGIN/SIGNUP
--------------------------------------------------------------------------------
Frontend (auth.js)
    ASLDS.Auth.signUp({ email, password, fullName })
    ASLDS.Auth.signIn({ email, password })
    ASLDS.Auth.signInWithGoogle()
    ASLDS.Auth.signOut()
    ASLDS.Auth.getUser() · .getSession()
    ASLDS.Auth.requireAuth(redirect) · .redirectIfLoggedIn(target)

Form wiring — attribute-based:
    <form data-auth="login">      → login form
    <form data-auth="register">   → register form
    <button data-auth-google>     → Google OAuth button

Sign out — attribute-based:
    <a data-signout>…</a>

Google OAuth
    Provider enabled in Supabase → Auth → Providers
    Callback: https://rrrojvvlflfitnxievob.supabase.co/auth/v1/callback
    Google pre-verifies email — no OTP needed for Google signups
    handle_new_user trigger creates profile automatically

BETA BADGE (injected by supabase-config.js)
--------------------------------------------------------------------------------
Fixed bottom-right pill · "Beta · Free" · pulsing green dot
Clickable → /apps/academy/feedback.html
Auto-injected on every page that loads supabase-config.js
Opt out: add data-hide-beta-badge to <body>

================================================================================
EVENTS — MASTER LIST
================================================================================
theme:ready / mode-changed / effective-changed
asl:navbar:init / open / close / destroy
asl:sidebar:init / open / close / destroy
asl:modal:init / open / close / destroy
asl:dropdown:init / open / close / destroy
asl:tabs:init / activate / destroy
asl:toast:init / show / dismiss / clear / destroy
asl:search:init / open / close / destroy
asl:playground:ready / destroy
asl:animations:init / triggered / destroy
runtime:ready / refresh / destroy / dom-change

Subscribe: document.addEventListener("event", handler)
        or ASLDS.events.on("event", handler)

================================================================================
FOLDER STRUCTURE
================================================================================

A-Square-L-Innovate/
├── apps/
│   ├── public-site/          (13 marketing pages + assets/images/)
│   ├── academy/
│   │   ├── assets/images/    (favicon, logo, founder)
│   │   ├── *.html            (index, login, register, dashboard, profile,
│   │   │                      settings, certificate, verify, feedback, subscribed)
│   │   └── courses/
│   │       ├── index.html
│   │       ├── lesson.html        (SHARED — ?course={slug}&id={lesson})
│   │       ├── quiz.html          (SHARED — ?course={slug}&id={quiz})
│   │       ├── quizzes.html       (SHARED — ?course={slug})
│   │       ├── web-development/index.html
│   │       ├── crypto-blockchain/index.html
│   │       └── smartphone-graphic-design/index.html
│   ├── admin/                (assets/images/ + 5 pages)
│   ├── ai/                   (reserved)
│   ├── business-os/          (reserved)
│   └── portfolio/            (reserved)
│
├── packages/
│   ├── aslds/
│   │   ├── css/              (6 core + 19 component files)
│   │   ├── js/               (11 modules)
│   │   ├── showcase/         (docs site)
│   │   ├── images/ · icons/ · fonts/
│   └── shared/js/
│       ├── core/             (supabase-config, auth)
│       ├── pages/            (11 page loaders)
│       └── admin/            (6 admin loaders)
│
├── backend/database/migrations/   (10 SQL files)
├── engineering/
│   ├── specifications/       (reference, quickref, schema, roadmap, state)
│   ├── prompts/              (content-writer.md)
│   ├── adr/ · rfc/ · standards/ · sprint-plans/
├── scripts/                  (build.js + _redirects)
├── docs/ · tests/ · deployment/ · .github/workflows/
├── netlify.toml
└── README, LICENSE, CHANGELOG, ROADMAP, CONTRIBUTING, SECURITY, .gitignore

PATH DEPTH RULES
    apps/{app}/*.html                          → ../../packages/
    apps/academy/courses/*.html                → ../../../packages/
    apps/academy/courses/{slug}/index.html     → ../../../../packages/

ASSETS
    apps/{app}/*.html                          → assets/images/
    apps/academy/courses/*.html                → ../assets/images/
    apps/academy/courses/{slug}/*.html         → ../../assets/images/

================================================================================
PATH RULES FOR SHARED JS (post Phase 4)
================================================================================
Every app page that loads Supabase:
    <script src="../../packages/shared/js/core/supabase-config.js"></script>

Every app page with auth:
    <script src="../../packages/shared/js/core/auth.js"></script>

Every page-specific loader:
    <script src="../../packages/shared/js/pages/{page}.js"></script>
    or
    <script src="../../packages/shared/js/admin/{page}.js"></script>

Adjust depth for pages at courses/ or courses/{slug}/ level.

================================================================================
VERIFICATION — ONE-LINE TEST
================================================================================
If a page has more than ~30 lines of inline CSS or any inline JS
manipulating a component → something is wrong.
A well-built ASLDS page has ZERO inline style and ZERO inline script.
(Exception: .progress-fill width — documented as allowed.)

================================================================================
END OF QUICKREF
================================================================================