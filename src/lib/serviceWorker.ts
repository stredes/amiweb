export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('✅ Service Worker registrado:', registration);

          // Check for updates every hour
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000);

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker available
                  if (confirm('Nueva versión disponible. ¿Actualizar ahora?')) {
                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                    window.location.reload();
                  }
                }
              });
            }
          });

          // Request notification permission
          if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then((permission) => {
              if (permission === 'granted') {
                console.log('✅ Permisos de notificación otorgados');
              }
            });
          }

          // Register for background sync
          if ('sync' in registration) {
            console.log('✅ Background Sync disponible');
          }

          // Subscribe to push notifications
          if ('pushManager' in registration) {
            subscribeToPushNotifications(registration);
          }
        })
        .catch((error) => {
          console.error('❌ Error al registrar Service Worker:', error);
        });
    });

    // Listen for controller change (new SW activated)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  }
}

async function subscribeToPushNotifications(registration: ServiceWorkerRegistration) {
  try {
    // Check if already subscribed
    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      console.log('✅ Ya suscrito a push notifications');
      return;
    }

    // For production, you'd use your own VAPID keys
    // This is a placeholder
    const vapidPublicKey = 'YOUR_VAPID_PUBLIC_KEY_HERE';
    
    // Only subscribe if we have a valid key
    if (vapidPublicKey !== 'YOUR_VAPID_PUBLIC_KEY_HERE') {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      // Send subscription to backend
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
      });

      console.log('✅ Suscrito a push notifications');
    }
  } catch (error) {
    console.error('Error suscribiéndose a push notifications:', error);
  }
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Background sync for pending quotes
export async function syncQuote(quoteData: any) {
  if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Store quote in IndexedDB
      await storeQuoteForSync(quoteData);
      
      // Register sync
      await (registration as any).sync.register('sync-quotes');
      
      console.log('✅ Cotización guardada para sincronización');
      return true;
    } catch (error) {
      console.error('Error al registrar sync:', error);
      return false;
    }
  }
  return false;
}

async function storeQuoteForSync(quoteData: any) {
  // Store in localStorage as fallback (in production, use IndexedDB)
  const pending = JSON.parse(localStorage.getItem('pending_quotes') || '[]');
  pending.push({
    ...quoteData,
    id: Date.now().toString(),
    timestamp: Date.now(),
  });
  localStorage.setItem('pending_quotes', JSON.stringify(pending));
}

export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error('Error unregistering SW:', error);
      });
  }
}
