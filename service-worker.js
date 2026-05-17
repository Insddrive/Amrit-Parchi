const CACHE_NAME = 'parchi-cache-v21';
const assets = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // ਨਵੀਂ ਫਾਈਲ ਨੂੰ ਤੁਰੰਤ ਐਕਟਿਵ ਕਰੋ
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(assets))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim(); // ਕਰੋਮ ਦਾ ਕੰਟਰੋਲ ਨਵੇਂ ਸਰਵਿਸ ਵਰਕਰ ਨੂੰ ਦਿਓ
});

self.addEventListener('fetch', event => {
  // Network-First Strategy: ਪਹਿਲਾਂ ਨੈੱਟ ਤੋਂ ਫਾਈਲ ਮੰਗੋ, ਨਾ ਮਿਲਣ ਤੇ ਕੈਸ਼ ਵਰਤੋ
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if(response && response.status === 200) {
          const resClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
