// ============================================================
// A SQUARE L INNOVATE — Admin Shared Logic
// Auth gate + data helpers for admin pages.
// ============================================================

(function (window, document) {
    'use strict';

    function getClient() { return window.SupabaseClient || null; }

    function toast(type, title, message) {
        if (window.ASLDS && window.ASLDS.Toast && typeof window.ASLDS.Toast.show === 'function') {
            window.ASLDS.Toast.show({ type, title, message });
        } else {
            console.log(`[${type}] ${title}: ${message}`);
        }
    }

    function escapeHtml(str) {
        if (str == null) return '';
        return String(str)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function getQueryParam(name) {
        return new URLSearchParams(window.location.search).get(name);
    }

    function setText(sel, value) {
        document.querySelectorAll(sel).forEach(el => el.textContent = value);
    }

    function getInitials(name) {
        if (!name) return '??';
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    // ----------------------------------------------------------
    // ADMIN GATE
    // Call this on every admin page. If it returns null, the
    // page has already redirected — do not continue.
    // ----------------------------------------------------------
    async function requireAdmin() {
        const client = getClient();
        if (!client) return null;

        const { data: { session } } = await client.auth.getSession();
        if (!session) {
            window.location.href = 'login.html';
            return null;
        }

        const { data: profile, error } = await client
            .from('profiles')
            .select('id, full_name, email, role, reg_number')
            .eq('id', session.user.id)
            .single();

        if (error || !profile || profile.role !== 'admin') {
            alert('Access denied. This area is for administrators only.');
            window.location.href = '../academy/dashboard.html';
            return null;
        }

        return { session, profile };
    }

    // ----------------------------------------------------------
    // DATA HELPERS
    // ----------------------------------------------------------
    async function fetchCourses() {
        const client = getClient();
        const { data, error } = await client
            .from('courses')
            .select('id, slug, title, tagline, icon, lessons_count, published, display_order')
            .order('display_order');
        if (error) { console.error('[Admin] courses', error); return []; }
        return data || [];
    }

    async function fetchLessonsByCourse(courseId) {
        const client = getClient();
        const { data, error } = await client
            .from('lessons')
            .select(`
                id, number, slug, title, duration_minutes, video_id, published,
                module:modules(id, title, order_index)
            `)
            .eq('course_id', courseId)
            .order('number');
        if (error) { console.error('[Admin] lessons', error); return []; }
        return data || [];
    }

    async function fetchLesson(lessonId) {
        const client = getClient();
        const { data, error } = await client
            .from('lessons')
            .select('*')
            .eq('id', lessonId)
            .single();
        if (error) { console.error('[Admin] lesson', error); return null; }
        return data;
    }

    async function updateLesson(lessonId, updates) {
        const client = getClient();
        const { error } = await client
            .from('lessons')
            .update(updates)
            .eq('id', lessonId);
        return { error: error ? error.message : null };
    }

    async function countStudents() {
        const client = getClient();
        const { count, error } = await client
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'student');
        if (error) return 0;
        return count || 0;
    }

    async function countEnrollments() {
        const client = getClient();
        const { count, error } = await client
            .from('enrollments')
            .select('*', { count: 'exact', head: true });
        if (error) return 0;
        return count || 0;
    }

    // ----------------------------------------------------------
    // SIGN OUT
    // ----------------------------------------------------------
    function wireSignOut() {
        document.querySelectorAll('[data-signout]').forEach(el => {
            el.addEventListener('click', async (e) => {
                e.preventDefault();
                const client = getClient();
                if (client) await client.auth.signOut();
                window.location.href = 'login.html';
            });
        });
    }

    // ----------------------------------------------------------
    // RENDER SIDEBAR IDENTITY
    // ----------------------------------------------------------
    function renderAdminIdentity(profile) {
        setText('[data-user-initials]', getInitials(profile.full_name));
        setText('[data-user-name]', profile.full_name);
        setText('[data-user-email]', profile.email);
        setText('[data-user-role]', profile.role);
    }

    window.ASLDS = window.ASLDS || {};
    window.ASLDS.Admin = {
        requireAdmin,
        fetchCourses,
        fetchLessonsByCourse,
        fetchLesson,
        updateLesson,
        countStudents,
        countEnrollments,
        wireSignOut,
        renderAdminIdentity,
        toast,
        escapeHtml,
        getQueryParam,
        setText,
        getInitials
    };

})(window, document);