// ਕੈਸ਼ ਦਾ ਨਾਮ ਬਦਲ ਕੇ v13 ਕੀਤਾ ਗਿਆ ਤਾਂ ਕਿ ਬ੍ਰਾਊਜ਼ਰ ਨਵੀਂ ਫਾਈਲ ਲੋਡ ਕਰੇ
const CACHE_NAME = 'parchi-cache-v13';
const assets = [
  'index.html',
  'manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
