(function (window, document) {
    'use strict';

    function getClient() { return window.SupabaseClient || null; }
    
    function getQuery(name) {
        return new URLSearchParams(window.location.search).get(name);
    }

    function escapeHtml(str) {
        if (str == null) return '';
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    async function boot() {
        const client = getClient();
        
        // Auth check
        const { data: { session } } = await client.auth.getSession();
        if (!session) { window.location.href = '../academy/login.html'; return; }

        const attemptId = getQuery('id');
        if (!attemptId) return;

        // Fetch attempt summary
        const { data: attempt } = await client
            .from('quiz_attempts')
            .select('score_percent, points_scored, points_total, passed')
            .eq('id', attemptId)
            .single();

        if (!attempt) return;

        // Populate Hero
        document.querySelector('[data-result-status]').textContent = attempt.passed ? 'PASSED' : 'NOT PASSED';
        const scoreEl = document.querySelector('[data-result-score]');
        scoreEl.textContent = `${attempt.score_percent}%`;
        scoreEl.className = `quiz-result-score ${attempt.passed ? 'pass' : 'fail'}`;
        document.querySelector('[data-result-points]').textContent = `${attempt.points_scored} of ${attempt.points_total} points`;

        // Fetch detailed answers
        const { data: answers } = await client
            .from('quiz_answers')
            .select(`
                is_correct, option_id,
                question:quiz_questions(id, question, explanation, order_index)
            `)
            .eq('attempt_id', attemptId);

        const list = document.querySelector('[data-review-list]');
        
        if (!answers || !answers.length) {
            list.innerHTML = '<p class="is-empty">No answers recorded.</p>';
            return;
        }

        // Sort by question order
        answers.sort((a, b) => a.question.order_index - b.question.order_index);

        list.innerHTML = answers.map((ans, i) => {
            const correct = ans.is_correct;
            return `
                <div class="quiz-result-item ${correct ? 'correct' : 'incorrect'}">
                    <div class="quiz-result-item-header">
                        <i class="fa-solid ${correct ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
                        <span class="quiz-result-item-question">Q${i + 1}: ${escapeHtml(ans.question.question)}</span>
                    </div>
                    ${ans.question.explanation ? `
                        <p class="quiz-result-item-explanation">
                            <strong>Explanation:</strong> ${escapeHtml(ans.question.explanation)}
                        </p>
                    ` : ''}
                </div>
            `;
        }).join('');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})(window, document);