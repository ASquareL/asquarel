// ============================================================
// A SQUARE L INNOVATE — Admin Login Page
// ============================================================

(function (window, document) {
    'use strict';

    function getClient() { return window.SupabaseClient || null; }

    function toast(type, title, message) {
        if (window.ASLDS && window.ASLDS.Toast) {
            window.ASLDS.Toast.show({ type, title, message });
        }
    }

    async function autoRedirect() {
        const client = getClient();
        if (!client) return;

        const { data: { session } } = await client.auth.getSession();
        if (!session) return;

        const { data: profile } = await client
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

        if (profile && profile.role === 'admin') {
            window.location.href = 'index.html';
        }
    }

    function wireForm() {
        const form = document.querySelector('[data-auth="admin-login"]');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = form.querySelector('button[type="submit"]');
            if (!btn) return;

            const original = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing in…';

            const email = form.querySelector('input[type="email"]').value.trim();
            const password = form.querySelector('input[type="password"]').value;

            const client = getClient();
            if (!client) {
                toast('error', 'Connection error', 'Unable to reach the server.');
                btn.disabled = false;
                btn.innerHTML = original;
                return;
            }

            const { data, error } = await client.auth.signInWithPassword({ email, password });

            if (error) {
                toast('error', 'Sign in failed', error.message);
                btn.disabled = false;
                btn.innerHTML = original;
                return;
            }

            const { data: profile } = await client
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single();

            if (!profile || profile.role !== 'admin') {
                await client.auth.signOut();
                toast('error', 'Access denied', 'This account does not have admin privileges.');
                btn.disabled = false;
                btn.innerHTML = original;
                return;
            }

            toast('success', 'Welcome, Admin', 'Redirecting to dashboard…');
            setTimeout(() => { window.location.href = 'index.html'; }, 700);
        });
    }

    function boot() {
        autoRedirect();
        wireForm();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})(window, document);