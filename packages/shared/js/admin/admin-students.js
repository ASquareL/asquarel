// ============================================================
// A SQUARE L INNOVATE — Admin Students List
// URL: students.html
// ============================================================

(function (window, document) {
    'use strict';

    let allStudents = [];
    let state = {
        search: '',
        status: 'all',
        sort: 'newest'
    };

    function formatDate(iso) {
        if (!iso) return '—';
        return new Date(iso).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    }

    function initials(name) {
        if (!name) return '??';
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    // ----------------------------------------------------------
    // FILTER + SORT
    // ----------------------------------------------------------
    function applyFilters() {
        let list = allStudents.slice();

        if (state.search) {
            const q = state.search.toLowerCase();
            list = list.filter(s =>
                (s.full_name || '').toLowerCase().includes(q) ||
                (s.email || '').toLowerCase().includes(q) ||
                (s.reg_number || '').toLowerCase().includes(q)
            );
        }

        if (state.status === 'active') {
            list = list.filter(s => (s.stats.active_days_30 || 0) > 0);
        } else if (state.status === 'inactive') {
            list = list.filter(s => (s.stats.active_days_30 || 0) === 0);
        }

        if (state.sort === 'newest') {
            list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else if (state.sort === 'name') {
            list.sort((a, b) => (a.full_name || '').localeCompare(b.full_name || ''));
        } else if (state.sort === 'active') {
            list.sort((a, b) => (b.stats.lessons_completed || 0) - (a.stats.lessons_completed || 0));
        }

        return list;
    }

    function render() {
        const list = applyFilters();

        const countEl = document.querySelector('[data-student-count]');
        if (countEl) {
            countEl.textContent = list.length === 1
                ? '1 student'
                : `${list.length} students`;
        }

        const tbody = document.querySelector('[data-students-tbody]');
        if (!tbody) return;

        if (!list.length) {
            const isSearching = state.search || state.status !== 'all';
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="is-empty">
                        ${isSearching ? 'No students match your filters.' : 'No students yet.'}
                    </td>
                </tr>`;
            return;
        }

        tbody.innerHTML = list.map(s => {
            const enrolled = s.stats.courses_enrolled || 0;
            const lessons = s.stats.lessons_completed || 0;
            const certs = s.stats.certificates_earned || 0;
            const active = (s.stats.active_days_30 || 0) > 0;

            return `
                <tr>
                    <td>
                        <div class="d-flex align-center gap-3">
                            <div class="avatar avatar-sm avatar-gold">
                                <span class="avatar-initials">${initials(s.full_name)}</span>
                            </div>
                            <div>
                                <strong class="d-block">${window.ASLDS.Admin.escapeHtml(s.full_name)}</strong>
                                <small class="text-muted">${window.ASLDS.Admin.escapeHtml(s.reg_number)}</small>
                            </div>
                        </div>
                    </td>
                    <td>${window.ASLDS.Admin.escapeHtml(s.email)}</td>
                    <td>${enrolled}</td>
                    <td>${lessons}</td>
                    <td>${certs}</td>
                    <td>${formatDate(s.created_at)}</td>
                    <td>
                        <span class="badge ${active ? 'badge-success' : ''} badge-sm">
                            ${active ? 'Active' : 'Inactive'}
                        </span>
                    </td>
                    <td>
                        <a href="student.html?id=${encodeURIComponent(s.id)}" class="btn btn-outline btn-sm">
                            <i class="fa-solid fa-eye"></i> View
                        </a>
                    </td>
                </tr>`;
        }).join('');
    }

    // ----------------------------------------------------------
    // WIRING
    // ----------------------------------------------------------
    function wireSearch() {
        const input = document.querySelector('[data-student-search]');
        if (!input) return;

        let debounce;
        input.addEventListener('input', () => {
            clearTimeout(debounce);
            debounce = setTimeout(() => {
                state.search = input.value.trim();
                render();
            }, 200);
        });
    }

    function wireStatusFilters() {
        document.querySelectorAll('[data-filter-status]').forEach(btn => {
            btn.addEventListener('click', () => {
                state.status = btn.getAttribute('data-filter-status');
                document.querySelectorAll('[data-filter-status]').forEach(b => b.classList.remove('is-active'));
                btn.classList.add('is-active');
                render();
            });
        });
    }

    function wireSort() {
        const select = document.querySelector('[data-student-sort]');
        if (!select) return;
        select.addEventListener('change', () => {
            state.sort = select.value;
            render();
        });
    }

    // ----------------------------------------------------------
    // BOOT
    // ----------------------------------------------------------
    async function boot() {
        const Admin = window.ASLDS.Admin;

        if (!Admin) {
            showError('ASLDS.Admin not loaded. Check script paths in HTML.');
            return;
        }

        try {
            const auth = await Admin.requireAdmin();
            if (!auth) return;

            Admin.renderAdminIdentity(auth.profile);
            Admin.wireSignOut();

            if (typeof Admin.fetchStudentsWithStats !== 'function') {
                showError('Admin.fetchStudentsWithStats is missing. Add helpers to admin.js.');
                return;
            }

            allStudents = await Admin.fetchStudentsWithStats();
            render();
            wireSearch();
            wireStatusFilters();
            wireSort();
        } catch (err) {
            console.error('[admin-students] boot error:', err);
            showError(err.message || String(err));
        }
    }

    function showError(message) {
        const tbody = document.querySelector('[data-students-tbody]');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="is-empty">
                        <strong class="text-danger">Error:</strong> ${message}
                    </td>
                </tr>`;
        }
        const countEl = document.querySelector('[data-student-count]');
        if (countEl) countEl.textContent = 'Error';
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})(window, document);