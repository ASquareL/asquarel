================================================================================
ASLDS QUICKREF — WORKING CHEAT SHEET
A Square L Innovate Design System · v1.1 Stable
Purpose: Paste this at the start of every page-building session.
Companion: engineering/specifications/aslds-reference.md (full docs)
================================================================================

GOLDEN RULES (memorize these — everything else follows)
--------------------------------------------------------------------------------
1. Tokens first.        var(--primary-gold), not #D4AF37.
2. Components first.    Use .btn/.card/.navbar — never rebuild.
3. Modules only.        Never duplicate JS behavior a module handles.
4. One pattern.         Every module = IIFE + ASLDS.register().
5. No page CSS.         A page adds ZERO CSS for anything ASLDS covers.
6. No page JS.          A page adds ZERO JS for anything a module handles.
7. A11y default.        Keyboard-reachable, focus-visible, screen-reader safe.

================================================================================
TOKENS (packages/aslds/css/variables.css)
================================================================================

COLORS — Brand
    --primary-gold #D4AF37 · --primary-gold-hover #E5C158
    --dark-gold #B8860B · --gold-light #F5E7A1

COLORS — Surfaces (theme-flipped)
    --background · --surface · --card-bg · --card-hover · --border-color
    --black · --white

COLORS — Grays
    --gray-100 → --gray-900

COLORS — Status
    --success #22C55E · --warning #FACC15 · --danger #EF4444 · --info #3B82F6

TYPE
    --font-family 'Nunito', sans-serif
    --fs-xs 12 · --fs-sm 14 · --fs-md 16 · --fs-lg 18 · --fs-xl 20
    --fs-2xl 24 · --fs-3xl 30 · --fs-4xl 36 · --fs-5xl 48 · --fs-6xl 64
    --fw-light 300 · --fw-normal 400 · --fw-medium 500
    --fw-semibold 600 · --fw-bold 700 · --fw-extrabold 800
    --lh-tight 1.2 · --lh-normal 1.6 · --lh-relaxed 1.8

SPACING (8px grid)
    --space-1 8 · --space-2 16 · --space-3 24 · --space-4 32 · --space-5 40
    --space-6 48 · --space-7 56 · --space-8 64 · --space-9 80
    --space-10 96 · --space-11 120

RADIUS
    --radius-sm 8 · --radius-md 12 · --radius-lg 18 · --radius-xl 24
    --radius-round 999

SHADOW
    --shadow-sm · --shadow-md · --shadow-lg · --shadow-gold
    (--shadow-xl is referenced but NOT defined — avoid)

GOLD GLOW
    --gold-glow-strong rgba(212,175,55,.16)
    --gold-glow-medium rgba(212,175,55,.08)
    --gold-glow-soft   rgba(212,175,55,.04)    

GLASS
    --glass-bg · --glass-border · --glass-blur

TRANSITION
    --transition-fast 0.2s · --transition-normal 0.3s · --transition-slow 0.6s

ANIMATION (animations.css only)
    --animation-fast 0.2s · --animation-normal 0.35s · --animation-slow 0.6s

Z-INDEX
    --z-dropdown 1000 · --z-sticky 1020 · --z-navbar 1030 · --z-modal 1050
    --z-tooltip 1060 · --z-toast 1070 · --z-loader 1200

CONTAINER / DIMENSIONS
    --container-width 1200 · --container-padding 24
    --navbar-height 75 · --sidebar-width 280
    --btn-height 50 · --btn-padding 0 28px
    --input-height 52 · --progress-height 8
    --course-card-height 340 · --lesson-sidebar-width 320

BREAKPOINTS (reference)
    --mobile 576 · --tablet 768 · --laptop 992 · --desktop 1200 · --wide 1400

================================================================================
LAYOUT UTILITIES (layout.css)
================================================================================

CONTAINER & SECTIONS
    .container              → max-width 1200, auto margins, 24px padding
    .section                → padding 96px 0
    .section-sm             → padding 56px 0
    .section-lg             → padding 120px 0
    .page-wrapper           → flex column, min-height 100vh
    .main-content           → flex:1 (pushes footer down)

FLEX (prefer these)
    .d-flex .d-grid .d-block .d-inline
    .flex-row .flex-column
    .align-center .align-start .align-end
    .justify-center .justify-between .justify-around .justify-evenly .justify-start .justify-end
    .gap-1..6 (8/16/24/32/40/48)

GRID
    .grid (gap 32) + .grid-2 / .grid-3 / .grid-4 / .grid-auto

