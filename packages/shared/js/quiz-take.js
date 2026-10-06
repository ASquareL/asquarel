// ============================================================
// A SQUARE L INNOVATE — Quiz Taking Page
// URL: quiz.html?id={quiz_uuid}
// ============================================================

(function (window, document) {
    'use strict';

    function getClient() { return window.SupabaseClient || null; }

    function toast(type, title, message) {
        if (window.ASLDS && window.ASLDS.Toast) {
            window.ASLDS.Toast.show({ type, title, message });
        }
    }

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

    function getQueryParam(name) {
        return new URLSearchParams(window.location.search).get(name);
    }

    const state = {
        session: null,
        quiz: null,
        course: null,
        module: null,
        questions: [],
        attempts: [],
        currentAttempt: null,
        currentIndex: 0,
        answers: {},
        results: null,
        phase: 'loading'
    };

    async function requireAuth() {
        const client = getClient();
        const { data: { session } } = await client.auth.getSession();
        if (!session) {
            window.location.href = '../../login.html';
            return null;
        }
        return session;
    }

    async function fetchQuiz(quizId) {
        const client = getClient();
        const { data, error } = await client
            .from('quizzes')
            .select(`
                id, title, description, pass_threshold, time_limit_min, max_attempts,
                course_id, module_id,
                module:modules(id, title, order_index),
                course:courses(id, slug, title)
            `)
            .eq('id', quizId)
            .single();
        if (error) { console.error('[Quiz] fetch', error); return null; }
        return data;
    }

    async function fetchQuestions(quizId) {
        const client = getClient();
        const { data: questions, error } = await client
            .from('quiz_questions')
            .select('id, question, explanation, points, order_index')
            .eq('quiz_id', quizId)
            .order('order_index');
        if (error) { console.error('[Quiz] questions', error); return []; }
        if (!questions || !questions.length) return [];

        const questionIds = questions.map(q => q.id);
        const { data: options, error: optErr } = await client
            .from('quiz_options_safe')
            .select('id, question_id, option_text, order_index')
            .in('question_id', questionIds)
            .order('order_index');
        if (optErr) { console.error('[Quiz] options', optErr); }

        return questions.map(q => ({
            ...q,
            options: (options || []).filter(o => o.question_id === q.id)
        }));
    }

    async function fetchAttempts(userId, quizId) {
        const client = getClient();
        const { data, error } = await client
            .from('quiz_attempts')
            .select('id, score_percent, points_scored, points_total, passed, started_at, submitted_at')
            .eq('user_id', userId)
            .eq('quiz_id', quizId)
            .not('submitted_at', 'is', null)
            .order('submitted_at', { ascending: false });
        if (error) { console.error('[Quiz] attempts', error); return []; }
        return data || [];
    }

    async function createAttempt() {
        const client = getClient();
        const { data, error } = await client
            .from('quiz_attempts')
            .insert({
                user_id: state.session.user.id,
                quiz_id: state.quiz.id,
                course_id: state.quiz.course_id
            })
            .select('id, started_at')
            .single();
        if (error) { console.error('[Quiz] create attempt', error); return null; }
        return data;
    }

    async function saveAnswers() {
        const client = getClient();
        const rows = Object.entries(state.answers).map(([questionId, optionId]) => ({
            attempt_id: state.currentAttempt.id,
            question_id: questionId,
            option_id: optionId
        }));
        if (!rows.length) return { error: null };

        const { error } = await client.from('quiz_answers').insert(rows);
        return { error: error ? error.message : null };
    }

    async function submitAttempt() {
        const client = getClient();
        const { data, error } = await client.rpc('submit_quiz_attempt', {
            p_attempt_id: state.currentAttempt.id
        });
        if (error) { console.error('[Quiz] submit', error); return null; }
        return data;
    }

    async function fetchAnswerDetails() {
        const client = getClient();
        const { data, error } = await client
            .from('quiz_answers')
            .select(`
                id, question_id, option_id, is_correct,
                question:quiz_questions(id, question, explanation, order_index)
            `)
            .eq('attempt_id', state.currentAttempt.id);
        if (error) { console.error('[Quiz] answers', error); return []; }
        return data || [];
    }

    // ----------------------------------------------------------
    // RENDER
    // ----------------------------------------------------------
    const content = () => document.querySelector('[data-quiz-content]');

    function renderLoading() {
        content().innerHTML = `
            <div class="text-center py-5">
                <i class="fa-solid fa-spinner fa-spin fa-3x text-gold"></i>
                <p class="mt-4 mb-0">Loading quiz…</p>
            </div>`;
    }

    function renderNotFound() {
        content().innerHTML = `
            <div class="text-center py-5">
                <div class="avatar avatar-xl avatar-gold mb-4 mx-auto">
                    <i class="fa-solid fa-circle-question fa-3x text-gold"></i>
                </div>
                <h1 class="mb-3">Quiz not found</h1>
                <p class="mb-4">This quiz doesn't exist or is no longer available.</p>
                <a href="quizzes.html" class="btn btn-primary">
                    View All Quizzes <i class="fa-solid fa-arrow-right"></i>
                </a>
            </div>`;
    }

    function renderIntro() {
        const best = state.attempts.length
            ? Math.max(...state.attempts.map(a => a.score_percent || 0))
            : null;
        const hasPassed = state.attempts.some(a => a.passed);
        const attemptCount = state.attempts.length;

        const meta = [];
        meta.push(`<span class="quiz-meta-item"><i class="fa-solid fa-list-ol"></i> ${state.questions.length} questions</span>`);
        meta.push(`<span class="quiz-meta-item"><i class="fa-solid fa-bullseye"></i> Pass at ${state.quiz.pass_threshold}%</span>`);
        if (state.quiz.time_limit_min) {
            meta.push(`<span class="quiz-meta-item"><i class="fa-solid fa-clock"></i> ${state.quiz.time_limit_min} min limit</span>`);
        }

        content().innerHTML = `
            <div class="quiz-shell">
                <div class="mb-4">
                    ${state.module ? `<span class="badge badge-sm mb-2">Module ${state.module.order_index}</span>` : ''}
                    <h1 class="mb-3">${escapeHtml(state.quiz.title)}</h1>
                    ${state.quiz.description ? `<p>${escapeHtml(state.quiz.description)}</p>` : ''}
                </div>

                <div class="quiz-meta mb-5">
                    ${meta.join('')}
                </div>

                ${attemptCount > 0 ? `
                    <div class="card mb-4">
                        <div class="card-body">
                            <div class="d-flex justify-between align-center flex-wrap gap-3">
                                <div>
                                    <strong>Your History</strong>
                                    <p class="mb-0">${attemptCount} attempt${attemptCount > 1 ? 's' : ''} · Best score: ${best}%</p>
                                </div>
                                ${hasPassed ? '<span class="badge badge-success">Passed</span>' : '<span class="badge badge-warning">Not Yet Passed</span>'}
                            </div>
                        </div>
                    </div>
                ` : ''}

                ${state.questions.length === 0 ? `
                    <div class="alert alert-warning">
                        <div class="alert-content">
                            <div class="alert-text">This quiz has no questions yet. Check back soon.</div>
                        </div>
                    </div>
                ` : `
                    <div class="card bg-sheen-gold">
                        <div class="card-body text-center py-5">
                            <h2 class="mb-3">${attemptCount === 0 ? 'Ready to begin?' : 'Try again?'}</h2>
                            <p class="mb-4">No time pressure. Answer every question, then submit.</p>
                            <button class="btn btn-primary btn-lg" type="button" data-start-quiz>
                                ${attemptCount === 0 ? 'Start Quiz' : 'Start New Attempt'} <i class="fa-solid fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                `}

                <div class="text-center mt-4">
                    <a href="quizzes.html" class="text-muted">
                        <i class="fa-solid fa-arrow-left"></i> Back to all quizzes
                    </a>
                </div>
            </div>`;
    }

    function renderQuestion() {
        const q = state.questions[state.currentIndex];
        const total = state.questions.length;
        const position = state.currentIndex + 1;
        const percent = Math.round(100 * position / total);
        const selected = state.answers[q.id];

        const optionsHtml = q.options.map(o => `
            <label class="quiz-option ${selected === o.id ? 'is-selected' : ''}">
                <input type="radio" name="question-${q.id}" value="${escapeHtml(o.id)}" ${selected === o.id ? 'checked' : ''}>
                <div class="quiz-option-content">
                    <span class="quiz-option-indicator"></span>
                    <span class="quiz-option-text">${escapeHtml(o.option_text)}</span>
                </div>
            </label>
        `).join('');

        const isLast = position === total;
        const hasAnswer = !!state.answers[q.id];

        content().innerHTML = `
            <div class="quiz-shell">
                <div class="quiz-progress">
                    <div class="quiz-progress-header">
                        <span>Question ${position} of ${total}</span>
                        <span>${percent}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percent}%"></div>
                    </div>
                </div>

                <div class="quiz-question">
                    <h2 class="quiz-question-text">${escapeHtml(q.question)}</h2>
                    <div class="quiz-options">
                        ${optionsHtml}
                    </div>
                </div>

                <div class="quiz-actions">
                    <button class="btn btn-outline" type="button" data-quiz-prev ${position === 1 ? 'disabled' : ''}>
                        <i class="fa-solid fa-arrow-left"></i> Previous
                    </button>

                    ${isLast ? `
                        <button class="btn btn-primary" type="button" data-quiz-submit ${hasAnswer ? '' : 'disabled'}>
                            Submit Quiz <i class="fa-solid fa-check"></i>
                        </button>
                    ` : `
                        <button class="btn btn-primary" type="button" data-quiz-next ${hasAnswer ? '' : 'disabled'}>
                            Next <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    `}
                </div>
            </div>`;

        // Wire option radios
        content().querySelectorAll('.quiz-option input').forEach(input => {
            input.addEventListener('change', () => {
                state.answers[q.id] = input.value;
                content().querySelectorAll('.quiz-option').forEach(el => el.classList.remove('is-selected'));
                input.closest('.quiz-option').classList.add('is-selected');
                // Re-enable next/submit
                const nextBtn = content().querySelector('[data-quiz-next]');
                const submitBtn = content().querySelector('[data-quiz-submit]');
                if (nextBtn) nextBtn.disabled = false;
                if (submitBtn) submitBtn.disabled = false;
            });
        });

        const prevBtn = content().querySelector('[data-quiz-prev]');
        if (prevBtn) prevBtn.addEventListener('click', () => {
            if (state.currentIndex > 0) {
                state.currentIndex--;
                renderQuestion();
            }
        });

        const nextBtn = content().querySelector('[data-quiz-next]');
        if (nextBtn) nextBtn.addEventListener('click', () => {
            if (state.currentIndex < state.questions.length - 1) {
                state.currentIndex++;
                renderQuestion();
            }
        });

        const submitBtn = content().querySelector('[data-quiz-submit]');
        if (submitBtn) submitBtn.addEventListener('click', handleSubmit);
    }

    function renderResults() {
        const r = state.results;
        const details = state.answerDetails || [];

        const items = details
            .sort((a, b) => (a.question?.order_index || 0) - (b.question?.order_index || 0))
            .map(item => {
                const correct = item.is_correct === true;
                return `
                    <div class="quiz-result-item ${correct ? 'correct' : 'incorrect'}">
                        <div class="quiz-result-item-header">
                            <i class="fa-solid ${correct ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
                            <span class="quiz-result-item-question">${escapeHtml(item.question?.question || '')}</span>
                        </div>
                        ${item.question?.explanation ? `
                            <p class="quiz-result-item-explanation">${escapeHtml(item.question.explanation)}</p>
                        ` : ''}
                    </div>`;
            }).join('');

        content().innerHTML = `
            <div class="quiz-shell">
                <div class="quiz-result-hero">
                    <div class="quiz-result-label">${r.passed ? 'Passed' : 'Not Passed'}</div>
                    <div class="quiz-result-score ${r.passed ? 'pass' : 'fail'}">${r.score_percent}%</div>
                    <p class="mb-0">${r.points_scored} of ${r.points_total} points</p>
                </div>

                <div class="d-flex justify-center gap-3 flex-wrap mb-5">
                    <a href="quiz.html?id=${encodeURIComponent(state.quiz.id)}" class="btn btn-primary">
                        <i class="fa-solid fa-rotate-right"></i> Retake Quiz
                    </a>
                    <a href="quizzes.html" class="btn btn-outline">
                        <i class="fa-solid fa-list"></i> All Quizzes
                    </a>
                </div>

                <h2 class="mb-4">Review Your Answers</h2>
                <div class="d-flex flex-column gap-3">
                    ${items}
                </div>
            </div>`;
    }

    // ----------------------------------------------------------
    // HANDLERS
    // ----------------------------------------------------------
    async function handleStart() {
        const attempt = await createAttempt();
        if (!attempt) {
            toast('error', 'Could not start quiz', 'Please try again.');
            return;
        }
        state.currentAttempt = attempt;
        state.answers = {};
        state.currentIndex = 0;
        state.phase = 'taking';
        renderQuestion();
    }

    async function handleSubmit() {
        const totalAnswered = Object.keys(state.answers).length;
        if (totalAnswered < state.questions.length) {
            toast('error', 'Not complete', `Answer all ${state.questions.length} questions before submitting.`);
            return;
        }

        const submitBtn = content().querySelector('[data-quiz-submit]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting…';
        }

        // 1. Save all answers
        const { error: saveErr } = await saveAnswers();
        if (saveErr) {
            toast('error', 'Save failed', saveErr);
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Submit Quiz <i class="fa-solid fa-check"></i>';
            }
            return;
        }

        // 2. Submit for grading
        const result = await submitAttempt();
        if (!result) {
            toast('error', 'Grading failed', 'Please try again.');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Submit Quiz <i class="fa-solid fa-check"></i>';
            }
            return;
        }

        // 3. Fetch per-question breakdown
        const details = await fetchAnswerDetails();

        state.results = result;
        state.answerDetails = details;
        state.phase = 'results';

        toast(
            result.passed ? 'success' : 'warning',
            result.passed ? 'Quiz passed!' : 'Quiz complete',
            `You scored ${result.score_percent}%.`
        );

        renderResults();
    }

    // ----------------------------------------------------------
    // BOOT
    // ----------------------------------------------------------
    async function boot() {
        renderLoading();

        const session = await requireAuth();
        if (!session) return;
        state.session = session;

        const id = getQueryParam('id');
        if (!id) { renderNotFound(); return; }

        const quiz = await fetchQuiz(id);
        if (!quiz) { renderNotFound(); return; }
        state.quiz = quiz;
        state.module = quiz.module;

        setText('[data-course-title]', quiz.course?.title || 'Course');
        document.title = `${quiz.title} — A Square L Academy`;

        const [questions, attempts] = await Promise.all([
            fetchQuestions(quiz.id),
            fetchAttempts(session.user.id, quiz.id)
        ]);

        state.questions = questions;
        state.attempts = attempts;
        state.phase = 'intro';

        renderIntro();

        const startBtn = content().querySelector('[data-start-quiz]');
        if (startBtn) startBtn.addEventListener('click', handleStart);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})(window, document);