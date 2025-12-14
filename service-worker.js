const CACHE_NAME = 'karah-parshad-v6'; // ਵਰਜਨ ਬਦਲ ਦਿੱਤਾ ਹੈ
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './profile.jpg' // ਹੁਣ ਤੁਹਾਡੀ ਫੋਟੋ ਵੀ ਸੇਵ ਹੋਵੇਗੀ
];

// 1. Install Event - ਸਾਰੀਆਂ ਫਾਈਲਾਂ ਪੱਕੇ ਤੌਰ 'ਤੇ ਸੇਵ ਕਰੋ
self.addEventListener('install', (event) => {
  self.skipWaiting(); // ਪੁਰਾਣੇ ਵਰਕਰ ਨੂੰ ਤੁਰੰਤ ਹਟਾ ਕੇ ਨਵਾਂ ਲਗਾਓ
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// 2. Fetch Event - ਪਹਿਲਾਂ ਕੈਸ਼ (Cache) ਚੈੱਕ ਕਰੋ, ਜੇ ਨਹੀਂ ਮਿਲਿਆ ਤਾਂ ਨੈੱਟ 'ਤੇ ਜਾਓ
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // ਜੇ ਕੈਸ਼ ਵਿੱਚ ਫਾਈਲ ਪਈ ਹੈ, ਤਾਂ ਉੱਥੋਂ ਹੀ ਵਾਪਿਸ ਕਰੋ (ਬਹੁਤ ਤੇਜ਼)
        if (response) {
          return response;
        }
        // ਜੇ ਨਹੀਂ ਹੈ, ਤਾਂ ਨੈੱਟ ਤੋਂ ਲਿਆਓ
        return fetch(event.request).catch(() => {
            // ਜੇ ਨੈੱਟ ਵੀ ਨਹੀਂ ਹੈ, ਤਾਂ ਕੁਝ ਨਹੀਂ ਕਰ ਸਕਦੇ (ਜਾਂ ਕੋਈ ਐਰਰ ਪੇਜ ਦਿਖਾ ਸਕਦੇ ਹਾਂ)
            // ਪਰ ਸਾਡੀ ਐਪ ਦੀਆਂ ਸਾਰੀਆਂ ਫਾਈਲਾਂ ਕੈਸ਼ ਵਿੱਚ ਹੋਣਗੀਆਂ।
        });
      })
  );
});

// 3. Activate Event - ਪੁਰਾਣਾ ਕੈਸ਼ (ਕੂੜਾ) ਸਾਫ਼ ਕਰੋ
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim(); // ਤੁਰੰਤ ਕੰਟਰੋਲ ਲਵੋ
});


