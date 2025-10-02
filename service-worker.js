const CACHE_NAME = 'taskxchange-cache-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Cache static assets on install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Fetch with cache-first strategy for static assets
self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.match(request).then(cachedResp => {
      if (cachedResp) return cachedResp;
      return fetch(request).then(networkResp => {
        // Cache new GET requests for future offline use (optional)
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(request, networkResp.clone());
          return networkResp;
        });
      }).catch(() => {
        // Offline fallback page could be served here if created
        if (request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});