WIDTH / HEIGHT
    .w-100 .w-50 .w-auto .h-100 .min-vh

POSITION
    .relative .absolute .fixed
    .sticky (includes top:0 + z-navbar)

HERO (layout.css — apps)
    .hero (min-height 85vh, flex, align-center)
    .hero-content (flex:1) · .hero-image (flex:1, justify-center)

DASHBOARD LAYOUT
    .dashboard-layout (grid 280px 1fr)
    .sidebar · .dashboard-content

COURSE LAYOUT
    .course-layout · .lesson-sidebar · .lesson-content

================================================================================
UTILITIES (utilities.css)
================================================================================

DISPLAY (with !important)
    .d-none .d-block .d-inline .d-inline-block .d-flex .d-grid

FLEX (duplicates layout, use either)
    .flex-row .flex-column .flex-wrap .flex-nowrap
    .items-start .items-center .items-end .items-stretch
    .justify-* (same as layout)

GAP (different scale — prefer layout.css .gap-*)
    .gap-xs 4 · .gap-sm 8 · .gap-md 16 · .gap-lg 24 · .gap-xl 32

WIDTH / HEIGHT
    .w-25 .w-50 .w-75 .w-100 .h-100 .min-vh-100

MARGIN
    .m-0
    .mt-1..5 (8/16/24/32/48) · .mb-1..5
    .mx-auto

PADDING
    .p-0..5 (0/8/16/24/32/48)
    .py-1..3 · .px-2..3

TEXT
    .text-left .text-center .text-right
    .text-white .text-gold .text-muted
    .text-success .text-danger .text-warning .text-info

WEIGHT
    .fw-normal .fw-medium .fw-bold .fw-extra-bold

BG
    .bg-primary .bg-card .bg-surface .bg-transparent

RADIUS
    .rounded-sm .rounded .rounded-lg .rounded-xl .rounded-circle

SHADOW
    .shadow-sm .shadow .shadow-lg
    (.shadow-xl referenced but undefined — avoid)

POSITION
    .position-relative .position-absolute .position-fixed
    .top-0 .bottom-0 .left-0 .right-0

MISC
    .overflow-hidden .overflow-auto .cursor-pointer .transition

RESPONSIVE
    .mobile-hidden (hide ≤768)
    .mobile-full (width 100% ≤768)

    GOLD GLOW (ambient)
    .bg-glow-top     → radial glow from top (sections)
    .bg-glow-hero    → pulsing glow center (hero)
    .bg-sheen-gold   → diagonal gold wash (cards, CTA)
    Use at most one per section. Never stack hero + sheen.

================================================================================
MOTION (animations.css)
================================================================================

ENTRY (use with animations.js — auto-triggered on scroll)
    .fade-in .fade-out
    .slide-up .slide-down .slide-left .slide-right
    .scale-in .page-enter

CONTINUOUS
    .float (4s) · .pulse (2s) · .spin (1s) · .glow (2s)
    .glow-pulse (auto-inside .bg-glow-hero) · 7s alternate

ATTENTION
    .shake .bounce

LOADING
    .skeleton

INTERACTION
    .ripple · .hover-lift · .hover-scale · .hover-rotate

STAGGER
    .stagger > * (children fade in sequentially — first 5 defined)

REDUCED MOTION
    Handled globally in animations.css — never override.

