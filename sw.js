const CACHE_NAME = 'portal-fallback-v1';
const ASSETS = [
  '/my-pwa-monorepo/',
  '/my-pwa-monorepo/index.html'
];

// Instalar y Cachear recursos del Home
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activar y limpiar cachés antiguas
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia Network-First cayendo al Cache Fallback en el Home
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // El Service Worker global solo interviene en la raíz, dejando las subcarpetas a sus respectivos SW
  if (url.pathname === '/my-pwa-monorepo/' || url.pathname === '/my-pwa-monorepo/index.html') {
    e.respondWith(
      fetch(e.request)
        .catch(() => {
          return caches.match(e.request) || caches.match('/my-pwa-monorepo/index.html');
        })
    );
  }
});
