import { useState, useEffect } from 'react';
import './PWAInstallPrompt.css';
import { FiDownload, FiX } from 'react-icons/fi';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Only show if user hasn't dismissed it in this session
      const dismissed = sessionStorage.getItem('pwa-prompt-dismissed');
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted PWA install');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (!showPrompt || !deferredPrompt) return null;

  return (
    <div className="pwa-prompt">
      <div className="pwa-prompt__content">
        <div className="pwa-prompt__icon">
          <FiDownload />
        </div>
        <div className="pwa-prompt__text">
          <h3>Instalar AMIWEB</h3>
          <p>Accede más rápido desde tu dispositivo</p>
        </div>
        <div className="pwa-prompt__actions">
          <button onClick={handleInstall} className="pwa-prompt__install">
            Instalar
          </button>
          <button onClick={handleDismiss} className="pwa-prompt__dismiss">
            <FiX />
          </button>
        </div>
      </div>
    </div>
  );
}
