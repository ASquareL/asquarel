# A SQUARE L INNOVATE — COMPLETE PROJECT STATE
Last updated: after wiring settings.html to Supabase
Purpose: This document is the single source of truth. If a chat hits a length limit,
paste this file into the next chat and work continues with zero context loss.

================================================================================
1. WHAT THIS PROJECT IS
================================================================================

A Square L Innovate is a Nigerian technology company. This repository contains
its entire digital ecosystem:

  • A marketing website (public-site)
  • An online learning platform (academy) — the current focus
  • Future divisions: AI, Business OS, Portfolio, Admin

The owner is Ashiru Awal Lawal, based in Kano, Nigeria.

Current milestone: The Academy student experience is live with real Supabase auth,
real database, and real user data flowing through every page.

================================================================================
2. PROJECT URLS & IDENTIFIERS
================================================================================

Production site:      https://asquarel.netlify.app
Academy app:          https://asquarel.netlify.app/apps/academy/
ASLDS showcase:       https://asquarel.netlify.app/aslds/
Repo:                 GitHub (connected to Netlify)
Supabase project:     a-square-l-innovate
Supabase project ref: rrrojvvlflfitnxievob
Supabase URL:         https://rrrojvvlflfitnxievob.supabase.co

NOTE: The project ref starts with THREE r's: "rrroj...". Misreading this as
"rroj..." was a source of hours of debugging. Always copy-paste, never retype.

================================================================================
3. TECH STACK
================================================================================

Frontend:     Plain HTML/CSS/JS — no build tools, no frameworks
Design sys:   ASLDS (custom, built in-house) — packages/aslds/
Backend:      Supabase (Postgres + Auth + RLS + Storage)
Hosting:      Netlify
Deploy:       Auto on git push → Netlify runs node scripts/build.js → serves dist/
Fonts:        Nunito (Google Fonts)
Icons:        Font Awesome 6.5.1
Auth:         Supabase email/password (Google OAuth pending)

================================================================================
4. REPOSITORY STRUCTURE
================================================================================

A-Square-L-Innovate/
├── apps/
│   ├── public-site/          ✅ 13 marketing pages, DONE
│   ├── academy/              🔄 IN PROGRESS — this is the active app
│   │   ├── index.html        ✅ Onboarding page
│   │   ├── login.html        ✅ Real Supabase auth
│   │   ├── register.html     ✅ Real Supabase auth
│   │   ├── dashboard.html    ✅ Wired to real data
│   │   ├── profile.html      ✅ Wired to real data
│   │   ├── settings.html     ✅ Wired to real data
│   │   ├── subscribed.html   ✅ Confirmation page
│   │   └── courses/
│   │       ├── index.html    ✅ Wired — enrolled + available courses
│   │       ├── web-development/
│   │       │   ├── index.html      ✅ Course landing (static)
│   │       │   └── lessons/        ⏸️ Not built yet
│   │       ├── crypto-blockchain/  ⏸️ Placeholder only
│   │       └── smartphone-graphic-design/  ⏸️ Placeholder only
│   ├── ai/                   ⏸️ Reserved
│   ├── business-os/          ⏸️ Reserved
│   ├── portfolio/            ⏸️ Reserved
│   └── admin/                ⏸️ Reserved
│
├── packages/
│   ├── aslds/                ✅ Design system (v1.1 Stable)
│   │   ├── css/              core + 17 component CSS files
│   │   ├── js/               11 JS modules
│   │   └── showcase/         Full documentation site
│   └── shared/
│       └── js/               ✅ App-level shared code (Supabase glue)
│           ├── supabase-config.js    Loads SDK, exposes window.SupabaseClient
│           ├── auth.js               Auth helpers + form auto-wiring
│           ├── dashboard.js          Dashboard page loader
│           ├── profile.js            Profile page loader
│           ├── courses.js            Courses index page loader
│           └── settings.js           Settings page loader
│
├── backend/
│   └── database/
│       └── migrations/       Not in repo — SQL was run in Supabase UI directly
├── engineering/specifications/
│   ├── PROJECT-STATE.md      ← this file
│   ├── database-schema.md    Full DB schema documentation
│   ├── database-reference.md Quick DB cheat sheet
│   └── course-system.md      Course structure spec
├── scripts/
│   ├── build.js              Copies apps + packages into dist/
│   └── _redirects            Netlify routing rules
├── netlify.toml              Build config
├── README.md, LICENSE, etc.
└── .github/workflows/

================================================================================
5. THE DESIGN SYSTEM (ASLDS)
================================================================================

ASLDS is a home-grown design system — the visual language of everything.

