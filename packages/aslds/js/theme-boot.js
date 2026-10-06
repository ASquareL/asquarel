// ============================================================
// ASLDS THEME BOOT
// Runs synchronously in <head> BEFORE the body renders.
// Reads saved theme preference + system preference and sets
// data-theme on <html> immediately, preventing the dark→light
// flash on page load.
//
// MUST be loaded via <script> (not defer, not async) as the
// FIRST script in <head>.
// ============================================================

(function () {
    try {
        var STORAGE_KEY = 'ASLDS::theme-mode';
        var stored = localStorage.getItem(STORAGE_KEY) || 'auto';
        var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        var systemTheme = systemDark ? 'dark' : 'light';
        var effective = (stored === 'light' || stored === 'dark') ? stored : systemTheme;

        document.documentElement.setAttribute('data-theme', effective);
        document.documentElement.setAttribute('data-theme-mode', stored);

        // Add transitioning class to suppress CSS transitions during initial paint
        document.documentElement.classList.add('theme-transitioning');
        window.addEventListener('load', function () {
            document.documentElement.classList.remove('theme-transitioning');
        });
    } catch (e) {
        // localStorage blocked or matchMedia unsupported — fall through to default dark
    }
})();