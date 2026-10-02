// ============================================================
// A SQUARE L INNOVATE — Settings Page Loader
// Loads profile + notification_prefs, wires save + password.
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
            window.location.href = 'login.html';
            return null;
        }
        return session;
    }

    // ----------------------------------------------------------
    // LOAD
    // ----------------------------------------------------------
    async function fetchProfile(userId) {
        const client = getClient();
        const { data, error } = await client
            .from('profiles').select('*').eq('id', userId).single();
        if (error) { console.error('[Settings] profile', error); return null; }
        return data;
    }

    async function fetchPrefs(userId) {
        const client = getClient();
        const { data, error } = await client
            .from('notification_prefs').select('*').eq('user_id', userId).single();
        if (error) { console.error('[Settings] prefs', error); return null; }
        return data;
    }

    function fillProfileForm(profile) {
        const setVal = (sel, v) => {
            const el = document.querySelector(sel);
            if (el) el.value = v || '';
        };

        setVal('[data-field="full_name"]', profile.full_name);
        setVal('[data-field="phone"]', profile.phone);
        setVal('[data-field="location"]', profile.location);
        setVal('[data-field="bio"]', profile.bio);
        setVal('[data-field="daily_goal_minutes"]', profile.daily_goal_minutes);
        setVal('[data-field="preferred_time"]', profile.preferred_time);
        setVal('[data-field="preferred_timezone"]', profile.preferred_timezone);
        setVal('[data-field="preferred_language"]', profile.preferred_language);

        const difficultyInput = document.querySelector(
            `input[name="difficulty"][value="${profile.difficulty_level}"]`
        );
        if (difficultyInput) difficultyInput.checked = true;

        // Sidebar identity
        setText('[data-user-initials]', getInitials(profile.full_name));
        setText('[data-user-name]', profile.full_name);
        setText('[data-user-reg]', profile.reg_number);
    }

    function fillPrefsForm(prefs) {
        document.querySelectorAll('[data-pref]').forEach(el => {
            const key = el.getAttribute('data-pref');
            if (key in prefs) el.checked = !!prefs[key];
        });
    }

    // ----------------------------------------------------------
    // SAVE
    // ----------------------------------------------------------
    function readProfileUpdates() {
        const get = (sel) => {
            const el = document.querySelector(sel);
            return el ? el.value : null;
        };

        const difficulty = document.querySelector('input[name="difficulty"]:checked');

        return {
            full_name: get('[data-field="full_name"]'),
            phone: get('[data-field="phone"]') || null,
            location: get('[data-field="location"]') || null,
            bio: get('[data-field="bio"]') || null,
            daily_goal_minutes: parseInt(get('[data-field="daily_goal_minutes"]'), 10) || 30,
            preferred_time: get('[data-field="preferred_time"]'),
            preferred_timezone: get('[data-field="preferred_timezone"]'),
            preferred_language: get('[data-field="preferred_language"]'),
            difficulty_level: difficulty ? difficulty.value : 'intermediate'
        };
    }

    function readPrefsUpdates() {
        const updates = {};
        document.querySelectorAll('[data-pref]').forEach(el => {
            updates[el.getAttribute('data-pref')] = el.checked;
        });
        return updates;
    }

    async function saveAll() {
        const client = getClient();
        const { data: { session } } = await client.auth.getSession();
        if (!session) return;

        const userId = session.user.id;
        const profileUpdates = readProfileUpdates();
        const prefsUpdates = readPrefsUpdates();

        const results = await Promise.all([
            client.from('profiles').update(profileUpdates).eq('id', userId),
            client.from('notification_prefs').update(prefsUpdates).eq('user_id', userId)
        ]);

        const error = results.find(r => r.error)?.error;

        if (error) {
            toast('error', 'Save failed', error.message);
            return;
        }

        // Update sidebar name/initials if changed
        setText('[data-user-initials]', getInitials(profileUpdates.full_name));
        setText('[data-user-name]', profileUpdates.full_name);

        toast('success', 'Settings saved', 'Your changes have been saved.');
    }

    // ----------------------------------------------------------
    // PASSWORD
    // ----------------------------------------------------------
    async function changePassword() {
        const client = getClient();
        const current = document.querySelector('[data-password="current"]')?.value || '';
        const newPass = document.querySelector('[data-password="new"]')?.value || '';
        const confirm = document.querySelector('[data-password="confirm"]')?.value || '';

        if (!current || !newPass || !confirm) {
            toast('error', 'Missing fields', 'Fill in all three password fields.');
            return;
        }
        if (newPass.length < 8) {
            toast('error', 'Password too short', 'Use at least 8 characters.');
            return;
        }
        if (newPass !== confirm) {
            toast('error', 'Passwords don\'t match', 'New password and confirmation must match.');
            return;
        }

        const { data: { user } } = await client.auth.getUser();
        if (!user) { toast('error', 'Not signed in', 'Please sign in again.'); return; }

        // Verify current password by re-authenticating
        const { error: verifyError } = await client.auth.signInWithPassword({
            email: user.email,
            password: current
        });

        if (verifyError) {
            toast('error', 'Wrong password', 'Your current password is incorrect.');
            return;
        }

        const { error: updateError } = await client.auth.updateUser({ password: newPass });

        if (updateError) {
            toast('error', 'Update failed', updateError.message);
            return;
        }

        document.querySelector('[data-password="current"]').value = '';
        document.querySelector('[data-password="new"]').value = '';
        document.querySelector('[data-password="confirm"]').value = '';

        toast('success', 'Password updated', 'Use your new password next time you sign in.');
    }

    // ----------------------------------------------------------
    // WIRING
    // ----------------------------------------------------------
    function wireSaveButton() {
        const btn = document.querySelector('[data-save]');
        if (!btn) return;
        btn.addEventListener('click', async () => {
            btn.disabled = true;
            const original = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving…';
            await saveAll();
            btn.disabled = false;
            btn.innerHTML = original;
        });
    }

    function wirePasswordButton() {
        const btn = document.querySelector('[data-password-submit]');
        if (!btn) return;
        btn.addEventListener('click', async () => {
            btn.disabled = true;
            const original = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Updating…';
            await changePassword();
            btn.disabled = false;
            btn.innerHTML = original;
        });
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

    // ----------------------------------------------------------
    // BOOT
    // ----------------------------------------------------------
    async function boot() {
        const session = await requireAuth();
        if (!session) return;

        const userId = session.user.id;
        const [profile, prefs] = await Promise.all([
            fetchProfile(userId),
            fetchPrefs(userId)
        ]);

        if (profile) fillProfileForm(profile);
        if (prefs) fillPrefsForm(prefs);

        // Also fill email field from auth (read-only)
        const emailEl = document.querySelector('[data-field="email"]');
        if (emailEl) emailEl.value = session.user.email || '';

        wireSaveButton();
        wirePasswordButton();
        wireSignOut();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})(window, document);