(function (window, document) {
    'use strict';

    function getClient() { return window.SupabaseClient || null; }
    function escapeHtml(str) { if (!str) return ''; return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
    function getQuery(name) { return new URLSearchParams(window.location.search).get(name); }

    async function boot() {
        const client = getClient();
        
        // Auth check
        const { data: { session } } = await client.auth.getSession();
        if (!session) { window.location.href = '../academy/login.html'; return; }

        const attemptIds = getQuery('attempts')?.split(',') || [];
        if (!attemptIds.length) return;

        // 1. Fetch Attempts (Scores)
        const { data: attempts } = await client
            .from('quiz_attempts')
            .select(`
                id, score_percent, points_scored, points_total,
                quiz:quizzes(title, course:courses(title))
            `)
            .in('id', attemptIds);

        if (!attempts) return;

        // Calculate Aggregate (Sum of percentages, max 400)
        let totalScore = 0;
        attempts.forEach(att => {
            totalScore += att.score_percent;
        });

        document.querySelector('[data-total-score]').textContent = totalScore;

        // Render Breakdown
        const breakdown = document.querySelector('[data-subject-breakdown]');
        breakdown.innerHTML = attempts.map(att => `
            <div class="d-flex align-center gap-4 card p-3">
                <div class="avatar avatar-md avatar-gold">
                    <i class="fa-solid fa-book text-gold"></i>
                </div>
                <div style="flex: 1;">
                    <h4 class="mb-1">${att.quiz.course.title}</h4>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${att.score_percent}%"></div>
                    </div>
                </div>
                <div class="text-right">
                    <strong class="text-gold" style="font-size: var(--fs-2xl);">${att.score_percent}%</strong>
                    <div class="text-muted text-sm">${att.points_scored}/${att.points_total} pts</div>
                </div>
            </div>
        `).join('');

        // 2. Fetch Full Review Data (Only when button is clicked to save bandwidth)
        document.querySelector('[data-toggle-review]').addEventListener('click', async () => {
            const btn = document.querySelector('[data-toggle-review]');
            const section = document.querySelector('[data-review-section]');
            
            if (!section.hidden) {
                section.hidden = true;
                btn.innerHTML = '<i class="fa-solid fa-search"></i> Review Corrections';
                return;
            }

            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading...';
            btn.disabled = true;

            const { data: answers } = await client
                .from('quiz_answers')
                .select(`
                    is_correct, option_id,
                    question:quiz_questions(
                        id, question, explanation, order_index, 
                        quiz:quizzes(course:courses(title))
                    )
                `)
                .in('attempt_id', attemptIds);

            // Fetch all correct options for these questions to show in review
            const questionIds = answers.map(a => a.question.id);
            const { data: allOptions } = await client
                .from('quiz_options')
                .select('id, question_id, option_text, is_correct')
                .in('question_id', questionIds);

            const list = document.querySelector('[data-review-list]');
            
            // Sort by subject, then order
            answers.sort((a, b) => {
                const subA = a.question.quiz.course.title;
                const subB = b.question.quiz.course.title;
                if (subA !== subB) return subA.localeCompare(subB);
                return a.question.order_index - b.question.order_index;
            });

            list.innerHTML = answers.map((ans, idx) => {
                const q = ans.question;
                const qOptions = allOptions.filter(o => o.question_id === q.id);
                const correctOpt = qOptions.find(o => o.is_correct);
                const userOpt = qOptions.find(o => o.id === ans.option_id);

                const isCorrect = ans.is_correct;

                return `
                    <div class="card mb-3 border-left-${isCorrect ? 'success' : 'danger'}" style="border-left: 4px solid var(--${isCorrect ? 'success' : 'danger'});">
                        <div class="card-body">
                            <div class="d-flex justify-between align-center mb-3">
                                <span class="badge ${isCorrect ? 'badge-success' : 'badge-danger'}">${isCorrect ? 'Correct' : 'Incorrect'}</span>
                                <small class="text-muted">${q.quiz.course.title} · Q${q.order_index}</small>
                            </div>
                            
                            <h4 class="mb-4">${escapeHtml(q.question)}</h4>
                            
                            <div class="d-flex flex-column gap-3 mb-4">
                                <div class="p-3 rounded ${isCorrect ? 'bg-surface' : 'bg-surface'}" style="border: 1px solid var(--danger);">
                                    <small class="text-muted d-block mb-1">Your Answer:</small>
                                    <strong>${userOpt ? escapeHtml(userOpt.option_text) : 'Not Answered'}</strong>
                                </div>
                                ${!isCorrect ? `
                                    <div class="p-3 rounded bg-surface" style="border: 1px solid var(--success);">
                                        <small class="text-muted d-block mb-1">Correct Answer:</small>
                                        <strong class="text-success">${escapeHtml(correctOpt ? correctOpt.option_text : 'N/A')}</strong>
                                    </div>
                                ` : ''}
                            </div>

                            ${q.explanation ? `
                                <div class="alert alert-info mb-0">
                                    <div class="alert-content">
                                        <div class="alert-text"><strong>Explanation:</strong> ${escapeHtml(q.explanation)}</div>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            }).join('');

            section.hidden = false;
            btn.innerHTML = '<i class="fa-solid fa-times"></i> Hide Corrections';
            btn.disabled = false;
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})(window, document);