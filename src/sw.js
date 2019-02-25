var cacheName = 'SBA-cache-v2';
var staticPathsToCache = [
  '/',
];

var dynamicPathsToCache = serviceWorkerOption.assets

self.addEventListener('install', function(event) {
  console.log('a')
  event.waitUntil(
    caches.open(cacheName)
      .then(function(cache) {
        return cache.addAll(staticPathsToCache.concat(dynamicPathsToCache));
      })
  );
});
