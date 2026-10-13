// ============================================================
// A SQUARE L INNOVATE — Admin Feedback View
// URL: feedback.html
// ============================================================

(function (window, document) {
    'use strict';

    function getClient() { return window.SupabaseClient || null; }

    const state = {
        filterCategory: 'all',
        filterUnresolved: false,
        items: []
    };

    const CATEGORY_LABELS = {
        bug: 'Bug',
        confusion: 'Confusing',
        suggestion: 'Suggestion',
        praise: 'Praise',
        other: 'Other'
    };

    const CATEGORY_BADGES = {
        bug: 'badge-danger',
        confusion: 'badge-warning',
        suggestion: 'badge-info',
        praise: 'badge-success',
        other: ''
    };

    function escapeHtml(str) {
        if (str == null) return '';
        return String(str)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function formatRelative(iso) {
        if (!iso) return '';
        const diff = Date.now() - new Date(iso).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'just now';
        if (mins < 60) return `${mins} min ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
        const days = Math.floor(hrs / 24);
        if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
        return new Date(iso).toLocaleDateString();
    }

    async function fetchFeedback() {
        const client = getClient();
        let query = client
            .from('feedback')
            .select(`
                id, category, rating, message, page_url, email,
                resolved, resolved_at, admin_notes, created_at, user_id,
                user:profiles(full_name, email)
            `)
            .order('created_at', { ascending: false });

        if (state.filterCategory !== 'all') {
            query = query.eq('category', state.filterCategory);
        }
        if (state.filterUnresolved) {
            query = query.eq('resolved', false);
        }

        const { data, error } = await query;
        if (error) { console.error('[Feedback] fetch', error); return []; }
        return data || [];
    }

    async function updateFeedback(id, updates) {
        const client = getClient();
        const { error } = await client.from('feedback').update(updates).eq('id', id);
        return { error: error ? error.message : null };
    }

    // ----------------------------------------------------------
    // RENDER
    // ----------------------------------------------------------
    function ratingHtml(rating) {
        if (!rating) return '';
        let html = '<span class="d-flex gap-1 align-center">';
        for (let i = 1; i <= 5; i++) {
            const solid = i <= rating;
            html += `<i class="fa-${solid ? 'solid' : 'regular'} fa-star ${solid ? 'text-gold' : 'text-muted'}"></i>`;
        }
        html += '</span>';
        return html;
    }

    function itemHtml(item) {
        const catBadge = CATEGORY_BADGES[item.category] || '';
        const catLabel = CATEGORY_LABELS[item.category] || item.category;
        const author = item.user?.full_name || item.email || 'Anonymous';
        const preview = (item.message || '').slice(0, 100);

        return `
            <details class="feedback-item" data-item-id="${escapeHtml(item.id)}" ${!item.resolved ? '' : ''}>
                <summary class="feedback-summary">
                    <div class="feedback-summary-meta">
                        <div class="feedback-summary-title">
                            <span class="badge badge-sm ${catBadge}">${escapeHtml(catLabel)}</span>
                            <strong>${escapeHtml(author)}</strong>
                            ${item.resolved ? '<span class="badge badge-sm badge-success">Resolved</span>' : ''}
                        </div>
                        <div class="feedback-summary-preview">${escapeHtml(preview)}${item.message.length > 100 ? '…' : ''}</div>
                    </div>
                    <div class="feedback-summary-side">
                        ${item.rating ? ratingHtml(item.rating) : ''}
                        <span class="feedback-time">${formatRelative(item.created_at)}</span>
                        <i class="fa-solid fa-chevron-down feedback-chevron"></i>
                    </div>
                </summary>
                <div class="feedback-body">
                    <div class="feedback-message">${escapeHtml(item.message)}</div>

                    <div class="feedback-meta-row">
                        ${item.user?.email || item.email ? `<div><strong>Email:</strong> ${escapeHtml(item.user?.email || item.email)}</div>` : '<div><strong>Signed in:</strong> No</div>'}
                        ${item.page_url ? `<div><strong>From:</strong> ${escapeHtml(item.page_url)}</div>` : ''}
                        <div><strong>Submitted:</strong> ${new Date(item.created_at).toLocaleString()}</div>
                    </div>

                    <div class="feedback-admin">
                        <label class="form-label" for="notes-${escapeHtml(item.id)}">Admin notes</label>
                        <textarea
                            id="notes-${escapeHtml(item.id)}"
                            class="form-control"
                            rows="3"
                            data-notes
                            placeholder="Internal notes about this feedback…"
                        >${escapeHtml(item.admin_notes || '')}</textarea>

                        <div class="feedback-admin-actions">
                            <button type="button" class="btn btn-outline btn-sm" data-save-notes>
                                <i class="fa-solid fa-floppy-disk"></i> Save Notes
                            </button>
                            ${item.resolved
                                ? `<button type="button" class="btn btn-outline btn-sm" data-unresolve>
                                    <i class="fa-solid fa-rotate-left"></i> Reopen
                                   </button>`
                                : `<button type="button" class="btn btn-success btn-sm" data-resolve>
                                    <i class="fa-solid fa-check"></i> Mark Resolved
                                   </button>`
                            }
                        </div>
                    </div>
                </div>
            </details>
        `;
    }

    function renderFeedback(items) {
        const list = document.querySelector('[data-feedback-list]');
        const empty = document.querySelector('[data-feedback-empty]');
        const count = document.querySelector('[data-feedback-count-text]');

        if (count) count.textContent = items.length === 1 ? '1 item' : `${items.length} items`;

        if (!items.length) {
            if (list) list.innerHTML = '';
            if (empty) empty.hidden = false;
            return;
        }
        if (empty) empty.hidden = true;

        list.innerHTML = items.map(itemHtml).join('');
    }

    // ----------------------------------------------------------
    // FILTER WIRING
    // ----------------------------------------------------------
    function wireFilters() {
        document.querySelectorAll('[data-filter-category]').forEach(btn => {
            btn.addEventListener('click', () => {
                const cat = btn.getAttribute('data-filter-category');
                state.filterCategory = cat;
                document.querySelectorAll('[data-filter-category]').forEach(b => b.classList.remove('is-active'));
                btn.classList.add('is-active');
                reload();
            });
        });

        const unresolvedBtn = document.querySelector('[data-filter-unresolved]');
        if (unresolvedBtn) {
            unresolvedBtn.addEventListener('click', () => {
                state.filterUnresolved = !state.filterUnresolved;
                unresolvedBtn.classList.toggle('is-active', state.filterUnresolved);
                reload();
            });
        }
    }

    // ----------------------------------------------------------
    // ITEM ACTION WIRING (delegated)
    // ----------------------------------------------------------
    function wireItemActions() {
        const list = document.querySelector('[data-feedback-list]');
        if (!list) return;

        list.addEventListener('click', async (e) => {
            const item = e.target.closest('[data-item-id]');
            if (!item) return;
            const id = item.getAttribute('data-item-id');

            // Save notes
            if (e.target.closest('[data-save-notes]')) {
                e.preventDefault();
                const btn = e.target.closest('[data-save-notes]');
                const original = btn.innerHTML;
                btn.disabled = true;
                btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving…';

                const notes = item.querySelector('[data-notes]').value.trim();
                const { error } = await updateFeedback(id, { admin_notes: notes || null });

                btn.disabled = false;
                btn.innerHTML = original;

                if (error) {
                    window.ASLDS.Admin.toast('error', 'Save failed', error);
                    return;
                }
                window.ASLDS.Admin.toast('success', 'Notes saved', '');
                return;
            }

            // Resolve
            if (e.target.closest('[data-resolve]')) {
                e.preventDefault();
                const { error } = await updateFeedback(id, {
                    resolved: true,
                    resolved_at: new Date().toISOString()
                });
                if (error) { window.ASLDS.Admin.toast('error', 'Failed', error); return; }
                window.ASLDS.Admin.toast('success', 'Marked resolved', '');
                reload();
                return;
            }

            // Unresolve
            if (e.target.closest('[data-unresolve]')) {
                e.preventDefault();
                const { error } = await updateFeedback(id, {
                    resolved: false,
                    resolved_at: null
                });
                if (error) { window.ASLDS.Admin.toast('error', 'Failed', error); return; }
                window.ASLDS.Admin.toast('success', 'Reopened', '');
                reload();
                return;
            }
        });
    }

    // ----------------------------------------------------------
    async function reload() {
        const list = document.querySelector('[data-feedback-list]');
        if (list) list.innerHTML = '<p class="is-empty">Loading…</p>';
        state.items = await fetchFeedback();
        renderFeedback(state.items);
    }

    // ----------------------------------------------------------
    // BOOT
    // ----------------------------------------------------------
    async function boot() {
        const Admin = window.ASLDS.Admin;
        const auth = await Admin.requireAdmin();
        if (!auth) return;

        Admin.renderAdminIdentity(auth.profile);
        Admin.wireSignOut();

        wireFilters();
        wireItemActions();
        await reload();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})(window, document);