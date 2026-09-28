# A SQUARE L ACADEMY — COURSE SYSTEM SPECIFICATION
Version: 1.0
Date: 2026
Status: Locked — build against this

================================================================================
1. CORE DECISIONS
================================================================================

NAMING
    Use "Lesson" everywhere.
    ❌ "Lecture" — academic feel, wrong tone.
    ✅ "Lesson" — self-paced, actionable, industry standard.

LESSON COUNT
    10 lessons per course.
    3 courses × 10 = 30 lesson files total.

VIDEO HOSTING
    YouTube embedded via iframe.
    Use youtube-nocookie.com for privacy.
    Student watches inside our site — never leaves.

FILE STORAGE
    Phase 1 (now): Static HTML files, one per lesson.
    Phase 2 (after DB): Single lesson.html template + database rows.

PAGE TYPES
    1. Course Landing — overview + Enroll/Continue CTA
    2. Lesson — the learning page with video + content + nav

================================================================================
2. PAGE TYPE 1 — COURSE LANDING
================================================================================

FILE LOCATION
    apps/academy/courses/{slug}/index.html

SLUGS
    web-development
    crypto-blockchain
    smartphone-graphic-design

LAYOUT
    Outer: .dashboard-layout (280px app sidebar + content)
    Same shell as courses/index.html — student keeps full navigation.

SECTIONS (top to bottom)

    1. HEADER ROW
       - Mobile toggle
       - Course title + tagline
       - Theme toggle
       - Enroll / Continue button (context-dependent)

    2. COURSE HERO CARD (.bg-sheen-gold)
       Left:
         - Large gold avatar with course icon
         - Course title (h2)
         - Tagline
         - Meta badges: lessons count · duration · level · certificate
         - Enroll / Continue CTA
       Right:
         - At-a-glance stats (lessons, hours, projects, level)

    3. WHAT YOU'LL LEARN
       - .grid.grid-2
       - 6 outcome bullets, each with gold check icon

    4. COURSE CURRICULUM
       - Modules list — each module is a .card with title + lesson rows
       - Each lesson row shows: number · title · duration · status icon
         ✓ complete · ▸ current · ○ not started
       - Lesson rows are links to lesson pages

    5. WHAT YOU'LL BUILD
       - .grid.grid-3
       - 3 project preview cards (icon + title + description)

    6. REQUIREMENTS
       - Short bulleted list
       - "No prior experience" · "A phone or laptop" · "Consistent practice"

    7. YOUR MENTOR
       - .profile-card — avatar, name, role, short bio
       - Reuses founder.png asset

    8. FAQ
       - .grid.grid-2
       - 4-6 course-specific Q&A cards

    9. FINAL CTA
       - Enroll / Continue button
       - Backup link to courses/index.html

ESTIMATED LENGTH
    ~350-400 lines per course landing.
    Same skeleton across all 3 — only copy changes.

================================================================================
3. PAGE TYPE 2 — LESSON
================================================================================

FILE LOCATION
    apps/academy/courses/{slug}/lessons/lesson-NN.html
    NN is two-digit zero-padded: 01, 02, 03 ... 10

LAYOUT
    Outer: .course-layout (320px lesson sidebar + content)
    The app sidebar is REPLACED with the lesson sidebar.
    Why: lesson is a focus mode. Student sees only what matters.
    This is how Udemy, Coursera, freeCodeCamp do it.

LESSON SIDEBAR (top to bottom)

    HEADER
        "← Back to course" link
        Course title (small)

    PROGRESS
        "X of 10 complete"
        .progress-bar

    LESSON LIST
        Grouped by module.
        Each row:
            - Lesson number (01, 02, ...)
            - Title
            - Duration (e.g., "25 min")
            - Status icon: ✓ done · ▸ current · ○ not started
            - Current lesson highlighted with gold left border + active class
            - Clicking navigates to that lesson

    FOOTER
        Certificate progress mini-card
        "Complete all lessons to unlock"

LESSON CONTENT (top to bottom)

    HEADER
        - Lesson N of 10 (small, muted)
        - Estimated time
        - Status badge: Complete / In Progress / Not Started

    VIDEO
        - 16:9 aspect ratio container
        - YouTube iframe embed
        - Privacy-enhanced: youtube-nocookie.com
        - Lazy loaded

    BODY
        - Lesson title (h1)
        - Written content — paragraphs, code blocks, images as needed

    RESOURCES (optional per lesson)
        - Downloadable file rows
        - Each row: icon · filename · size · download button
        - Skip section entirely if lesson has no resources

    ACTIONS
        - "Mark as Complete" button (toggles status)
        - Prev / Next navigation buttons (disabled at first/last)

BEHAVIOUR

    - All lessons unlocked (self-paced, no gating)
    - Current lesson highlighted in sidebar
    - "Mark as Complete" toggles ✓ in sidebar (visual only until DB)
    - Prev/Next always visible; disabled at boundaries

================================================================================
4. YOUTUBE EMBED PATTERN
================================================================================

STANDARD EMBED
    <iframe
        src="https://www.youtube.com/embed/VIDEO_ID"
        title="Lesson title"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
    ></iframe>

