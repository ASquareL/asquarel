// ============================================================
// A SQUARE L INNOVATE — Lesson Viewer
// Data-driven: reads lesson slug from ?id= query param.
// Renders sidebar + content + progress for one lesson.
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

    function escapeHtml(str) {
        if (str == null) return '';
        return String(str)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function setText(sel, value) {
        document.querySelectorAll(sel).forEach(el => el.textContent = value);
    }

    function getQueryParam(name) {
        return new URLSearchParams(window.location.search).get(name);
    }

    function getCourseSlug() {
        const el = document.querySelector('[data-course]');
        return el ? el.getAttribute('data-course') : null;
    }

    const state = {
        session: null,
        course: null,
        lessons: [],
        progressMap: {},
        currentLesson: null
    };

    async function requireAuth() {
        const client = getClient();
        if (!client) return null;
        const { data: { session } } = await client.auth.getSession();
        if (!session) {
            window.location.href = '../../login.html';
            return null;
        }
        return session;
    }

    async function fetchCourse(slug) {
        const client = getClient();
        const { data, error } = await client
            .from('courses')
            .select('id, slug, title, lessons_count')
            .eq('slug', slug)
            .single();
        if (error) { console.error('[Lesson] course', error); return null; }
        return data;
    }

    async function fetchLessons(courseId) {
        const client = getClient();
        const { data, error } = await client
            .from('lessons')
            .select(`
                id, number, slug, title, duration_minutes, video_id, content, resources,
                module:modules(id, title, order_index)
            `)
            .eq('course_id', courseId)
            .eq('published', true)
            .order('number');
        if (error) { console.error('[Lesson] lessons', error); return []; }
        return data || [];
    }

    async function fetchProgress(userId, courseId) {
        const client = getClient();
        const { data, error } = await client
            .from('lesson_progress')
            .select('lesson_id, status')
            .eq('user_id', userId)
            .eq('course_id', courseId);
        if (error) { console.error('[Lesson] progress', error); return {}; }
        const map = {};
        (data || []).forEach(r => { map[r.lesson_id] = r.status; });
        return map;
    }

    async function saveProgress(userId, lessonId, courseId, status) {
        const client = getClient();
        const payload = {
            user_id: userId,
            lesson_id: lessonId,
            course_id: courseId,
            status: status,
            completed_at: status === 'completed' ? new Date().toISOString() : null
        };
        const { error } = await client
            .from('lesson_progress')
            .upsert(payload, { onConflict: 'user_id,lesson_id' });
        return { error: error ? error.message : null };
    }

    // ----------------------------------------------------------
    // RENDER — SIDEBAR
    // ----------------------------------------------------------
    function renderSidebar() {
        const { course, lessons, progressMap, currentLesson } = state;

        setText('[data-course-title]', course.title);

        const total = lessons.length;
        const completed = Object.values(progressMap).filter(s => s === 'completed').length;
        const percent = total ? Math.round(100 * completed / total) : 0;

        setText('[data-progress-text]', `${completed} of ${total} complete`);
        setText('[data-progress-percent]', `${percent}%`);
        document.querySelectorAll('[data-progress-fill]').forEach(el => {
            el.style.width = `${percent}%`;
        });

        const moduleMap = new Map();
        lessons.forEach(l => {
            const mid = l.module.id;
            if (!moduleMap.has(mid)) {
                moduleMap.set(mid, {
                    id: mid,
                    title: l.module.title,
                    order: l.module.order_index,
                    lessons: []
                });
            }
            moduleMap.get(mid).lessons.push(l);
        });

        const modules = Array.from(moduleMap.values()).sort((a, b) => a.order - b.order);

        const listEl = document.querySelector('[data-lesson-list]');
        if (!listEl) return;

        listEl.innerHTML = modules.map(m =>
            moduleHtml(m, currentLesson.slug, progressMap)
        ).join('');

        wireModuleToggles();
    }

    function moduleHtml(m, currentSlug, progressMap) {
        const isCurrentModule = m.lessons.some(l => l.slug === currentSlug);
        const allComplete = m.lessons.every(l => progressMap[l.id] === 'completed');
        const someComplete = m.lessons.some(l => progressMap[l.id] === 'completed');

        let badge = '';
        if (allComplete) {
            badge = '<span class="badge badge-sm badge-success">Done</span>';
        } else if (someComplete) {
            badge = '<span class="badge badge-sm badge-warning">In Progress</span>';
        }

        return `
            <div class="lesson-module ${isCurrentModule ? 'is-expanded' : ''}" data-module>
                <button class="lesson-module-header" type="button" aria-expanded="${isCurrentModule}">
                    <div class="lesson-module-info">
                        <span class="lesson-module-num">Module ${m.order}</span>
                        <strong class="lesson-module-title">${escapeHtml(m.title)}</strong>
                    </div>
                    <div class="lesson-module-meta">
                        ${badge}
                        <i class="fa-solid fa-chevron-down lesson-module-chevron"></i>
                    </div>
                </button>
                <div class="lesson-module-lessons">
                    <ul class="sidebar-menu">
                        ${m.lessons.map(l => lessonRowHtml(l, currentSlug, progressMap)).join('')}
                    </ul>
                </div>
            </div>`;
    }

    function lessonRowHtml(lesson, currentSlug, progressMap) {
        const isCurrent = lesson.slug === currentSlug;
        const status = progressMap[lesson.id] || 'not_started';

        let icon, iconColor;
        if (status === 'completed') {
            icon = 'fa-solid fa-circle-check';
            iconColor = 'text-success';
        } else if (isCurrent) {
            icon = 'fa-solid fa-circle-play';
            iconColor = 'text-gold';
        } else {
            icon = 'fa-regular fa-circle';
            iconColor = 'text-muted';
        }

        return `
            <li class="sidebar-item">
                <a href="?id=${encodeURIComponent(lesson.slug)}"
                   class="sidebar-link ${isCurrent ? 'active' : ''}"
                   ${isCurrent ? 'aria-current="page"' : ''}>
                    <i class="${icon} ${iconColor} icon-fixed"></i>
                    <span class="lesson-num text-muted">${String(lesson.number).padStart(2, '0')}</span>
                    <span>${escapeHtml(lesson.title)}</span>
                </a>
            </li>`;
    }

    function wireModuleToggles() {
        document.querySelectorAll('[data-module] .lesson-module-header').forEach(header => {
            header.addEventListener('click', () => {
                const module = header.closest('[data-module]');
                const isExpanded = module.classList.toggle('is-expanded');
                header.setAttribute('aria-expanded', String(isExpanded));
            });
        });
    }

    // ----------------------------------------------------------
    // RENDER — CONTENT
    // ----------------------------------------------------------
    function renderContent() {
        const { lessons, progressMap, currentLesson } = state;
        const idx = lessons.findIndex(l => l.id === currentLesson.id);
        const total = lessons.length;
        const prev = idx > 0 ? lessons[idx - 1] : null;
        const next = idx < total - 1 ? lessons[idx + 1] : null;

        setText('[data-lesson-number]', String(currentLesson.number).padStart(2, '0'));
        setText('[data-lesson-total]', total);
        setText('[data-lesson-duration]', `${currentLesson.duration_minutes} min`);
        setText('[data-lesson-title]', currentLesson.title);
        setText('[data-lesson-module]', currentLesson.module.title);

        const badge = document.querySelector('[data-lesson-status]');
        const status = progressMap[currentLesson.id] || 'not_started';
        if (badge) {
            if (status === 'completed') {
                badge.className = 'badge badge-success';
                badge.textContent = 'Completed';
            } else if (status === 'in_progress') {
                badge.className = 'badge badge-warning';
                badge.textContent = 'In Progress';
            } else {
                badge.className = 'badge';
                badge.textContent = 'Not Started';
            }
        }

        const videoEl = document.querySelector('[data-lesson-video]');
        if (videoEl) {
            if (currentLesson.video_id) {
                videoEl.innerHTML = `
                    <div class="video-embed">
                        <iframe
                            src="https://www.youtube-nocookie.com/embed/${escapeHtml(currentLesson.video_id)}?rel=0"
                            title="${escapeHtml(currentLesson.title)}"
                            loading="lazy"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen
                        ></iframe>
                    </div>`;
            } else {
                videoEl.innerHTML = `
                    <div class="video-embed video-placeholder">
                        <div class="text-center">
                            <i class="fa-solid fa-video fa-3x text-gold mb-3"></i>
                            <p class="mb-0">Video coming soon</p>
                        </div>
                    </div>`;
            }
        }

        const bodyEl = document.querySelector('[data-lesson-body]');
        if (bodyEl) {
            bodyEl.innerHTML = currentLesson.content || '<p class="text-muted">Content coming soon. The video above covers this lesson.</p>';
        }

        const resList = document.querySelector('[data-lesson-resources]');
        const resSection = document.querySelector('[data-lesson-resources-section]');
        const resources = Array.isArray(currentLesson.resources) ? currentLesson.resources : [];
        if (resList && resSection) {
            if (resources.length === 0) {
                resSection.hidden = true;
            } else {
                resSection.hidden = false;
                resList.innerHTML = resources.map(r => `
                    <div class="card">
                        <div class="card-body d-flex align-center gap-3">
                            <i class="fa-solid fa-file fa-2x text-gold"></i>
                            <div>
                                <strong>${escapeHtml(r.name || 'Resource')}</strong>
                                <p class="mb-0">${escapeHtml(r.size || '')}</p>
                            </div>
                            <a href="${escapeHtml(r.url || '#')}" class="btn btn-outline btn-sm ml-auto" download>
                                <i class="fa-solid fa-download"></i> Download
                            </a>
                        </div>
                    </div>
                `).join('');
            }
        }

        const prevBtn = document.querySelector('[data-prev-btn]');
        const nextBtn = document.querySelector('[data-next-btn]');

        if (prevBtn) {
            if (prev) {
                prevBtn.href = `?id=${encodeURIComponent(prev.slug)}`;
                prevBtn.classList.remove('disabled');
                prevBtn.removeAttribute('aria-disabled');
            } else {
                prevBtn.href = '#';
                prevBtn.classList.add('disabled');
                prevBtn.setAttribute('aria-disabled', 'true');
            }
        }
        if (nextBtn) {
            if (next) {
                nextBtn.href = `?id=${encodeURIComponent(next.slug)}`;
                nextBtn.classList.remove('disabled');
                nextBtn.removeAttribute('aria-disabled');
            } else {
                nextBtn.href = '#';
                nextBtn.classList.add('disabled');
                nextBtn.setAttribute('aria-disabled', 'true');
            }
        }

        updateCompleteButton();
        document.title = `Lesson ${String(currentLesson.number).padStart(2, '0')} · ${currentLesson.title} — A Square L Academy`;
    }

    function updateCompleteButton() {
        const btn = document.querySelector('[data-complete-btn]');
        if (!btn) return;
        const status = state.progressMap[state.currentLesson.id] || 'not_started';

        if (status === 'completed') {
            btn.className = 'btn btn-success';
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Completed';
            btn.dataset.action = 'uncomplete';
        } else {
            btn.className = 'btn btn-primary';
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Mark as Complete';
            btn.dataset.action = 'complete';
        }
    }

    function renderNotFound() {
        const content = document.querySelector('[data-lesson-content]');
        if (content) {
            content.innerHTML = `
                <div class="text-center py-5">
                    <div class="avatar avatar-xl avatar-gold mb-4 mx-auto">
                        <i class="fa-solid fa-circle-question fa-3x text-gold"></i>
                    </div>
                    <h1 class="mb-3">Lesson not found</h1>
                    <p class="mb-4">The lesson you're looking for doesn't exist or has been removed.</p>
                    <a href="../index.html" class="btn btn-primary">
                        Back to Course <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>`;
        }
    }

    // ----------------------------------------------------------
    // MOBILE SIDEBAR DRAWER
    // ----------------------------------------------------------
    function wireMobileSidebar() {
        const toggle = document.querySelector('[data-lesson-toggle]');
        const sidebar = document.querySelector('.lesson-sidebar');
        const backdrop = document.querySelector('[data-lesson-backdrop]');
        if (!toggle || !sidebar) return;

        function open() {
            sidebar.classList.add('is-open');
            if (backdrop) backdrop.classList.add('is-visible');
            toggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }

        function close() {
            sidebar.classList.remove('is-open');
            if (backdrop) backdrop.classList.remove('is-visible');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        toggle.addEventListener('click', () => {
            if (sidebar.classList.contains('is-open')) close(); else open();
        });

        if (backdrop) backdrop.addEventListener('click', close);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('is-open')) close();
        });

        sidebar.querySelectorAll('a[href^="?id="]').forEach(a => {
            a.addEventListener('click', () => {
                if (window.innerWidth <= 992) close();
            });
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 992 && sidebar.classList.contains('is-open')) close();
        });
    }

    // ----------------------------------------------------------
    // WIRING
    // ----------------------------------------------------------
    function wireCompleteButton() {
        const btn = document.querySelector('[data-complete-btn]');
        if (!btn) return;

        btn.addEventListener('click', async () => {
            const userId = state.session.user.id;
            const lesson = state.currentLesson;
            const courseId = state.course.id;
            const action = btn.dataset.action;
            const newStatus = action === 'complete' ? 'completed' : 'in_progress';

            btn.disabled = true;
            const original = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving…';

            const { error } = await saveProgress(userId, lesson.id, courseId, newStatus);

            if (error) {
                toast('error', 'Update failed', error);
                btn.disabled = false;
                btn.innerHTML = original;
                return;
            }

            state.progressMap[lesson.id] = newStatus;

            if (newStatus === 'completed') {
                toast('success', 'Lesson complete!', 'Great progress.');
            } else {
                toast('info', 'Marked incomplete', 'You can revisit this lesson.');
            }

            renderSidebar();
            renderContent();

            btn.disabled = false;
        });
    }

    function wireSignOut() {
        document.querySelectorAll('[data-signout]').forEach(el => {
            el.addEventListener('click', async (e) => {
                e.preventDefault();
                const client = getClient();
                if (client) await client.auth.signOut();
                window.location.href = '../../login.html';
            });
        });
    }

    // ----------------------------------------------------------
    // BOOT
    // ----------------------------------------------------------
    async function boot() {
        const session = await requireAuth();
        if (!session) return;
        state.session = session;

        const courseSlug = getCourseSlug();
        const lessonSlug = getQueryParam('id');

        if (!courseSlug || !lessonSlug) {
            renderNotFound();
            return;
        }

        const course = await fetchCourse(courseSlug);
        if (!course) { renderNotFound(); return; }
        state.course = course;

        const [lessons, progressMap] = await Promise.all([
            fetchLessons(course.id),
            fetchProgress(session.user.id, course.id)
        ]);

        if (!lessons.length) { renderNotFound(); return; }
        state.lessons = lessons;
        state.progressMap = progressMap;

        const currentLesson = lessons.find(l => l.slug === lessonSlug);
        if (!currentLesson) { renderNotFound(); return; }
        state.currentLesson = currentLesson;

        renderSidebar();
        renderContent();
        wireCompleteButton();
        wireMobileSidebar();
        wireSignOut();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})(window, document);