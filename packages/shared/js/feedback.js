// ============================================================
// A SQUARE L INNOVATE — Feedback Form
// Works for both signed-in and anonymous users.
// ============================================================

(function (window, document) {
    'use strict';

    function getClient() { return window.SupabaseClient || null; }

    function toast(type, title, message) {
        if (window.ASLDS && window.ASLDS.Toast) {
            window.ASLDS.Toast.show({ type, title, message });
        }
    }

    async function getCurrentUser() {
        const client = getClient();
        if (!client) return null;
        const { data: { session } } = await client.auth.getSession();
        return session ? session.user : null;
    }

    function getPageContext() {
        const params = new URLSearchParams(window.location.search);
        const from = params.get('from');
        return from || document.referrer || 'unknown';
    }

    async function submitFeedback(data) {
        const client = getClient();
        if (!client) return { error: 'Supabase not ready' };

        const { error } = await client.from('feedback').insert({
            user_id: data.userId || null,
            email: data.email || null,
            category: data.category,
            rating: data.rating || null,
            message: data.message,
            page_url: data.pageUrl
        });

        return { error: error ? error.message : null };
    }

    function prefillEmail(user) {
        if (!user) return;
        const emailInput = document.querySelector('[data-field="email"]');
        if (emailInput && !emailInput.value) {
            emailInput.value = user.email || '';
        }
    }

    function wireRatingStars() {
        const stars = document.querySelectorAll('[data-rating-star]');
        const hiddenInput = document.querySelector('[data-field="rating"]');
        if (!stars.length) return;

        stars.forEach((star, idx) => {
            star.addEventListener('click', () => {
                const rating = idx + 1;
                if (hiddenInput) hiddenInput.value = rating;

                stars.forEach((s, i) => {
                    const icon = s.querySelector('i');
                    if (!icon) return;
                    if (i < rating) {
                        icon.classList.remove('fa-regular');
                        icon.classList.add('fa-solid', 'text-gold');
                    } else {
                        icon.classList.remove('fa-solid', 'text-gold');
                        icon.classList.add('fa-regular');
                    }
                });
            });

            star.addEventListener('mouseenter', () => {
                stars.forEach((s, i) => {
                    if (i <= idx) s.classList.add('is-hover');
                });
            });
            star.addEventListener('mouseleave', () => {
                stars.forEach(s => s.classList.remove('is-hover'));
            });
        });
    }

    function wireCategoryButtons() {
        const buttons = document.querySelectorAll('[data-category]');
        const hiddenInput = document.querySelector('[data-field="category"]');
        if (!buttons.length) return;

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const value = btn.getAttribute('data-category');
                if (hiddenInput) hiddenInput.value = value;

                buttons.forEach(b => b.classList.remove('is-selected'));
                btn.classList.add('is-selected');
            });
        });
    }

    function showSuccess() {
        const form = document.querySelector('[data-feedback-form]');
        const success = document.querySelector('[data-feedback-success]');
        if (form) form.hidden = true;
        if (success) success.hidden = false;
    }

    async function boot() {

                const resetBtn = document.querySelector('[data-feedback-reset]');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                window.location.reload();
            });
        }

        
        const form = document.querySelector('[data-feedback-form]');
        if (!form) return;

        const user = await getCurrentUser();
        prefillEmail(user);

        wireRatingStars();
        wireCategoryButtons();

        // Default category
        const categoryInput = document.querySelector('[data-field="category"]');
        if (categoryInput && !categoryInput.value) {
            const firstBtn = document.querySelector('[data-category]');
            if (firstBtn) {
                categoryInput.value = firstBtn.getAttribute('data-category');
                firstBtn.classList.add('is-selected');
            }
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const original = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';

            const message = form.querySelector('[data-field="message"]').value.trim();
            if (message.length < 5) {
                toast('error', 'Message too short', 'Please tell us a bit more.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = original;
                return;
            }

            const data = {
                userId: user ? user.id : null,
                email: form.querySelector('[data-field="email"]')?.value.trim() || null,
                category: form.querySelector('[data-field="category"]').value || 'other',
                rating: parseInt(form.querySelector('[data-field="rating"]')?.value, 10) || null,
                message: message,
                pageUrl: getPageContext()
            };

            const { error } = await submitFeedback(data);

            if (error) {
                toast('error', 'Send failed', error);
                submitBtn.disabled = false;
                submitBtn.innerHTML = original;
                return;
            }

            toast('success', 'Thank you!', 'Your feedback helps us improve.');
            showSuccess();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})(window, document);