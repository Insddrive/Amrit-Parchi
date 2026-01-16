// ਵਰਜਨ v8 ਕਰ ਦਿੱਤਾ ਹੈ - ਹੁਣ ਕਰੋਮ ਨੂੰ ਪੁਰਾਣਾ ਛੱਡਣਾ ਹੀ ਪਵੇਗਾ
const CACHE_NAME = 'karah-parshad-v8'; 
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './profile.jpg'
];

self.addEventListener('install', (event) => {
  // ਇਹ ਲਾਈਨ ਪੁਰਾਣੇ ਵਰਕਰ ਨੂੰ ਤੁਰੰਤ ਰੋਕ ਕੇ ਨਵਾਂ ਚਲਾਉਂਦੀ ਹੈ
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // ਪੁਰਾਣਾ ਕੈਸ਼ (v7, v6 ਆਦਿ) ਡਿਲੀਟ ਕਰੋ
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});
