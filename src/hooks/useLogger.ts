import { useEffect, useCallback } from 'react';
import { logger } from '../lib/logger';
import { logNavigationEvent } from '../lib/eventLogger';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/authStore';

/**
 * Hook para usar el logger con contexto del usuario
 */
export function useLogger() {
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      logger.setUserId(user.id);
    } else {
      logger.clearUserId();
    }
  }, [user]);

  return {
    debug: useCallback((message: string, context?: Record<string, any>) => {
      logger.debug(message, context);
    }, []),

    info: useCallback((message: string, context?: Record<string, any>) => {
      logger.info(message, context);
    }, []),

    warn: useCallback((message: string, context?: Record<string, any>) => {
      logger.warn(message, context);
    }, []),

    error: useCallback((message: string, contextOrError?: Record<string, any> | Error, error?: Error) => {
      logger.error(message, contextOrError, error);
    }, []),

    critical: useCallback((message: string, contextOrError?: Record<string, any> | Error, error?: Error) => {
      logger.critical(message, contextOrError, error);
    }, []),

    logEvent: useCallback((eventName: string, params?: Record<string, any>) => {
      logger.logEvent(eventName, params);
    }, [])
  };
}

/**
 * Hook para tracking automático de páginas
 */
export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    const pagePath = location.pathname + location.search;
    const pageTitle = document.title;
    
    logNavigationEvent.pageView(pagePath, pageTitle);
  }, [location]);
}

/**
 * Hook para medir performance de componentes
 */
export function usePerformanceLogger(componentName: string) {
  const log = useLogger();

  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const duration = performance.now() - startTime;
      if (duration > 1000) { // Log si tarda más de 1 segundo
        log.warn(`Component ${componentName} took ${duration.toFixed(2)}ms to unmount`);
      }
    };
  }, [componentName, log]);
}

/**
 * Hook para logging de errores de async operations
 */
export function useAsyncLogger() {
  const log = useLogger();

  const wrapAsync = useCallback(
    async <T,>(
      operation: () => Promise<T>,
      operationName: string,
      context?: Record<string, any>
    ): Promise<T | null> => {
      const startTime = performance.now();
      
      try {
        log.debug(`Starting async operation: ${operationName}`, context);
        const result = await operation();
        const duration = performance.now() - startTime;
        log.debug(`Completed async operation: ${operationName}`, { 
          duration: `${duration.toFixed(2)}ms`,
          ...context 
        });
        return result;
      } catch (error) {
        const duration = performance.now() - startTime;
        log.error(`Failed async operation: ${operationName}`, {
          duration: `${duration.toFixed(2)}ms`,
          error: error instanceof Error ? error.message : String(error),
          ...context
        }, error instanceof Error ? error : undefined);
        return null;
      }
    },
    [log]
  );

  return { wrapAsync };
}
