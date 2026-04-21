self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', () => {
  // Service worker minimal pour rendre la PWA installable
  // sans mettre en cache agressivement l’application.
});