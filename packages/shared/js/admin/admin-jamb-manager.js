(function (window, document) {
    'use strict';

    function getClient() { return window.SupabaseClient || null; }
    function toast(type, title, msg) { if (window.ASLDS && window.ASLDS.Toast) window.ASLDS.Toast.show({ type, title, message: msg }); }

    async function loadSubjects() {
        const client = getClient();
        const { data } = await client.from('courses').select('id, title').like('slug', 'jamb-%').order('title');
        
        const select = document.querySelector('[data-subject-select]');
        if (!select) return;

        if (!data || !data.length) {
            select.innerHTML = '<option value="">No JAMB subjects found</option>';
            return;
        }

        select.innerHTML = '<option value="">Select subject...</option>' + data.map(c => `<option value="${c.id}">${c.title}</option>`).join('');
    }

    async function loadExams() {
        const client = getClient();
        const { data } = await client
            .from('quizzes')
            .select('id, year, title, course:courses(title, slug), quiz_questions(count)')
            .order('year', { ascending: false });

        const jambExams = (data || []).filter(q => q.course?.slug?.startsWith('jamb-'));

        const tbody = document.querySelector('[data-exams-tbody]');
        if (!tbody) return;

        if (!jambExams.length) {
            tbody.innerHTML = '<tr><td colspan="4" class="is-empty">No exams created yet.</td></tr>';
            return;
        }

        tbody.innerHTML = jambExams.map(q => {
            const count = q.quiz_questions && q.quiz_questions[0] ? q.quiz_questions[0].count : 0;
            return `
                <tr>
                    <td><strong>${q.course.title.replace('JAMB ', '')}</strong></td>
                    <td><span class="badge badge-sm">${q.year || 'N/A'}</span></td>
                    <td>${count}</td>
                    <td>
                        <a href="jamb-upload.html" class="btn btn-outline btn-sm">Upload</a>
                        <button class="btn btn-danger btn-sm" data-delete="${q.id}"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `;
        }).join('');

        // Wire delete buttons
        tbody.querySelectorAll('[data-delete]').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (!confirm('Delete this exam and all its questions?')) return;
                const id = btn.getAttribute('data-delete');
                await client.from('quizzes').delete().eq('id', id);
                toast('success', 'Deleted', 'Exam removed.');
                loadExams();
            });
        });
    }

    async function handleCreate(e) {
        e.preventDefault();
        const client = getClient();
        const btn = e.target.querySelector('button[type="submit"]');
        btn.disabled = true;

        const courseId = document.querySelector('[data-subject-select]').value;
        const year = parseInt(document.querySelector('[data-year-input]').value, 10);
        const timeLimit = parseInt(document.querySelector('[data-time-input]').value, 10);

        const title = `JAMB ${year} Mock`;

        const { error } = await client.from('quizzes').insert({
            course_id: courseId,
            title: title,
            year: year,
            time_limit_min: timeLimit,
            published: true,
            pass_threshold: 50
        });

        btn.disabled = false;

        if (error) {
            toast('error', 'Failed', error.message);
            return;
        }

        toast('success', 'Created', `${title} is ready for upload.`);
        document.querySelector('[data-year-input]').value = '';
        loadExams();
    }

    async function boot() {
        const Admin = window.ASLDS.Admin;
        if (!Admin) return;
        const auth = await Admin.requireAdmin();
        if (!auth) return;
        Admin.renderAdminIdentity(auth.profile);
        Admin.wireSignOut();

        await loadSubjects();
        await loadExams();
        document.querySelector('[data-create-form]')?.addEventListener('submit', handleCreate);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})(window, document);