# A SQUARE L INNOVATE — DATABASE QUICK REFERENCE

Platform:      Supabase (PostgreSQL)
Project ref:   rrojwvllffitnxievob
Project URL:   https://rrojwvllffitnxievob.supabase.co
Frontend URL:  https://asquarel.netlify.app

## 21 TABLES

IDENTITY
  profiles             id · reg_number (ASL-YYYY-NNN) · full_name · email · phone
                       · location · bio · avatar_url · role (student|mentor|admin)
                       · level · created_at · updated_at
  notification_prefs   user_id · email_* (6 toggles) · push_* (4 toggles) · updated_at

CONTENT
  courses              id · slug · title · tagline · description · icon · level
                       · lessons_count · total_minutes · certificate_enabled
                       · outcomes[] · projects[] · requirements[] · faq[]
                       · mentor_id · published · display_order
  modules              id · course_id · title · description · order_index
                       · lessons_count · total_minutes
  lessons              id · course_id · module_id · slug · number · title
                       · duration_minutes · video_id · content · resources[]
                       · preview · published

ENROLLMENT
  enrollments          id · user_id · course_id · plan · enrolled_at
                       · completed_at · last_accessed_at · last_lesson_id
  lesson_progress      id · user_id · lesson_id · course_id
                       · status (not_started|in_progress|completed)
                       · completed_at · time_spent_sec
  certificates         id · user_id · course_id · certificate_number
                       · verification_code · issued_at · pdf_url

QUIZZES
  quizzes              id · course_id · module_id | lesson_id · title
                       · pass_threshold · time_limit_min · max_attempts
  quiz_questions       id · quiz_id · question · explanation · points · order_index
  quiz_options         id · question_id · option_text · is_correct · order_index
  quiz_attempts        id · user_id · quiz_id · course_id · score_percent
                       · points_scored · points_total · passed · submitted_at
  quiz_answers         id · attempt_id · question_id · option_id · is_correct

DISCUSSIONS
  discussion_threads    id · author_id · course_id · lesson_id · title · body
                        · pinned · locked · resolved · reply_count
                        · reaction_count · last_reply_at
  discussion_replies    id · thread_id · author_id · body · parent_id
                        · is_answer · reaction_count
  discussion_reactions  id · user_id · thread_id | reply_id
                        · reaction (like|helpful|insightful)

ACTIVITY & NOTIFICATIONS
  activity_log         id (bigserial) · user_id · type · lesson_id · course_id
                       · metadata jsonb · created_at
  notifications        id (bigserial) · user_id · type · title · body · link
                       · read · created_at

BILLING
  plans                id · slug · name · description · price_cents · currency
                       · interval · features[] · display_order · active
  subscriptions        id · user_id · plan_id · status · started_at
                       · current_period_end · cancelled_at · provider
                       · provider_subscription_id
  transactions         id · user_id · subscription_id · amount_cents · currency
                       · status · provider · provider_transaction_id · paid_at

## KEY FUNCTIONS

  generate_reg_number()          → ASL-YYYY-NNN
  generate_certificate_number()  → ASL-CERT-YYYY-NNNN
  is_admin()                     → boolean for current user
  is_enrolled(course_uuid)       → boolean for current user
  is_mentor_of(course_uuid)      → boolean for current user
  submit_quiz_attempt(uuid)      → grades quiz, sets passed, logs activity
                                   (SECURITY DEFINER — students call this,
                                    correct answers hidden)

## KEY TRIGGERS (auto-fire)

  auth.users INSERT              → creates profiles row + notification_prefs row
  profiles UPDATE                → locks role/reg_number/level from non-admin
  lesson_progress INSERT/UPDATE  → logs activity; when all lessons complete:
                                     sets enrollments.completed_at
                                     issues certificate
                                     creates notification
                                     logs course_completed + certificate_earned
  enrollments INSERT             → logs course_enrolled
  lessons INSERT/DELETE          → refreshes courses.lessons_count + total_minutes
  discussion_replies INSERT      → bumps thread.reply_count + last_reply_at
                                     notifies thread author
  discussion_reactions INSERT/DELETE → updates cached reaction_count

## KEY VIEWS

  course_progress      user_id · course_id · total_lessons · completed_lessons
                       · percentage
  user_stats           user_id · courses_enrolled · courses_completed
                       · lessons_completed · total_minutes_learned
                       · certificates_earned · active_days_30
                       · quizzes_passed · discussion_posts
  lesson_with_context  lesson.* + module_title + course_title + course_slug
                       + user_status + prev_lesson_number + next_lesson_number
  quiz_summary         quiz + question_count + user_best_score + user_passed
  thread_with_meta     thread + author info + course/lesson titles
  quiz_options_safe    quiz_options WITHOUT is_correct for non-admins

## AUTH

Providers enabled: Email (confirm OFF for dev)
Reg number format: ASL-2026-001 (auto-increments)
Google OAuth: NOT YET configured (skipped for now)

## SEEDED DATA

  courses:  3  (web-development · crypto-blockchain · smartphone-graphic-design)
  modules:  18 (6 per course)
  lessons:  52 (all web-development; other courses empty)
  quizzes:  6  (web-dev only; 0 questions each — placeholders)
  plans:    3  (free · pro · mentorship in NGN)

## RLS STATUS

  All 21 tables: ENABLED
  All 6 views:   security_invoker = TRUE (respect caller's permissions)
  Helper functions: is_admin() · is_enrolled() · is_mentor_of() are SECURITY DEFINER

## MIGRATIONS APPLIED

  001 Foundation (extensions, sequences, scalar functions)
  002 Tables (21 tables)
  003 Triggers & Views (15 triggers, 5 views)
  004 RLS policies + quiz grading function
  005 Seed data (courses/modules/lessons/quizzes/plans)
  006 Lock views (security_invoker)

## KEY CONVENTIONS

  currency codes:  NGN only (v1)
  lesson video:    youtube-nocookie.com iframe, video_id = raw 11-char ID
  reg numbers:     ASL-YYYY-NNN (auto-generated on signup)
  certificate no:  ASL-CERT-YYYY-NNNN
  slugs:           kebab-case (web-development, lesson-01)
  UUIDs:           gen_random_uuid() everywhere

END OF REFERENCE