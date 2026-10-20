// ============================================================
// PWA REGISTRATION — Registers the service worker
// ============================================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then((reg) => console.log('[PWA] Service Worker registered. Scope:', reg.scope))
            .catch((err) => console.error('[PWA] Service Worker registration failed:', err));
    });
}