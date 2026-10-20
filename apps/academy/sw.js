// ============================================================
// A SQUARE L ACADEMY — Service Worker
// Caches static assets for offline support and speed.
// ============================================================

const CACHE_NAME = 'asl-academy-v1';
const OFFLINE_URL = './dashboard.html';

// Install: skip waiting to activate immediately
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch: Cache-first strategy for static assets, Network-first for HTML
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    if (!event.request.url.startsWith('http')) return;

    // Do NOT cache Supabase API calls, Auth, or third-party CDNs
    if (
        event.request.url.includes('supabase.co') || 
        event.request.url.includes('fonts.googleapis.com') ||
        event.request.url.includes('cdnjs.cloudflare.com') ||
        event.request.url.includes('cdn.jsdelivr.net')
    ) {
        return; 
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // If network works, cache the static asset and return it
                if (response && response.status === 200 && response.type === 'basic') {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return response;
            })
            .catch(() => {
                // If network fails (offline), try to serve from cache
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // Fallback for HTML pages when offline
                    if (event.request.headers.get('accept').includes('text/html')) {
                        return caches.match(OFFLINE_URL);
                    }
                });
            })
    );
});