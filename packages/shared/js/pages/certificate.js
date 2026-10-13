// ============================================================
// A SQUARE L INNOVATE — Certificate View Page
// URL: certificate.html?id={certificate_uuid}
// Or:  certificate.html?course={slug} (finds certificate for that course)
// ============================================================

(function (window, document) {
    'use strict';

    function getClient() { return window.SupabaseClient || null; }

    function toast(type, title, message) {
        if (window.ASLDS && window.ASLDS.Toast) {
            window.ASLDS.Toast.show({ type, title, message });
        }
    }

    function getQuery(name) {
        return new URLSearchParams(window.location.search).get(name);
    }

    function setText(sel, value) {
        document.querySelectorAll(sel).forEach(el => el.textContent = value);
    }

    function formatDate(iso) {
        if (!iso) return '—';
        return new Date(iso).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    }

    function showState(name) {
        const loading = document.querySelector('[data-cert-loading]');
        const notfound = document.querySelector('[data-cert-notfound]');
        const view = document.querySelector('[data-cert-view]');

        if (loading) loading.hidden = name !== 'loading';
        if (notfound) notfound.hidden = name !== 'notfound';
        if (view) view.hidden = name !== 'view';
    }

    async function fetchCertificateById(userId, certId) {
        const client = getClient();
        const { data, error } = await client
            .from('certificates')
            .select(`
                id, certificate_number, verification_code, issued_at,
                course:courses(id, slug, title)
            `)
            .eq('id', certId)
            .eq('user_id', userId)
            .single();
        if (error) { console.error('[Certificate] fetch by id', error); return null; }
        return data;
    }

    async function fetchCertificateByCourse(userId, courseSlug) {
        const client = getClient();
        const { data: course } = await client
            .from('courses').select('id').eq('slug', courseSlug).single();
        if (!course) return null;

        const { data, error } = await client
            .from('certificates')
            .select(`
                id, certificate_number, verification_code, issued_at,
                course:courses(id, slug, title)
            `)
            .eq('user_id', userId)
            .eq('course_id', course.id)
            .single();
        if (error) { console.error('[Certificate] fetch by course', error); return null; }
        return data;
    }

    async function fetchProfile(userId) {
        const client = getClient();
        const { data } = await client
            .from('profiles').select('full_name').eq('id', userId).single();
        return data;
    }

    function render(cert, profile) {
        setText('[data-cert-name]', profile?.full_name || 'Student');
        setText('[data-cert-course]', cert.course?.title || 'Course');
        setText('[data-cert-date]', formatDate(cert.issued_at));
        setText('[data-cert-number]', cert.certificate_number);
        setText('[data-cert-code]', cert.verification_code);

        const verifyUrl = `${window.location.origin}/verify/${cert.verification_code}`;
        const verifyLink = document.querySelector('[data-cert-verify-url]');
        if (verifyLink) verifyLink.href = verifyUrl;

        showState('view');
    }

    function wirePrint() {
        const btn = document.querySelector('[data-cert-print]');
        if (!btn) return;
        btn.addEventListener('click', () => {
            window.print();
        });
    }

    function wireCopy() {
        const btn = document.querySelector('[data-cert-copy]');
        if (!btn) return;
        btn.addEventListener('click', async () => {
            const link = document.querySelector('[data-cert-verify-url]');
            if (!link) return;
            try {
                await navigator.clipboard.writeText(link.href);
                toast('success', 'Link copied', 'Paste it anywhere to share.');
            } catch (e) {
                toast('error', 'Copy failed', 'Your browser blocked clipboard access.');
            }
        });
    }

    async function boot() {
        const client = getClient();
        if (!client) { showState('notfound'); return; }

        const { data: { session } } = await client.auth.getSession();
        if (!session) {
            window.location.href = 'login.html';
            return;
        }

        const certId = getQuery('id');
        const courseSlug = getQuery('course');

        if (!certId && !courseSlug) {
            showState('notfound');
            return;
        }

        const [cert, profile] = await Promise.all([
            certId
                ? fetchCertificateById(session.user.id, certId)
                : fetchCertificateByCourse(session.user.id, courseSlug),
            fetchProfile(session.user.id)
        ]);

        if (!cert) {
            showState('notfound');
            return;
        }

        render(cert, profile);
        wirePrint();
        wireCopy();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})(window, document);