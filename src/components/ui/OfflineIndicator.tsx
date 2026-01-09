import { useState, useEffect } from 'react';
import { FiWifiOff, FiWifi } from 'react-icons/fi';
import './OfflineIndicator.css';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showIndicator, setShowIndicator] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowIndicator(true);
      // Hide after 3 seconds
      setTimeout(() => setShowIndicator(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowIndicator(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showIndicator) return null;

  return (
    <div className={`offline-indicator ${isOnline ? 'online' : 'offline'}`}>
      <div className="offline-indicator__content">
        {isOnline ? (
          <>
            <FiWifi size={20} />
            <span>Conexión restaurada</span>
          </>
        ) : (
          <>
            <FiWifiOff size={20} />
            <span>Sin conexión a internet</span>
          </>
        )}
      </div>
    </div>
  );
}