PRIVACY-ENHANCED EMBED (RECOMMENDED)
    <iframe
        src="https://www.youtube-nocookie.com/embed/VIDEO_ID?rel=0"
        title="Lesson title"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
    ></iframe>

WHY youtube-nocookie.com
    No tracking cookies until the student presses play.
    Same playback experience.

QUERY PARAMS
    rel=0            → related videos at end limited to your channel
    modestbranding=1 → reduced YouTube logo (deprecated, partial support)

WORKFLOW
    1. Upload video to YouTube (public or unlisted)
    2. Copy video ID (the part after v= or /embed/)
    3. Paste into src where VIDEO_ID is

ASPECT RATIO
    16:9 container
    Inline style on wrapper: aspect-ratio: 16/9
    NOTE: ASLDS has no .video-embed class yet.
          Add to tech debt — add to ASLDS when a second page needs it.

================================================================================
5. FILE NAMING
================================================================================

COURSE LANDING
    apps/academy/courses/web-development/index.html
    apps/academy/courses/crypto-blockchain/index.html
    apps/academy/courses/smartphone-graphic-design/index.html

LESSONS
    apps/academy/courses/web-development/lessons/lesson-01.html
    apps/academy/courses/web-development/lessons/lesson-02.html
    ...
    apps/academy/courses/web-development/lessons/lesson-10.html
    (repeat for other two courses)

TWO-DIGIT PADDING
    lesson-01 NOT lesson-1
    Keeps alphabetical sort correct past lesson-09.

================================================================================
6. DATA MODEL (for future DB)
================================================================================

COURSES TABLE
    slug             text (PK)     "web-development"
    title            text          "Web Development"
    tagline          text          "Master HTML, CSS, JavaScript..."
    description      text          (long form)
    icon             text          "fa-solid fa-code"
    duration_weeks   int           12
    level            text          "Beginner"
    lessons_count    int           10
    certificate      boolean       true
    outcomes         text[]        6 outcome strings
    projects         jsonb[]      3 project objects
    requirements     text[]        requirement strings
    mentor           jsonb         { name, role, bio, image }
    faq              jsonb[]       { q, a } pairs

LESSONS TABLE
    id               int (PK)
    course_slug      text (FK)
    number           int           1-10
    slug             text          "lesson-01"
    title            text          "Introduction to HTML"
    module_id        int (FK)
    duration_minutes int           25
    video_id         text          YouTube video ID
    content          text          HTML body
    resources        jsonb[]       { name, url, size }
    prev_slug        text          "lesson-00" or null
    next_slug        text          "lesson-02"

MODULES TABLE
    id               int (PK)
    course_slug      text (FK)
    order            int
    title            text

================================================================================
7. STATIC NOW → DATA-DRIVEN LATER
================================================================================

TODAY (Phase 1 — static)
    - 30 hand-written HTML files
    - One per lesson
    - Copy/paste pattern
    - No backend needed
    - Perfect for design phase

LATER (Phase 2 — data-driven)
    - 1 template file: lesson.html
    - Reads lesson ID from URL: lesson.html?id=web-dev-03
    - Fetches lesson row from Supabase
    - Renders content dynamically
    - 30 lessons = 1 file + 30 database rows

WHY BUILD STATIC FIRST
    - No DB yet
    - Design language needs to be proven
    - The HTML we write today becomes the template
    - Nothing is wasted when we switch

MIGRATION PATH
    1. Design and ship static lesson (lesson-01.html)
    2. Duplicate for lessons 02-10
    3. Same for other two courses
    4. Supabase arrives
    5. Turn lesson-01.html into lesson.html (template)
    6. Move lesson content into database
    7. All URLs redirect to lesson.html?id=NN
    8. Student sees no difference

================================================================================
8. BUILD ORDER
================================================================================

STEP 1  courses/web-development/index.html  (template course landing)
STEP 2  courses/web-development/lessons/lesson-01.html  (template lesson)
STEP 3  lessons/lesson-02.html through lesson-10.html    (fill out web-dev)
STEP 4  courses/crypto-blockchain/index.html
STEP 5  lessons/lesson-01.html through lesson-10.html    (crypto)
STEP 6  courses/smartphone-graphic-design/index.html
STEP 7  lessons/lesson-01.html through lesson-10.html    (design)

Building the template first means each subsequent page is fast —
just copy structure, replace copy.

================================================================================
9. TECH DEBT TO LOG
================================================================================

1. ASLDS has no .video-embed class.
   Add to components/*.css when a second page needs it.

2. ASLDS .card:hover lifts on every card.
   Non-interactive cards (course info panels) shouldn't lift.
   Add .card-static when cleanup happens.

3. Lesson progress is visual only.
   Wire to Supabase in Phase 2.

4. "Mark as Complete" button has no persistence.
   Wire to Supabase in Phase 2.

5. ASLDS .switch hides input — a11y issue.
   Already logged. Fix in forms.css during cleanup.

================================================================================
10. REMAINING QUESTIONS / OPEN ITEMS
================================================================================

- Lesson page needs .course-layout CSS verified to work
  (grid 320px 1fr) — test on first lesson build.
- Mentor image: reuse assets/images/founder.png
  (already used on academy/index.html).
- Certificate unlock condition: all 10 lessons complete.
  Visual only until DB.

================================================================================
END OF SPEC
================================================================================