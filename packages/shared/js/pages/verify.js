// ============================================================
// A SQUARE L INNOVATE — Public Certificate Verification
// URL: /verify/{code}  OR  /verify?code={code}
// No auth required — uses the public verify_certificate() function.
// ============================================================

(function (window, document) {
    'use strict';

    function getClient() { return window.SupabaseClient || null; }

    function setText(sel, value) {
        document.querySelectorAll(sel).forEach(el => el.textContent = value);
    }

    function formatDate(iso) {
        if (!iso) return '—';
        return new Date(iso).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    }

    // Extracts the code from either /verify/CODE or ?code=CODE
    function getCodeFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const fromQuery = params.get('code');
        if (fromQuery) return fromQuery.trim();

        const path = window.location.pathname;
        const match = path.match(/\/verify\/([^/?#]+)/);
        if (match) return decodeURIComponent(match[1]).trim();

        return null;
    }

    function showState(name) {
        const states = {
            loading: document.querySelector('[data-verify-loading]'),
            valid: document.querySelector('[data-verify-valid]'),
            invalid: document.querySelector('[data-verify-invalid]'),
            form: document.querySelector('[data-verify-form]')
        };
        Object.entries(states).forEach(([key, el]) => {
            if (!el) return;
            el.hidden = key !== name;
        });
    }

    async function verify(code) {
        const client = getClient();
        if (!client) return null;

        const { data, error } = await client.rpc('verify_certificate', { p_code: code });
        if (error) {
            console.error('[Verify] rpc error', error);
            return null;
        }
        return data;
    }

    async function runLookup(code) {
        showState('loading');

        const result = await verify(code);

        if (!result || !result.valid) {
            showState('invalid');
            return;
        }

        setText('[data-verify-name]', result.student_name);
        setText('[data-verify-course]', result.course_title);
        setText('[data-verify-date]', formatDate(result.issued_at));
        setText('[data-verify-number]', result.certificate_number);

        showState('valid');
    }

    function wireForm() {
        const form = document.querySelector('[data-verify-form-el]');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = form.querySelector('#verify-code-input');
            const code = input.value.trim();
            if (!code) return;

            // Update URL so it's shareable/bookmarkable
            const newUrl = `${window.location.origin}/verify/${encodeURIComponent(code)}`;
            window.history.pushState({}, '', newUrl);

            runLookup(code);
        });
    }

    function boot() {
        wireForm();

        const code = getCodeFromUrl();
        if (!code) {
            // No code in URL — show the empty form
            showState('form');
            return;
        }

        // Pre-fill the form input for reference
        const input = document.querySelector('#verify-code-input');
        if (input) input.value = code;

        runLookup(code);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})(window, document);