================================================================================
DOCS-ONLY (showcase.css — packages/aslds/showcase/**)
================================================================================

DO NOT USE ON APP PAGES. Only for packages/aslds/showcase/*.

SECTION HEADER
    <header class="section-header">
        <span class="section-label">Label</span>
        <h2>Title</h2>
        <p>Description</p>
    </header>

HERO (docs)
    .hero > .container > .hero-grid > .hero-content + .hero-panel
    .hero-badge .hero-title .hero-tagline .hero-description .hero-actions

GRIDS
    .card-grid + .documentation-grid / .feature-grid / .component-grid
                .stats-grid / .roadmap-grid / .updates-grid / .quick-links-grid

CARDS
    .documentation-card .component-card .feature-card .stat-card
    .roadmap-card .update-card .quick-link-card

CODE
    <div class="code-example">
        <div class="code-header">
            <span class="code-language">HTML</span>
            <button class="copy-button">Copy</button>
        </div>
        <div class="code-content"><pre><code>…</code></pre></div>
    </div>

BREADCRUMB
    .doc-breadcrumb + .doc-breadcrumb-separator

DOC SIDEBAR
    .doc-layout > .doc-sidebar + .doc-content
    .doc-sidebar-nav .doc-sidebar-link (.active)

DOC FOOTER (not .footer)
    .doc-footer .doc-footer-grid .doc-footer-column .doc-footer-bottom

ROADMAP / CHANGELOG / QUICK LINKS / EMPTY STATE
    .roadmap-timeline .roadmap-item .roadmap-marker .roadmap-content
    .changelog-list .changelog-item .changelog-version .changelog-date
    .quick-links .quick-link
    .empty-state .empty-state-icon .empty-state-title .empty-state-description

BACK TO TOP
    .back-to-top (fixed, bottom-right)

================================================================================
COMPONENTS — QUICK CATALOG
================================================================================

BUTTONS (Section 09)
--------------------------------------------------------------------------------
<button class="btn btn-primary">Label</button>
<a class="btn btn-secondary" href="…">Label</a>
<button class="btn btn-outline btn-sm">Small</button>
<button class="btn btn-primary btn-icon" aria-label="…"><i class="fa-solid fa-plus"></i></button>

Variants: primary · secondary · outline · success · danger · warning · info
          light · glass · link · icon
Sizes:    sm (40px) · md (50 default) · lg (60) · xl (70)
Width:    .btn-block (100%)
Shape:    .rounded-pill · .rounded-circle
States:   :active scale .98 · :disabled opacity .6 · .btn-loading
Group:    .btn-group (flex gap 16)
FAB:      .btn-fab (fixed bottom-right)

⚠️ Mobile ≤768: ALL .btn become 100% width. Wrap in .btn-group or override.

CARDS (Section 10)
--------------------------------------------------------------------------------
<article class="card">
    <div class="card-header">
        <h3 class="card-title">Title</h3>
        <p class="card-subtitle">Subtitle</p>
    </div>
    <div class="card-body">Content</div>
    <div class="card-footer">Actions</div>
</article>

Base:     .card (auto hover lift — see notes)
Variants: .card-glass
Special:  .course-card · .dashboard-card · .stat-card · .profile-card
          .pricing-card · .card-horizontal · .lesson-card · .certificate-card
          .download-card
Featured: .featured (adds "POPULAR" ribbon)
Badge:    .card-badge (absolute, top-left)

⚠️ .card:hover ALWAYS lifts translateY(-8px) — problem for static cards.
⚠️ .card { overflow:hidden } clips ribbons/badges outside bounds.

FORMS (Section 11)
--------------------------------------------------------------------------------
<form class="form">
    <div class="form-row">
        <div class="form-group">
            <label class="form-label" for="email">Email</label>
            <input id="email" class="form-control" type="email" placeholder="…">
            <p class="form-text">Helper text</p>
        </div>
    </div>
</form>

Layout:   .form · .form-row (2 col) · .form-row-3 (3 col) · .form-group
Controls: .form-control (input/textarea/select, 56px)
          textarea.form-control (150px min)
Groups:   .input-group + .input-group-text
Special:  .search-box (with .form-control)
          .checkbox · .radio · .switch + .slider · .file-upload
Helper:   .form-text
Valid:    .is-success · .is-error · .is-warning
Text:     .text-success · .text-error · .text-warning

⚠️ .form-control height 56px ≠ --input-height (52px). Align later.
⚠️ .switch input {display:none} breaks keyboard access — fix needed.

NAVBAR (Section 12)
--------------------------------------------------------------------------------
<header class="navbar">
    <div class="navbar-container">
        <a class="navbar-logo" href="/">
            <strong>ASL<span>INNOVATE</span></strong>
        </a>
        <button class="mobile-toggle" aria-expanded="false" aria-controls="nav">
            <span></span><span></span><span></span>
        </button>
        <nav id="nav" aria-label="Primary">
            <ul class="nav-menu">
                <li><a class="nav-link active" aria-current="page" href="/">Home</a></li>
            </ul>
        </nav>
        <div class="nav-actions">
            <button class="nav-search">Search</button>
            <button class="btn btn-outline" data-theme-toggle>Theme</button>
            <span class="badge">v1.1</span>
        </div>
    </div>
</header>

⚠️ Never use .dropdown inside navbar (CSS conflict).
JS: navbar.js handles mobile toggle + escape + outside click.

SIDEBAR (Section 13)
--------------------------------------------------------------------------------
<aside class="sidebar">
    <div class="sidebar-header">…</div>
    <div class="sidebar-user">…</div>
    <nav class="sidebar-nav">
        <ul class="sidebar-menu">
            <li class="sidebar-item">
                <a class="sidebar-link active" href="/dashboard" aria-current="page">
                    <i class="fa-solid fa-home"></i> Dashboard
                </a>
            </li>
        </ul>
    </nav>
    <div class="sidebar-progress">…</div>
    <div class="sidebar-footer">
        <a class="sidebar-link" href="/logout">Logout</a>
    </div>
</aside>

JS: sidebar.js handles toggle + auto-active + escape + outside click.

FOOTER (Section 14)
--------------------------------------------------------------------------------
<footer class="footer" role="contentinfo">
    <div class="container">
        <div class="footer-grid">
            <div class="footer-brand">
                <h3>ASL<span>INNOVATE</span></h3>
                <p>Tagline</p>
                <div class="social-links">
                    <a href="…" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>
                </div>
            </div>
            <div class="footer-links">
                <h4>Docs</h4>
                <ul><li><a href="…">…</a></li></ul>
            </div>
            <div class="footer-newsletter">
                <h4>Subscribe</h4>
                <form class="newsletter-form">
                    <input type="email" placeholder="…" required>
                    <button type="submit" aria-label="Subscribe">
                        <i class="fa-solid fa-paper-plane"></i>
                    </button>
                </form>
            </div>
        </div>
        <div class="footer-bottom">
            <p class="footer-copy">© 2026 …</p>
            <span class="badge">v1.1</span>
        </div>
    </div>
</footer>

⚠️ --container-xl UNDEFINED in footer.css. Newsletter submit button unstyled.

MODAL (Section 15)
--------------------------------------------------------------------------------
<div class="modal" id="myModal">
    <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-header">
            <h3 class="modal-title" id="modal-title">Title</h3>
            <button class="modal-close" aria-label="Close">×</button>
        </div>
        <div class="modal-body">Content</div>
        <div class="modal-footer">
            <button class="btn btn-outline">Cancel</button>
            <button class="btn btn-primary">Confirm</button>
        </div>
    </div>
</div>

Sizes: .modal-sm (420) · .modal-md (650) · .modal-lg (900) · .modal-xl (1200)
       Size class goes on OUTER .modal, not dialog.
Scroll:.modal-scroll on .modal-body

Open programmatically: ASLDS.Modal.open()
⚠️ --shadow-xl undefined → modal has no shadow.
⚠️ z-index 2000 hardcoded (wrong priority).

DROPDOWN (Section 16)
--------------------------------------------------------------------------------
<div class="dropdown">
    <button class="dropdown-toggle" aria-expanded="false">
        Menu <i class="fa-solid fa-chevron-down"></i>
    </button>
    <div class="dropdown-menu">
        <div class="dropdown-header">
            <div class="dropdown-title">Title</div>
            <div class="dropdown-subtitle">Sub</div>
        </div>
        <ul class="dropdown-list">
            <li class="dropdown-item">
                <a class="dropdown-link" href="/profile">
                    <i class="fa-solid fa-user"></i> Profile
                </a>
            </li>
        </ul>
        <div class="dropdown-divider"></div>
        <div class="dropdown-footer"><a href="/logout">Logout</a></div>
    </div>
</div>

JS: dropdown.js handles toggle + escape + outside click + arrow keys.
Multiple dropdowns per page supported.

TABS (Section 17)
--------------------------------------------------------------------------------
<div class="tabs">
    <div class="tab-list" role="tablist">
        <button class="tab-button is-active" role="tab">Overview</button>
        <button class="tab-button" role="tab">Settings</button>
    </div>
    <div class="tab-content is-active" role="tabpanel">…</div>
    <div class="tab-content" role="tabpanel">…</div>
</div>

JS: tabs.js handles switch + arrows + Home/End + ARIA + IDs.

TOAST (Section 18)
--------------------------------------------------------------------------------
NEVER write toast HTML. Call the API.

ASLDS.Toast.show({
    type: 'success',    // 'success' | 'error' | 'warning' | 'info'
    title: 'Saved',
    message: 'Your changes have been saved.',
    duration: 3500,     // 0 = persistent
    position: 'top-right'
});

Positions: top-right · top-left · bottom-right · bottom-left
CSS: toast.css (loaded) — no page markup.

BADGE (Section 19)
--------------------------------------------------------------------------------
<span class="badge">Default (gold tint)</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-danger">Danger</span>
<span class="badge badge-info">Info</span>

Sizes:  .badge-sm · .badge-md (default) · .badge-lg
Styles: .badge-solid · .badge-outline · .badge-dot
Removable: <button class="badge-close" aria-label="Remove">×</button>

ALERT (Section 20)
--------------------------------------------------------------------------------
<div class="alert alert-success">
    <div class="alert-icon"><i class="fa-solid fa-check"></i></div>
    <div class="alert-content">
        <div class="alert-title">Success</div>
        <div class="alert-text">Message</div>
    </div>
    <button class="alert-close" aria-label="Close">×</button>
</div>

Variants: .alert-success · .alert-warning · .alert-danger · .alert-info · .alert-primary
⚠️ .alert-info uses cyan #0dcaf0 — mismatch with --info #3B82F6.

PROGRESS (Section 21)
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

Sizes:  .progress-sm · .progress-md · .progress-lg
Colors: .progress-success · .progress-warning · .progress-danger · .progress-info
Extra:  .progress-striped · .progress-animated
Circle: .progress-circle > .progress-circle-inner
Steps:  .progress-steps > .progress-step (.active)

⚠️ .progress-circle has 68% hardcoded in conic-gradient.

AVATAR (Section 22)
--------------------------------------------------------------------------------
<div class="avatar avatar-md">
    <img src="user.jpg" alt="John Doe">
</div>

<!-- Or initials -->
<div class="avatar avatar-md">
    <span class="avatar-initials">JD</span>
</div>

<!-- With status -->
<div class="avatar avatar-md">
    <img src="user.jpg" alt="User">
    <span class="avatar-status status-online" aria-label="Online"></span>
</div>

Sizes:  .avatar-xs (28) .avatar-sm (40) .avatar-md (56) .avatar-lg (72) .avatar-xl (100)
Border: .avatar-gold .avatar-success .avatar-danger .avatar-white
Extra:  .avatar-badge (verified) · .avatar-glow · .avatar-group (stacked)
Status: .status-online .status-away .status-busy .status-offline

TABLE (Section 23)
--------------------------------------------------------------------------------
<div class="table-wrapper">
    <table class="table">
        <caption class="sr-only">Description</caption>
        <thead>
            <tr><th scope="col">Name</th><th scope="col">Status</th></tr>
        </thead>
        <tbody>
            <tr><td>Buttons</td><td>Ready</td></tr>
        </tbody>
    </table>
</div>

Variants: .table-striped · .table-bordered · .table-sm
Always wrap in .table-wrapper.

DASHBOARD (Section 24)
--------------------------------------------------------------------------------
<div class="dashboard">
    <aside class="dashboard-sidebar">…</aside>
    <div class="dashboard-content">
        <header class="dashboard-header">
            <h1 class="dashboard-title">Title</h1>
            <p class="dashboard-subtitle">Sub</p>
        </header>
        <div class="dashboard-body">
            <div class="dashboard-stats">…</div>
            <div class="dashboard-grid">
                <div class="widget">
                    <h3 class="widget-title">…</h3>
                </div>
            </div>
            <div class="quick-actions">
                <div class="quick-action">…</div>
            </div>
            <div class="activity-list">
                <div class="activity-item">…</div>
            </div>
        </div>
    </div>
</div>

⚠️ Duplicates layout.css .dashboard-layout and sidebar.css .sidebar. Pick one.

================================================================================
JAVASCRIPT MODULES — QUICK CATALOG
================================================================================

LOAD ORDER (non-negotiable — app.js first)
--------------------------------------------------------------------------------
1. app.js          runtime
2. navbar.js
3. sidebar.js
4. tabs.js
5. dropdown.js
6. modal.js
7. theme.js
8. playground.js   (showcase only)
9. search.js
10. animations.js
11. toast.js

Runtime auto-inits everything on window load. Pages never call .init().

PRIORITY TABLE
--------------------------------------------------------------------------------
10  Theme
50  Animations
55  Search
60  Playground
70  Toast
75  Dropdown
80  Tabs
85  Modal
90  Sidebar
100 Navbar

RUNTIME API (app.js)
--------------------------------------------------------------------------------
ASLDS.register(name, module, priority, dependencies)
ASLDS.getModules() · ASLDS.hasModule(name)
ASLDS.events.on(event, cb) · .off(event, cb) · .emit(event, payload)
ASLDS.utils.select / selectAll / exists / delegate / on / offAll
ASLDS.utils.cacheElement / getCachedElement / clearCache
ASLDS.accessibility.setExpanded / setHidden / focus
ASLDS.storage.get / set / remove / clear (prefix: "ASLDS::")
ASLDS.logger.log / info / warn / error
ASLDS.performance.mark / measure / now
ASLDS.configure({…}) · ASLDS.refresh() · ASLDS.destroy() · ASLDS.reset()
ASLDS.info() · ASLDS.status() · ASLDS.getVersion()

THEME (theme.js) — priority 10
--------------------------------------------------------------------------------
Modes: auto · light · dark  (toggle cycles in that order)
HTML: <html data-theme="dark" data-theme-mode="auto">
Trigger: any [data-theme-toggle] button — auto-wired, label updates.

ASLDS.Theme.setMode(mode, instant)
ASLDS.Theme.toggle(instant)
ASLDS.Theme.getMode() · .getEffectiveTheme() · .getSystemTheme()
ASLDS.Theme.isDark() · .isLight() · .isAuto()
ASLDS.Theme.refresh() · .reset() · .info()

Events: theme:ready · theme:mode-changed · theme:effective-changed

NAVBAR (navbar.js) — priority 100
--------------------------------------------------------------------------------
HTML contract: .navbar > .mobile-toggle + .nav-menu (.nav-link inside)
Handles: toggle · escape · outside click · resize · focus restore on escape

ASLDS.Navbar.open() · .close([focus]) · .toggle()
ASLDS.Navbar.isOpen() · .getState() · .getToggle() · .getMenu()
Events: asl:navbar:init · :open · :close · :destroy

SIDEBAR (sidebar.js) — priority 90
--------------------------------------------------------------------------------
HTML contract: .sidebar + .sidebar-link + .mobile-toggle
Handles: toggle · auto-active link · escape · outside click · resize

ASLDS.Sidebar.open() · .close() · .toggle()
ASLDS.Sidebar.getState() · .getElement() · .getToggle()
Events: asl:sidebar:init · :open · :close · :destroy

MODAL (modal.js) — priority 85
--------------------------------------------------------------------------------
HTML contract: .modal > .modal-dialog > .modal-header/.modal-body/.modal-footer
               + .modal-close
Handles: open/close · focus trap · scroll lock · escape · outside click

ASLDS.Modal.open() · .close() · .toggle()
ASLDS.Modal.getState() · .getElement() · .getDialog()
Events: asl:modal:init · :open · :close · :destroy
Only ONE modal per page.

DROPDOWN (dropdown.js) — priority 75
--------------------------------------------------------------------------------
HTML contract: .dropdown > .dropdown-toggle + .dropdown-menu
               + .dropdown-link / .dropdown-item
Handles: toggle · arrow keys · escape · outside click · one-at-a-time

ASLDS.Dropdown.open(container) · .close(container) · .toggle(container) · .closeAll()
ASLDS.Dropdown.getState(container) · .getContainers() · .getToggle(container) · .getMenu(container)
Events: asl:dropdown:init · :open · :close · :destroy
Multiple dropdowns per page.

TABS (tabs.js) — priority 80
--------------------------------------------------------------------------------
HTML contract: .tabs > .tab-list > .tab-button + .tab-content
Handles: click · arrows · Home/End · ARIA · IDs

ASLDS.Tabs.activateByIndex(container, i, focus)
ASLDS.Tabs.getActiveTab(container) · .getTabs(container) · .getPanels(container) · .getState(container)
Events: asl:tabs:init · :activate · :destroy
Multiple tab groups per page.

TOAST (toast.js) — priority 70
--------------------------------------------------------------------------------
NO HTML contract — creates its own DOM.

ASLDS.Toast.show({ type, title, message, duration, position, showProgress, showIcon, closeButton })
ASLDS.Toast.dismiss(toast, immediate)
ASLDS.Toast.clear(immediate)
ASLDS.Toast.configure(config) · .getConfig() · .getToasts() · .getContainer(position) · .info()
Events: asl:toast:init · :show · :dismiss · :clear · :destroy

SEARCH (search.js) — priority 55
--------------------------------------------------------------------------------
NO HTML contract — creates overlay + injects CSS.
Triggers: click .nav-search OR Ctrl+K / Cmd+K

ASLDS.Search.open() · .close() · .toggle() · .isOpen()
ASLDS.Search.getResults() · .getIndex() · .setIndex(array) · .info() · .updateConfig(config)
Events: asl:search:init · :open · :close · :destroy

⚠️ NO search.css file exists — styles are injected by search.js.
⚠️ Index is hardcoded inside search.js.

PLAYGROUND (playground.js) — priority 60
--------------------------------------------------------------------------------
SHOWCASE-ONLY. Never load on app pages.

Wires [data-demo-toast] [data-demo-modal] [data-demo-dropdown] [data-demo-tab]
       + .btn-copy + theme label.

ASLDS.Playground.showToast(type) · .showModal() · .toggleDropdown(c) · .activateTab(c,i) · .getState()

ANIMATIONS (animations.js) — priority 50
--------------------------------------------------------------------------------
Watches: [data-animate], .fade-in, .slide-up, .slide-down, .slide-left,
         .slide-right, .scale-in, .stagger > *

Adds .is-visible when element enters viewport. Respects prefers-reduced-motion.

ASLDS.Animations.trigger(element) · .refresh() · .isReducedMotion()
ASLDS.Animations.getObservedElements() · .getTriggeredElements() · .info() · .updateConfig(config)
Events: asl:animations:init · :triggered · :destroy

⚠️ Do NOT add .is-visible manually. Module handles it.

================================================================================
EVENTS — MASTER LIST (for cross-module reactions)
================================================================================
theme:ready / theme:mode-changed / theme:effective-changed
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

Listen via document.addEventListener("event", handler)
or ASLDS.events.on("event", handler).

================================================================================
CANONICAL PAGE TEMPLATE
================================================================================

SHOWCASE PAGE (packages/aslds/showcase/**/*.html)
--------------------------------------------------------------------------------
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="…">
    <meta name="author" content="A Square L Innovate">
    <meta name="theme-color" content="#0b0b0b">
    <title>Page • ASL Design System</title>
    <link rel="icon" type="image/png" href="../../images/favicon.png">
    <link rel="apple-touch-icon" href="../../images/favicon.png">

    <!-- Core -->
    <link rel="stylesheet" href="../../css/reset.css">
    <link rel="stylesheet" href="../../css/variables.css">
    <link rel="stylesheet" href="../../css/typography.css">
    <link rel="stylesheet" href="../../css/layout.css">
    <link rel="stylesheet" href="../../css/utilities.css">
    <link rel="stylesheet" href="../../css/animations.css">

    <!-- Components -->
    <link rel="stylesheet" href="../../css/components/navbar.css">
    <link rel="stylesheet" href="../../css/components/sidebar.css">
    <link rel="stylesheet" href="../../css/components/buttons.css">
    <link rel="stylesheet" href="../../css/components/cards.css">
    <link rel="stylesheet" href="../../css/components/forms.css">
    <link rel="stylesheet" href="../../css/components/dashboard.css">
    <link rel="stylesheet" href="../../css/components/footer.css">
    <link rel="stylesheet" href="../../css/components/badge.css">
    <link rel="stylesheet" href="../../css/components/alert.css">
    <link rel="stylesheet" href="../../css/components/progress.css">
    <link rel="stylesheet" href="../../css/components/avatar.css">
    <link rel="stylesheet" href="../../css/components/dropdown.css">
    <link rel="stylesheet" href="../../css/components/modal.css">
    <link rel="stylesheet" href="../../css/components/toast.css">
    <link rel="stylesheet" href="../../css/components/table.css">
    <link rel="stylesheet" href="../../css/components/tabs.css">

    <!-- Docs-only -->
    <link rel="stylesheet" href="../../css/showcase.css">

    <!-- Fonts + Icons -->
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body>
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <div class="page-wrapper">
        <header class="navbar">
            <div class="navbar-container">
                <a href="../index.html" class="navbar-logo" aria-label="ASL Design System">
                    <strong>ASLDS</strong>
                </a>
                <button class="mobile-toggle" type="button" aria-label="Toggle Navigation"
                        aria-expanded="false" aria-controls="primary-navigation">
                    <span></span><span></span><span></span>
                </button>
                <nav id="primary-navigation" aria-label="Primary Navigation">
                    <ul class="nav-menu">
                        <li><a href="../index.html" class="nav-link">Home</a></li>
                        <li><a href="../getting-started.html" class="nav-link">Getting Started</a></li>
                        <li><a href="../installation.html" class="nav-link">Installation</a></li>
                        <li><a href="../playground.html" class="nav-link">Playground</a></li>
                        <li><a href="buttons.html" class="nav-link active" aria-current="page">Components</a></li>
                    </ul>
                </nav>
                <div class="nav-actions">
                    <button class="nav-search" type="button">Search</button>
                    <button class="btn btn-outline" type="button" data-theme-toggle>Theme</button>
                    <button class="btn btn-secondary" type="button">GitHub</button>
                    <span class="badge">v1.1 Stable</span>
                </div>
            </div>
        </header>

        <main id="main-content" class="main-content">
            <!-- breadcrumb · hero · sections · page-navigation -->
        </main>

        <footer class="footer" role="contentinfo">
            <div class="container">
                <div class="footer-grid">…</div>
                <div class="footer-bottom">…</div>
            </div>
        </footer>
    </div>

    <div id="live-region" class="sr-only" aria-live="polite" aria-atomic="true"></div>
    <section id="toast-region" aria-live="polite" aria-label="Toast Notifications"></section>
    <dialog id="modal-root" aria-label="Application Modal"></dialog>

    <script src="../../js/app.js"></script>
    <script src="../../js/navbar.js"></script>
    <script src="../../js/sidebar.js"></script>
    <script src="../../js/tabs.js"></script>
    <script src="../../js/dropdown.js"></script>
    <script src="../../js/modal.js"></script>
    <script src="../../js/theme.js"></script>
    <script src="../../js/playground.js"></script>
    <script src="../../js/search.js"></script>
    <script src="../../js/animations.js"></script>
    <script src="../../js/toast.js"></script>
