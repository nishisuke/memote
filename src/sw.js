var cacheName = 'SBA-cache-v3';
var staticPathsToCache = [
  '/',
];

var dynamicPathsToCache = serviceWorkerOption.assets

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName)
      .then(function(cache) {
        return cache.addAll(staticPathsToCache.concat(dynamicPathsToCache));
      })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(name) {
          if (name != cacheName) {
            return caches.delete(name);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (navigator.onLine || !response) {
          return fetch(event.request);
        } else {
          return response;
        }
      }
    )
  );
});
