# ⚠️ Critical blocker before we begin

**Resend requires you to own a real domain.** It does NOT accept Netlify subdomains like `asquarel.netlify.app` — you cannot verify DNS records for a domain you don't control.

**Your options:**

| Option | Cost | Time | Notes |
|---|---|---|---|
| **A — Buy a domain** | ₦10,000–15,000/year (.com, .ng, .africa) | 15 min + DNS propagation | Recommended. `asquarel.com` or `asquarel.ng` |
| **B — Use Resend's test domain** | Free | Instant | Only sends to your own email. Works for testing, useless for real users |
| **C — Defer email branding** | Free | — | Keep Supabase's default emails for now, revisit after you have a domain |

**My recommendation: A.** Buy `asquarel.com` (~$10/year from Namecheap or Google Domains). You'll need it eventually anyway, and it unlocks Resend, custom email addresses (`hello@asquarel.com`), and better SEO.

**If you can't buy a domain right now:** do Option B for testing the flow, then swap to a real domain later. Everything else in this implementation works — only the email sending provider changes.

**Tell me which option you're going with before proceeding.** The rest of this response assumes you'll have a domain (A or B) at some point.

---

# What we're building

**Current flow:**
1. User enters email + password + name
2. Supabase sends a "Confirm your email" link
3. User clicks link → account activated

**New flow:**
1. User enters email + password + name
2. Supabase sends a **6-digit OTP** (from your branded email)
3. User enters OTP on a second screen
4. Verified → account activated

**Constraints:**
- 6-digit code
- 21-minute expiry
- 3 failed attempts → 21-minute lockout

---

# Step 1 — Resend setup

Assuming you have a domain (e.g., `asquarel.com`):

1. Sign up at **resend.com** (GitHub login is fastest)
2. Go to **Domains** → **Add Domain**
3. Enter `updates.asquarel.com` (subdomain, not root — better deliverability per Resend docs)
4. Resend shows 3 DNS records (SPF, DKIM, and optionally DMARC). **Add them to your domain's DNS provider.**
5. Click **Verify DNS Records** — usually takes 5-10 minutes
6. Once verified, go to **API Keys** → **Create API Key**
7. Name it `A Square L Academy`, permission `Full access`, click **Create**
8. **Copy the API key** (starts with `re_`) — save it somewhere safe

**Free tier:** 3,000 emails/month, 100/day. Plenty.

---

# Step 2 — Supabase SMTP configuration

**In Supabase dashboard:**

1. Go to **Authentication → Emails → SMTP Settings**
2. Toggle **Enable Custom SMTP** ON
3. Fill in:

| Field | Value |
|---|---|
| Host | `smtp.resend.com` |
| Port | `465` |
| Username | `resend` |
| Password | *(your Resend API key — the `re_...` one)* |
| Sender email | `no-reply@updates.asquarel.com` |
| Sender name | `A Square L Academy` |

4. **Save**

**Then configure rate limits:**

Go to **Authentication → Rate Limits**. Set:

