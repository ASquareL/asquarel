// ============================================================
// A SQUARE L INNOVATE — Course Landing Page Helper
// Auth guard + sidebar identity + enroll button wiring.
// Works for any course landing page.
// URL: courses/{slug}/index.html
// ============================================================

(function (window, document) {
    'use strict';

    function getClient() { return window.SupabaseClient || null; }

    function toast(type, title, message) {
        if (window.ASLDS && window.ASLDS.Toast) {
            window.ASLDS.Toast.show({ type, title, message });
        }
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

    // Course slug is inferred from the URL path: .../courses/{slug}/index.html
    function getCourseSlug() {
        const m = window.location.pathname.match(/\/courses\/([^/]+)\//);
        return m ? m[1] : null;
    }

    async function requireAuth() {
        const client = getClient();
        const { data: { session } } = await client.auth.getSession();
        if (!session) {
            window.location.href = '../../login.html';
            return null;
        }
        return session;
    }

    async function fetchProfile(userId) {
        const client = getClient();
        const { data, error } = await client
            .from('profiles').select('full_name, reg_number').eq('id', userId).single();
        if (error) return null;
        return data;
    }

    async function isEnrolled(userId, courseSlug) {
        const client = getClient();
        const { data: course } = await client
            .from('courses').select('id').eq('slug', courseSlug).single();
        if (!course) return { enrolled: false, courseId: null };

        const { data: enrollment } = await client
            .from('enrollments').select('id')
            .eq('user_id', userId).eq('course_id', course.id).single();

        return { enrolled: !!enrollment, courseId: course.id };
    }

    async function enroll(userId, courseId) {
        const client = getClient();
        const { error } = await client.from('enrollments').insert({
            user_id: userId, course_id: courseId
        });
        return { error: error ? error.message : null };
    }

    function wireSignOut() {
        document.querySelectorAll('[data-signout]').forEach(el => {
            el.addEventListener('click', async (e) => {
                e.preventDefault();
                const client = getClient();
                if (client) await client.auth.signOut();
                window.location.href = '../../login.html';
            });
        });
    }

    // Builds the URL to the first lesson of this course,
    // using the new shared lesson.html location.
    function firstLessonUrl(slug) {
        return `../lesson.html?course=${encodeURIComponent(slug)}&id=lesson-01`;
    }

    async function boot() {
        const session = await requireAuth();
        if (!session) return;

        const slug = getCourseSlug();
        const [profile, enrollmentInfo] = await Promise.all([
            fetchProfile(session.user.id),
            slug ? isEnrolled(session.user.id, slug) : { enrolled: false, courseId: null }
        ]);

        if (profile) {
            setText('[data-user-initials]', getInitials(profile.full_name));
            setText('[data-user-name]', profile.full_name);
            setText('[data-user-reg]', profile.reg_number);
        }

        wireSignOut();

        document.querySelectorAll('[data-enroll-cta]').forEach(btn => {
            if (enrollmentInfo.enrolled && slug) {
                // Already enrolled → point to the first lesson
                btn.innerHTML = 'Continue Learning <i class="fa-solid fa-arrow-right"></i>';
                btn.href = firstLessonUrl(slug);
                return;
            }

            // Not enrolled → wire enroll click
            btn.addEventListener('click', async (e) => {
                e.preventDefault();

                if (!enrollmentInfo.courseId) {
                    toast('error', 'Enrollment failed', 'Course not found.');
                    return;
                }

                const original = btn.innerHTML;
                btn.disabled = true;
                btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enrolling…';

                const { error } = await enroll(session.user.id, enrollmentInfo.courseId);

                if (error) {
                    toast('error', 'Enrollment failed', error);
                    btn.disabled = false;
                    btn.innerHTML = original;
                    return;
                }

                toast('success', 'Enrolled!', 'Welcome to the course.');
                setTimeout(() => window.location.reload(), 900);
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})(window, document);