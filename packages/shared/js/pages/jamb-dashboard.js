(function (window, document) {
    'use strict';

    function getClient() { return window.SupabaseClient || null; }
    
    function toast(type, title, message) {
        if (window.ASLDS && window.ASLDS.Toast) window.ASLDS.Toast.show({ type, title, message });
    }

    const state = {
        session: null,
        userPlan: 'free',
        subjects: [],
        selectedSlugs: new Set(['jamb-english']),
        briefingData: null,
        searchQuery: ''
    };

    // REPLACE THIS WITH YOUR ACTUAL PAYSTACK PUBLIC KEY LATER
    const PAYSTACK_PUBLIC_KEY = 'pk_test_YOUR_PUBLIC_KEY_HERE'; 
    const PRO_PLAN_PRICE = 500000; // 5,000 NGN (Paystack uses kobo)

    async function loadHistory() {
        const client = getClient();
        
        // Add .order to fetch newest first
        const { data: attempts } = await client
            .from('quiz_attempts')
            .select('id, score_percent, started_at, quiz:quizzes(course:courses(slug, title))')
            .eq('user_id', state.session.user.id)
            .not('submitted_at', 'is', null)
            .order('started_at', { ascending: false });

        const jambAttempts = (attempts || []).filter(a => a.quiz?.course?.slug?.startsWith('jamb-'));

        if (!jambAttempts.length) {
            const widget = document.querySelector('[data-history-widget]');
            const divider = document.querySelector('[data-history-divider]');
            if (widget) widget.hidden = true;
            if (divider) divider.hidden = true;
            return;
        }

        const sessions = {};
        jambAttempts.forEach(a => {
            const dateKey = new Date(a.started_at).toISOString().slice(0, 16);
            if (!sessions[dateKey]) {
                sessions[dateKey] = {
                    date: new Date(a.started_at),
                    attempts: [],
                    totalScore: 0
                };
            }
            sessions[dateKey].attempts.push(a);
            sessions[dateKey].totalScore += a.score_percent;
        });

        const sessionList = Object.values(sessions).sort((a, b) => b.date - a.date);
        let bestScore = 0;
        
        // Calculate best score based on actual subjects taken (e.g., 4 subjects * 100 = 400)
        sessionList.forEach(s => {
            const maxScore = s.attempts.length * 100;
            if (s.totalScore > bestScore) bestScore = s.totalScore;
        });

        const avgScore = Math.round(sessionList.reduce((sum, s) => sum + s.totalScore, 0) / sessionList.length);

        // Update Top Stats
        const setTxt = (sel, val) => { const el = document.querySelector(sel); if (el) el.textContent = val; };
        setTxt('[data-stat="exams-taken"]', sessionList.length);
        setTxt('[data-stat="avg-score"]', avgScore);
        setTxt('[data-stat="best-score"]', bestScore);

        // Render History Table
        const widget = document.querySelector('[data-history-widget]');
        const divider = document.querySelector('[data-history-divider]');
        const tbody = document.querySelector('[data-history-tbody]');

        if (widget && tbody) {
            widget.hidden = false;
            if (divider) divider.hidden = false;

            // SLICE: Only show the 5 most recent sessions
            const recentSessions = sessionList.slice(0, 5);

            tbody.innerHTML = recentSessions.map(session => {
                const subjects = session.attempts.map(a => a.quiz.course.title.replace('JAMB ', '')).join(', ');
                const attemptIds = session.attempts.map(a => a.id).join(',');
                
                const dateStr = session.date.toLocaleDateString('en-US', { 
                    month: 'short', day: 'numeric', year: 'numeric' 
                });

                // Dynamic Score Denominator (100 per subject taken)
                const maxScore = session.attempts.length * 100;

                return `
                    <tr>
                        <td><small>${dateStr}</small></td>
                        <td><small>${subjects}</small></td>
                        <td>
                            <strong class="text-gold" style="font-size: var(--fs-lg);">${session.totalScore}</strong>
                            <span class="text-muted" style="font-size: var(--fs-xs);">/ ${maxScore}</span>
                        </td>
                        <td>
                            <a href="full-results.html?attempts=${attemptIds}" class="btn btn-outline btn-sm">
                                <i class="fa-solid fa-magnifying-glass"></i> Review
                            </a>
                        </td>
                    </tr>
                `;
            }).join('');
        }
    }

    function renderSubjects() {
        const container = document.querySelector('[data-subject-selection]');
        if (!container) return;

        container.innerHTML = '';
        const filtered = state.subjects.filter(sub => sub.title.toLowerCase().includes(state.searchQuery.toLowerCase()));

        if (!filtered.length) {
            container.innerHTML = '<p class="is-empty" style="grid-column: 1 / -1;">No subjects match your search.</p>';
            return;
        }

        container.innerHTML = filtered.map(sub => {
            const isEnglish = sub.slug === 'jamb-english';
            const isSelected = state.selectedSlugs.has(sub.slug);
            const availableExams = (sub.quizzes || []).sort((a, b) => (b.year || 0) - (a.year || 0));

            let classes = 'subject-select-card';
            if (isEnglish) classes += ' is-locked';
            else if (isSelected) classes += ' is-selected';

            let practiceUI = '';
            if (availableExams.length > 0) {
                practiceUI = `
                    <div class="form-group mt-3 mb-0">
                        <select class="form-control form-control-sm" data-practice-select="${sub.slug}">
                            ${availableExams.map(e => `<option value="${e.id}">${e.year ? e.year + ' UTME' : e.title}</option>`).join('')}
                        </select>
                    </div>
                    <button class="btn btn-outline btn-sm btn-block mt-2" data-start-practice="${sub.slug}">
                        Practice Subject <i class="fa-solid fa-arrow-right"></i>
                    </button>
                `;
            } else {
                practiceUI = `<button class="btn btn-outline btn-sm btn-block mt-3" disabled>No exams uploaded</button>`;
            }

            return `
                <div class="${classes}" data-slug="${sub.slug}">
                    <div class="d-flex justify-between align-center mb-3">
                        <div class="subject-select-indicator"><i class="fa-solid fa-check"></i></div>
                        ${isEnglish ? '<span class="badge badge-solid badge-gold badge-sm">Compulsory</span>' : ''}
                    </div>
                    <h3 class="mb-1 text-white">${sub.title}</h3>
                    <p class="mb-0 text-muted text-sm">${sub.tagline || ''}</p>
                    ${practiceUI}
                </div>
            `;
        }).join('');

        container.querySelectorAll('.subject-select-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('select') || e.target.closest('[data-start-practice]')) return;
                e.preventDefault(); 
                const slug = card.getAttribute('data-slug');
                if (slug === 'jamb-english') return;

                if (state.selectedSlugs.has(slug)) {
                    state.selectedSlugs.delete(slug);
                } else {
                    if (state.selectedSlugs.size >= 4) {
                        toast('warning', 'Limit Reached', 'You can only select exactly 4 subjects.');
                        return;
                    }
                    state.selectedSlugs.add(slug);
                }
                updateSelectionUI();
            });
        });

        container.querySelectorAll('[data-start-practice]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const slug = btn.getAttribute('data-start-practice');
                const select = container.querySelector(`[data-practice-select="${slug}"]`);
                if (select && select.value) window.location.href = `exam.html?id=${select.value}`;
            });
        });

        updateSelectionUI();
    }

    function updateSelectionUI() {
        document.querySelectorAll('.subject-select-card').forEach(card => {
            const slug = card.getAttribute('data-slug');
            if (slug === 'jamb-english') return;

            if (state.selectedSlugs.has(slug)) card.classList.add('is-selected');
            else card.classList.remove('is-selected');
        });

        const btn = document.querySelector('[data-prepare-mock]');
        const error = document.querySelector('[data-selection-error]');
        
        if (state.selectedSlugs.size === 4) {
            btn.disabled = false;
            if (state.userPlan === 'free') {
                btn.className = 'btn btn-warning btn-lg'; // Yellow to highlight upgrade
                btn.innerHTML = 'Upgrade to Pro to Start Mock <i class="fa-solid fa-lock"></i>';
            } else {
                btn.className = 'btn btn-primary btn-lg';
                btn.innerHTML = 'Prepare Full Mock <i class="fa-solid fa-arrow-right"></i>';
            }
            if (error) error.hidden = true;
        } else {
            btn.disabled = true;
            btn.className = 'btn btn-primary btn-lg';
            btn.innerHTML = 'Prepare Full Mock <i class="fa-solid fa-arrow-right"></i>';
            if (error) error.hidden = false;
        }
    }

    function initiatePaystack() {
        if (typeof PaystackPop === 'undefined') {
            toast('error', 'Payment Error', 'Paystack library not loaded.');
            return;
        }

        const handler = PaystackPop.setup({
            key: PAYSTACK_PUBLIC_KEY, 
            email: state.session.user.email,
            amount: PRO_PLAN_PRICE, 
            currency: 'NGN',
            callback: function(response) {
                toast('info', 'Payment successful', 'Upgrading account...');
                const client = getClient();
                
                // Note: In production, verify this reference via backend before upgrading!
                client.from('profiles')
                    .update({ plan: 'pro' })
                    .eq('id', state.session.user.id)
                    .then(({ error }) => {
                        if (error) {
                            toast('error', 'Upgrade Failed', error.message);
                            return;
                        }
                        state.userPlan = 'pro';
                        toast('success', 'Upgraded!', 'You now have Pro access.');
                        updateSelectionUI();
                        setTimeout(() => handlePrepareMock(), 1000); // Auto-start mock
                    });
            },
            onClose: function() {
                toast('warning', 'Payment Cancelled', 'You need Pro to take a Full Mock.');
            }
        });
        handler.openIframe();
    }

    async function handlePrepareMock() {
        if (state.userPlan === 'free') {
            initiatePaystack();
            return;
        }

        const client = getClient();
        const btn = document.querySelector('[data-prepare-mock]');
        const original = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Checking availability...';

        const { data: courses } = await client
            .from('courses')
            .select('id, title, slug, quizzes(id, year, quiz_questions(id))')
            .in('slug', Array.from(state.selectedSlugs));

        let totalQuestions = 0;
        let emptySubjects = [];
        let quizzesToPass = [];

        courses.forEach(c => {
            const sortedQuizzes = (c.quizzes || []).sort((a, b) => (b.year || 0) - (a.year || 0));
            const latestQuiz = sortedQuizzes[0];
            const qCount = latestQuiz && latestQuiz.quiz_questions ? latestQuiz.quiz_questions.length : 0;
            
            if (!latestQuiz || qCount === 0) {
                emptySubjects.push(c.title);
            } else {
                totalQuestions += qCount;
                quizzesToPass.push({ slug: c.slug, quizId: latestQuiz.id, title: c.title });
            }
        });

        btn.disabled = false;
        btn.innerHTML = original;

        if (emptySubjects.length > 0) {
            toast('error', 'Missing Questions', `${emptySubjects.join(', ')} has no questions uploaded yet.`);
            return;
        }

        state.briefingData = {
            subjects: quizzesToPass.map(q => q.slug), 
            quizIds: quizzesToPass.map(q => q.quizId),
            titles: quizzesToPass.map(q => q.title),
            totalQuestions: totalQuestions
        };

        const list = document.querySelector('[data-briefing-subjects]');
        list.innerHTML = quizzesToPass.map(q => `
            <li class="d-flex justify-between align-items-center">
                <span>${q.title}</span>
                ${q.slug === 'jamb-english' ? '<i class="fa-solid fa-lock text-gold text-sm"></i>' : ''}
            </li>
        `).join('');

        document.querySelector('[data-briefing-questions]').textContent = totalQuestions;
        if (window.ASLDS && window.ASLDS.Modal) window.ASLDS.Modal.open();
    }

    function wireModal() {
        document.querySelector('[data-close-modal]')?.addEventListener('click', () => {
            if (window.ASLDS && window.ASLDS.Modal) window.ASLDS.Modal.close();
        });

        document.querySelector('[data-start-exam]')?.addEventListener('click', () => {
            if (state.briefingData) {
                const slugs = state.briefingData.subjects.join(',');
                window.location.href = `full-mock.html?subjects=${slugs}`;
            }
        });
    }

    async function boot() {
        const client = getClient();
        const { data: { session } } = await client.auth.getSession();
        if (!session) { window.location.href = '../academy/login.html?redirect=jamb'; return; }
        state.session = session;

        // Fetch User Plan
        const { data: profile } = await client.from('profiles').select('plan').eq('id', session.user.id).single();
        if (profile && profile.plan) state.userPlan = profile.plan;

        const { data: subjects } = await client
            .from('courses')
            .select('id, slug, title, tagline, icon, quizzes(id, title, year)')
            .like('slug', 'jamb-%')
            .order('title');
        
        state.subjects = subjects || [];

        await loadHistory();
        renderSubjects();
        wireModal();

        const searchInput = document.querySelector('[data-subject-search]');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                state.searchQuery = e.target.value;
                renderSubjects();
            });
        }

        document.querySelector('[data-prepare-mock]')?.addEventListener('click', handlePrepareMock);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})(window, document);