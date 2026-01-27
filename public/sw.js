const CACHE_VERSION = 'v6';
const CACHE_NAME = `ultimatecar3d-${CACHE_VERSION}`;
const IMAGE_CACHE_NAME = `ultimatecar3d-images-${CACHE_VERSION}`;

self.addEventListener('install', (event) => {
  console.log('[SW] Installing new version...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating new version...');
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(name => name.startsWith('ultimatecar3d-') &&
                         name !== CACHE_NAME &&
                         name !== IMAGE_CACHE_NAME)
          .map(name => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );

      await clients.claim();
      console.log('[SW] New version activated!');
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.pathname === '/' || url.pathname === '/index.html') {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  if (url.pathname.includes('/src/') ||
      url.pathname.includes('/@') ||
      url.pathname.match(/\.(tsx?|jsx?)$/i) ||
      event.request.destination === 'script') {
    event.respondWith(fetch(event.request));
    return;
  }

  if (event.request.destination === 'image' ||
      url.hostname.includes('imgur.com') ||
      url.hostname.includes('supabase.co') ||
      url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {

    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => cachedResponse);

          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  if (event.request.method !== 'GET' ||
      url.hostname.includes('supabase.co') ||
      url.hostname.includes('stripe.com')) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200 &&
            !url.pathname.includes('/sw.js')) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || new Response('Offline', { status: 503 });
        });
      })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
