(function (window, document) {
    'use strict';

    function getClient() {
        if (!window.SupabaseClient) {
            console.error('[Auth] Supabase client not initialized. Is supabase-config.js loaded?');
            return null;
        }
        return window.SupabaseClient;
    }

    function toast(type, title, message) {
        if (window.ASLDS && window.ASLDS.Toast && typeof window.ASLDS.Toast.show === 'function') {
            window.ASLDS.Toast.show({ type, title, message });
        } else {
            console.log(`[${type}] ${title}: ${message}`);
        }
    }

    async function signUp({ email, password, fullName }) {
        const c = getClient();
        if (!c) return { user: null, error: 'Supabase not ready' };

        const { data, error } = await c.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName } }
        });

        if (error) return { user: null, error: error.message };
        return { user: data.user, error: null };
    }

    async function signIn({ email, password }) {
        const c = getClient();
        if (!c) return { user: null, error: 'Supabase not ready' };

        const { data, error } = await c.auth.signInWithPassword({ email, password });
        if (error) return { user: null, error: error.message };
        return { user: data.user, error: null };
    }

    async function signOut() {
        const c = getClient();
        if (!c) return { error: 'Supabase not ready' };
        const { error } = await c.auth.signOut();
        return { error: error ? error.message : null };
    }

    async function getUser() {
        const c = getClient();
        if (!c) return null;
        const { data } = await c.auth.getUser();
        return data ? data.user : null;
    }

    async function getSession() {
        const c = getClient();
        if (!c) return null;
        const { data } = await c.auth.getSession();
        return data ? data.session : null;
    }

    function onAuthChange(callback) {
        const c = getClient();
        if (!c) return () => {};
        const { data } = c.auth.onAuthStateChange(callback);
        return () => data.subscription.unsubscribe();
    }

    async function signInWithGoogle() {
        const c = getClient();
        if (!c) return { error: 'Supabase not ready' };

        // Build the redirect URL from the current page's folder.
        // On login.html or register.html (both in /apps/academy/),
        // this resolves to /apps/academy/dashboard.html
        const redirectTo = new URL('dashboard.html', window.location.href).href;

        const { error } = await c.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent'
                }
            }
        });

        return { error: error ? error.message : null };
    }

    async function requireAuth(redirectUrl) {
        const session = await getSession();
        if (!session) {
            window.location.href = redirectUrl || '/apps/academy/login.html';
            return null;
        }
        return session;
    }

    async function redirectIfLoggedIn(targetUrl) {
        const session = await getSession();
        if (session) {
            window.location.href = targetUrl || '/apps/academy/dashboard.html';
            return true;
        }
        return false;
    }

    // ----------------------------------------------------------
    // FORM AUTO-WIRING
    // Any form with [data-auth="login"|"register"] gets wired.
    // Any button with [data-auth-google] triggers Google OAuth.
    // ----------------------------------------------------------

    function wireForms() {
        const loginForm = document.querySelector('[data-auth="login"]');
        const registerForm = document.querySelector('[data-auth="register"]');
        const googleButtons = document.querySelectorAll('[data-auth-google]');

        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const submitBtn = loginForm.querySelector('button[type="submit"]');
                if (submitBtn) submitBtn.disabled = true;

                const email = loginForm.querySelector('input[type="email"]').value.trim();
                const password = loginForm.querySelector('input[type="password"]').value;

                const { user, error } = await signIn({ email, password });

                if (submitBtn) submitBtn.disabled = false;

                if (error) {
                    toast('error', 'Sign in failed', error);
                    return;
                }
                toast('success', 'Welcome back', 'Redirecting to your dashboard…');
                setTimeout(() => { window.location.href = '/apps/academy/dashboard.html'; }, 800);
            });
        }

        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const submitBtn = registerForm.querySelector('button[type="submit"]');
                if (submitBtn) submitBtn.disabled = true;

                const fullName = registerForm.querySelector('input[name="name"]').value.trim();
                const email = registerForm.querySelector('input[type="email"]').value.trim();
                const password = registerForm.querySelector('input[type="password"]').value;

                const { user, error } = await signUp({ email, password, fullName });

                if (submitBtn) submitBtn.disabled = false;

                if (error) {
                    toast('error', 'Registration failed', error);
                    return;
                }
                toast('success', 'Account created', 'Welcome to A Square L Academy.');
                setTimeout(() => { window.location.href = '/apps/academy/dashboard.html'; }, 1000);
            });
        }

        googleButtons.forEach((btn) => {
            btn.addEventListener('click', async () => {
                btn.disabled = true;
                const { error } = await signInWithGoogle();
                if (error) {
                    toast('error', 'Google sign-in failed', error);
                    btn.disabled = false;
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', wireForms);
    } else {
        wireForms();
    }

    window.ASLDS = window.ASLDS || {};
    window.ASLDS.Auth = {
        signUp,
        signIn,
        signOut,
        getUser,
        getSession,
        onAuthChange,
        signInWithGoogle,
        requireAuth,
        redirectIfLoggedIn
    };

})(window, document);