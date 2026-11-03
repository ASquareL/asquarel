// ============================================================
// A SQUARE L INNOVATE — OTP Verification Step
// Shown on register.html when URL contains ?verify=email
// ============================================================

(function (window, document) {
    'use strict';

    function getQuery(name) { return new URLSearchParams(window.location.search).get(name); }
    function toast(type, title, message) { if (window.ASLDS && window.ASLDS.Toast) window.ASLDS.Toast.show({ type, title, message }); }

    function showError(msg) {
        const el = document.getElementById('otp-error');
        if (el) { el.textContent = msg; el.hidden = false; }
    }

    function clearError() {
        const el = document.getElementById('otp-error');
        if (el) { el.textContent = ''; el.hidden = true; }
    }

    function startResendCooldown(seconds) {
        const link = document.getElementById('resend-link');
        const timer = document.getElementById('resend-timer');
        if (!link || !timer) return;

        link.style.pointerEvents = 'none';
        link.style.opacity = '0.4';

        let remaining = seconds;
        timer.textContent = ` (${remaining}s)`;

        const interval = setInterval(() => {
            remaining--;
            if (remaining <= 0) {
                clearInterval(interval);
                timer.textContent = '';
                link.style.pointerEvents = '';
                link.style.opacity = '';
            } else {
                timer.textContent = ` (${remaining}s)`;
            }
        }, 1000);
    }

    async function boot() {
        const email = getQuery('verify');
        const userId = getQuery('uid'); // We get the UID from the URL
        
        if (!email) return;

        // Hide register form, show OTP step
        const registerCard = document.getElementById('register-card');
        const verifyStep = document.getElementById('verify-step');
        if (registerCard) registerCard.hidden = true;
        if (verifyStep) verifyStep.hidden = false;

        const emailEl = document.getElementById('verify-email');
        if (emailEl) emailEl.textContent = email;

        startResendCooldown(60);

        const form = document.getElementById('otp-form');
        const input = document.getElementById('otp-input');
        const submit = document.getElementById('otp-submit');
        const resendLink = document.getElementById('resend-link');

        if (input) input.focus();

        // 1. Check if user is currently locked using the UID from the URL
        if (userId && window.ASLDS.Auth) {
            const status = await window.ASLDS.Auth.checkVerifyAttempts(userId);
            if (status && status.allowed === false) {
                showError(`Too many attempts. Try again in ${Math.ceil(status.remaining_seconds / 60)} minutes.`);
                if (input) input.disabled = true;
                if (submit) submit.disabled = true;
            }
        }

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                clearError();

                const token = input.value.trim();
                if (!/^\d{6}$/.test(token)) {
                    showError('Please enter a valid 6-digit code.');
                    return;
                }

                // Pre-check attempts before sending to Supabase
                if (userId) {
                    const status = await window.ASLDS.Auth.checkVerifyAttempts(userId);
                    if (status && status.allowed === false) {
                        showError(`Too many attempts. Try again in ${Math.ceil(status.remaining_seconds / 60)} minutes.`);
                        input.disabled = true;
                        submit.disabled = true;
                        return;
                    }
                }

                submit.disabled = true;
                const original = submit.innerHTML;
                submit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verifying…';

                const { error } = await window.ASLDS.Auth.verifyOtp({ email, token });

                if (error) {
                    submit.disabled = false;
                    submit.innerHTML = original;

                    if (userId) {
                        const rec = await window.ASLDS.Auth.recordFailedVerify(userId);
                        if (rec && rec.locked) {
                            showError('Too many failed attempts. Locked for 21 minutes.');
                            input.disabled = true;
                            submit.disabled = true;
                            return;
                        }
                        showError(`${error} (${rec.remaining} attempt${rec.remaining === 1 ? '' : 's'} left)`);
                    } else {
                        showError(error);
                    }
                    return;
                }

                toast('success', 'Email verified!', 'Welcome to A Square L Academy.');
                setTimeout(() => { window.location.href = 'dashboard.html'; }, 700);
            });
        }

        if (resendLink) {
            resendLink.addEventListener('click', async (e) => {
                e.preventDefault();
                clearError();
                const { error } = await window.ASLDS.Auth.resendOtp({ email });
                if (error) { showError(error); return; }
                
                toast('success', 'Code resent', 'Check your inbox again.');
                startResendCooldown(60);
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})(window, document);