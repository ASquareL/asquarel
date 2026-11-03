(function (window, document) {
    'use strict';

    function getClient() {
        if (!window.SupabaseClient) {
            console.error('[Auth] Supabase client not initialized.');
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

    // ----------------------------------------------------------
    // SIGN UP
    // ----------------------------------------------------------
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

    // ----------------------------------------------------------
    // OTP VERIFICATION
    // ----------------------------------------------------------
    async function verifyOtp({ email, token }) {
        const c = getClient();
        if (!c) return { user: null, error: 'Supabase not ready' };

        const { data, error } = await c.auth.verifyOtp({
            email,
            token,
            type: 'signup'
        });

        if (error) return { user: null, error: error.message };
        return { user: data.user, error: null };
    }

    async function resendOtp({ email }) {
        const c = getClient();
        if (!c) return { error: 'Supabase not ready' };

        const { error } = await c.auth.resend({ type: 'signup', email });
        return { error: error ? error.message : null };
    }

    async function checkVerifyAttempts(userId) {
        const c = getClient();
        if (!c) return { allowed: true };
        const { data, error } = await c.rpc('check_verify_attempts', { p_user_id: userId });
        if (error) return { allowed: true };
        return data;
    }

    async function recordFailedVerify(userId) {
        const c = getClient();
        if (!c) return { locked: false };
        const { data, error } = await c.rpc('record_failed_verify', { p_user_id: userId });
        if (error) return { locked: false };
        return data;
    }

    // ----------------------------------------------------------
    // LOGIN
    // ----------------------------------------------------------
    async function signIn({ email, password }) {
        const c = getClient();
        if (!c) return { user: null, error: 'Supabase not ready' };

        const { data, error } = await c.auth.signInWithPassword({ email, password });
        if (error) return { user: null, error: error.message };

        // Check suspension
        const { data: profile } = await c
            .from('profiles')
            .select('suspended_at')
            .eq('id', data.user.id)
            .single();

        if (profile && profile.suspended_at) {
            await c.auth.signOut();
            return { 
                user: null, 
                error: 'Your account has been suspended. Please contact support@asquarel.com.' 
            };
        }

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
        const redirectTo = new URL('dashboard.html', window.location.href).href;
        const { error } = await c.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo, queryParams: { access_type: 'offline', prompt: 'consent' } }
        });
        return { error: error ? error.message : null };
    }

    async function requireAuth(redirectUrl) {
        const session = await getSession();
        if (!session) {
            window.location.href = redirectUrl || 'login.html';
            return null;
        }

        const client = getClient();
        const { data: profile } = await client
            .from('profiles')
            .select('suspended_at')
            .eq('id', session.user.id)
            .single();

        if (profile && profile.suspended_at) {
            await client.auth.signOut();
            window.location.href = 'login.html?error=suspended';
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
    // ----------------------------------------------------------
    function wireForms() {
        const loginForm = document.querySelector('[data-auth="login"]');
        const registerForm = document.querySelector('[data-auth="register"]');
        const googleButtons = document.querySelectorAll('[data-auth-google]');

        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const submitBtn = loginForm.querySelector('button[type="submit"]');
                const originalTxt = submitBtn.innerHTML;
                if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing in…'; }

                const email = loginForm.querySelector('input[type="email"]').value.trim();
                const password = loginForm.querySelector('input[type="password"]').value;

                const { user, error } = await signIn({ email, password });

                if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalTxt; }

                if (error) {
                    // If they haven't verified their email, push them to the OTP screen
                    if (error.toLowerCase().includes('email not confirmed')) {
                        toast('warning', 'Email not verified', 'Redirecting to verification…');
                        setTimeout(() => { window.location.href = `register.html?verify=${encodeURIComponent(email)}`; }, 1200);
                        return;
                    }
                    toast('error', 'Sign in failed', error);
                    return;
                }
                
                const redirectParam = new URLSearchParams(window.location.search).get('redirect');
                let destination = 'dashboard.html';
                if (redirectParam === 'jamb') destination = '../jamb/index.html';

                toast('success', 'Welcome back', 'Redirecting…');
                setTimeout(() => { window.location.href = destination; }, 800);
            });
        }

        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const submitBtn = registerForm.querySelector('button[type="submit"]');
                const originalTxt = submitBtn.innerHTML;
                if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating account…'; }

                const fullName = registerForm.querySelector('input[name="name"]').value.trim();
                const email = registerForm.querySelector('input[type="email"]').value.trim();
                const password = registerForm.querySelector('input[type="password"]').value;

                const { user, error } = await signUp({ email, password, fullName });

                if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalTxt; }

                if (error) {
                    toast('error', 'Registration failed', error);
                    return;
                }
                
                toast('success', 'Check your email', 'We sent you a 6-digit code.');
                setTimeout(() => { 
                    // Pass the UID so we can check lockouts even without a session
                    window.location.href = `register.html?verify=${encodeURIComponent(email)}&uid=${user.id}`; 
                }, 800);
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
        verifyOtp,
        resendOtp,
        checkVerifyAttempts,
        recordFailedVerify,
        getUser,
        getSession,
        onAuthChange,
        signInWithGoogle,
        requireAuth,
        redirectIfLoggedIn
    };

})(window, document);