// ============================================================
// A SQUARE L INNOVATE — Dashboard Data Loader
// Fetches profile, stats, enrollments, activity for the
// logged-in user and injects into the DOM.
// Requires: SupabaseClient (supabase-config.js)
// ============================================================

(function (window, document) {
    'use strict';

    function getClient() { return window.SupabaseClient || null; }

    function toast(type, title, message) {
        if (window.ASLDS && window.ASLDS.Toast && typeof window.ASLDS.Toast.show === 'function') {
            window.ASLDS.Toast.show({ type, title, message });
        }
    }

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

    function getFirstName(name) {
        if (!name) return 'there';
        return name.trim().split(/\s+/)[0];
    }

    function setText(sel, value) {
        document.querySelectorAll(sel).forEach(el => el.textContent = value);
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

    // ----------------------------------------------------------
    // AUTH GUARD
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

    // ----------------------------------------------------------
    // DATA FETCHES
    // ----------------------------------------------------------
    async function fetchProfile(userId) {
        const client = getClient();
        const { data, error } = await client
            .from('profiles').select('*').eq('id', userId).single();
        if (error) { console.error('[Dashboard] profile', error); return null; }
        return data;
    }

    async function fetchStats(userId) {
        const client = getClient();
        const { data, error } = await client
            .from('user_stats').select('*').eq('user_id', userId).single();
        if (error) { console.error('[Dashboard] stats', error); return null; }
        return data;
    }

    async function fetchEnrollments(userId) {
        const client = getClient();
        const { data, error } = await client
            .from('enrollments')
            .select(`id, plan, enrolled_at, completed_at, last_lesson_id,
                     course:courses(id, slug, title, tagline, icon, lessons_count, level)`)
            .eq('user_id', userId)
            .order('enrolled_at', { ascending: false });
        if (error) { console.error('[Dashboard] enrollments', error); return []; }
        return data || [];
    }

    async function fetchProgress(userId) {
        const client = getClient();
        const { data, error } = await client
            .from('course_progress').select('*').eq('user_id', userId);
        if (error) { console.error('[Dashboard] progress', error); return {}; }
        const map = {};
        (data || []).forEach(r => { map[r.course_id] = r; });
        return map;
    }

    async function fetchActivity(userId) {
        const client = getClient();
        const { data, error } = await client
            .from('activity_log')
            .select(`id, type, created_at, metadata, course_id, lesson_id,
                     course:courses(title, slug),
                     lesson:lessons(title, number)`)
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(8);
        if (error) { console.error('[Dashboard] activity', error); return []; }
        return data || [];
    }

    // ----------------------------------------------------------
    // RENDERERS
    // ----------------------------------------------------------
    function renderProfile(profile) {
        setText('[data-user-initials]', getInitials(profile.full_name));
        setText('[data-user-name]', profile.full_name);
        setText('[data-user-firstname]', getFirstName(profile.full_name));
        setText('[data-user-reg]', profile.reg_number);
        setText('[data-user-email]', profile.email);
    }

    function renderStats(stats) {
        setText('[data-stat="courses-enrolled"]', stats.courses_enrolled);
        setText('[data-stat="lessons-completed"]', stats.lessons_completed);
        setText('[data-stat="active-days"]', stats.active_days_30);
        setText('[data-stat="hours-learned"]',
            (stats.total_minutes_learned / 60).toFixed(1));
    }

    function courseCardHtml(enrollment, progress) {
        const c = enrollment.course;
        const percent = progress ? progress.percentage : 0;
        const completed = progress ? progress.completed_lessons : 0;
        const total = c.lessons_count || 0;
        const started = completed > 0;
        const ctaClass = started ? 'btn-primary' : 'btn-outline';
        const ctaText = started ? 'Continue' : 'Start Course';
        const url = `courses/${c.slug}/index.html`;

        return `
            <article class="card">
                <div class="card-body">
                    <div class="d-flex justify-between align-center mb-3">
                        <span class="badge ${started ? 'badge-warning' : ''}">${started ? 'In Progress' : 'Not Started'}</span>
                        <span class="${started ? 'text-gold' : ''} fw-bold">${percent}%</span>
                    </div>
                    <h3 class="mb-2">${escapeHtml(c.title)}</h3>
                    <p class="mb-3">${escapeHtml(c.tagline || '')}</p>
                    ${started ? `
                        <div class="progress-bar mb-3">
                            <div class="progress-fill" style="width: ${percent}%"></div>
                        </div>` : ''}
                    <div class="d-flex justify-between align-center">
                        <small>${completed} of ${total} lessons</small>
                        <a href="${url}" class="btn ${ctaClass} btn-sm">
                            ${ctaText} <i class="fa-solid fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </article>`;
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

        list.innerHTML = enrollments.map(e =>
            courseCardHtml(e, progressMap[e.course?.id])
        ).join('');
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
            case 'lesson_started': return `Started ${item.lesson?.title || 'a lesson'}`;
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

    // ----------------------------------------------------------
    // SIGN OUT
    // ----------------------------------------------------------
    function wireSignOut() {
        document.querySelectorAll('[data-signout]').forEach(el => {
            el.addEventListener('click', async (e) => {
                e.preventDefault();
                if (window.ASLDS && window.ASLDS.Auth) {
                    await window.ASLDS.Auth.signOut();
                }
                window.location.href = 'login.html';
            });
        });
    }

    // ----------------------------------------------------------
    // BOOT
    // ----------------------------------------------------------
    async function boot() {
        const session = await requireAuth();
        if (!session) return;

        const userId = session.user.id;

        const [profile, stats, enrollments, progress, activity] = await Promise.all([
            fetchProfile(userId),
            fetchStats(userId),
            fetchEnrollments(userId),
            fetchProgress(userId),
            fetchActivity(userId)
        ]);

        if (profile) renderProfile(profile);
        if (stats) renderStats(stats);
        renderEnrollments(enrollments, progress);
        renderActivity(activity);
        wireSignOut();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})(window, document);