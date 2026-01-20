import {precacheAndRoute} from 'workbox-precaching';
import {registerRoute} from 'workbox-routing';
import {NetworkFirst, StaleWhileRevalidate, CacheFirst} from 'workbox-strategies';
import {ExpirationPlugin} from 'workbox-expiration';
import {setCatchHandler} from 'workbox-routing';

// Injected precache manifest
precacheAndRoute(self.__WB_MANIFEST);

// App shell: HTML navigation
registerRoute(
  ({request}) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'html-cache',
    networkTimeoutSeconds: 3,
  })
);

// Fallback to offline page on navigation failures
setCatchHandler(async ({event}) => {
  if (event.request.mode === 'navigate') {
    const cache = await caches.open('html-cache')
    const cached = await cache.match('/offline.html')
    if (cached) return cached
    // Try to return the built fallback if path differs
    return caches.match('/offline.html')
  }
  return Response.error()
});

// Static assets: CSS/JS
registerRoute(
  ({request}) => ['style', 'script'].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
  })
);

// Images
registerRoute(
  ({request}) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new ExpirationPlugin({maxEntries: 100, maxAgeSeconds: 7 * 24 * 60 * 60})
    ],
  })
);

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
