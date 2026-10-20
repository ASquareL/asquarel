// ============================================================
// A SQUARE L INNOVATE — Admin Settings
// ============================================================

(function (window, document) {
    'use strict';

    function getClient() { return window.SupabaseClient || null; }

    function toast(type, title, message) {
        if (window.ASLDS && window.ASLDS.Toast) {
            window.ASLDS.Toast.show({ type, title, message });
        }
    }

    function setVal(sel, val) {
        const el = document.querySelector(sel);
        if (el) el.value = val ?? '';
    }

    function readVal(sel) {
        const el = document.querySelector(sel);
        return el ? el.value.trim() : '';
    }

    // ----------------------------------------------------------
    // LOAD PROFILE
    // ----------------------------------------------------------
    function populateProfile(profile) {
        setVal('[data-field="full_name"]', profile.full_name);
        setVal('[data-field="email"]', profile.email);
        setVal('[data-field="reg_number"]', profile.reg_number);

        // Update sidebar display name (in case it changed)
        if (window.ASLDS.Admin && window.ASLDS.Admin.renderAdminIdentity) {
            window.ASLDS.Admin.renderAdminIdentity(profile);
        }
    }

    // ----------------------------------------------------------
    // SAVE PROFILE (Name only)
    // ----------------------------------------------------------
    async function saveProfile(e) {
        e.preventDefault();
        const client = getClient();
        const btn = document.querySelector('[data-save-profile]');
        const fullName = readVal('[data-field="full_name"]');

        if (!fullName) {
            toast('error', 'Name required', 'Display name cannot be empty.');
            return;
        }

        const original = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving…';

        const { data: { user } } = await client.auth.getUser();
        const { error } = await client
            .from('profiles')
            .update({ full_name: fullName })
            .eq('id', user.id);

        btn.disabled = false;
        btn.innerHTML = original;

        if (error) {
            toast('error', 'Save failed', error.message);
            return;
        }

        toast('success', 'Profile updated', 'Your name has been saved.');

        // Refresh the sidebar
        const { data: newProfile } = await client
            .from('profiles').select('*').eq('id', user.id).single();
        if (newProfile) populateProfile(newProfile);
    }

    // ----------------------------------------------------------
    // CHANGE PASSWORD
    // ----------------------------------------------------------
    async function changePassword(e) {
        e.preventDefault();
        const client = getClient();
        const btn = document.querySelector('[data-save-password]');

        const current = readVal('[data-field="current_password"]');
        const newPass = readVal('[data-field="new_password"]');
        const confirm = readVal('[data-field="confirm_password"]');

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

        const original = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Updating…';

        const { data: { user } } = await client.auth.getUser();

        // Verify current password
        const { error: verifyError } = await client.auth.signInWithPassword({
            email: user.email,
            password: current
        });

        if (verifyError) {
            btn.disabled = false;
            btn.innerHTML = original;
            toast('error', 'Wrong password', 'Your current password is incorrect.');
            return;
        }

        // Update to new password
        const { error: updateError } = await client.auth.updateUser({ password: newPass });

        btn.disabled = false;
        btn.innerHTML = original;

        if (updateError) {
            toast('error', 'Update failed', updateError.message);
            return;
        }

        // Clear fields
        setVal('[data-field="current_password"]', '');
        setVal('[data-field="new_password"]', '');
        setVal('[data-field="confirm_password"]', '');

        toast('success', 'Password updated', 'Use your new password next time you log in.');
    }

    // ----------------------------------------------------------
    // BOOT
    // ----------------------------------------------------------
    async function boot() {
        const Admin = window.ASLDS.Admin;
        if (!Admin) return;

        const auth = await Admin.requireAdmin();
        if (!auth) return;

        Admin.renderAdminIdentity(auth.profile);
        Admin.wireSignOut();

        populateProfile(auth.profile);

        // Wire forms
        document.querySelector('[data-profile-form]')?.addEventListener('submit', saveProfile);
        document.querySelector('[data-password-form]')?.addEventListener('submit', changePassword);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})(window, document);