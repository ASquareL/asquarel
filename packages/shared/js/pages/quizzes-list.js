// ============================================================
// A SQUARE L INNOVATE — Quizzes List Page
// URL: quizzes.html?course={slug}
// ============================================================

(function (window, document) {
    'use strict';

    function getClient() { return window.SupabaseClient || null; }

    function escapeHtml(str) {
        if (str == null) return '';
        return String(str)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function setText(sel, value) {
        document.querySelectorAll(sel).forEach(el => el.textContent = value);
    }

    function getCourseSlug() {
        return new URLSearchParams(window.location.search).get('course');
    }

    // Keeps the course param on every URL we generate
    function withCourse(url, slug) {
        if (!slug) return url;
        const sep = url.includes('?') ? '&' : '?';
        return `${url}${sep}course=${encodeURIComponent(slug)}`;
    }

    async function requireAuth() {
        const client = getClient();
        const { data: { session } } = await client.auth.getSession();
        if (!session) {
            window.location.href = '../login.html';
            return null;
        }
        return session;
    }

    async function fetchCourse(slug) {
        const client = getClient();
        const { data, error } = await client
            .from('courses')
            .select('id, slug, title')
            .eq('slug', slug)
            .single();
        if (error) { console.error('[Quizzes] course', error); return null; }
        return data;
    }

    async function fetchQuizzes(courseId) {
        const client = getClient();
        const { data, error } = await client
            .from('quizzes')
            .select(`
                id, title, description, pass_threshold, time_limit_min, max_attempts, published,
                module:modules(id, title, order_index)
            `)
            .eq('course_id', courseId)
            .eq('published', true)
            .order('module(order_index)', { ascending: true });
        if (error) { console.error('[Quizzes] list', error); return []; }
        return data || [];
    }

    async function fetchUserAttempts(userId, courseId) {
        const client = getClient();
        const { data, error } = await client
            .from('quiz_attempts')
            .select('quiz_id, score_percent, passed, submitted_at')
            .eq('user_id', userId)
            .eq('course_id', courseId)
            .not('submitted_at', 'is', null);
        if (error) { console.error('[Quizzes] attempts', error); return []; }
        return data || [];
    }

    async function fetchQuestionCounts(quizIds) {
        if (!quizIds.length) return {};
        const client = getClient();
        const { data, error } = await client
            .from('quiz_questions')
            .select('quiz_id')
            .in('quiz_id', quizIds);
        if (error) return {};
        const counts = {};
        data.forEach(r => { counts[r.quiz_id] = (counts[r.quiz_id] || 0) + 1; });
        return counts;
    }

    // ----------------------------------------------------------
    // BACK LINK
    // ----------------------------------------------------------
    function updateBackLink(slug) {
        if (!slug) return;
        const href = `${slug}/index.html`;
        document.querySelectorAll('[data-back-link]').forEach(link => {
            link.href = href;
        });
    }

    // ----------------------------------------------------------
    // RENDER
    // ----------------------------------------------------------
    function renderQuiz(quiz, attempts, questionCount, courseSlug) {
        const quizAttempts = attempts.filter(a => a.quiz_id === quiz.id);
        const bestScore = quizAttempts.length
            ? Math.max(...quizAttempts.map(a => a.score_percent || 0))
            : null;
        const hasPassed = quizAttempts.some(a => a.passed);
        const attemptCount = quizAttempts.length;

        let statusBadge;
        if (hasPassed) {
            statusBadge = '<span class="badge badge-success">Passed</span>';
        } else if (attemptCount > 0) {
            statusBadge = '<span class="badge badge-warning">Retake Available</span>';
        } else {
            statusBadge = '<span class="badge">Not Attempted</span>';
        }

        const meta = [];
        if (quiz.module?.title) meta.push(`Module ${quiz.module.order_index}: ${quiz.module.title}`);
        meta.push(`${questionCount} questions`);
        meta.push(`Pass: ${quiz.pass_threshold}%`);
        if (quiz.time_limit_min) meta.push(`Time: ${quiz.time_limit_min} min`);

        const buttonLabel = attemptCount === 0 ? 'Start Quiz' : (hasPassed ? 'Retake' : 'Try Again');
        const quizHref = withCourse(`quiz.html?id=${encodeURIComponent(quiz.id)}`, courseSlug);

        return `
            <article class="card">
                <div class="card-body">
                    <div class="d-flex justify-between align-center flex-wrap gap-3 mb-3">
                        <div>
                            <h3 class="mb-1">${escapeHtml(quiz.title)}</h3>
                            <p class="mb-0">${escapeHtml(meta.join(' · '))}</p>
                        </div>
                        ${statusBadge}
                    </div>

                    ${quiz.description ? `<p class="mb-3">${escapeHtml(quiz.description)}</p>` : ''}

                    ${bestScore !== null ? `
                        <div class="d-flex align-center gap-2 mb-3">
                            <strong class="text-gold">Best score: ${bestScore}%</strong>
                            <small class="text-muted">· ${attemptCount} attempt${attemptCount > 1 ? 's' : ''}</small>
                        </div>
                    ` : ''}

                    ${questionCount === 0 ? `
                        <div class="alert alert-warning">
                            <div class="alert-content">
                                <div class="alert-text">No questions in this quiz yet. Check back soon.</div>
                            </div>
                        </div>
                    ` : `
                        <a href="${quizHref}" class="btn btn-primary">
                            ${buttonLabel} <i class="fa-solid fa-arrow-right"></i>
                        </a>
                    `}
                </div>
            </article>`;
    }

    async function boot() {
        const session = await requireAuth();
        if (!session) return;

        const slug = getCourseSlug();
        if (!slug) {
            // No course in URL — redirect to courses index
            window.location.href = 'index.html';
            return;
        }

        const course = await fetchCourse(slug);
        if (!course) return;

        setText('[data-course-title]', course.title);

        // Populate the "Back to course" link
        updateBackLink(slug);

        const [quizzes, attempts] = await Promise.all([
            fetchQuizzes(course.id),
            fetchUserAttempts(session.user.id, course.id)
        ]);

        const counts = await fetchQuestionCounts(quizzes.map(q => q.id));

        const list = document.querySelector('[data-list="quizzes"]');
        if (!list) return;

        if (!quizzes.length) {
            list.innerHTML = `
                <div class="card">
                    <div class="card-body text-center py-5">
                        <div class="avatar avatar-lg avatar-gold mb-4 mx-auto">
                            <i class="fa-solid fa-circle-question fa-2x text-gold"></i>
                        </div>
                        <h3 class="mb-2">No quizzes yet</h3>
                        <p class="mb-0">Quizzes will appear here as they're released.</p>
                    </div>
                </div>`;
            return;
        }

        list.innerHTML = quizzes
            .map(q => renderQuiz(q, attempts, counts[q.id] || 0, slug))
            .join('');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})(window, document);