| Field | Value |
|---|---|
| Emails per hour | `30` |
| OTP expiry (seconds) | `1260` (that's 21 minutes) |
| OTP length | `6` |

**Save.**

**Verify it worked:**
- Go to **Authentication → Users** → click your test user → **Send confirmation email**
- Check your inbox — the email should come from `no-reply@updates.asquarel.com`

---

# Step 3 — Branded email template

**In Supabase → Authentication → Email Templates:**

Click the **"Confirm signup"** template. Replace the entire content with this:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify your email</title>
</head>
<body style="margin:0; padding:0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background:#0a0a0a; color:#e5e5e5;">

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#0a0a0a;">
        <tr>
            <td align="center" style="padding:40px 20px;">

                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="max-width:560px; background:#111111; border-radius:18px; border:1px solid #222222; overflow:hidden;">

                    <!-- Header -->
                    <tr>
                        <td style="padding:40px 40px 20px; text-align:center; border-bottom:1px solid #1f1f1f;">
                            <div style="font-size:24px; font-weight:800; color:#ffffff; letter-spacing:0.5px;">
                                A SQUARE L <span style="color:#D4AF37;">ACADEMY</span>
                            </div>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding:40px;">

                            <h1 style="margin:0 0 16px; font-size:26px; font-weight:700; color:#ffffff; line-height:1.3;">
                                Verify your email address
                            </h1>

                            <p style="margin:0 0 24px; font-size:16px; line-height:1.6; color:#b3b3b3;">
                                Hi {{ .Data.full_name }},
                            </p>

                            <p style="margin:0 0 24px; font-size:16px; line-height:1.6; color:#b3b3b3;">
                                Thanks for signing up for A Square L Academy. Enter this code to verify your email and finish creating your account.
                            </p>

                            <!-- OTP Code -->
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:32px 0;">
                                <tr>
                                    <td align="center" style="background:#1a1a1a; border:2px solid #D4AF37; border-radius:14px; padding:28px;">
                                        <div style="font-size:13px; color:#D4AF37; text-transform:uppercase; letter-spacing:2px; font-weight:700; margin-bottom:12px;">
                                            Your verification code
                                        </div>
                                        <div style="font-size:42px; font-weight:900; color:#ffffff; letter-spacing:12px; font-family:'Courier New', monospace;">
                                            {{ .Token }}
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin:0 0 8px; font-size:14px; line-height:1.6; color:#777777;">
                                This code expires in 21 minutes. If you didn't request this, you can safely ignore this email.
                            </p>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding:24px 40px; border-top:1px solid #1f1f1f; text-align:center;">
                            <p style="margin:0; font-size:13px; color:#666666; line-height:1.6;">
                                A Square L Innovate · Kano, Nigeria
                            </p>
                            <p style="margin:8px 0 0; font-size:12px; color:#444444;">
                                You received this email because someone signed up for A Square L Academy with this address.
                            </p>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>
```

**Set the Subject to:** `Verify your email — A Square L Academy`

Click **Save**.

**Key template variables:**
- `{{ .Token }}` — the 6-digit OTP
- `{{ .Data.full_name }}` — pulls from user metadata you pass during signup
- `{{ .SiteURL }}` — your site URL (in case you want a link)
- `{{ .ConfirmationURL }}` — the default magic-link URL (we're not using it)

---

# Step 4 — Database migration

Open **Supabase → SQL Editor → New query**. Paste and run:

```sql
-- ================================================
-- MIGRATION 008 — Email verification attempt tracking
-- ================================================

ALTER TABLE profiles
    ADD COLUMN email_verify_attempts int NOT NULL DEFAULT 0,
    ADD COLUMN email_verify_locked_until timestamptz;

-- Helper function to check + increment attempts atomically.
-- Called from client before verifyOtp to enforce 3-attempt limit.
CREATE OR REPLACE FUNCTION check_verify_attempts(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_attempts int;
    v_locked_until timestamptz;
    v_remaining int;
BEGIN
    SELECT email_verify_attempts, email_verify_locked_until
    INTO v_attempts, v_locked_until
    FROM profiles WHERE id = p_user_id;

    IF v_locked_until IS NOT NULL AND v_locked_until > now() THEN
        RETURN jsonb_build_object(
            'allowed', false,
            'locked_until', v_locked_until,
            'remaining_seconds', EXTRACT(EPOCH FROM (v_locked_until - now()))::int
        );
    END IF;

    -- If lock has expired, reset
    IF v_locked_until IS NOT NULL AND v_locked_until <= now() THEN
        UPDATE profiles
        SET email_verify_attempts = 0, email_verify_locked_until = NULL
        WHERE id = p_user_id;
        v_attempts := 0;
    END IF;

    v_remaining := 3 - v_attempts;

    RETURN jsonb_build_object(
        'allowed', true,
        'attempts', v_attempts,
        'remaining', v_remaining
    );
END;
$$;

GRANT EXECUTE ON FUNCTION check_verify_attempts(uuid) TO authenticated;

-- Function to record a failed attempt
CREATE OR REPLACE FUNCTION record_failed_verify(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_attempts int;
BEGIN
    UPDATE profiles
    SET email_verify_attempts = email_verify_attempts + 1
    WHERE id = p_user_id
    RETURNING email_verify_attempts INTO v_attempts;

    IF v_attempts >= 3 THEN
        UPDATE profiles
        SET email_verify_locked_until = now() + interval '21 minutes'
        WHERE id = p_user_id;

        RETURN jsonb_build_object('locked', true, 'locked_until_minutes', 21);
    END IF;

    RETURN jsonb_build_object('locked', false, 'remaining', 3 - v_attempts);
END;
$$;

GRANT EXECUTE ON FUNCTION record_failed_verify(uuid) TO authenticated;
```

**Verify:** "Success. No rows returned." Then check Table Editor → `profiles` shows the two new columns.

---

# Step 5 — Updated `packages/shared/js/auth.js`

Replace the entire file:

```javascript
// ============================================================
// A SQUARE L INNOVATE — Auth Module
// Handles email + password signup with OTP verification.
// ============================================================

(function (window, document) {
    'use strict';

    function getClient() {
        if (!window.SupabaseClient) {
            console.error('[Auth] Supabase client not initialized.');
            return null;
        }
        return window.SupabaseClient;
    }

    function toast(type, title, message) {
        if (window.ASLDS && window.ASLDS.Toast && typeof window.ASLDS.Toast.show === 'function') {
            window.ASLDS.Toast.show({ type, title, message });
        } else {
            console.log(`[${type}] ${title}: ${message}`);
        }
    }

    // ----------------------------------------------------------
    // SIGN UP — creates unverified account + triggers OTP email
    // ----------------------------------------------------------
    async function signUp({ email, password, fullName }) {
        const c = getClient();
        if (!c) return { user: null, error: 'Supabase not ready' };

        const { data, error } = await c.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName }
            }
        });

        if (error) return { user: null, error: error.message };
        return { user: data.user, error: null };
    }

    // ----------------------------------------------------------
    // VERIFY OTP — completes email verification
    // ----------------------------------------------------------
    async function verifyOtp({ email, token }) {
        const c = getClient();
        if (!c) return { user: null, error: 'Supabase not ready' };

        const { data, error } = await c.auth.verifyOtp({
            email,
            token,
            type: 'signup'
        });

        if (error) return { user: null, error: error.message };
        return { user: data.user, error: null };
    }

    // ----------------------------------------------------------
    // RESEND OTP
    // ----------------------------------------------------------
    async function resendOtp({ email }) {
        const c = getClient();
        if (!c) return { error: 'Supabase not ready' };

        const { error } = await c.auth.resend({
            type: 'signup',
            email
        });

        return { error: error ? error.message : null };
    }

    // ----------------------------------------------------------
    // SIGN IN
    // ----------------------------------------------------------
    async function signIn({ email, password }) {
        const c = getClient();
        if (!c) return { user: null, error: 'Supabase not ready' };

        const { data, error } = await c.auth.signInWithPassword({ email, password });
        if (error) return { user: null, error: error.message };
        return { user: data.user, error: null };
    }

    async function signOut() {
        const c = getClient();
        if (!c) return { error: 'Supabase not ready' };
        const { error } = await c.auth.signOut();
        return { error: error ? error.message : null };
    }

    async function getUser() {
        const c = getClient();
        if (!c) return null;
        const { data } = await c.auth.getUser();
        return data ? data.user : null;
    }

    async function getSession() {
        const c = getClient();
        if (!c) return null;
        const { data } = await c.auth.getSession();
        return data ? data.session : null;
    }

    function onAuthChange(callback) {
        const c = getClient();
        if (!c) return () => {};
        const { data } = c.auth.onAuthStateChange(callback);
        return () => data.subscription.unsubscribe();
    }

    async function requireAuth(redirectUrl) {
        const session = await getSession();
        if (!session) {
            window.location.href = redirectUrl || 'login.html';
            return null;
        }
        return session;
    }

    async function redirectIfLoggedIn(targetUrl) {
        const session = await getSession();
        if (session) {
            window.location.href = targetUrl || 'dashboard.html';
            return true;
        }
        return false;
    }

    async function signInWithGoogle() {
        const c = getClient();
        if (!c) return { error: 'Supabase not ready' };
        const redirectTo = new URL('dashboard.html', window.location.href).href;
        const { error } = await c.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo }
        });
        return { error: error ? error.message : null };
    }

    // ----------------------------------------------------------
    // ATTEMPT TRACKING (calls SECURITY DEFINER functions)
    // ----------------------------------------------------------
    async function checkVerifyAttempts(userId) {
        const c = getClient();
        if (!c) return { allowed: true };
        const { data, error } = await c.rpc('check_verify_attempts', { p_user_id: userId });
        if (error) return { allowed: true }; // fail open — don't block on API error
        return data;
    }

    async function recordFailedVerify(userId) {
        const c = getClient();
        if (!c) return { locked: false };
        const { data, error } = await c.rpc('record_failed_verify', { p_user_id: userId });
        if (error) return { locked: false };
        return data;
    }

    // ----------------------------------------------------------
    // FORM WIRING
    // ----------------------------------------------------------
    function wireLoginForm() {
        const form = document.querySelector('[data-auth="login"]');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const original = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing in…';

            const email = form.querySelector('input[type="email"]').value.trim();
            const password = form.querySelector('input[type="password"]').value;

            const { user, error } = await signIn({ email, password });
            btn.disabled = false;
            btn.innerHTML = original;

            if (error) {
                // Special case: unverified email
                if (error.toLowerCase().includes('email not confirmed') ||
                    error.toLowerCase().includes('not confirmed')) {
                    toast('warning', 'Email not verified', 'Redirecting to verification…');
                    setTimeout(() => {
                        window.location.href = `register.html?verify=${encodeURIComponent(email)}`;
                    }, 1200);
                    return;
                }
                toast('error', 'Sign in failed', error);
                return;
            }

            toast('success', 'Welcome back', 'Redirecting…');
            setTimeout(() => { window.location.href = 'dashboard.html'; }, 700);
        });
    }

    function wireRegisterForm() {
        const form = document.querySelector('[data-auth="register"]');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const original = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating account…';

            const fullName = form.querySelector('input[name="name"]').value.trim();
            const email = form.querySelector('input[type="email"]').value.trim();
            const password = form.querySelector('input[type="password"]').value;

            const { user, error } = await signUp({ email, password, fullName });
            btn.disabled = false;
            btn.innerHTML = original;

            if (error) {
                toast('error', 'Registration failed', error);
                return;
            }

            toast('success', 'Check your email', 'We sent you a 6-digit code.');

            // Redirect to verification step
            setTimeout(() => {
                window.location.href = `register.html?verify=${encodeURIComponent(email)}&name=${encodeURIComponent(fullName)}`;
            }, 800);
        });
    }

    function wireGoogleButtons() {
        document.querySelectorAll('[data-auth-google]').forEach(btn => {
            btn.addEventListener('click', async () => {
                btn.disabled = true;
                const { error } = await signInWithGoogle();
                if (error) {
                    toast('error', 'Google sign-in failed', error);
                    btn.disabled = false;
                }
            });
        });
    }

    function boot() {
        wireLoginForm();
        wireRegisterForm();
        wireGoogleButtons();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

    window.ASLDS = window.ASLDS || {};
    window.ASLDS.Auth = {
        signUp,
        verifyOtp,
        resendOtp,
        signIn,
        signOut,
        getUser,
        getSession,
        onAuthChange,
        signInWithGoogle,
        requireAuth,
        redirectIfLoggedIn,
        checkVerifyAttempts,
        recordFailedVerify
    };

})(window, document);
```

---

# Step 6 — Updated `apps/academy/register.html`

Two things need to change:

**Change 1:** The main form gets a `data-auth="register"` attribute (already there from earlier).

**Change 2:** Add a **verification step** — an OTP entry screen that shows when `?verify=email` is in the URL.

Add this block right before the closing `</main>`:

```html
<!-- ========================================== -->
<!-- OTP VERIFICATION STEP (hidden until needed) -->
<!-- ========================================== -->
<div id="verify-step" class="auth-card" hidden>
    <header class="auth-card-header">
        <h1 class="auth-card-title">Verify your email</h1>
        <p class="auth-card-subtitle">
            We sent a 6-digit code to <strong id="verify-email">your email</strong>.
        </p>
    </header>

    <form class="form" id="otp-form">
        <div class="form-group">
            <label class="form-label" for="otp-input">Verification code</label>
            <input
                id="otp-input"
                class="form-control"
                type="text"
                inputmode="numeric"
                pattern="[0-9]*"
                maxlength="6"
                autocomplete="one-time-code"
                placeholder="000000"
            />
            <p class="form-text" id="otp-error" hidden></p>
        </div>

        <button type="submit" class="btn btn-primary btn-block" id="otp-submit">
            Verify &amp; Continue <i class="fa-solid fa-arrow-right"></i>
        </button>
    </form>

    <p class="auth-footer-note">
        Didn't get the code?
        <a href="#" id="resend-link">Resend</a>
        <span id="resend-timer"></span>
    </p>

    <p class="auth-footer-note">
        <a href="register.html">← Back to sign up</a>
    </p>
