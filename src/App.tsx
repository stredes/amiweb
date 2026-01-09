import AppRouter from './router';
import useScrollToTop from './hooks/useScrollToTop';
import { ToastContainer } from './components/ui/Toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { WhatsAppButton } from './components/ui/WhatsAppButton';
import { PWAInstallPrompt } from './components/ui/PWAInstallPrompt';
import { WishlistProvider } from './contexts/WishlistContext';
import { CompareProvider } from './contexts/CompareContext';
import { useEffect } from 'react';
import { registerServiceWorker } from './lib/serviceWorker';
import { checkBackendConnection } from './lib/httpClient';

function App() {
  useScrollToTop();
  
  useEffect(() => {
    registerServiceWorker();
    checkBackendConnection();
  }, []);
  
  return (
    <ThemeProvider>
      <WishlistProvider>
        <CompareProvider>
          <AppRouter />
          <ToastContainer />
          <WhatsAppButton phoneNumber="56912345678" message="Hola! Tengo una consulta sobre AMIWEB" />
          <PWAInstallPrompt />
        </CompareProvider>
      </WishlistProvider>
    </ThemeProvider>
  );
}

export default App;
