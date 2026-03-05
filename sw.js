/* ── Sauna Timer – Service Worker ──────────────────────
   Caches all app files on install so it works fully offline.
─────────────────────────────────────────────────────── */
const CACHE   = 'sauna-v1';
const ASSETS  = [
  './sauna-timer.html',
  './manifest.json',
  './icon.svg',
  './sw.js',
];

/* Install: pre-cache all assets */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())   // activate immediately
  );
});

/* Activate: delete any old caches */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())  // take control of open tabs
  );
});

/* Fetch: cache-first, fall back to network */
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
      .catch(() => caches.match('./sauna-timer.html'))  // offline fallback
  );
});
