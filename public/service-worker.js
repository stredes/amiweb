const CACHE_NAME = 'amiweb-v2';
const API_CACHE_NAME = 'amiweb-api-v2';
const IMAGE_CACHE_NAME = 'amiweb-images-v2';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
];

const API_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => 
            name !== CACHE_NAME && 
            name !== API_CACHE_NAME && 
            name !== IMAGE_CACHE_NAME
          )
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event with advanced caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API requests - Network First with stale-while-revalidate
  if (url.pathname.startsWith('/api/') || url.hostname.includes('firestore') || url.hostname.includes('firebase')) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then(async (cache) => {
        try {
          const response = await fetch(request);
          const clonedResponse = response.clone();
          
          // Store with timestamp
          const responseToCache = {
            response: clonedResponse,
            timestamp: Date.now(),
          };
          
          cache.put(request, response.clone());
          return response;
        } catch (error) {
          // Network failed, try cache
          const cachedResponse = await cache.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Return offline page if no cache
          return new Response(JSON.stringify({ error: 'Offline', message: 'No hay conexión a internet' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      })
    );
    return;
  }

  // Image requests - Cache First with expiration
  if (request.destination === 'image') {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }

        try {
          const response = await fetch(request);
          if (response.status === 200) {
            cache.put(request, response.clone());
          }
          return response;
        } catch (error) {
          // Return placeholder image
          return new Response('', { status: 404 });
        }
      })
    );
    return;
  }

  // Static assets - Cache First
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const clonedResponse = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, clonedResponse);
        });

        return response;
      }).catch(() => {
        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
        return new Response('', { status: 404 });
      });
    })
  );
});

// Background Sync - for pending quotes
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-quotes') {
    event.waitUntil(syncPendingQuotes());
  }
});

async function syncPendingQuotes() {
  try {
    const pendingQuotes = await getStorageData('pending_quotes');
    if (!pendingQuotes || pendingQuotes.length === 0) {
      return;
    }

    for (const quote of pendingQuotes) {
      try {
        const response = await fetch('/api/quotes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(quote),
        });

        if (response.ok) {
          // Remove from pending
          await removeFromPending(quote.id);
          
          // Notify user of success
          self.registration.showNotification('Cotización enviada', {
            body: `Su cotización ha sido enviada exitosamente`,
            icon: '/icon-192x192.png',
            badge: '/badge-72x72.png',
            tag: 'quote-sync',
          });
        }
      } catch (error) {
        console.error('Failed to sync quote:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Push Notifications - for order updates
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'AMILAB Notificación';
  const options = {
    body: data.body || 'Tienes una nueva notificación',
    icon: data.icon || '/icon-192x192.png',
    badge: '/badge-72x72.png',
    data: data.url || '/',
    actions: [
      { action: 'open', title: 'Ver' },
      { action: 'close', title: 'Cerrar' },
    ],
    tag: data.tag || 'notification',
    requireInteraction: false,
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open' || event.action === '') {
    const urlToOpen = event.notification.data || '/';
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((windowClients) => {
          // Check if there's already a window open
          for (let client of windowClients) {
            if (client.url === urlToOpen && 'focus' in client) {
              return client.focus();
            }
          }
          // Open new window
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});

// Message handler for communication with app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});

// Helper functions
async function getStorageData(key) {
  // In a real implementation, you'd use IndexedDB
  // For now, this is a placeholder
  return [];
}

async function removeFromPending(id) {
  // Remove from IndexedDB
  // Placeholder implementation
}
