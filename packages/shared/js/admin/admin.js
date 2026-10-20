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

               // Fire-and-forget: hydrate sidebar feedback badge
        hydrateFeedbackBadge();

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

        async function countUnresolvedFeedback() {
        const client = getClient();
        const { count, error } = await client
            .from('feedback')
            .select('*', { count: 'exact', head: true })
            .eq('resolved', false);
        if (error) return 0;
        return count || 0;
    }

    async function hydrateFeedbackBadge() {
        const badges = document.querySelectorAll('[data-feedback-count]');
        if (!badges.length) return;
        const count = await countUnresolvedFeedback();
        badges.forEach(el => {
            el.textContent = count;
            el.hidden = count === 0;
        });
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

        // ----------------------------------------------------------
    // DASHBOARD DATA HELPERS
    // ----------------------------------------------------------

    async function fetchRecentSignups(limit = 8) {
        const client = getClient();
        const { data, error } = await client
            .from('profiles')
            .select('id, full_name, email, reg_number, role, created_at, avatar_url')
            .eq('role', 'student')
            .order('created_at', { ascending: false })
            .limit(limit);
        if (error) { console.error('[Admin] recent signups', error); return []; }
        return data || [];
    }

    async function fetchRecentEnrollments(limit = 8) {
        const client = getClient();
        const { data, error } = await client
            .from('enrollments')
            .select(`
                id, enrolled_at, plan,
                user:profiles(full_name, reg_number, avatar_url),
                course:courses(title, slug, icon)
            `)
            .order('enrolled_at', { ascending: false })
            .limit(limit);
        if (error) { console.error('[Admin] recent enrollments', error); return []; }
        return data || [];
    }

    async function fetchRecentActivity(limit = 10) {
        const client = getClient();
        const { data, error } = await client
            .from('activity_log')
            .select(`
                id, type, created_at, metadata,
                user:profiles(full_name, avatar_url),
                course:courses(title, slug),
                lesson:lessons(title, number)
            `)
            .order('created_at', { ascending: false })
            .limit(limit);
        if (error) { console.error('[Admin] recent activity', error); return []; }
        return data || [];
    }

    async function fetchContentHealth() {
        const client = getClient();

        const [total, withContent, withVideo] = await Promise.all([
            client.from('lessons').select('*', { count: 'exact', head: true }),
            client.from('lessons').select('*', { count: 'exact', head: true }).neq('content', ''),
            client.from('lessons').select('*', { count: 'exact', head: true }).not('video_id', 'is', null)
        ]);

        return {
            total: total.count || 0,
            withContent: withContent.count || 0,
            withVideo: withVideo.count || 0
        };
    }

    async function fetchTotalCertificates() {
        const client = getClient();
        const { count, error } = await client
            .from('certificates')
            .select('*', { count: 'exact', head: true });
        if (error) return 0;
        return count || 0;
    }


        // ----------------------------------------------------------
    // STUDENTS HELPERS
    // ----------------------------------------------------------

    async function fetchStudentsWithStats() {
        const client = getClient();

        const [profilesRes, statsRes] = await Promise.all([
            client
                .from('profiles')
                .select('id, full_name, email, phone, location, reg_number, role, level, avatar_url, created_at')
                .eq('role', 'student')
                .order('created_at', { ascending: false }),
            client.from('user_stats').select('*')
        ]);

        if (profilesRes.error) {
            console.error('[Admin] students', profilesRes.error);
            return [];
        }

        const statsMap = {};
        (statsRes.data || []).forEach(s => { statsMap[s.user_id] = s; });

        return (profilesRes.data || []).map(p => ({
            ...p,
            stats: statsMap[p.id] || {
                courses_enrolled: 0,
                courses_completed: 0,
                lessons_completed: 0,
                certificates_earned: 0,
                active_days_30: 0
            }
        }));
    }

    async function fetchStudentDetail(userId) {
        const client = getClient();

        const [profileRes, statsRes, enrollmentsRes, certsRes] = await Promise.all([
            client.from('profiles').select('*').eq('id', userId).single(),
            client.from('user_stats').select('*').eq('user_id', userId).maybeSingle(),
            client.from('enrollments')
                .select(`
                    id, enrolled_at, completed_at, plan,
                    course:courses(id, slug, title, icon, lessons_count)
                `)
                .eq('user_id', userId)
                .order('enrolled_at', { ascending: false }),
            client.from('certificates')
                .select('id, certificate_number, issued_at, course:courses(title, slug)')
                .eq('user_id', userId)
                .order('issued_at', { ascending: false })
        ]);

        if (profileRes.error) {
            console.error('[Admin] student detail', profileRes.error);
            return null;
        }

        return {
            profile: profileRes.data,
            stats: statsRes.data || {},
            enrollments: enrollmentsRes.data || [],
            certificates: certsRes.data || []
        };
    }

    async function fetchStudentActivity(userId, limit = 20) {
        const client = getClient();
        const { data, error } = await client
            .from('activity_log')
            .select(`
                id, type, created_at, metadata,
                course:courses(title, slug),
                lesson:lessons(title, number)
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);
        if (error) { console.error('[Admin] student activity', error); return []; }
        return data || [];
    }

        // ----------------------------------------------------------
    // ENROLLMENTS HELPERS
    // ----------------------------------------------------------

    async function fetchAllEnrollments() {
        const client = getClient();
        if (!client) return [];

        const [enrollRes, progressRes] = await Promise.all([
            client
                .from('enrollments')
                .select(`
                    id, enrolled_at, completed_at, plan,
                    user:profiles(id, full_name, email, reg_number, avatar_url),
                    course:courses(id, slug, title, icon, lessons_count)
                `)
                .order('enrolled_at', { ascending: false }),
            client
                .from('course_progress')
                .select('user_id, course_id, percentage, completed_lessons, total_lessons')
        ]);

        if (enrollRes.error) {
            console.error('[Admin] enrollments', enrollRes.error);
            return [];
        }

        const progressMap = {};
        (progressRes.data || []).forEach(p => {
            progressMap[`${p.user_id}:${p.course_id}`] = p;
        });

        return (enrollRes.data || []).map(e => ({
            ...e,
            progress: progressMap[`${e.user?.id}:${e.course?.id}`] || {
                percentage: 0,
                completed_lessons: 0,
                total_lessons: e.course?.lessons_count || 0
            }
        }));
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
        getInitials,
        countUnresolvedFeedback,
        hydrateFeedbackBadge,
        fetchRecentSignups,
        fetchRecentEnrollments,
        fetchRecentActivity,
        fetchContentHealth,
        fetchTotalCertificates,
        fetchStudentsWithStats,
        fetchStudentDetail,
        fetchStudentActivity,
        fetchAllEnrollments,
    };


})(window, document);