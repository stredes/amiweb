import { useState } from 'react';
import { FiBell, FiX, FiCheck, FiTrash2, FiAlertCircle, FiInfo, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import { useNotifications, NotificationType } from '../../features/notifications/notificationContext';
import './NotificationCenter.css';

export function NotificationCenter() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <FiCheckCircle size={20} />;
      case 'warning':
        return <FiAlertTriangle size={20} />;
      case 'error':
        return <FiAlertCircle size={20} />;
      default:
        return <FiInfo size={20} />;
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes}min`;
    if (hours < 24) return `Hace ${hours}h`;
    return `Hace ${days}d`;
  };

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };

  return (
    <>
      <button 
        className="notification-button" 
        data-tour="notifications-button"
        onClick={() => setIsOpen(!isOpen)} 
        title="Notificaciones"
      >
        <FiBell size={24} />
        {unreadCount > 0 && <span className="notification-button__badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
      </button>

      {isOpen && (
        <>
          <div className="notification-overlay" onClick={() => setIsOpen(false)} />
          <div className="notification-panel">
            <div className="notification-panel__header">
              <h3>
                Notificaciones
                {unreadCount > 0 && <span className="unread-badge">{unreadCount} nuevas</span>}
              </h3>
              <div className="notification-panel__actions">
                {notifications.length > 0 && (
                  <>
                    <button onClick={markAllAsRead} title="Marcar todas como leídas" className="action-btn">
                      <FiCheck size={18} />
                    </button>
                    <button onClick={clearAll} title="Limpiar todas" className="action-btn">
                      <FiTrash2 size={18} />
                    </button>
                  </>
                )}
                <button onClick={() => setIsOpen(false)} title="Cerrar" className="action-btn">
                  <FiX size={20} />
                </button>
              </div>
            </div>

            <div className="notification-panel__list">
              {notifications.length === 0 ? (
                <div className="notification-empty">
                  <FiBell size={48} />
                  <p>No tienes notificaciones</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-item ${notification.type} ${notification.read ? 'read' : 'unread'}`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="notification-item__icon">{getIcon(notification.type)}</div>
                    <div className="notification-item__content">
                      <h4>{notification.title}</h4>
                      <p>{notification.message}</p>
                      {notification.actionLabel && notification.actionUrl && (
                        <a href={notification.actionUrl} className="notification-item__action">
                          {notification.actionLabel}
                        </a>
                      )}
                      <span className="notification-item__time">{formatTime(notification.timestamp)}</span>
                    </div>
                    <button
                      className="notification-item__remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }}
                      title="Eliminar"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
