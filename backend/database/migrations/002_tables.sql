-- ================================================
-- MIGRATION 002 — Tables
-- ================================================

-- 2.1 profiles
CREATE TABLE profiles (
    id            uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    reg_number    text UNIQUE NOT NULL,
    full_name     text NOT NULL,
    email         text NOT NULL,
    phone         text,
    location      text,
    bio           text,
    avatar_url    text,
    role          text NOT NULL DEFAULT 'student'
                  CHECK (role IN ('student','mentor','admin')),
    level         int NOT NULL DEFAULT 1,
    created_at    timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_created ON profiles(created_at);

-- 2.2 courses
CREATE TABLE courses (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug                text UNIQUE NOT NULL,
    title               text NOT NULL,
    tagline             text NOT NULL,
    description         text,
    icon                text,
    cover_image_url     text,
    duration_weeks      int,
    level               text CHECK (level IN ('Beginner','Intermediate','Advanced')),
    lessons_count       int NOT NULL DEFAULT 0,
    total_minutes       int NOT NULL DEFAULT 0,
    certificate_enabled boolean NOT NULL DEFAULT true,
    outcomes            text[] NOT NULL DEFAULT '{}',
    projects            jsonb NOT NULL DEFAULT '[]',
    requirements        text[] NOT NULL DEFAULT '{}',
    faq                 jsonb NOT NULL DEFAULT '[]',
    mentor_id           uuid REFERENCES profiles(id) ON DELETE SET NULL,
    published           boolean NOT NULL DEFAULT false,
    display_order       int NOT NULL DEFAULT 0,
    created_at          timestamptz NOT NULL DEFAULT now(),
    updated_at          timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_courses_published ON courses(published, display_order);
CREATE INDEX idx_courses_mentor ON courses(mentor_id);

-- 2.3 modules
CREATE TABLE modules (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id       uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title           text NOT NULL,
    description     text,
    order_index     int NOT NULL,
    lessons_count   int NOT NULL DEFAULT 0,
    total_minutes   int NOT NULL DEFAULT 0,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now(),
    UNIQUE (course_id, order_index)
);

-- 2.4 lessons
CREATE TABLE lessons (
    id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id         uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    module_id         uuid NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    slug              text NOT NULL,
    number            int NOT NULL,
    title             text NOT NULL,
    duration_minutes  int NOT NULL DEFAULT 0,
    video_id          text,
    content           text NOT NULL DEFAULT '',
    resources         jsonb NOT NULL DEFAULT '[]',
    preview           boolean NOT NULL DEFAULT false,
    published         boolean NOT NULL DEFAULT true,
    created_at        timestamptz NOT NULL DEFAULT now(),
    updated_at        timestamptz NOT NULL DEFAULT now(),
    UNIQUE (course_id, number),
    UNIQUE (course_id, slug)
);
CREATE INDEX idx_lessons_module ON lessons(module_id);

-- 2.5 enrollments
CREATE TABLE enrollments (
    id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    course_id         uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    plan              text NOT NULL DEFAULT 'free',
    enrolled_at       timestamptz NOT NULL DEFAULT now(),
    completed_at      timestamptz,
    last_accessed_at  timestamptz,
    last_lesson_id    uuid REFERENCES lessons(id) ON DELETE SET NULL,
    UNIQUE (user_id, course_id)
);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);

-- 2.6 lesson_progress
CREATE TABLE lesson_progress (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    lesson_id       uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    course_id       uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    status          text NOT NULL DEFAULT 'not_started'
                    CHECK (status IN ('not_started','in_progress','completed')),
    completed_at    timestamptz,
    time_spent_sec  int NOT NULL DEFAULT 0,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now(),
    UNIQUE (user_id, lesson_id)
);
CREATE INDEX idx_lp_user_course_status ON lesson_progress(user_id, course_id, status);

-- 2.7 certificates
CREATE TABLE certificates (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    course_id           uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    certificate_number  text UNIQUE NOT NULL,
    verification_code   text UNIQUE NOT NULL,
    issued_at           timestamptz NOT NULL DEFAULT now(),
    pdf_url             text,
    UNIQUE (user_id, course_id)
);

-- 2.8 activity_log
CREATE TABLE activity_log (
    id          bigserial PRIMARY KEY,
    user_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type        text NOT NULL,
    lesson_id   uuid REFERENCES lessons(id) ON DELETE SET NULL,
    course_id   uuid REFERENCES courses(id) ON DELETE SET NULL,
    metadata    jsonb NOT NULL DEFAULT '{}',
    created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_activity_user_created ON activity_log(user_id, created_at DESC);
CREATE INDEX idx_activity_user_type ON activity_log(user_id, type);
CREATE INDEX idx_activity_created ON activity_log(created_at DESC);

-- 2.9 notification_prefs
CREATE TABLE notification_prefs (
    user_id                          uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    email_course_updates             boolean NOT NULL DEFAULT true,
    email_weekly_digest              boolean NOT NULL DEFAULT true,
    email_achievements               boolean NOT NULL DEFAULT true,
    email_mentor_messages            boolean NOT NULL DEFAULT true,
    email_community_announcements    boolean NOT NULL DEFAULT false,
    email_marketing                  boolean NOT NULL DEFAULT false,
    push_course_updates              boolean NOT NULL DEFAULT true,
    push_achievements                boolean NOT NULL DEFAULT true,
    push_quiz_results                boolean NOT NULL DEFAULT true,
    push_discussion_replies          boolean NOT NULL DEFAULT true,
    updated_at                       timestamptz NOT NULL DEFAULT now()
);

-- 2.10 notifications
CREATE TABLE notifications (
    id          bigserial PRIMARY KEY,
    user_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type        text NOT NULL,
    title       text NOT NULL,
    body        text NOT NULL,
    link        text,
    read        boolean NOT NULL DEFAULT false,
    created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_notif_user_read ON notifications(user_id, read, created_at DESC);

-- 2.11 plans
CREATE TABLE plans (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug          text UNIQUE NOT NULL,
    name          text NOT NULL,
    description   text,
    price_cents   int NOT NULL DEFAULT 0,
    currency      text NOT NULL DEFAULT 'NGN',
    interval      text CHECK (interval IN ('month','year','one-time')),
    features      text[] NOT NULL DEFAULT '{}',
    display_order int NOT NULL DEFAULT 0,
    active        boolean NOT NULL DEFAULT true
);

-- 2.12 subscriptions
CREATE TABLE subscriptions (
    id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                   uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    plan_id                   uuid REFERENCES plans(id) ON DELETE SET NULL,
    status                    text NOT NULL
                              CHECK (status IN ('active','cancelled','expired','past_due')),
    started_at                timestamptz NOT NULL DEFAULT now(),
    current_period_end        timestamptz,
    cancelled_at              timestamptz,
    provider                  text,
    provider_subscription_id  text,
    created_at                timestamptz NOT NULL DEFAULT now(),
    updated_at                timestamptz NOT NULL DEFAULT now()
);

-- 2.13 transactions
CREATE TABLE transactions (
    id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                   uuid NOT NULL REFERENCES profiles(id),
    subscription_id           uuid REFERENCES subscriptions(id) ON DELETE SET NULL,
    amount_cents              int NOT NULL,
    currency                  text NOT NULL,
    status                    text NOT NULL
                              CHECK (status IN ('pending','succeeded','failed','refunded')),
    provider                  text NOT NULL,
    provider_transaction_id   text UNIQUE,
    paid_at                   timestamptz,
    created_at                timestamptz NOT NULL DEFAULT now()
);

-- 2.14 quizzes
CREATE TABLE quizzes (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id       uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    module_id       uuid REFERENCES modules(id) ON DELETE CASCADE,
    lesson_id       uuid REFERENCES lessons(id) ON DELETE CASCADE,
    title           text NOT NULL,
    description     text,
    pass_threshold  int NOT NULL DEFAULT 70,
    time_limit_min  int,
    max_attempts    int,
    shuffle_q       boolean NOT NULL DEFAULT false,
    published       boolean NOT NULL DEFAULT true,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now(),
    CHECK ((module_id IS NOT NULL)::int + (lesson_id IS NOT NULL)::int = 1)
);
CREATE INDEX idx_quizzes_course ON quizzes(course_id);
CREATE INDEX idx_quizzes_module ON quizzes(module_id);
CREATE INDEX idx_quizzes_lesson ON quizzes(lesson_id);

-- 2.15 quiz_questions
CREATE TABLE quiz_questions (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id         uuid NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question        text NOT NULL,
    explanation     text,
    points          int NOT NULL DEFAULT 1,
    order_index     int NOT NULL,
    created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_qq_quiz_order ON quiz_questions(quiz_id, order_index);

-- 2.16 quiz_options
CREATE TABLE quiz_options (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id     uuid NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
    option_text     text NOT NULL,
    is_correct      boolean NOT NULL DEFAULT false,
    order_index     int NOT NULL,
    created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_qo_question_order ON quiz_options(question_id, order_index);

-- 2.17 quiz_attempts
CREATE TABLE quiz_attempts (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    quiz_id         uuid NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    course_id       uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    score_percent   int,
    points_scored   int,
    points_total    int,
    passed          boolean,
    started_at      timestamptz NOT NULL DEFAULT now(),
    submitted_at    timestamptz,
    time_spent_sec  int NOT NULL DEFAULT 0
);
CREATE INDEX idx_qa_user_quiz ON quiz_attempts(user_id, quiz_id);
CREATE INDEX idx_qa_user_course ON quiz_attempts(user_id, course_id);
CREATE INDEX idx_qa_submitted ON quiz_attempts(submitted_at);

-- 2.18 quiz_answers
CREATE TABLE quiz_answers (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id      uuid NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    question_id     uuid NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
    option_id       uuid REFERENCES quiz_options(id) ON DELETE SET NULL,
    is_correct      boolean,
    answered_at     timestamptz NOT NULL DEFAULT now(),
    UNIQUE (attempt_id, question_id)
);

-- 2.19 discussion_threads
CREATE TABLE discussion_threads (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id       uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    course_id       uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    lesson_id       uuid REFERENCES lessons(id) ON DELETE CASCADE,
    title           text NOT NULL,
    body            text NOT NULL,
    pinned          boolean NOT NULL DEFAULT false,
    locked          boolean NOT NULL DEFAULT false,
    resolved        boolean NOT NULL DEFAULT false,
    reply_count     int NOT NULL DEFAULT 0,
    reaction_count  int NOT NULL DEFAULT 0,
    last_reply_at   timestamptz,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_dt_course ON discussion_threads(course_id);
CREATE INDEX idx_dt_lesson ON discussion_threads(lesson_id);
CREATE INDEX idx_dt_author ON discussion_threads(author_id);
CREATE INDEX idx_dt_feed ON discussion_threads(pinned DESC, last_reply_at DESC NULLS LAST, created_at DESC);

-- 2.20 discussion_replies
CREATE TABLE discussion_replies (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id       uuid NOT NULL REFERENCES discussion_threads(id) ON DELETE CASCADE,
    author_id       uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    body            text NOT NULL,
    parent_id       uuid REFERENCES discussion_replies(id) ON DELETE CASCADE,
    is_answer       boolean NOT NULL DEFAULT false,
    reaction_count  int NOT NULL DEFAULT 0,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_dr_thread ON discussion_replies(thread_id);
CREATE INDEX idx_dr_author ON discussion_replies(author_id);
CREATE INDEX idx_dr_parent ON discussion_replies(parent_id);

-- 2.21 discussion_reactions
CREATE TABLE discussion_reactions (
    id          bigserial PRIMARY KEY,
    user_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    thread_id   uuid REFERENCES discussion_threads(id) ON DELETE CASCADE,
    reply_id    uuid REFERENCES discussion_replies(id) ON DELETE CASCADE,
    reaction    text NOT NULL DEFAULT 'like'
                CHECK (reaction IN ('like','helpful','insightful')),
    created_at  timestamptz NOT NULL DEFAULT now(),
    CHECK ((thread_id IS NOT NULL)::int + (reply_id IS NOT NULL)::int = 1),
    UNIQUE (user_id, thread_id, reaction),
    UNIQUE (user_id, reply_id, reaction)
);
CREATE INDEX idx_drx_thread ON discussion_reactions(thread_id);
CREATE INDEX idx_drx_reply ON discussion_reactions(reply_id);