GOLDEN RULES
  1. Tokens first — use var(--primary-gold), never #D4AF37
  2. Components first — use .btn, .card, .navbar — never rebuild
  3. Modules only — never duplicate JS a module already handles
  4. No page CSS — pages add ZERO CSS for anything ASLDS covers
  5. No page JS — pages add ZERO JS for component behavior

BRAND
  Primary gold:   #D4AF37  (--primary-gold)
  Gold hover:     #E5C158  (--primary-gold-hover)
  Dark bg:        #050505  (--background)
  Font:           Nunito

COMPONENTS (17 CSS files)
  buttons · cards · forms · navbar · sidebar · dashboard · footer · badge ·
  alert · progress · avatar · dropdown · modal · toast · table · tabs · auth

JS MODULES (11)
  Load order matters. app.js MUST load first.
  1. app.js          Runtime — namespace, module registry, event bus
  2. navbar.js
  3. sidebar.js
  4. tabs.js
  5. dropdown.js
  6. modal.js
  7. theme.js
  8. playground.js   (showcase-only, never on app pages)
  9. search.js
  10. animations.js
  11. toast.js

TOAST API
  ASLDS.Toast.show({
      type: 'success'|'error'|'warning'|'info',
      title: 'Success',
      message: 'Saved successfully'
  });

THEME
  Add [data-theme-toggle] to any button. theme.js auto-wires it.
  Cycles: auto → light → dark → auto.

KNOWN ASLDS QUIRKS (do NOT fight these)
  • .card:hover always lifts (translateY -8px) — even static cards
  • .form-control is 56px, --input-height says 52px — mismatch
  • .switch input { display:none } breaks keyboard access
  • --shadow-xl referenced but undefined (modal has no shadow)
  • .mobile-toggle is hidden by navbar.css — dashboard pages also need it
  • Modal z-index hardcoded to 2000 (wrong priority)

================================================================================
6. DATABASE (SUPABASE)
================================================================================

21 TABLES. All with RLS enabled. Project ref: rrrojvvlflfitnxievob

IDENTITY
  profiles                Extends auth.users. Auto-created on signup by trigger.
                          Columns: id, reg_number (ASL-YYYY-NNN), full_name,
                          email, phone, location, bio, avatar_url,
                          role (student|mentor|admin), level,
                          daily_goal_minutes, preferred_time, preferred_timezone,
                          preferred_language, difficulty_level,
                          created_at, updated_at
  notification_prefs      user_id + 10 toggles (6 email + 4 push)

CONTENT
  courses                 3 seeded: web-development (52 lessons), crypto-blockchain,
                          smartphone-graphic-design
  modules                 6 per course
  lessons                 52 in web-development (titles + durations; content empty)

ENROLLMENT
  enrollments             user_id + course_id, unique pair
  lesson_progress         user_id + lesson_id + status (not_started|in_progress|completed)
  certificates            Auto-issued when course complete

QUIZZES
  quizzes, quiz_questions, quiz_options, quiz_attempts, quiz_answers
  (schema built, not yet wired in UI)

DISCUSSIONS
  discussion_threads, discussion_replies, discussion_reactions
  (schema built, not yet wired in UI)

ACTIVITY & NOTIFICATIONS
  activity_log            Auto-populated by triggers on lesson/enrollment events
  notifications           In-app notification inbox

BILLING
  plans                   3 seeded: free · pro (5000 NGN/mo) · mentorship (25000 NGN/mo)
  subscriptions, transactions

KEY FUNCTIONS
  generate_reg_number()      → ASL-YYYY-NNN
  submit_quiz_attempt()      → Grades a quiz (SECURITY DEFINER)
  is_admin()                 → Boolean for current user
  is_enrolled(course_id)     → Boolean for current user

KEY TRIGGERS
  auth.users INSERT → creates profiles row + notification_prefs row
  lesson_progress INSERT/UPDATE → logs activity, checks for course completion,
                                   issues certificate if all lessons done
  enrollments INSERT → logs course_enrolled
  discussion_replies INSERT → notifies thread author

KEY VIEWS
  course_progress      user_id · course_id · total_lessons · completed_lessons · percentage
  user_stats           courses_enrolled · lessons_completed · certificates_earned
                       · total_minutes_learned · active_days_30 · quizzes_passed
  lesson_with_context  lesson + module + course + user_status + prev/next
  quiz_summary, thread_with_meta, quiz_options_safe

RLS HIGHLIGHTS
  Profiles: user sees own row only. Role/reg_number/level locked from non-admins.
  Lessons: preview=true or enrolled in course.
  Quiz answers: is_correct hidden from students via quiz_options_safe view.
  All views: security_invoker = TRUE (respect caller permissions).

