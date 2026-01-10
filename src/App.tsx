import AppRouter from './router';
import useScrollToTop from './hooks/useScrollToTop';
import { ToastContainer } from './components/ui/Toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { WhatsAppButton } from './components/ui/WhatsAppButton';
import { PWAInstallPrompt } from './components/ui/PWAInstallPrompt';
import { WishlistProvider } from './contexts/WishlistContext';
import { CompareProvider } from './contexts/CompareContext';
import { CartProvider } from './features/cart/cartContext';
import { NotificationProvider } from './features/notifications/notificationContext';
import { SearchProvider } from './features/search/searchStore';
import { TourProvider } from './contexts/TourContext';
import { CartButton } from './components/cart/CartButton';
import { CompareTable } from './components/products/CompareTable';
import { WishlistManager } from './components/wishlist/WishlistManager';
import { TourOverlay } from './components/tour/TourOverlay';
import { TourTrigger } from './components/tour/TourTrigger';
import { OfflineIndicator } from './components/ui/OfflineIndicator';
import { useEffect } from 'react';
import { registerServiceWorker } from './lib/serviceWorker';
import { checkBackendConnection } from './lib/httpClient';
import { ErrorBoundary } from './components/debug/ErrorBoundary';
import { usePageTracking } from './hooks/useLogger';
import { logger } from './lib/logger';

function App() {
  useScrollToTop();
  usePageTracking();
  
  useEffect(() => {
    logger.info('App initialized');
    registerServiceWorker();
    checkBackendConnection();
  }, []);
  
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <SearchProvider>
            <WishlistProvider>
              <CompareProvider>
                <CartProvider>
                  <TourProvider>
                    <AppRouter />
                    <ToastContainer />
                    <WhatsAppButton phoneNumber="56912345678" message="Hola! Tengo una consulta sobre AMIWEB" />
                    <CartButton />
                    <CompareTable />
                    <WishlistManager />
                    <TourOverlay />
                    <TourTrigger />
                    <OfflineIndicator />
                    <PWAInstallPrompt />
                  </TourProvider>
                </CartProvider>
              </CompareProvider>
            </WishlistProvider>
          </SearchProvider>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