</div>
```

**Also add this script at the very bottom** (before `</body>`), AFTER `auth.js`:

```html
<script src="../../packages/shared/js/register-verify.js"></script>
```

---

# Step 7 — New file `packages/shared/js/register-verify.js`

Save as `A-Square-L-Innovate/packages/shared/js/register-verify.js`:

```javascript
// ============================================================
// A SQUARE L INNOVATE — OTP Verification Step
// Shown on register.html when URL contains ?verify=email
// ============================================================

(function (window, document) {
    'use strict';

    function getQuery(name) {
        return new URLSearchParams(window.location.search).get(name);
    }

    function toast(type, title, message) {
        if (window.ASLDS && window.ASLDS.Toast) {
            window.ASLDS.Toast.show({ type, title, message });
        }
    }

    function showError(msg) {
        const el = document.getElementById('otp-error');
        if (!el) return;
        el.textContent = msg;
        el.hidden = false;
        el.classList.add('text-error');
    }

    function clearError() {
        const el = document.getElementById('otp-error');
        if (!el) return;
        el.textContent = '';
        el.hidden = true;
    }

    async function startResendCooldown(seconds) {
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
        if (!email) return;

        // Hide the register form, show verify step
        const registerCard = document.querySelector('[data-auth="register"]')?.closest('.auth-card');
        const verifyStep = document.getElementById('verify-step');
        if (registerCard) registerCard.hidden = true;
        if (verifyStep) verifyStep.hidden = false;

        const emailEl = document.getElementById('verify-email');
        if (emailEl) emailEl.textContent = email;

        // Start 60-second resend cooldown from page load
        startResendCooldown(60);

        const form = document.getElementById('otp-form');
        const input = document.getElementById('otp-input');
        const submit = document.getElementById('otp-submit');
        const resendLink = document.getElementById('resend-link');

        if (input) input.focus();

        // Check if user is currently locked
        const client = window.SupabaseClient;
        const { data: { user } } = await client.auth.getUser();
        if (user) {
            const status = await window.ASLDS.Auth.checkVerifyAttempts(user.id);
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

                // Pre-check attempts
                const { data: { user: u } } = await client.auth.getUser();
                if (u) {
                    const status = await window.ASLDS.Auth.checkVerifyAttempts(u.id);
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

                    if (u) {
                        const rec = await window.ASLDS.Auth.recordFailedVerify(u.id);
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
                if (error) {
                    showError(error);
                    return;
                }
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
```

---

# Step 8 — Update QuickRef

Add to the JavaScript modules section of the QuickRef:

```markdown
REGISTER VERIFY (register-verify.js)
--------------------------------------------------------------------------------
Handles the OTP verification step on register.html.
Activated when URL contains ?verify=email

- Reads email from query param
- Hides register form, shows OTP step
- 60-second resend cooldown
- Pre-check + post-check attempt tracking (3 max, 21-min lockout)
- On success → dashboard.html

Load after auth.js on register.html.
```

Also add a new **utility block**:

```markdown
EMAIL VERIFICATION
--------------------------------------------------------------------------------
Methods:  6-digit OTP via Resend SMTP
Expiry:   21 minutes
Attempts: 3 max, then 21-minute lockout
Provider: Resend (custom SMTP)
Template: Supabase → Auth → Email Templates → Confirm signup
DB funcs: check_verify_attempts(uuid) · record_failed_verify(uuid)
```

---

# Step 9 — Deploy and test

```powershell
node scripts/build.js
git add .
git commit -m "Add branded email OTP verification with 3-attempt lockout"
git push
```

Wait ~30s, then test:

**Test 1 — Happy path:**
1. Open `https://asquarel.netlify.app/apps/academy/register.html`
2. Fill in a fresh email (different from any existing account), strong password, your name
3. Check terms → Submit
4. Should show "Check your email" toast, then redirect to OTP step
5. **Open your email inbox** — you should see a branded email from `no-reply@updates.asquarel.com` with a big 6-digit code
6. Enter the code → verify
7. Redirect to dashboard

**Test 2 — Wrong code:**
1. Open `?verify=youremail@example.com` (or repeat step 1–4 with a fresh email)
2. Enter wrong 6-digit code
3. Should show error + "2 attempts left"
4. Enter wrong again → "1 attempt left"
5. Enter wrong a third time → "Locked for 21 minutes", inputs disabled

**Test 3 — Resend:**
1. On the OTP screen, click Resend
2. Should show "Code resent" toast
3. Link disabled for 60 seconds

**Test 4 — Login with unverified:**
1. Create an account but DON'T verify
2. Try to sign in with that email + password
3. Should show "Email not verified" and redirect to the verification step

**Verify in Supabase:**
- Table Editor → `profiles` → your test user → check `email_verify_attempts` and `email_verify_locked_until` update on failed attempts
- Authentication → Users → user shows "Confirmed" after successful verification

---

# Report back

1. **Did you buy a domain, or use Resend's test mode?**
2. **Did Resend DNS verify?** ✅ / ❌
3. **Did the branded email arrive?** ✅ / ❌ (screenshot if possible)
4. **Did OTP verification complete?** ✅ / ❌
5. **Did the 3-attempt lockout trigger?** ✅ / ❌
6. **Any errors?** paste them

Once confirmed, we go back to **Path A** — you do a full user journey test, then we tackle whatever bugs you find.