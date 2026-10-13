// ============================================================
// A SQUARE L INNOVATE — Profile Page Data Loader
// ============================================================

(function (window, document) {
    'use strict';

    function getClient() { return window.SupabaseClient || null; }

    function escapeHtml(str) {
        if (str == null) return '';
        return String(str)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function getInitials(name) {
        if (!name) return '??';
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
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
        if (mins < 60) return `${mins} min ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
        const days = Math.floor(hrs / 24);
        if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
        return new Date(iso).toLocaleDateString();
    }

    function setText(sel, value) {
        document.querySelectorAll(sel).forEach(el => el.textContent = value);
    }

    // ----------------------------------------------------------
    async function requireAuth() {
        const client = getClient();
        if (!client) return null;
        const { data: { session } } = await client.auth.getSession();
        if (!session) {
            window.location.href = 'login.html';
            return null;
        }
        return session;
    }

    async function fetchProfile(userId) {
        const client = getClient();
        const { data, error } = await client
            .from('profiles').select('*').eq('id', userId).single();
        if (error) { console.error('[Profile] profile', error); return null; }
        return data;
    }

    async function fetchStats(userId) {
        const client = getClient();
        const { data, error } = await client
            .from('user_stats').select('*').eq('user_id', userId).single();
        if (error) { console.error('[Profile] stats', error); return null; }
        return data;
    }

    async function fetchEnrollments(userId) {
        const client = getClient();
        const { data, error } = await client
            .from('enrollments')
            .select('id, enrolled_at, completed_at, course:courses(id, slug, title, tagline, lessons_count)')
            .eq('user_id', userId)
            .order('enrolled_at', { ascending: false });
        if (error) { console.error('[Profile] enrollments', error); return []; }
        return data || [];
    }

    async function fetchProgress(userId) {
        const client = getClient();
        const { data, error } = await client
            .from('course_progress').select('*').eq('user_id', userId);
        if (error) { console.error('[Profile] progress', error); return {}; }
        const map = {};
        (data || []).forEach(r => { map[r.course_id] = r; });
        return map;
    }

    async function fetchActivity(userId) {
        const client = getClient();
        const { data, error } = await client
            .from('activity_log')
            .select('id, type, created_at, metadata, course:courses(title), lesson:lessons(title, number)')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(6);
        if (error) { console.error('[Profile] activity', error); return []; }
        return data || [];
    }

    async function fetchCertificates(userId) {
        const client = getClient();
        const { data, error } = await client
            .from('certificates')
            .select('id, certificate_number, issued_at, course:courses(title, slug)')
            .eq('user_id', userId)
            .order('issued_at', { ascending: false });
        if (error) { console.error('[Profile] certificates', error); return []; }
        return data || [];
    }

    // ----------------------------------------------------------
    function renderProfile(profile) {
        setText('[data-user-initials]', getInitials(profile.full_name));
        setText('[data-user-name]', profile.full_name);
        setText('[data-user-reg]', profile.reg_number);
        setText('[data-user-email]', profile.email);
        setText('[data-user-role]', profile.role.charAt(0).toUpperCase() + profile.role.slice(1));
        setText('[data-user-level]', 'Level ' + profile.level);
        setText('[data-user-phone]', profile.phone || 'Not set');
        setText('[data-user-location]', profile.location || 'Not set');
        setText('[data-user-joined]', 'Joined ' + formatDate(profile.created_at));
        setText('[data-user-bio]', profile.bio || 'No bio yet. Update it in Settings.');
    }

    function renderStats(stats) {
        setText('[data-stat="courses-enrolled"]', stats.courses_enrolled);
        setText('[data-stat="lessons-completed"]', stats.lessons_completed);
        setText('[data-stat="certificates-earned"]', stats.certificates_earned);
        setText('[data-stat="hours-learned"]', (stats.total_minutes_learned / 60).toFixed(1));
    }

    function renderEnrollments(enrollments, progressMap) {
        const list = document.querySelector('[data-list="enrolled-courses"]');
        if (!list) return;

        if (!enrollments.length) {
            const empty = document.querySelector('[data-empty="enrolled-courses"]');
            if (empty) empty.hidden = false;
            return;
        }

        const empty = document.querySelector('[data-empty="enrolled-courses"]');
        if (empty) empty.hidden = true;

        list.innerHTML = enrollments.map(e => {
            const c = e.course;
            const prog = progressMap[c.id] || {};
            const percent = prog.percentage || 0;
            const completed = prog.completed_lessons || 0;
            const total = c.lessons_count || 0;
            const started = completed > 0;

            return `
                <article class="card">
                    <div class="card-body">
                        <div class="d-flex justify-between align-center mb-3">
                            <span class="badge ${started ? 'badge-warning' : ''}">${started ? 'In Progress' : 'Not Started'}</span>
                            <span class="${started ? 'text-gold' : ''} fw-bold">${percent}%</span>
                        </div>
                        <h3 class="mb-2">${escapeHtml(c.title)}</h3>
                        <p class="mb-3">${escapeHtml(c.tagline || '')}</p>
                        <div class="progress-bar mb-3">
                            <div class="progress-fill" style="width: ${percent}%"></div>
                        </div>
                        <div class="d-flex justify-between align-center">
                            <small>${completed} of ${total} lessons</small>
                            <a href="courses/${c.slug}/index.html" class="btn ${started ? 'btn-primary' : 'btn-outline'} btn-sm">
                                ${started ? 'Continue' : 'Start'} <i class="fa-solid fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                </article>`;
        }).join('');
    }

    const ACTIVITY_ICONS = {
        course_enrolled: 'fa-flag',
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
            case 'course_completed': return `Completed the ${item.course?.title || ''} course`;
            case 'certificate_earned': return `Earned a certificate for ${item.course?.title || 'a course'}`;
            case 'quiz_passed': return `Passed a quiz (${item.metadata?.score_percent || 0}%)`;
            case 'quiz_failed': return `Attempted a quiz (${item.metadata?.score_percent || 0}%)`;
            case 'thread_created': return 'Posted a discussion thread';
            case 'reply_posted': return 'Replied to a discussion';
            default: return item.type;
        }
    }

    function renderActivity(items) {
        const list = document.querySelector('[data-list="activity"]');
        if (!list) return;

        if (!items.length) {
            const empty = document.querySelector('[data-empty="activity"]');
            if (empty) empty.hidden = false;
            return;
        }

        const empty = document.querySelector('[data-empty="activity"]');
        if (empty) empty.hidden = true;

        list.innerHTML = items.map(item => `
            <div class="d-flex align-center gap-3">
                <div class="avatar avatar-sm avatar-gold">
                    <i class="fa-solid ${ACTIVITY_ICONS[item.type] || 'fa-circle'}"></i>
                </div>
                <div>
                    <strong>${escapeHtml(activityText(item))}</strong>
                    <p class="mb-0">${formatRelative(item.created_at)}</p>
                </div>
            </div>
        `).join('');
    }

    // ----- Certificate Progress widget (existing — shows best in-progress) -----
    function renderCertificate(certs, enrollments, progressMap) {
        const widget = document.querySelector('[data-certificate-widget]');
        if (!widget) return;

        if (certs.length) {
            const c = certs[0];
            widget.innerHTML = `
                <div class="d-flex align-center gap-3 mb-3">
                    <div class="avatar avatar-md avatar-gold">
                        <i class="fa-solid fa-certificate"></i>
                    </div>
                    <div>
                        <strong>${escapeHtml(c.course?.title || 'Certificate')}</strong>
                        <p class="mb-0">Issued ${formatDate(c.issued_at)}</p>
                    </div>
                </div>
                <span class="badge badge-success">Earned</span>`;
            return;
        }

        const inProgress = enrollments
            .map(e => ({ e, prog: progressMap[e.course?.id] || {} }))
            .filter(x => (x.prog.percentage || 0) > 0)
            .sort((a, b) => (b.prog.percentage || 0) - (a.prog.percentage || 0))[0];

        if (!inProgress) {
            widget.innerHTML = `
                <p class="mb-3">Enroll in a course and start learning to begin your first certificate.</p>
                <a href="courses/index.html" class="btn btn-outline btn-sm">
                    Browse Courses <i class="fa-solid fa-arrow-right"></i>
                </a>`;
            return;
        }

        const c = inProgress.e.course;
        const percent = inProgress.prog.percentage || 0;
        const remaining = 100 - percent;

        widget.innerHTML = `
            <div class="d-flex align-center gap-3 mb-3">
                <div class="avatar avatar-md avatar-gold">
                    <i class="fa-solid fa-certificate"></i>
                </div>
                <div>
                    <strong>${escapeHtml(c.title)}</strong>
                    <p class="mb-0">${remaining}% remaining</p>
                </div>
            </div>
            <div class="progress-bar mb-3">
                <div class="progress-fill" style="width: ${percent}%"></div>
            </div>
            <small>Complete the track to unlock your certificate.</small>`;
    }

    // ----- My Certificates widget (new — lists every earned certificate) -----
    function renderCertificates(certs) {
        const container = document.querySelector('[data-certificates-container]');
        const empty = document.querySelector('[data-certificates-empty]');
        if (!container) return;

        if (!certs.length) {
            if (empty) empty.hidden = false;
            return;
        }

        if (empty) empty.hidden = true;

        container.innerHTML = certs.map(c => `
            <div class="card">
                <div class="card-body">
                    <div class="d-flex align-center gap-3 mb-3">
                        <div class="avatar avatar-md avatar-gold">
                            <i class="fa-solid fa-certificate text-gold"></i>
                        </div>
                        <div>
                            <strong>${escapeHtml(c.course?.title || 'Certificate')}</strong>
                            <p class="mb-0">Issued ${formatDate(c.issued_at)}</p>
                        </div>
                    </div>
                    <div class="d-flex gap-2 flex-wrap">
                        <a href="certificate.html?id=${encodeURIComponent(c.id)}" class="btn btn-primary btn-sm">
                            <i class="fa-solid fa-eye"></i> View
                        </a>
                        <a href="certificate.html?id=${encodeURIComponent(c.id)}" class="btn btn-outline btn-sm">
                            <i class="fa-solid fa-download"></i> Download
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function wireSignOut() {
        document.querySelectorAll('[data-signout]').forEach(el => {
            el.addEventListener('click', async (e) => {
                e.preventDefault();
                if (window.ASLDS && window.ASLDS.Auth) await window.ASLDS.Auth.signOut();
                window.location.href = 'login.html';
            });
        });
    }

    async function boot() {
        const session = await requireAuth();
        if (!session) return;

        const userId = session.user.id;

        const [profile, stats, enrollments, progress, activity, certs] = await Promise.all([
            fetchProfile(userId),
            fetchStats(userId),
            fetchEnrollments(userId),
            fetchProgress(userId),
            fetchActivity(userId),
            fetchCertificates(userId)
        ]);

        if (profile) renderProfile(profile);
        if (stats) renderStats(stats);
        renderEnrollments(enrollments, progress);
        renderActivity(activity);
        renderCertificate(certs, enrollments, progress);
        renderCertificates(certs);
        wireSignOut();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})(window, document);