const CACHE_NAME = 'hg-imoveis-v2';
const IMAGE_CACHE = 'hg-imoveis-images-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME && k !== IMAGE_CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = event.request.url;

  // Photos from Firebase Storage: serve from cache instantly, refresh in the background
  if (url.includes('firebasestorage.googleapis.com') || url.includes('firebasestorage.app')) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(async (cache) => {
        const cached = await cache.match(event.request);
        const network = fetch(event.request).then((resp) => {
          if (resp && resp.ok) cache.put(event.request, resp.clone());
          return resp;
        }).catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  // App shell: cache-first with network fallback
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).catch(() => cached);
    })
  );
});