</body>
</html>

APP PAGE (apps/{app}/*.html)
--------------------------------------------------------------------------------
Same as above, except:
    • CSS paths: ../../packages/aslds/css/…
    • JS paths:  ../../packages/aslds/js/…
    • Favicon:  assets/images/favicon.png
    • Logo:     assets/images/logo.png
    • REMOVE:   showcase.css link
    • REMOVE:   playground.js script
    • REMOVE:   breadcrumb, "On This Page" hero panel
    • REMOVE:   .doc-* classes

DASHBOARD PAGE (apps/academy/dashboard.html, apps/admin/*, apps/business-os/*)
--------------------------------------------------------------------------------
Same as APP PAGE, but main uses:

<main id="main-content" class="main-content">
    <div class="dashboard-layout">
        <aside class="sidebar">
            <div class="sidebar-header">…</div>
            <nav class="sidebar-nav">
                <ul class="sidebar-menu">
                    <li class="sidebar-item">
                        <a class="sidebar-link active" href="/dashboard" aria-current="page">
                            <i class="fa-solid fa-home"></i> Dashboard
                        </a>
                    </li>
                </ul>
            </nav>
        </aside>
        <main class="dashboard-content">
            <header class="dashboard-header">
                <h1 class="dashboard-title">Dashboard</h1>
            </header>
            <div class="dashboard-body">…</div>
        </main>
    </div>
</main>

================================================================================
PATH RULES PER LOCATION
================================================================================

packages/aslds/showcase/*.html
    ../css/…  ../js/…  ../images/…

packages/aslds/showcase/{foundations,components,guides}/*.html
    ../../css/…  ../../js/…  ../../images/…

apps/{public-site,academy,ai,business-os,portfolio,admin}/*.html
    ../../packages/aslds/css/…
    ../../packages/aslds/js/…
    assets/images/favicon.png
    assets/images/logo.png

================================================================================
VERIFICATION CHECKLIST (before committing any page)
================================================================================
[ ] DOCTYPE + <html lang="en" data-theme="dark">
[ ] meta viewport + description + author + theme-color
[ ] favicon + apple-touch-icon
[ ] Core CSS in order (reset → variables → typography → layout → utilities → animations)
[ ] All needed component CSS
[ ] showcase.css ONLY on docs pages
[ ] Skip link is first element in body
[ ] .page-wrapper wraps everything
[ ] <header class="navbar"> + <main id="main-content" class="main-content"> + <footer class="footer">
[ ] Accessibility regions (live-region, toast-region, modal-root)
[ ] app.js loaded FIRST
[ ] Scripts in canonical order
[ ] NO inline <style> for ASLDS-covered styles
[ ] NO inline <script> for component behavior
[ ] NO hardcoded colors / sizes / z-indices
[ ] All interactive elements are <button>/<a>/<input>
[ ] Every icon-only button has aria-label
[ ] One <h1> per page
[ ] All images have alt
[ ] External links have rel="noopener"

================================================================================
FINAL RULE — THE ONE-LINE TEST
================================================================================
If a page has more than ~30 lines of inline CSS or any inline JS
manipulating a component → something is wrong.
A well-built ASLDS page has ZERO inline style and ZERO inline script.

================================================================================
END OF QUICKREF
================================================================================