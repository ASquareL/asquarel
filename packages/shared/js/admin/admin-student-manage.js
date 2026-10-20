// ============================================================
// A SQUARE L INNOVATE — Admin Student Management Widget
// Lives on student.html — handles edit, suspend, reset, role.
// ============================================================

(function (window, document) {
    'use strict';

    let currentProfile = null;

    function getClient() { return window.SupabaseClient || null; }

    function toast(type, title, message) {
        if (window.ASLDS && window.ASLDS.Toast) {
            window.ASLDS.Toast.show({ type, title, message });
        }
    }

    function getQuery(name) {
        return new URLSearchParams(window.location.search).get(name);
    }

    // ----------------------------------------------------------
    // MODAL HELPERS (Using the single ASLDS modal shell)
    // ----------------------------------------------------------
    function openModal(title, bodyHtml, footerHtml) {
        const modal = document.getElementById('admin-action-modal');
        if (!modal) return;

        modal.querySelector('#modal-title').textContent = title;
        modal.querySelector('[data-modal-body]').innerHTML = bodyHtml;
        modal.querySelector('[data-modal-footer]').innerHTML = footerHtml;

        if (window.ASLDS && window.ASLDS.Modal) {
            window.ASLDS.Modal.open();
        }
    }

    function closeModal() {
        if (window.ASLDS && window.ASLDS.Modal) {
            window.ASLDS.Modal.close();
        }
    }

    // ----------------------------------------------------------
    // RENDER MANAGEMENT WIDGET
    // ----------------------------------------------------------
    function renderWidget(profile) {
        currentProfile = profile;
        const container = document.querySelector('[data-manage-widget]');
        if (!container) return;

        const isSuspended = !!profile.suspended_at;

        container.innerHTML = `
            <div class="d-flex flex-column gap-3">
                
                <button class="btn btn-outline btn-block" type="button" data-action="edit">
                    <i class="fa-solid fa-pen"></i> Edit Profile Info
                </button>

                <button class="btn btn-outline btn-block" type="button" data-action="reset">
                    <i class="fa-solid fa-envelope"></i> Send Password Reset
                </button>

                <div class="dropdown-divider"></div>

                <div class="form-group mb-0">
                    <label class="form-label">Role</label>
                    <select class="form-control" data-action="change-role">
                        <option value="student" ${profile.role === 'student' ? 'selected' : ''}>Student</option>
                        <option value="mentor" ${profile.role === 'mentor' ? 'selected' : ''}>Mentor</option>
                        <option value="admin" ${profile.role === 'admin' ? 'selected' : ''}>Admin</option>
                    </select>
                </div>

                <div class="dropdown-divider"></div>

                ${isSuspended 
                    ? `<button class="btn btn-success btn-block" type="button" data-action="reactivate">
                        <i class="fa-solid fa-check"></i> Reactivate Account
                       </button>`
                    : `<button class="btn btn-danger btn-block" type="button" data-action="suspend">
                        <i class="fa-solid fa-ban"></i> Suspend Account
                       </button>`
                }
            </div>
        `;

        wireActions();
    }

    // ----------------------------------------------------------
    // ACTIONS
    // ----------------------------------------------------------
    function wireActions() {
        const container = document.querySelector('[data-manage-widget]');
        if (!container) return;

        container.querySelector('[data-action="edit"]')?.addEventListener('click', handleEdit);
        container.querySelector('[data-action="reset"]')?.addEventListener('click', handleReset);
        container.querySelector('[data-action="suspend"]')?.addEventListener('click', handleSuspend);
        container.querySelector('[data-action="reactivate"]')?.addEventListener('click', handleReactivate);
        container.querySelector('[data-action="change-role"]')?.addEventListener('change', handleRoleChange);
    }

    function handleEdit() {
        const body = `
            <form id="edit-profile-form" class="form">
                <div class="form-group">
                    <label class="form-label">Full Name</label>
                    <input type="text" class="form-control" name="full_name" value="${window.ASLDS.Admin.escapeHtml(currentProfile.full_name)}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Phone Number</label>
                    <input type="text" class="form-control" name="phone" value="${window.ASLDS.Admin.escapeHtml(currentProfile.phone || '')}">
                </div>
                <div class="form-group">
                    <label class="form-label">Location</label>
                    <input type="text" class="form-control" name="location" value="${window.ASLDS.Admin.escapeHtml(currentProfile.location || '')}">
                </div>
            </form>
        `;
        const footer = `
            <button class="btn btn-outline" type="button" onclick="ASLDS.Modal.close()">Cancel</button>
            <button class="btn btn-primary" type="submit" form="edit-profile-form">Save Changes</button>
        `;

        openModal('Edit Profile Info', body, footer);

        document.getElementById('edit-profile-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = e.target;
            const btn = document.querySelector('.modal-footer .btn-primary');
            const original = btn.innerHTML;

            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving…';

            const updates = {
                full_name: form.full_name.value.trim(),
                phone: form.phone.value.trim() || null,
                location: form.location.value.trim() || null
            };

            const client = getClient();
            const { error } = await client.from('profiles').update(updates).eq('id', currentProfile.id);

            btn.disabled = false;
            btn.innerHTML = original;

            if (error) {
                toast('error', 'Save failed', error.message);
                return;
            }

            toast('success', 'Profile updated', 'Changes have been saved.');
            closeModal();
            
            // Update local state + widget
            currentProfile = { ...currentProfile, ...updates };
            renderWidget(currentProfile);
            
            // Optionally refresh the page title/header if needed
            document.querySelectorAll('[data-student-name]').forEach(el => el.textContent = updates.full_name);
        });
    }

    async function handleReset() {
        if (!confirm(`Send a password reset email to ${currentProfile.email}?`)) return;

        const client = getClient();
        const { error } = await client.auth.resetPasswordForEmail(currentProfile.email, {
            redirectTo: window.location.origin + '/apps/academy/login.html'
        });

        if (error) {
            toast('error', 'Failed to send', error.message);
        } else {
            toast('success', 'Reset sent', `Instructions sent to ${currentProfile.email}.`);
        }
    }

    function handleSuspend() {
        const body = `
            <p>Are you sure you want to suspend <strong>${window.ASLDS.Admin.escapeHtml(currentProfile.full_name)}</strong>?</p>
            <p class="text-danger">They will be logged out and blocked from signing in until reactivated.</p>
        `;
        const footer = `
            <button class="btn btn-outline" type="button" onclick="ASLDS.Modal.close()">Cancel</button>
            <button class="btn btn-danger" type="button" id="confirm-suspend">Suspend</button>
        `;

        openModal('Suspend Account', body, footer);

        document.getElementById('confirm-suspend').addEventListener('click', async () => {
            const btn = document.getElementById('confirm-suspend');
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Suspending…';

            const client = getClient();
            const { error } = await client
                .from('profiles')
                .update({ suspended_at: new Date().toISOString() })
                .eq('id', currentProfile.id);

            if (error) {
                toast('error', 'Failed', error.message);
                btn.disabled = false;
                btn.innerHTML = 'Suspend';
                return;
            }

            toast('success', 'Account suspended', 'User cannot log in.');
            closeModal();
            currentProfile.suspended_at = new Date().toISOString();
            renderWidget(currentProfile);
        });
    }

    function handleReactivate() {
        const body = `
            <p>Reactivate <strong>${window.ASLDS.Admin.escapeHtml(currentProfile.full_name)}</strong>?</p>
            <p>They will be able to log in again immediately.</p>
        `;
        const footer = `
            <button class="btn btn-outline" type="button" onclick="ASLDS.Modal.close()">Cancel</button>
            <button class="btn btn-success" type="button" id="confirm-reactivate">Reactivate</button>
        `;

        openModal('Reactivate Account', body, footer);

        document.getElementById('confirm-reactivate').addEventListener('click', async () => {
            const btn = document.getElementById('confirm-reactivate');
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Reactivating…';

            const client = getClient();
            const { error } = await client
                .from('profiles')
                .update({ suspended_at: null })
                .eq('id', currentProfile.id);

            if (error) {
                toast('error', 'Failed', error.message);
                btn.disabled = false;
                btn.innerHTML = 'Reactivate';
                return;
            }

            toast('success', 'Account active', 'User can log in again.');
            closeModal();
            currentProfile.suspended_at = null;
            renderWidget(currentProfile);
        });
    }

    async function handleRoleChange(e) {
        const newRole = e.target.value;
        const previousRole = currentProfile.role;

        if (!confirm(`Change role from "${previousRole}" to "${newRole}"?`)) {
            e.target.value = previousRole;
            return;
        }

        const client = getClient();
        const { error } = await client
            .from('profiles')
            .update({ role: newRole })
            .eq('id', currentProfile.id);

        if (error) {
            toast('error', 'Failed to change role', error.message);
            e.target.value = previousRole;
            return;
        }

        toast('success', 'Role updated', `User is now a ${newRole}.`);
        currentProfile.role = newRole;
    }

    // ----------------------------------------------------------
    // INIT
    // ----------------------------------------------------------
    async function init() {
        const Admin = window.ASLDS.Admin;
        if (!Admin) return;

        const auth = await Admin.requireAdmin();
        if (!auth) return;

        const id = getQuery('id');
        if (!id) return;

        // Fetch fresh profile data
        const client = getClient();
        const { data: profile } = await client.from('profiles').select('*').eq('id', id).single();
        
        if (profile) {
            renderWidget(profile);
        }
    }

    // Run after admin-student.js has loaded the page
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(init, 100));
    } else {
        setTimeout(init, 100);
    }

})(window, document);