MIGRATIONS APPLIED (all run in Supabase SQL Editor)
  001 Foundation (extensions, sequences, functions)
  002 Tables (21 tables)
  003 Triggers & Views
  004 RLS policies + quiz grading
  005 Seed data
  006 Lock views (security_invoker)
  007 Learning preferences columns on profiles

================================================================================
7. AUTH FLOW
================================================================================

SIGNUP
  1. User fills register.html form
  2. auth.js calls Supabase auth.signUp({ email, password, options: { data: { full_name } } })
  3. Supabase creates auth.users row
  4. Trigger `handle_new_user` fires:
       - INSERT into profiles (reg_number auto-generated)
       - INSERT into notification_prefs
  5. User redirected to dashboard.html

LOGIN
  1. User fills login.html form
  2. auth.js calls Supabase signInWithPassword()
  3. Session stored in localStorage under key "asl-auth"
  4. Redirect to dashboard.html

PROTECTED PAGES
  Every wired page calls requireAuth() on load:
    - Checks session via Supabase client
    - If no session → redirect to login.html
    - If session exists → load user data

LOGOUT
  [data-signout] elements wired by dashboard.js / profile.js / etc.
  Calls auth.signOut() → redirect to login.html

GOOGLE OAUTH
  ⏸️ Not configured. Login.html has a Google button, but it's a placeholder.
  To enable: Google Cloud Console OAuth setup + Supabase provider config.

================================================================================
8. SHARED JS PATTERN
================================================================================

Every wired page loads scripts in this exact order:

  <!-- 1. Supabase SDK + config FIRST -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="../../packages/shared/js/supabase-config.js"></script>

  <!-- 2. ASLDS runtime (app.js FIRST) -->
  <script src="../../packages/aslds/js/app.js"></script>
  ... other ASLDS modules ...

  <!-- 3. Auth + page logic LAST -->
  <script src="../../packages/shared/js/auth.js"></script>
  <script src="../../packages/shared/js/{page}.js"></script>

CRITICAL: supabase-config.js must NOT touch window.ASLDS.
It exposes window.SupabaseClient. Touching window.ASLDS before app.js runs
will break the entire ASLDS runtime.

PAGE WIRING PATTERN
  HTML has empty containers with data attributes:
    <div data-list="enrolled-courses"></div>
    <span data-user-name>Loading…</span>
    <span data-stat="courses-enrolled">0</span>

  Page JS queries these on load, fetches from Supabase, renders HTML.

  Sign out: <a data-signout>
  Tabs are auto-wired by ASLDS tabs.js
  Theme toggle: <button data-theme-toggle>
  Mobile sidebar toggle: <button class="mobile-toggle">

================================================================================
9. DEPLOYMENT
================================================================================

REPO → NETLIFY FLOW

  git push → Netlify webhook → runs "node scripts/build.js" → serves dist/

BUILD SCRIPT (scripts/build.js)
  - Wipes dist/
  - Copies apps/ and packages/ into dist/
  - Copies scripts/_redirects into dist/
  Result: dist/ has the full tree, all relative paths work.

