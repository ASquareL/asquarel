// ============================================================
// A SQUARE L INNOVATE — Admin Enrollments Overview
// URL: enrollments.html
// ============================================================

(function (window, document) {
    'use strict';

    let allEnrollments = [];
    let allCourses = [];
    let state = {
        search: '',
        courseFilter: 'all',
        statusFilter: 'all',
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
        let list = allEnrollments.slice();

        if (state.search) {
            const q = state.search.toLowerCase();
            list = list.filter(e =>
                (e.user?.full_name || '').toLowerCase().includes(q) ||
                (e.user?.email || '').toLowerCase().includes(q) ||
                (e.user?.reg_number || '').toLowerCase().includes(q)
            );
        }

        if (state.courseFilter !== 'all') {
            list = list.filter(e => e.course?.slug === state.courseFilter);
        }

        if (state.statusFilter === 'completed') {
            list = list.filter(e => !!e.completed_at);
        } else if (state.statusFilter === 'in_progress') {
            list = list.filter(e => !e.completed_at);
        }

        if (state.sort === 'newest') {
            list.sort((a, b) => new Date(b.enrolled_at) - new Date(a.enrolled_at));
        } else if (state.sort === 'oldest') {
            list.sort((a, b) => new Date(a.enrolled_at) - new Date(b.enrolled_at));
        } else if (state.sort === 'progress') {
            list.sort((a, b) => (b.progress?.percentage || 0) - (a.progress?.percentage || 0));
        }

        return list;
    }

    function render() {
        const Admin = window.ASLDS.Admin;
        const list = applyFilters();

        const countEl = document.querySelector('[data-enrollment-count]');
        if (countEl) {
            countEl.textContent = list.length === 1
                ? '1 enrollment'
                : `${list.length} enrollments`;
        }

        const tbody = document.querySelector('[data-enrollments-tbody]');
        if (!tbody) return;

        if (!list.length) {
            const isFiltering = state.search || state.courseFilter !== 'all' || state.statusFilter !== 'all';
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="is-empty">
                        ${isFiltering ? 'No enrollments match your filters.' : 'No enrollments yet.'}
                    </td>
                </tr>`;
            return;
        }

        tbody.innerHTML = list.map(e => {
            const p = e.progress || {};
            const percent = p.percentage || 0;
            const completed = p.completed_lessons || 0;
            const total = p.total_lessons || e.course?.lessons_count || 0;
            const finished = !!e.completed_at;

            return `
                <tr>
                    <td>
                        <div class="d-flex align-center gap-3">
                            <div class="avatar avatar-sm avatar-gold">
                                <span class="avatar-initials">${initials(e.user?.full_name)}</span>
                            </div>
                            <div>
                                <strong class="d-block">${Admin.escapeHtml(e.user?.full_name || 'Unknown')}</strong>
                                <small class="text-muted">${Admin.escapeHtml(e.user?.reg_number || '')}</small>
                            </div>
                        </div>
                    </td>
                    <td>${Admin.escapeHtml(e.course?.title || 'Unknown Course')}</td>
                    <td>${formatDate(e.enrolled_at)}</td>
                    <td>
                        <div class="d-flex justify-between align-center mb-1">
                            <span class="text-gold fw-bold">${percent}%</span>
                            <small class="text-muted">${completed}/${total}</small>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${percent}%"></div>
                        </div>
                    </td>
                    <td>
                        <span class="badge ${finished ? 'badge-success' : 'badge-warning'} badge-sm">
                            ${finished ? 'Completed' : 'In Progress'}
                        </span>
                    </td>
                    <td>
                        <a href="student.html?id=${encodeURIComponent(e.user?.id)}" class="btn btn-outline btn-sm">
                            <i class="fa-solid fa-eye"></i> Student
                        </a>
                    </td>
                </tr>`;
        }).join('');
    }

    // ----------------------------------------------------------
    // WIRING
    // ----------------------------------------------------------
    function wireSearch() {
        const input = document.querySelector('[data-enrollment-search]');
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

    function wireCourseFilter() {
        const select = document.querySelector('[data-filter-course]');
        if (!select) return;
        select.addEventListener('change', () => {
            state.courseFilter = select.value;
            render();
        });
    }

    function wireStatusFilters() {
        document.querySelectorAll('[data-filter-status]').forEach(btn => {
            btn.addEventListener('click', () => {
                state.statusFilter = btn.getAttribute('data-filter-status');
                document.querySelectorAll('[data-filter-status]').forEach(b => b.classList.remove('is-active'));
                btn.classList.add('is-active');
                render();
            });
        });
    }

    function wireSort() {
        const select = document.querySelector('[data-enrollment-sort]');
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
        if (!Admin) return;

        const auth = await Admin.requireAdmin();
        if (!auth) return;

        Admin.renderAdminIdentity(auth.profile);
        Admin.wireSignOut();

        const [enrollments, courses] = await Promise.all([
            Admin.fetchAllEnrollments(),
            Admin.fetchCourses()
        ]);

        allEnrollments = enrollments;
        allCourses = courses;

        // Populate course dropdown
        const select = document.querySelector('[data-filter-course]');
        if (select) {
            select.innerHTML = '<option value="all">All courses</option>' +
                courses.map(c => `<option value="${Admin.escapeHtml(c.slug)}">${Admin.escapeHtml(c.title)}</option>`).join('');
        }

        render();
        wireSearch();
        wireCourseFilter();
        wireStatusFilters();
        wireSort();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})(window, document);