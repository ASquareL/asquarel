// ============================================================
// A SQUARE L INNOVATE — Courses Index Page Loader
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

    function setText(sel, value) {
        document.querySelectorAll(sel).forEach(el => el.textContent = value);
    }

    async function requireAuth() {
        const client = getClient();
        if (!client) return null;
        const { data: { session } } = await client.auth.getSession();
        if (!session) {
            window.location.href = '../login.html';
            return null;
        }
        return session;
    }

    async function fetchProfile(userId) {
        const client = getClient();
        const { data, error } = await client
            .from('profiles').select('*').eq('id', userId).single();
        if (error) { console.error('[Courses] profile', error); return null; }
        return data;
    }

    async function fetchAllCourses() {
        const client = getClient();
        const { data, error } = await client
            .from('courses')
            .select('id, slug, title, tagline, icon, level, lessons_count, duration_weeks, certificate_enabled')
            .eq('published', true)
            .order('display_order');
        if (error) { console.error('[Courses] all', error); return []; }
        return data || [];
    }

    async function fetchEnrollments(userId) {
        const client = getClient();
        const { data, error } = await client
            .from('enrollments')
            .select('id, course_id, plan, enrolled_at, completed_at')
            .eq('user_id', userId);
        if (error) { console.error('[Courses] enrollments', error); return []; }
        return data || [];
    }

    async function fetchProgress(userId) {
        const client = getClient();
        const { data, error } = await client
            .from('course_progress').select('*').eq('user_id', userId);
        if (error) { console.error('[Courses] progress', error); return {}; }
        const map = {};
        (data || []).forEach(r => { map[r.course_id] = r; });
        return map;
    }

    async function enrollUser(courseId) {
        const client = getClient();
        const { data: { session } } = await client.auth.getSession();
        if (!session) return { error: 'Not authenticated' };
        const { error } = await client.from('enrollments').insert({
            user_id: session.user.id,
            course_id: courseId
        });
        return { error: error ? error.message : null };
    }

    function enrolledCardHtml(course, progress) {
        const percent = progress ? progress.percentage : 0;
        const completed = progress ? progress.completed_lessons : 0;
        const total = course.lessons_count || 0;
        const started = completed > 0;
        const icon = course.icon || 'fa-solid fa-book';

        return `
            <article class="card">
                <div class="card-body">
                    <div class="d-flex justify-between align-center mb-4">
                        <div class="avatar avatar-md avatar-gold">
                            <i class="${escapeHtml(icon)} fa-2x text-gold"></i>
                        </div>
                        <span class="badge ${started ? 'badge-warning' : ''}">${started ? 'In Progress' : 'Not Started'}</span>
                    </div>
                    <h3 class="mb-3">${escapeHtml(course.title)}</h3>
                    <p class="mb-4">${escapeHtml(course.tagline || '')}</p>
                    <div class="progress mb-4">
                        <div class="progress-header">
                            <span class="progress-title">Progress</span>
                            <span class="progress-value">${percent}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${percent}%"></div>
                        </div>
                    </div>
                    <a href="${escapeHtml(course.slug)}/index.html" class="btn ${started ? 'btn-primary' : 'btn-outline'} btn-block">
                        ${started ? 'Continue Learning' : 'Start Course'} <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
            </article>`;
    }

    function availableCardHtml(course) {
        const icon = course.icon || 'fa-solid fa-book';
        return `
            <article class="card">
                <div class="card-body">
                    <div class="d-flex justify-between align-center mb-4">
                        <div class="avatar avatar-md avatar-gold">
                            <i class="${escapeHtml(icon)} fa-2x text-gold"></i>
                        </div>
                        <span class="badge">${course.lessons_count || 0} Lessons</span>
                    </div>
                    <h3 class="mb-3">${escapeHtml(course.title)}</h3>
                    <p class="mb-4">${escapeHtml(course.tagline || '')}</p>
                    <button class="btn btn-outline btn-block" type="button" data-enroll="${escapeHtml(course.id)}">
                        Enroll Now <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </article>`;
    }

    function renderEnrolled(courses, progressMap) {
        const list = document.querySelector('[data-list="enrolled-courses"]');
        const empty = document.querySelector('[data-empty="enrolled-courses"]');
        if (!list) return;

        if (!courses.length) {
            if (empty) empty.hidden = false;
            return;
        }
        if (empty) empty.hidden = true;
        list.innerHTML = courses.map(c => enrolledCardHtml(c, progressMap[c.id])).join('');
    }

    function renderAvailable(courses) {
        const list = document.querySelector('[data-list="available-courses"]');
        const empty = document.querySelector('[data-empty="available-courses"]');
        if (!list) return;

        if (!courses.length) {
            if (empty) empty.hidden = false;
            return;
        }
        if (empty) empty.hidden = true;
        list.innerHTML = courses.map(availableCardHtml).join('');
    }

    function wireEnrollButtons() {
        document.querySelectorAll('[data-enroll]').forEach(btn => {
            btn.addEventListener('click', async () => {
                const courseId = btn.getAttribute('data-enroll');
                btn.disabled = true;
                const originalHtml = btn.innerHTML;
                btn.innerHTML = 'Enrolling…';

                const { error } = await enrollUser(courseId);

                if (error) {
                    toast('error', 'Enrollment failed', error);
                    btn.disabled = false;
                    btn.innerHTML = originalHtml;
                    return;
                }
                toast('success', 'Enrolled!', 'Welcome to the course.');
                setTimeout(() => window.location.reload(), 900);
            });
        });
    }

    function wireSignOut() {
        document.querySelectorAll('[data-signout]').forEach(el => {
            el.addEventListener('click', async (e) => {
                e.preventDefault();
                if (window.ASLDS && window.ASLDS.Auth) {
                    await window.ASLDS.Auth.signOut();
                }
                window.location.href = '../login.html';
            });
        });
    }

    async function boot() {
        const session = await requireAuth();
        if (!session) return;

        const userId = session.user.id;

        const [profile, allCourses, enrollments, progressMap] = await Promise.all([
            fetchProfile(userId),
            fetchAllCourses(),
            fetchEnrollments(userId),
            fetchProgress(userId)
        ]);

        if (profile) {
            setText('[data-user-initials]', getInitials(profile.full_name));
            setText('[data-user-name]', profile.full_name);
            setText('[data-user-reg]', profile.reg_number);
        }

        const enrolledIds = enrollments.map(e => e.course_id);
        const enrolledCourses = allCourses.filter(c => enrolledIds.includes(c.id));
        const availableCourses = allCourses.filter(c => !enrolledIds.includes(c.id));

        renderEnrolled(enrolledCourses, progressMap);
        renderAvailable(availableCourses);
        wireEnrollButtons();
        wireSignOut();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})(window, document);