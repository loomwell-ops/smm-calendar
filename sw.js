const CACHE = 'murnova-cal-v3';
const ASSETS = ['./', './index.html', './theme.css', './manifest.webmanifest', './icon.svg', './assets/bg-light.webp', './assets/bg-dark.jpg'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