NETLIFY ROUTING (scripts/_redirects)
  /                       → /apps/public-site/index.html
  /academy                → /apps/academy/index.html
  /academy/*              → /apps/academy/:splat
  /aslds                  → /packages/aslds/showcase/index.html
  /about, /contact, etc.  → /apps/public-site/{page}.html
  /*                      → /apps/public-site/:splat

  Clean URLs work (`/about` loads about.html).
  Direct paths like /apps/academy/dashboard.html also work.

NETLIFY ENV VARS
  Not needed — the Supabase URL and anon key are hardcoded in
  packages/shared/js/supabase-config.js (safe — RLS protects data).

GIT WORKFLOW
  git add .
  git commit -m "Message"
  git push
  → wait ~30 seconds → hard refresh (Ctrl+Shift+R) on Netlify URL

================================================================================
10. WHAT'S DONE (fully working end-to-end)
================================================================================

✅ ASLDS design system v1.1 Stable
✅ Public site (13 pages)
✅ Supabase project with full schema + RLS + seed data
✅ Email/password auth
✅ Register → profile auto-created with reg number
✅ Login → dashboard
✅ Session persistence
✅ Logout
✅ Dashboard — real user data, stats, enrolled courses, activity
✅ Profile — real user info, stats, enrolled courses, activity, certificate progress
✅ Settings — profile edits, notification prefs, learning prefs, password change
✅ Courses index — real enrolled + available courses, enroll button
✅ Web Development landing page (static content, structure only)
✅ Netlify build + routing

================================================================================
11. WHAT'S NEXT (in order)
================================================================================

IMMEDIATE NEXT
  → Build lesson viewer pages for Web Development (52 lessons)
    • URL pattern: courses/web-development/lessons/lesson-NN.html
    • Uses .course-layout (ASLDS Section 5.15)
    • Lesson sidebar: course outline + progress
    • Content: YouTube embed + written content + resources
    • "Mark as Complete" button wires to lesson_progress table
    • Prev/Next navigation
    • Data-driven: one template + lessons table = all 52 pages

SOON AFTER
  → Wire web-development/index.html (course landing) to pull from DB
  → Build crypto-blockchain and smartphone-graphic-design landings
  → Populate lesson content in DB for those courses

LATER
  → Quiz UI (schema exists)
  → Discussion threads UI (schema exists)
  → Certificate PDF generation
  → Google OAuth
  → Notifications inbox
  → Payment integration (Stripe or Paystack) — plans exist in DB
  → Admin panel (apps/admin/)
  → Business OS (apps/business-os/)
  → AI platform (apps/ai/)
  → Portfolio (apps/portfolio/)

================================================================================
12. KNOWN TECHNICAL DEBT
================================================================================

ASLDS
  • .card:hover lifts on non-clickable cards — needs .card-static variant
  • .form-control height 56px ≠ --input-height 52px
  • .switch input { display:none } breaks keyboard accessibility
  • --shadow-xl undefined (modal has no shadow)
  • Modal z-index hardcoded 2000 (not tokenized)
  • Navbar + sidebar both use .mobile-toggle — conflict if both loaded

PROJECT
  • Google OAuth: button exists, doesn't work yet
  • Web-dev landing page is static HTML — should pull from DB
  • Crypto + Design courses have no landing pages
  • Lesson content (video IDs, HTML bodies) not populated in DB
  • Quiz questions are placeholder rows (no real content)
  • Certificates generate as DB rows but no PDF endpoint
  • Two-factor auth removed from settings (needs edge function)
  • Active sessions removed from settings (Supabase limitation)
  • Delete account removed (replaced with contact-support link)

================================================================================
13. CRITICAL GOTCHAS TO REMEMBER
================================================================================

1. SUPABASE PROJECT REF STARTS WITH THREE R's: "rrroj..."
   Copy from Supabase dashboard → Settings → API. Never retype.

2. supabase-config.js MUST NOT touch window.ASLDS
   It runs before app.js. If it creates window.ASLDS = {}, the runtime
   fails to initialize and every module silently breaks.

3. SCRIPT ORDER MATTERS
   Supabase SDK → supabase-config.js → ASLDS app.js → other ASLDS →
   auth.js → page-specific js

4. LOCAL FILE:// DOESN'T WORK FOR AUTH
   Browser blocks network requests from file://. Always test on
   Netlify (live) or a local HTTP server (npx serve dist).

5. VPNs AND ISP DNS FILTERING
   If Supabase requests fail with ERR_NAME_NOT_RESOLVED:
   - Change DNS to 1.1.1.1 / 1.0.0.1 (Windows adapter settings)
   - Or enable DoH in browser settings
   - Test: open https://{PROJECT_REF}.supabase.co/rest/v1/ in a tab —
     should return JSON, not a network error

6. INSERT ... SELECT shows "Success. No rows returned"
   This is NORMAL, not a failure. It means the query ran but returned
   no result rows (which is expected for inserts).

7. MOBILE-TOGGLE VISIBILITY
   Only hidden on desktop if navbar.css loads. Dashboard pages don't
   load navbar.css — hamburger will show. This is a known ASLDS issue.

8. LESSONS COUNT CACHE
   courses.lessons_count is auto-updated by trigger when lessons
   are inserted/deleted. Don't update it manually.

================================================================================
14. HOW TO CONTINUE IN A NEW CHAT
================================================================================

Copy this document. In the new chat say:

  "Read this project state. We continue from Section 11.
   The next task is: [specific task].
   Load [specific files] before you start."

Then attach:
  • This file (PROJECT-STATE.md)
  • engineering/specifications/database-reference.md
  • The file you want to work on (if editing existing)

The assistant will have full context. No re-explaining needed.

For specific tasks, mention which section of this doc is relevant:
  • "Section 6 covers the DB"
  • "Section 8 covers the JS pattern"
  • "Section 10 lists what's built"
  • "Section 12 lists technical debt"

================================================================================
END OF PROJECT STATE
================================================================================