// ============================================================
// A SQUARE L INNOVATE — Admin Lesson Editor
// URL: lesson-edit.html?id={uuid}
// ============================================================

(function (window, document) {
    'use strict';

    let currentLesson = null;

    function setValue(sel, value) {
        const el = document.querySelector(sel);
        if (el) el.value = value ?? '';
    }

    function readValue(sel) {
        const el = document.querySelector(sel);
        return el ? el.value : '';
    }

    function setChecked(sel, value) {
        const el = document.querySelector(sel);
        if (el) el.checked = !!value;
    }

    // ----------------------------------------------------------
    // Extract just the YouTube video ID from any format:
    //   "AZsZH1NZ9qU"                                          → "AZsZH1NZ9qU"
    //   "https://youtu.be/AZsZH1NZ9qU"                         → "AZsZH1NZ9qU"
    //   "https://www.youtube.com/watch?v=AZsZH1NZ9qU&list=..." → "AZsZH1NZ9qU"
    //   "AZsZH1NZ9qU&list=RD...&start_radio=1"                 → "AZsZH1NZ9qU"
    // ----------------------------------------------------------
    function extractVideoId(input) {
        if (!input) return '';
        const s = String(input).trim();

        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/|youtube-nocookie\.com\/embed\/)([A-Za-z0-9_-]{11})/,
            /^([A-Za-z0-9_-]{11})(?:[&?#].*)?$/
        ];

        for (const p of patterns) {
            const m = s.match(p);
            if (m) return m[1];
        }

        return s;
    }

    function render(lesson, course) {
        currentLesson = lesson;
        const Admin = window.ASLDS.Admin;

        Admin.setText('[data-lesson-title]', `Lesson ${String(lesson.number).padStart(2, '0')} — ${lesson.title}`);
        Admin.setText('[data-lesson-slug]', lesson.slug);
        Admin.setText('[data-course-name]', course.title);
        Admin.setText('[data-lesson-number]', String(lesson.number).padStart(2, '0'));

        setValue('[data-field="title"]', lesson.title);
        setValue('[data-field="duration_minutes"]', lesson.duration_minutes);
        setValue('[data-field="video_id"]', lesson.video_id || '');
        setValue('[data-field="content"]', lesson.content || '');
        setChecked('[data-field="published"]', lesson.published);

        updateVideoPreview();
    }

    function updateVideoPreview() {
        const preview = document.querySelector('[data-video-preview]');
        const id = extractVideoId(readValue('[data-field="video_id"]'));

        if (!preview) return;

        if (!id) {
            preview.innerHTML = `
                <div class="text-center text-muted is-empty">
                    <i class="fa-solid fa-video fa-2x mb-2"></i>
                    <p class="mb-0">No video yet. Paste a YouTube ID above.</p>
                </div>`;
            return;
        }

        preview.innerHTML = `
            <div class="video-embed">
                <iframe
                    src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0"
                    title="Video preview"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                ></iframe>
            </div>`;
    }

    async function loadCourse(lesson) {
        const client = window.SupabaseClient;
        const { data } = await client
            .from('courses')
            .select('id, title, slug')
            .eq('id', lesson.course_id)
            .single();
        return data;
    }

    async function save() {
        const Admin = window.ASLDS.Admin;
        const btn = document.querySelector('[data-save-btn]');
        if (!btn || !currentLesson) return;

        const original = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving…';

        const updates = {
            title: readValue('[data-field="title"]').trim(),
            duration_minutes: parseInt(readValue('[data-field="duration_minutes"]'), 10) || 0,
            video_id: extractVideoId(readValue('[data-field="video_id"]')) || null,
            content: readValue('[data-field="content"]'),
            published: document.querySelector('[data-field="published"]').checked
        };

        if (!updates.title) {
            Admin.toast('error', 'Title required', 'Lesson title cannot be empty.');
            btn.disabled = false;
            btn.innerHTML = original;
            return;
        }

        const { error } = await Admin.updateLesson(currentLesson.id, updates);

        btn.disabled = false;
        btn.innerHTML = original;

        if (error) {
            Admin.toast('error', 'Save failed', error);
            return;
        }

        Admin.toast('success', 'Lesson saved', 'Students will see the update immediately.');

        setValue('[data-field="video_id"]', updates.video_id || '');

        currentLesson = { ...currentLesson, ...updates };
        Admin.setText('[data-lesson-title]', `Lesson ${String(currentLesson.number).padStart(2, '0')} — ${currentLesson.title}`);
    }

    function wireEvents() {
        document.querySelector('[data-save-btn]')?.addEventListener('click', save);

        const videoInput = document.querySelector('[data-field="video_id"]');
        if (videoInput) {
            videoInput.addEventListener('input', updateVideoPreview);

            videoInput.addEventListener('blur', () => {
                const cleaned = extractVideoId(videoInput.value);
                if (cleaned !== videoInput.value) {
                    videoInput.value = cleaned;
                    updateVideoPreview();
                }
            });
        }
    }

    async function boot() {
        const Admin = window.ASLDS.Admin;

        const auth = await Admin.requireAdmin();
        if (!auth) return;

        Admin.renderAdminIdentity(auth.profile);
        Admin.wireSignOut();

        const id = Admin.getQueryParam('id');
        if (!id) {
            window.location.href = 'index.html';
            return;
        }

        const lesson = await Admin.fetchLesson(id);
        if (!lesson) {
            Admin.setText('[data-lesson-title]', 'Lesson not found');
            return;
        }

        const course = await loadCourse(lesson);
        if (course) {
            const backLink = document.querySelector('[data-back-link]');
            if (backLink) backLink.href = `lessons.html?course=${encodeURIComponent(course.slug)}`;
        }

        render(lesson, course || { title: 'Course' });
        wireEvents();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})(window, document);