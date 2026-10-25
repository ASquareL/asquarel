(function (window, document) {
    'use strict';

    function getClient() { return window.SupabaseClient || null; }
    function toast(type, title, message) { if (window.ASLDS && window.ASLDS.Toast) window.ASLDS.Toast.show({ type, title, message }); }
    function escapeHtml(str) { if (!str) return ''; return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
    function getQuery(name) { return new URLSearchParams(window.location.search).get(name); }

    const state = {
        session: null,
        subjects: [],
        masterQuestions: [],
        currentIndex: 0,
        answers: {},
        markedForReview: new Set(), // Track which questions are marked
        timerInterval: null,
        timeRemaining: 120 * 60,
        attempts: {}
    };

    // ----------------------------------------------------------
    // DATA ASSEMBLY
    // ----------------------------------------------------------
    async function assembleExam(subjectSlugs) {
        const client = getClient();
        
        const { data: courses } = await client
            .from('courses')
            .select('id, title, slug, quizzes(id, title)')
            .in('slug', subjectSlugs);
        
        if (!courses || !courses.length) return false;

        let allQuestions = [];
        const quizIds = [];

        // Maintain the order of the slugs passed in the URL
        const orderedCourses = subjectSlugs.map(slug => courses.find(c => c.slug === slug)).filter(c => c);

        for (const course of orderedCourses) {
            const quiz = course.quizzes && course.quizzes[0];
            if (!quiz) continue;
            
            quizIds.push(quiz.id);
            state.attempts[quiz.id] = { courseTitle: course.title, attemptId: null };

            const { data: qs } = await client.from('quiz_questions').select('id, question, order_index, quiz_id').eq('quiz_id', quiz.id).order('order_index');
            
            if (qs && qs.length) {
                const qIds = qs.map(q => q.id);
                const { data: opts } = await client.from('quiz_options_safe').select('id, question_id, option_text, order_index').in('question_id', qIds).order('order_index');

                const formattedQs = qs.map(q => ({
                    ...q,
                    courseTitle: course.title,
                    options: (opts || []).filter(o => o.question_id === q.id)
                }));

                allQuestions = allQuestions.concat(formattedQs);
            }
        }

        state.masterQuestions = allQuestions;
        state.subjects = orderedCourses.map(c => c.title);
        
        for (const quizId of quizIds) {
            const { data: attempt } = await client.from('quiz_attempts').insert({
                user_id: state.session.user.id,
                quiz_id: quizId,
                course_id: courses.find(c => c.quizzes[0].id === quizId).id
            }).select('id').single();
            
            if (attempt) state.attempts[quizId].attemptId = attempt.id;
        }

        return true;
    }

    // ----------------------------------------------------------
    // RENDERERS
    // ----------------------------------------------------------
    function renderSubjectTabs() {
        const container = document.querySelector('[data-subject-tabs]');
        if (!container) return;

        const currentQ = state.masterQuestions[state.currentIndex];

        container.innerHTML = state.subjects.map(subject => {
            const isActive = currentQ.courseTitle === subject;
            return `<button type="button" class="cbt-subject-tab ${isActive ? 'is-active' : ''}" data-tab="${subject}">${subject}</button>`;
        }).join('');

        container.querySelectorAll('[data-tab]').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetSubject = btn.getAttribute('data-tab');
                // Find first question of this subject
                const targetIndex = state.masterQuestions.findIndex(q => q.courseTitle === targetSubject);
                if (targetIndex !== -1) {
                    state.currentIndex = targetIndex;
                    renderQuestion();
                    renderSidebarGrid();
                }
            });
        });
    }

    function renderSidebarGrid() {
        const sidebar = document.querySelector('[data-mock-sidebar]');
        if (!sidebar) return;

        const groups = {};
        state.masterQuestions.forEach((q, idx) => {
            if (!groups[q.courseTitle]) groups[q.courseTitle] = [];
            groups[q.courseTitle].push({ ...q, globalIndex: idx });
        });

        let html = '';
        for (const [subject, questions] of Object.entries(groups)) {
            html += `
                <div class="mb-4">
                    <h4 class="text-sm font-bold text-gold mb-2">${subject}</h4>
                    <div class="cbt-grid cbt-grid-6">
                        ${questions.map(q => {
                            const isCurrent = q.globalIndex === state.currentIndex;
                            const isAnswered = !!state.answers[q.id];
                            const isReview = state.markedForReview.has(q.id);
                            
                            let classes = 'cbt-grid-btn';
                            if (isReview) classes += ' is-review';
                            else if (isAnswered) classes += ' is-answered';
                            
                            if (isCurrent) classes += ' is-active';

                            return `<button type="button" class="${classes}" data-jump="${q.globalIndex}">${q.globalIndex + 1}</button>`;
                        }).join('')}
                    </div>
                </div>
            `;
        }
        
        sidebar.innerHTML = html;

        sidebar.querySelectorAll('[data-jump]').forEach(btn => {
            btn.addEventListener('click', () => {
                state.currentIndex = parseInt(btn.getAttribute('data-jump'), 10);
                renderQuestion();
                renderSidebarGrid();
            });
        });
    }

    function renderQuestion() {
        const area = document.querySelector('[data-question-area]');
        if (!area || !state.masterQuestions.length) return;

        const q = state.masterQuestions[state.currentIndex];
        const selected = state.answers[q.id];
        const isMarked = state.markedForReview.has(q.id);
        const letters = ['A', 'B', 'C', 'D', 'E'];

        const optionsHtml = q.options.map((opt, i) => `
            <label class="cbt-option ${selected === opt.id ? 'is-selected' : ''}" data-opt-index="${i}">
                <input type="radio" name="q-${q.id}" value="${opt.id}" ${selected === opt.id ? 'checked' : ''}>
                <div class="cbt-option-letter">${letters[i]}</div>
                <div class="cbt-option-text">${escapeHtml(opt.option_text)}</div>
            </label>
        `).join('');

        area.innerHTML = `
            <div class="d-flex justify-between align-center mb-4">
                <div class="cbt-q-number mb-0">${q.courseTitle} · Question ${state.currentIndex + 1} of ${state.masterQuestions.length}</div>
            </div>
            
            <h2 class="cbt-q-text">${escapeHtml(q.question)}</h2>
            <div class="cbt-options">${optionsHtml}</div>
            
            <button type="button" class="cbt-mark-review ${isMarked ? 'is-marked' : ''}" data-mark-review>
                <i class="fa-solid fa-flag"></i> ${isMarked ? 'Unmark Review' : 'Mark for Review'}
            </button>

            <div class="cbt-footer">
                <button type="button" class="btn btn-outline" data-prev ${state.currentIndex === 0 ? 'disabled' : ''}>
                    <i class="fa-solid fa-arrow-left"></i> Previous (P)
                </button>
                <button type="button" class="btn btn-primary" data-next ${state.currentIndex === state.masterQuestions.length - 1 ? 'disabled' : ''}>
                    Next (N) <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>
            <div class="text-center mt-3 text-muted"><small>Use keys A, B, C, D to answer. N for next, P for previous. M to mark for review.</small></div>
        `;

        // Wire clicks
        area.querySelectorAll('.cbt-option input').forEach(input => {
            input.addEventListener('change', () => {
                state.answers[q.id] = input.value;
                area.querySelectorAll('.cbt-option').forEach(el => el.classList.remove('is-selected'));
                input.closest('.cbt-option').classList.add('is-selected');
                renderSidebarGrid();
            });
        });

        area.querySelector('[data-mark-review]')?.addEventListener('click', toggleMarkForReview);
        area.querySelector('[data-prev]')?.addEventListener('click', () => navigate(-1));
        area.querySelector('[data-next]')?.addEventListener('click', () => navigate(1));
    }

    function toggleMarkForReview() {
        const q = state.masterQuestions[state.currentIndex];
        if (state.markedForReview.has(q.id)) {
            state.markedForReview.delete(q.id);
        } else {
            state.markedForReview.add(q.id);
        }
        renderQuestion();
        renderSidebarGrid();
    }

    function navigate(direction) {
        const newIndex = state.currentIndex + direction;
        if (newIndex >= 0 && newIndex < state.masterQuestions.length) {
            state.currentIndex = newIndex;
            renderQuestion();
            renderSidebarGrid();
        }
    }

    // ----------------------------------------------------------
    // KEYBOARD SHORTCUTS
    // ----------------------------------------------------------
    function setupKeyboard() {
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            const key = e.key.toLowerCase();

            if (['a', 'b', 'c', 'd'].includes(key)) {
                const index = ['a', 'b', 'c', 'd'].indexOf(key);
                const q = state.masterQuestions[state.currentIndex];
                const option = q.options[index];
                
                if (option) {
                    state.answers[q.id] = option.id;
                    const area = document.querySelector('[data-question-area]');
                    area.querySelectorAll('.cbt-option').forEach(el => el.classList.remove('is-selected'));
                    const label = area.querySelector(`.cbt-option[data-opt-index="${index}"]`);
                    if (label) {
                        label.classList.add('is-selected');
                        label.querySelector('input').checked = true;
                    }
                    renderSidebarGrid();
                }
            } else if (key === 'n') {
                navigate(1);
            } else if (key === 'p') {
                navigate(-1);
            } else if (key === 'm') {
                toggleMarkForReview();
            }
        });
    }

    // ----------------------------------------------------------
    // TIMER & SUBMIT
    // ----------------------------------------------------------
    function startTimer() {
        const timerEl = document.querySelector('[data-timer] span');
        if (!timerEl) return;

        state.timerInterval = setInterval(() => {
            state.timeRemaining--;
            if (state.timeRemaining <= 0) {
                clearInterval(state.timerInterval);
                timerEl.textContent = '00:00:00';
                toast('error', 'Time is up!', 'Auto-submitting your mock exam.');
                executeSubmit();
                return;
            }
            const h = Math.floor(state.timeRemaining / 3600).toString().padStart(2, '0');
            const m = Math.floor((state.timeRemaining % 3600) / 60).toString().padStart(2, '0');
            const s = (state.timeRemaining % 60).toString().padStart(2, '0');
            timerEl.textContent = `${h}:${m}:${s}`;
        }, 1000);
    }

    function openSubmitModal() {
        const answered = Object.keys(state.answers).length;
        const total = state.masterQuestions.length;
        const unanswered = total - answered;
        const marked = state.markedForReview.size;

        document.querySelector('[data-summary-answered]').textContent = answered;
        document.querySelector('[data-summary-unanswered]').textContent = unanswered;
        document.querySelector('[data-summary-review]').textContent = marked;

        if (window.ASLDS && window.ASLDS.Modal) {
            window.ASLDS.Modal.open();
        }
    }

    async function executeSubmit() {
        clearInterval(state.timerInterval);
        const btn = document.querySelector('[data-confirm-submit]');
        if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Grading...'; }

        const client = getClient();
        
        // Group answers by quiz_id
        const answersByQuiz = {};
        state.masterQuestions.forEach(q => {
            if (state.answers[q.id]) {
                if (!answersByQuiz[q.quiz_id]) answersByQuiz[q.quiz_id] = [];
                answersByQuiz[q.quiz_id].push({
                    attempt_id: state.attempts[q.quiz_id].attemptId,
                    question_id: q.id,
                    option_id: state.answers[q.id]
                });
            }
        });

        // Insert answers and grade each subject
        let completedAttempts = [];
        for (const [quizId, answers] of Object.entries(answersByQuiz)) {
            if (answers.length > 0) {
                await client.from('quiz_answers').insert(answers);
            }
            const attemptId = state.attempts[quizId].attemptId;
            await client.rpc('submit_quiz_attempt', { p_attempt_id: attemptId });
            completedAttempts.push(attemptId);
        }

        // Redirect to results with a comma-separated list of attempt IDs
        window.location.href = `full-results.html?attempts=${completedAttempts.join(',')}`;
    }

    function wireSubmitModal() {
        document.querySelector('[data-close-submit]')?.addEventListener('click', () => {
            if (window.ASLDS && window.ASLDS.Modal) window.ASLDS.Modal.close();
        });
        document.querySelector('[data-confirm-submit]')?.addEventListener('click', executeSubmit);
    }

    // ----------------------------------------------------------
    // BOOT
    // ----------------------------------------------------------
    async function boot() {
        const client = getClient();
        const { data: { session } } = await client.auth.getSession();
        if (!session) { window.location.href = '../academy/login.html?redirect=jamb'; return; }
        state.session = session;

        const subjectSlugs = getQuery('subjects');
        if (!subjectSlugs) { window.location.href = 'index.html'; return; }

        document.querySelector('[data-candidate-name]').textContent = session.user.email;

        const success = await assembleExam(subjectSlugs.split(','));
        if (!success || !state.masterQuestions.length) {
            toast('error', 'Exam Error', 'Could not load questions. Ensure questions are uploaded.');
            return;
        }

        // Add Subject Tabs container to DOM dynamically (if not in HTML)
        const header = document.querySelector('.cbt-header');
        if (header && !document.querySelector('[data-subject-tabs]')) {
            const tabsDiv = document.createElement('div');
            tabsDiv.className = 'cbt-subject-tabs';
            tabsDiv.setAttribute('data-subject-tabs', '');
            header.parentNode.insertBefore(tabsDiv, header.nextSibling);
        }

        renderSubjectTabs();
        renderQuestion();
        renderSidebarGrid();
        startTimer();
        setupKeyboard();
        wireSubmitModal();

        document.querySelector('[data-submit-exam]')?.addEventListener('click', openSubmitModal);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})(window, document);