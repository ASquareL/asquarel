// ============================================================
// A SQUARE L INNOVATE — Admin JAMB Bulk Uploader
// Parses JSON and inserts questions in chunks to prevent timeouts
// ============================================================

(function (window, document) {
    'use strict';

    function getClient() { return window.SupabaseClient || null; }

    function toast(type, title, message) {
        if (window.ASLDS && window.ASLDS.Toast) {
            window.ASLDS.Toast.show({ type, title, message });
        }
    }

    async function loadExams() {
        const client = getClient();
        const { data, error } = await client
            .from('quizzes')
            .select('id, title, year, course:courses(title, slug)')
            .order('year', { ascending: false });
        
        const select = document.querySelector('[data-quiz-select]');
        if (!select) return;

        // Filter to only JAMB exams
        const jambExams = (data || []).filter(q => q.course?.slug?.startsWith('jamb-'));

        if (error || !jambExams.length) {
            select.innerHTML = '<option value="">No JAMB exams found</option>';
            return;
        }

        select.innerHTML = '<option value="">Select an exam...</option>' + 
            jambExams.map(q => `<option value="${q.id}">${q.course?.title} — ${q.year || 'No Year'} (${q.title})</option>`).join('');
    }

    function setStatus(html, type = 'info') {
        const el = document.querySelector('[data-upload-status]');
        if (!el) return;
        
        el.className = ''; // remove is-empty
        if (type === 'loading') {
            el.innerHTML = `<div class="text-center py-4"><i class="fa-solid fa-spinner fa-spin fa-2x text-gold"></i><p class="mt-3">Processing...</p></div>`;
        } else if (type === 'success') {
            el.innerHTML = `<div class="alert alert-success"><div class="alert-content"><div class="alert-text">${html}</div></div></div>`;
        } else if (type === 'error') {
            el.innerHTML = `<div class="alert alert-danger"><div class="alert-content"><div class="alert-text">${html}</div></div></div>`;
        } else {
            el.innerHTML = html;
        }
    }

    async function handleUpload() {
        const client = getClient();
        const quizId = document.querySelector('[data-quiz-select]').value;
        const rawJson = document.querySelector('[data-json-input]').value.trim();
        const btn = document.querySelector('[data-upload-btn]');

        if (!quizId) { toast('error', 'Missing Exam', 'Please select a target exam.'); return; }
        if (!rawJson) { toast('error', 'Missing Data', 'Please paste the JSON data.'); return; }

        let questionsArray;
        try {
            questionsArray = JSON.parse(rawJson);
            if (!Array.isArray(questionsArray)) throw new Error("JSON must be an array []");
        } catch (err) {
            toast('error', 'Invalid JSON', err.message);
            setStatus('Failed to parse JSON. Check the syntax.', 'error');
            return;
        }

        // Get current max order_index for this quiz
        const { data: maxOrder } = await client
            .from('quiz_questions')
            .select('order_index')
            .eq('quiz_id', quizId)
            .order('order_index', { ascending: false })
            .limit(1);

        let startOrder = (maxOrder && maxOrder.length > 0) ? maxOrder[0].order_index + 1 : 1;

        btn.disabled = true;
        setStatus(`Starting upload of ${questionsArray.length} questions...`, 'loading');

        const CHUNK_SIZE = 20;
        let successCount = 0;

        try {
            for (let i = 0; i < questionsArray.length; i += CHUNK_SIZE) {
                const chunk = questionsArray.slice(i, i + CHUNK_SIZE);
                setStatus(`Uploading question ${i + 1} to ${Math.min(i + CHUNK_SIZE, questionsArray.length)}...`, 'loading');

                // 1. Insert Questions
                const qRows = chunk.map((q, idx) => ({
                    quiz_id: quizId,
                    question: q.question,
                    explanation: q.explanation || null,
                    order_index: startOrder + i + idx
                }));

                const { data: insertedQs, error: qErr } = await client
                    .from('quiz_questions')
                    .insert(qRows)
                    .select();

                if (qErr) throw new Error(qErr.message);

                // 2. Map returned Question IDs to Options
                const optRows = [];
                insertedQs.forEach((dbQ, index) => {
                    const originalQ = chunk[index];
                    if (originalQ.options && Array.isArray(originalQ.options)) {
                        originalQ.options.forEach((opt, optIdx) => {
                            optRows.push({
                                question_id: dbQ.id,
                                option_text: opt.text,
                                is_correct: opt.is_correct === true,
                                order_index: optIdx + 1
                            });
                        });
                    }
                });

                // 3. Insert Options
                const { error: optErr } = await client.from('quiz_options').insert(optRows);
                if (optErr) throw new Error(optErr.message);

                successCount += chunk.length;
            }

            setStatus(`Successfully uploaded ${successCount} questions.`, 'success');
            toast('success', 'Upload Complete', `${successCount} questions added to the exam.`);
            document.querySelector('[data-json-input]').value = ''; // Clear textarea

        } catch (err) {
            console.error(err);
            setStatus(`Error after ${successCount} questions: ${err.message}`, 'error');
            toast('error', 'Upload failed', err.message);
        } finally {
            btn.disabled = false;
        }
    }

    async function boot() {
        const Admin = window.ASLDS.Admin;
        if (!Admin) return;

        const auth = await Admin.requireAdmin();
        if (!auth) return;

        Admin.renderAdminIdentity(auth.profile);
        Admin.wireSignOut();

        await loadExams();

        document.querySelector('[data-upload-btn]')?.addEventListener('click', handleUpload);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})(window, document);