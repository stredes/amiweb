import { Toaster, toast as hotToast } from 'react-hot-toast';

/**
 * Toast notifications system
 * 
 * Usage:
 * import { toast } from '@/components/ui/Toast';
 * toast.success('Operación exitosa');
 * toast.error('Error al procesar');
 */

export const toast = {
  success: (message: string) => {
    hotToast.success(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#10b981',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#10b981',
      },
    });
  },
  
  error: (message: string) => {
    hotToast.error(message, {
      duration: 5000,
      position: 'top-right',
      style: {
        background: '#ef4444',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#ef4444',
      },
    });
  },
  
  info: (message: string) => {
    hotToast(message, {
      duration: 4000,
      position: 'top-right',
      icon: 'ℹ️',
      style: {
        background: '#3b82f6',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
      },
    });
  },
  
  loading: (message: string) => {
    return hotToast.loading(message, {
      position: 'top-right',
      style: {
        background: '#6366f1',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
      },
    });
  },
  
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return hotToast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      {
        position: 'top-right',
        style: {
          padding: '16px',
          borderRadius: '8px',
        },
      }
    );
  },
  
  dismiss: (toastId?: string) => {
    hotToast.dismiss(toastId);
  },
};

// Legacy export for backward compatibility
export const showToast = {
  success: (message: string) => {
    hotToast.success(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#10b981',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#10b981',
      },
    });
  },
  
  error: (message: string) => {
    hotToast.error(message, {
      duration: 5000,
      position: 'top-right',
      style: {
        background: '#ef4444',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#ef4444',
      },
    });
  },
  
  info: (message: string) => {
    hotToast(message, {
      duration: 4000,
      position: 'top-right',
      icon: 'ℹ️',
      style: {
        background: '#3b82f6',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
      },
    });
  },
  
  loading: (message: string) => {
    return hotToast.loading(message, {
      position: 'top-right',
      style: {
        background: '#6366f1',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
      },
    });
  },
  
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return hotToast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      {
        position: 'top-right',
        style: {
          padding: '16px',
          borderRadius: '8px',
        },
      }
    );
  },
  
  dismiss: (toastId?: string) => {
    hotToast.dismiss(toastId);
  },
};

/**
 * Toaster component - Add this to your App.tsx
 */
export function ToastContainer() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
          borderRadius: '8px',
          padding: '16px',
        },
      }}
    />
  );
}
