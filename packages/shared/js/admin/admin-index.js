// ============================================================
// A SQUARE L INNOVATE — Admin Dashboard
// ============================================================

(function (window, document) {
    'use strict';

    // ---------- HELPERS ----------

    function formatRelative(iso) {
        if (!iso) return '';
        const diff = Date.now() - new Date(iso).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'just now';
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        const days = Math.floor(hrs / 24);
        if (days < 7) return `${days}d ago`;
        return new Date(iso).toLocaleDateString();
    }

    function initials(name) {
        if (!name) return '??';
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    // ---------- ACTIVITY ICONS + TEXT ----------

    const ACTIVITY_ICONS = {
        course_enrolled: 'fa-flag',
        lesson_started: 'fa-play',
        lesson_completed: 'fa-check',
        course_completed: 'fa-trophy',
        certificate_earned: 'fa-certificate',
        quiz_passed: 'fa-circle-check',
        quiz_failed: 'fa-circle-xmark',
        thread_created: 'fa-comment',
        reply_posted: 'fa-reply'
    };

    function activityText(item) {
        const name = item.user?.full_name || 'Someone';
        switch (item.type) {
            case 'course_enrolled': return `${name} enrolled in ${item.course?.title || 'a course'}`;
            case 'lesson_completed': return `${name} completed ${item.lesson?.title || 'a lesson'}`;
            case 'course_completed': return `${name} finished ${item.course?.title || 'a course'}`;
            case 'certificate_earned': return `${name} earned a certificate`;
            case 'quiz_passed': return `${name} passed a quiz (${item.metadata?.score_percent || 0}%)`;
            case 'quiz_failed': return `${name} attempted a quiz (${item.metadata?.score_percent || 0}%)`;
            case 'thread_created': return `${name} posted a discussion thread`;
            case 'reply_posted': return `${name} replied to a discussion`;
            default: return `${name} did something`;
        }
    }

    // ---------- RENDERERS ----------

    function renderRecentSignups(students) {
        const el = document.querySelector('[data-list="recent-signups"]');
        const empty = document.querySelector('[data-empty="recent-signups"]');
        if (!el) return;

        if (!students.length) {
            if (empty) empty.hidden = false;
            el.innerHTML = '';
            return;
        }
        if (empty) empty.hidden = true;

        el.innerHTML = students.map(s => `
            <div class="list-row">
                <div class="avatar avatar-sm avatar-gold">
                    <span class="avatar-initials">${initials(s.full_name)}</span>
                </div>
                <div class="list-row-body">
                    <strong>${window.ASLDS.Admin.escapeHtml(s.full_name)}</strong>
                    <small class="text-muted">${window.ASLDS.Admin.escapeHtml(s.reg_number)}</small>
                </div>
                <span class="list-row-time">${formatRelative(s.created_at)}</span>
            </div>
        `).join('');
    }

    function renderRecentEnrollments(enrollments) {
        const el = document.querySelector('[data-list="recent-enrollments"]');
        const empty = document.querySelector('[data-empty="recent-enrollments"]');
        if (!el) return;

        if (!enrollments.length) {
            if (empty) empty.hidden = false;
            el.innerHTML = '';
            return;
        }
        if (empty) empty.hidden = true;

        el.innerHTML = enrollments.map(e => {
            const icon = e.course?.icon || 'fa-solid fa-book';
            return `
                <div class="list-row">
                    <div class="avatar avatar-sm avatar-gold">
                        <i class="${window.ASLDS.Admin.escapeHtml(icon)}"></i>
                    </div>
                    <div class="list-row-body">
                        <strong>${window.ASLDS.Admin.escapeHtml(e.user?.full_name || 'Student')}</strong>
                        <small class="text-muted">joined ${window.ASLDS.Admin.escapeHtml(e.course?.title || 'a course')}</small>
                    </div>
                    <span class="list-row-time">${formatRelative(e.enrolled_at)}</span>
                </div>`;
        }).join('');
    }

    function renderRecentActivity(items) {
        const el = document.querySelector('[data-list="recent-activity"]');
        const empty = document.querySelector('[data-empty="recent-activity"]');
        if (!el) return;

        if (!items.length) {
            if (empty) empty.hidden = false;
            el.innerHTML = '';
            return;
        }
        if (empty) empty.hidden = true;

        el.innerHTML = items.map(item => `
            <div class="list-row">
                <div class="avatar avatar-sm avatar-gold">
                    <i class="fa-solid ${ACTIVITY_ICONS[item.type] || 'fa-circle'}"></i>
                </div>
                <div class="list-row-body">
                    <div>${window.ASLDS.Admin.escapeHtml(activityText(item))}</div>
                    <small class="text-muted">${formatRelative(item.created_at)}</small>
                </div>
            </div>
        `).join('');
    }

    function renderContentHealth(health) {
        const el = document.querySelector('[data-content-health]');
        if (!el) return;

        const contentPct = health.total ? Math.round(100 * health.withContent / health.total) : 0;
        const videoPct = health.total ? Math.round(100 * health.withVideo / health.total) : 0;

        el.innerHTML = `
            <div class="mb-4">
                <div class="d-flex justify-between align-center mb-2">
                    <span class="text-muted">Lesson content</span>
                    <span class="text-gold fw-bold">${health.withContent}/${health.total}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${contentPct}%"></div>
                </div>
                <small class="text-muted d-block mt-2">${contentPct}% of lessons have written content</small>
            </div>

            <div>
                <div class="d-flex justify-between align-center mb-2">
                    <span class="text-muted">Video coverage</span>
                    <span class="text-gold fw-bold">${health.withVideo}/${health.total}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${videoPct}%"></div>
                </div>
                <small class="text-muted d-block mt-2">${videoPct}% of lessons have videos</small>
            </div>
        `;
    }

    function renderCourses(courses) {
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
                            <i class="${window.ASLDS.Admin.escapeHtml(c.icon || 'fa-solid fa-book')} fa-2x text-gold"></i>
                        </div>
                        <span class="badge ${c.published ? 'badge-success' : ''}">${c.published ? 'Published' : 'Draft'}</span>
                    </div>
                    <h3 class="mb-2">${window.ASLDS.Admin.escapeHtml(c.title)}</h3>
                    <p class="mb-3">${window.ASLDS.Admin.escapeHtml(c.tagline || '')}</p>
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

    // ---------- BOOT ----------

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

        const [courses, students, enrollments, certs, signups, enrolls, activity, health] = await Promise.all([
            Admin.fetchCourses(),
            Admin.countStudents(),
            Admin.countEnrollments(),
            Admin.fetchTotalCertificates(),
            Admin.fetchRecentSignups(8),
            Admin.fetchRecentEnrollments(8),
            Admin.fetchRecentActivity(10),
            Admin.fetchContentHealth()
        ]);

        const totalLessons = courses.reduce((sum, c) => sum + (c.lessons_count || 0), 0);

        Admin.setText('[data-stat="students"]', students);
        Admin.setText('[data-stat="courses"]', courses.length);
        Admin.setText('[data-stat="lessons"]', totalLessons);
        Admin.setText('[data-stat="enrollments"]', enrollments);
        Admin.setText('[data-stat="certificates"]', certs);

        renderRecentSignups(signups);
        renderRecentEnrollments(enrolls);
        renderRecentActivity(activity);
        renderContentHealth(health);
        renderCourses(courses);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})(window, document);