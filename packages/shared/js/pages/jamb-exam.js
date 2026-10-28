// ============================================================
// A SQUARE L INNOVATE — JAMB CBT Exam Interface
// URL: jamb-exam.html?id={quiz_uuid}
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
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function getQuery(name) {
        return new URLSearchParams(window.location.search).get(name);
    }

    function formatTime(seconds) {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    const state = {
        session: null,
        quiz: null,
        questions: [],
        currentAttempt: null,
        currentIndex: 0,
        answers: {},
        timerInterval: null,
        timeRemaining: 0,
        closeSidebar: null
    };

    async function requireAuth() {
        const client = getClient();
        const { data: { session } } = await client.auth.getSession();
        if (!session) {
            window.location.href = '/apps/academy/login.html?redirect=jamb';
            return null;
        }
        return session;
    }

    // ----------------------------------------------------------
    // DATA FETCHING
    // ----------------------------------------------------------
    async function fetchExam(quizId) {
        const client = getClient();
        const { data, error } = await client
            .from('quizzes')
            .select(`
                id, title, time_limit_min, course_id,
                course:courses(title)
            `)
            .eq('id', quizId)
            .single();
        if (error) return null;
        return data;
    }

    async function fetchQuestions(quizId) {
        const client = getClient();
        const { data: questions } = await client
            .from('quiz_questions')
            .select('id, question, order_index')
            .eq('quiz_id', quizId)
            .order('order_index');

        if (!questions) return [];

        const { data: options } = await client
            .from('quiz_options_safe')
            .select('id, question_id, option_text, order_index')
            .in('question_id', questions.map(q => q.id))
            .order('order_index');

        return questions.map(q => ({
            ...q,
            options: (options || []).filter(o => o.question_id === q.id)
        }));
    }

    async function createAttempt() {
        const client = getClient();
        const { data } = await client
            .from('quiz_attempts')
            .insert({
                user_id: state.session.user.id,
                quiz_id: state.quiz.id,
                course_id: state.quiz.course_id
            })
            .select('id, started_at')
            .single();
        return data;
    }

    // ----------------------------------------------------------
    // RENDERERS
    // ----------------------------------------------------------
    function renderGrid() {
        const grid = document.querySelector('[data-question-grid]');
        if (!grid) return;

        grid.innerHTML = state.questions.map((q, index) => {
            const isCurrent = index === state.currentIndex;
            const isAnswered = !!state.answers[q.id];
            let classes = 'cbt-grid-btn';
            if (isCurrent) classes += ' is-active';
            if (isAnswered) classes += ' is-answered';

            return `<button type="button" class="${classes}" data-jump="${index}">${index + 1}</button>`;
        }).join('');

        grid.querySelectorAll('[data-jump]').forEach(btn => {
            btn.addEventListener('click', () => {
                state.currentIndex = parseInt(btn.getAttribute('data-jump'), 10);
                renderQuestion();
                renderGrid();
                if (state.closeSidebar) state.closeSidebar();
            });
        });
    }

    function renderQuestion() {
        const area = document.querySelector('[data-question-area]');
        if (!area || !state.questions.length) return;

        const q = state.questions[state.currentIndex];
        const selected = state.answers[q.id];
        const letters = ['A', 'B', 'C', 'D', 'E'];

        const optionsHtml = q.options.map((opt, i) => `
            <label class="cbt-option ${selected === opt.id ? 'is-selected' : ''}">
                <input type="radio" name="q-${q.id}" value="${opt.id}" ${selected === opt.id ? 'checked' : ''}>
                <div class="cbt-option-letter">${letters[i] || '?'}</div>
                <div class="cbt-option-text">${escapeHtml(opt.option_text)}</div>
            </label>
        `).join('');

        area.innerHTML = `
            <div class="cbt-q-number">Question ${state.currentIndex + 1} of ${state.questions.length}</div>
            <h2 class="cbt-q-text">${escapeHtml(q.question)}</h2>
            <div class="cbt-options">${optionsHtml}</div>

            <div class="cbt-footer">
                <button type="button" class="btn btn-outline" data-prev ${state.currentIndex === 0 ? 'disabled' : ''}>
                    <i class="fa-solid fa-arrow-left"></i> Previous
                </button>
                <button type="button" class="btn btn-primary" data-next ${state.currentIndex === state.questions.length - 1 ? 'disabled' : ''}>
                    Next <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        `;

        area.querySelectorAll('.cbt-option input').forEach(input => {
            input.addEventListener('change', () => {
                state.answers[q.id] = input.value;
                area.querySelectorAll('.cbt-option').forEach(el => el.classList.remove('is-selected'));
                input.closest('.cbt-option').classList.add('is-selected');
                renderGrid();
            });
        });

        area.querySelector('[data-prev]')?.addEventListener('click', () => {
            if (state.currentIndex > 0) {
                state.currentIndex--;
                renderQuestion();
                renderGrid();
            }
        });
        area.querySelector('[data-next]')?.addEventListener('click', () => {
            if (state.currentIndex < state.questions.length - 1) {
                state.currentIndex++;
                renderQuestion();
                renderGrid();
            }
        });
    }

    // ----------------------------------------------------------
    // MOBILE SIDEBAR DRAWER
    // ----------------------------------------------------------
    function setupMobileSidebar() {
        const sidebar = document.querySelector('.cbt-sidebar');
        const backdrop = document.querySelector('[data-sidebar-backdrop]');
        const toggleBtn = document.querySelector('[data-toggle-sidebar]');
        const closeBtn = document.querySelector('[data-close-sidebar]');

        if (!sidebar) return;

        function openSidebar() {
            if (sidebar.classList.contains('is-open')) return;
            sidebar.classList.add('is-open');
            if (backdrop) backdrop.classList.add('is-visible');
            if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
            const focusTarget = closeBtn || sidebar.querySelector('button');
            if (focusTarget) focusTarget.focus({ preventScroll: true });
        }

        function closeSidebar() {
            if (!sidebar.classList.contains('is-open')) return;
            sidebar.classList.remove('is-open');
            if (backdrop) backdrop.classList.remove('is-visible');
            if (toggleBtn) {
                toggleBtn.setAttribute('aria-expanded', 'false');
                toggleBtn.focus({ preventScroll: true });
            }
            document.body.style.overflow = '';
        }

        function toggleSidebar() {
            if (sidebar.classList.contains('is-open')) closeSidebar();
            else openSidebar();
        }

        if (toggleBtn) toggleBtn.addEventListener('click', toggleSidebar);
        if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
        if (backdrop) backdrop.addEventListener('click', closeSidebar);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('is-open')) {
                closeSidebar();
            }
        });

        state.closeSidebar = closeSidebar;
    }

    // ----------------------------------------------------------
    // TIMER
    // ----------------------------------------------------------
    function startTimer() {
        const timerEl = document.querySelector('[data-timer] span');
        const timerBox = document.querySelector('[data-timer]');
        if (!timerEl || !timerBox) return;

        if (!state.quiz.time_limit_min) {
            timerEl.textContent = 'Untimed';
            return;
        }

        state.timeRemaining = state.quiz.time_limit_min * 60;

        state.timerInterval = setInterval(() => {
            state.timeRemaining--;

            if (state.timeRemaining <= 0) {
                clearInterval(state.timerInterval);
                timerEl.textContent = '00:00';
                toast('error', 'Time is up!', 'Auto-submitting your exam.');
                handleSubmit(true);
                return;
            }

            timerEl.textContent = formatTime(state.timeRemaining);

            if (state.timeRemaining < 300) {
                timerBox.classList.add('is-warning');
            }
        }, 1000);
    }

    // ----------------------------------------------------------
    // SUBMIT
    // ----------------------------------------------------------
    async function handleSubmit(force = false) {
        if (state.closeSidebar) state.closeSidebar();

        const answered = Object.keys(state.answers).length;
        const total = state.questions.length;

        if (!force && answered < total) {
            const confirm = window.confirm(`You have answered ${answered} out of ${total} questions. Are you sure you want to submit?`);
            if (!confirm) return;
        }

        const btn = document.querySelector('[data-submit-exam]');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting…';
        }

        clearInterval(state.timerInterval);

        const client = getClient();

        const rows = Object.entries(state.answers).map(([qId, optId]) => ({
            attempt_id: state.currentAttempt.id,
            question_id: qId,
            option_id: optId
        }));

        if (rows.length > 0) {
            await client.from('quiz_answers').insert(rows);
        }

        const { data, error } = await client.rpc('submit_quiz_attempt', {
            p_attempt_id: state.currentAttempt.id
        });

        if (error) {
            toast('error', 'Submission failed', error.message);
            if (btn) { btn.disabled = false; btn.innerHTML = 'Submit Exam'; }
            return;
        }

        window.location.href = `jamb-results.html?id=${state.currentAttempt.id}`;
    }

    // ----------------------------------------------------------
    // BOOT
    // ----------------------------------------------------------
    async function boot() {
        setupMobileSidebar();

        const session = await requireAuth();
        if (!session) return;
        state.session = session;

        const quizId = getQuery('id');
        if (!quizId) { window.location.href = 'index.html'; return; }

        state.quiz = await fetchExam(quizId);
        if (!state.quiz) { toast('error', 'Error', 'Exam not found.'); return; }

        document.querySelector('[data-exam-title]').textContent = state.quiz.title;
        document.querySelector('[data-candidate-name]').textContent = session.user.email;
        document.title = `${state.quiz.title} — CBT Exam`;

        state.questions = await fetchQuestions(quizId);
        if (!state.questions.length) {
            document.querySelector('[data-question-area]').innerHTML = '<p class="is-empty">No questions in this exam.</p>';
            return;
        }

        state.currentAttempt = await createAttempt();
        if (!state.currentAttempt) {
            toast('error', 'Error', 'Could not start exam attempt.');
            return;
        }

        renderQuestion();
        renderGrid();
        startTimer();

        document.querySelector('[data-submit-exam]')?.addEventListener('click', () => handleSubmit(false));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})(window, document);