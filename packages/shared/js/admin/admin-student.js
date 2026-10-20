// ============================================================
// A SQUARE L INNOVATE — Admin Student Detail
// URL: student.html?id={uuid}
// ============================================================

(function (window, document) {
    'use strict';

    function getQuery(name) {
        return new URLSearchParams(window.location.search).get(name);
    }

    function formatDate(iso) {
        if (!iso) return '—';
        return new Date(iso).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    }

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
        switch (item.type) {
            case 'course_enrolled': return `Enrolled in ${item.course?.title || 'a course'}`;
            case 'lesson_completed': return `Completed ${item.lesson?.title || 'a lesson'}`;
            case 'course_completed': return `Finished ${item.course?.title || 'a course'}`;
            case 'certificate_earned': return `Earned a certificate`;
            case 'quiz_passed': return `Passed a quiz (${item.metadata?.score_percent || 0}%)`;
            case 'quiz_failed': return `Attempted a quiz (${item.metadata?.score_percent || 0}%)`;
            case 'thread_created': return `Posted a discussion thread`;
            case 'reply_posted': return `Replied to a discussion`;
            default: return item.type;
        }
    }

    function showState(name) {
        const states = {
            loading: document.querySelector('[data-state="loading"]'),
            notfound: document.querySelector('[data-state="notfound"]'),
            view: document.querySelector('[data-state="view"]')
        };
        Object.entries(states).forEach(([key, el]) => {
            if (!el) return;
            el.hidden = key !== name;
        });
    }

    // ----------------------------------------------------------
    // RENDERERS
    // ----------------------------------------------------------

    function renderProfile(profile, stats) {
        window.ASLDS.Admin.setText('[data-student-name]', profile.full_name);
        window.ASLDS.Admin.setText('[data-student-initials]', initials(profile.full_name));
        window.ASLDS.Admin.setText('[data-student-reg]', profile.reg_number);
        window.ASLDS.Admin.setText('[data-student-email]', profile.email);
        window.ASLDS.Admin.setText('[data-student-phone]', profile.phone || 'Not set');
        window.ASLDS.Admin.setText('[data-student-location]', profile.location || 'Not set');
        window.ASLDS.Admin.setText('[data-student-joined]', formatDate(profile.created_at));
        window.ASLDS.Admin.setText('[data-student-level]', 'Level ' + profile.level);

        window.ASLDS.Admin.setText('[data-stat="courses-enrolled"]', stats.courses_enrolled || 0);
        window.ASLDS.Admin.setText('[data-stat="lessons-completed"]', stats.lessons_completed || 0);
        window.ASLDS.Admin.setText('[data-stat="certificates"]', stats.certificates_earned || 0);
        window.ASLDS.Admin.setText('[data-stat="active-days"]', stats.active_days_30 || 0);
    }

    function renderEnrollments(enrollments) {
        const list = document.querySelector('[data-list="enrollments"]');
        const empty = document.querySelector('[data-empty="enrollments"]');
        if (!list) return;

        if (!enrollments.length) {
            if (empty) empty.hidden = false;
            list.innerHTML = '';
            return;
        }
        if (empty) empty.hidden = true;

        list.innerHTML = enrollments.map(e => {
            const c = e.course;
            const icon = c?.icon || 'fa-solid fa-book';
            const completed = !!e.completed_at;

            return `
                <div class="list-row">
                    <div class="avatar avatar-sm avatar-gold">
                        <i class="${window.ASLDS.Admin.escapeHtml(icon)}"></i>
                    </div>
                    <div class="list-row-body">
                        <strong>${window.ASLDS.Admin.escapeHtml(c?.title || 'Unknown Course')}</strong>
                        <small class="text-muted">Enrolled ${formatDate(e.enrolled_at)}</small>
                    </div>
                    <span class="badge ${completed ? 'badge-success' : 'badge-warning'} badge-sm">
                        ${completed ? 'Completed' : 'In Progress'}
                    </span>
                </div>`;
        }).join('');
    }

    function renderCertificates(certs) {
        const list = document.querySelector('[data-list="certificates"]');
        const empty = document.querySelector('[data-empty="certificates"]');
        if (!list) return;

        if (!certs.length) {
            if (empty) empty.hidden = false;
            list.innerHTML = '';
            return;
        }
        if (empty) empty.hidden = true;

        list.innerHTML = certs.map(c => `
            <div class="list-row">
                <div class="avatar avatar-sm avatar-gold">
                    <i class="fa-solid fa-certificate"></i>
                </div>
                <div class="list-row-body">
                    <strong>${window.ASLDS.Admin.escapeHtml(c.course?.title || 'Certificate')}</strong>
                    <small class="text-muted">Issued ${formatDate(c.issued_at)} · ${c.certificate_number}</small>
                </div>
                <a href="../academy/verify.html?code=${encodeURIComponent(c.certificate_number)}" target="_blank" class="btn btn-outline btn-sm">
                    <i class="fa-solid fa-eye"></i>
                </a>
            </div>
        `).join('');
    }

    function renderActivity(items) {
        const list = document.querySelector('[data-list="activity"]');
        const empty = document.querySelector('[data-empty="activity"]');
        if (!list) return;

        if (!items.length) {
            if (empty) empty.hidden = false;
            list.innerHTML = '';
            return;
        }
        if (empty) empty.hidden = true;

        list.innerHTML = items.map(item => `
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

    // ----------------------------------------------------------
    // BOOT
    // ----------------------------------------------------------
    async function boot() {
        const Admin = window.ASLDS.Admin;
        
        if (!Admin) {
            showState('notfound');
            return;
        }

        const auth = await Admin.requireAdmin();
        if (!auth) return;

        Admin.renderAdminIdentity(auth.profile);
        Admin.wireSignOut();

        const id = getQuery('id');
        if (!id) {
            showState('notfound');
            return;
        }

        const [detail, activity] = await Promise.all([
            Admin.fetchStudentDetail(id),
            Admin.fetchStudentActivity(id, 20)
        ]);

        if (!detail || !detail.profile) {
            showState('notfound');
            return;
        }

        renderProfile(detail.profile, detail.stats);
        renderEnrollments(detail.enrollments);
        renderCertificates(detail.certificates);
        renderActivity(activity);

        // Wire back link
        document.querySelectorAll('[data-back-link]').forEach(link => {
            link.href = 'students.html';
        });

        // Update page title
        document.title = `${detail.profile.full_name} — ASL Admin`;

        showState('view');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})(window, document);