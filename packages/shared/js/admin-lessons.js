// ============================================================
// A SQUARE L INNOVATE — Admin Lessons List
// URL: lessons.html?course={slug}
// ============================================================

(function (window, document) {
    'use strict';

    async function fetchCourseBySlug(slug) {
        const client = window.SupabaseClient;
        const { data, error } = await client
            .from('courses')
            .select('id, slug, title, lessons_count')
            .eq('slug', slug)
            .single();
        if (error) { console.error('[admin-lessons] course', error); return null; }
        return data;
    }

    function renderLessons(course, lessons) {
        const Admin = window.ASLDS.Admin;

        Admin.setText('[data-course-title]', course.title);
        Admin.setText('[data-lesson-count]', `${lessons.length} lessons`);

        const tbody = document.querySelector('[data-lessons-tbody]');
        if (!tbody) return;

        if (!lessons.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="is-empty">No lessons yet for this course.</td>
                </tr>`;
            return;
        }

        tbody.innerHTML = lessons.map(l => {
            const hasVideo = !!l.video_id;
            const isPublished = !!l.published;
            return `
                <tr>
                    <td><strong>${String(l.number).padStart(2, '0')}</strong></td>
                    <td>${Admin.escapeHtml(l.title)}</td>
                    <td><small>${Admin.escapeHtml(l.module?.title || '—')}</small></td>
                    <td>${l.duration_minutes} min</td>
                    <td>
                        <span class="badge ${hasVideo ? 'badge-success' : ''}">
                            ${hasVideo ? 'Yes' : 'No'}
                        </span>
                    </td>
                    <td>
                        <span class="badge ${isPublished ? 'badge-success' : 'badge-warning'}">
                            ${isPublished ? 'Published' : 'Draft'}
                        </span>
                    </td>
                    <td>
                        <a href="lesson-edit.html?id=${encodeURIComponent(l.id)}"
                           class="btn btn-outline btn-sm">
                            <i class="fa-solid fa-pen"></i> Edit
                        </a>
                    </td>
                </tr>`;
        }).join('');
    }

    async function boot() {
        const Admin = window.ASLDS.Admin;

        const auth = await Admin.requireAdmin();
        if (!auth) return;

        Admin.renderAdminIdentity(auth.profile);
        Admin.wireSignOut();

        const slug = Admin.getQueryParam('course');
        if (!slug) {
            window.location.href = 'index.html';
            return;
        }

        const course = await fetchCourseBySlug(slug);
        if (!course) {
            const titleEl = document.querySelector('[data-course-title]');
            if (titleEl) titleEl.textContent = 'Course not found';
            return;
        }

        const backLink = document.querySelector('[data-back-link]');
        if (backLink) backLink.href = 'index.html';

        const lessons = await Admin.fetchLessonsByCourse(course.id);
        renderLessons(course, lessons);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})(window, document);