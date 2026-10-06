// ============================================================
// A SQUARE L INNOVATE — Admin Dashboard Page
// ============================================================

(function (window, document) {
    'use strict';

    async function boot() {
        const Admin = window.ASLDS.Admin;
        if (!Admin) {
            console.error('[admin-index] ASLDS.Admin not loaded');
            return;
        }

        const auth = await Admin.requireAdmin();
        if (!auth) return;

        Admin.renderAdminIdentity(auth.profile);
        Admin.wireSignOut();

        const [courses, students, enrollments] = await Promise.all([
            Admin.fetchCourses(),
            Admin.countStudents(),
            Admin.countEnrollments()
        ]);

        const totalLessons = courses.reduce((sum, c) => sum + (c.lessons_count || 0), 0);

        Admin.setText('[data-stat="students"]', students);
        Admin.setText('[data-stat="courses"]', courses.length);
        Admin.setText('[data-stat="lessons"]', totalLessons);
        Admin.setText('[data-stat="enrollments"]', enrollments);

        const list = document.querySelector('[data-list="courses"]');
        if (!list) return;

        if (!courses.length) {
            list.innerHTML = '<p class="is-empty">No courses yet.</p>';
            return;
        }

        list.innerHTML = courses.map(c => `
            <article class="card">
                <div class="card-body">
                    <div class="d-flex justify-between align-center mb-3">
                        <div class="avatar avatar-md avatar-gold">
                            <i class="${Admin.escapeHtml(c.icon || 'fa-solid fa-book')} fa-2x text-gold"></i>
                        </div>
                        <span class="badge ${c.published ? 'badge-success' : ''}">${c.published ? 'Published' : 'Draft'}</span>
                    </div>
                    <h3 class="mb-2">${Admin.escapeHtml(c.title)}</h3>
                    <p class="mb-3">${Admin.escapeHtml(c.tagline || '')}</p>
                    <div class="d-flex justify-between align-center">
                        <small>${c.lessons_count || 0} lessons</small>
                        <a href="lessons.html?course=${encodeURIComponent(c.slug)}" class="btn btn-primary btn-sm">
                            Manage <i class="fa-solid fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </article>
        `).join('');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})(window, document);