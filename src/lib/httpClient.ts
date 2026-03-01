import { API_BASE_URL as RAW_API_BASE_URL, API_TIMEOUT_MS } from '../config/env';
import { logger } from './logger';
import { logApiEvent } from './eventLogger';
import { auth } from './firebase';

// Normalizar URL: remover trailing slash si existe
const API_BASE_URL = RAW_API_BASE_URL?.endsWith('/')
  ? RAW_API_BASE_URL.slice(0, -1)
  : RAW_API_BASE_URL;

function buildUrl(endpoint: string) {
  if (!API_BASE_URL) {
    return '';
  }

  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${normalizedEndpoint}`;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type HttpClientOptions = {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
};

// Cache para evitar múltiples chequeos de conexión
let backendConnectionCache: { status: boolean; timestamp: number } | null = null;
const CACHE_DURATION = 30000; // 30 segundos
let lastErrorLogged = 0;
const ERROR_LOG_THROTTLE = 60000; // 1 minuto entre logs de error

export async function checkBackendConnection(): Promise<boolean> {
  // Usar cache si está disponible y es reciente
  if (backendConnectionCache && Date.now() - backendConnectionCache.timestamp < CACHE_DURATION) {
    return backendConnectionCache.status;
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 5000);

  try {
    if (!API_BASE_URL) {
      if (import.meta.env.DEV) {
        logger.debug('Backend not configured - running in development mode');
      }
      backendConnectionCache = { status: false, timestamp: Date.now() };
      return false;
    }

    const response = await fetch(buildUrl('/api/health'), {
      method: 'GET',
      signal: controller.signal,
    });
    
    if (response.ok) {
      logger.info('Backend connected successfully', {
        url: API_BASE_URL,
        status: response.status
      });
      console.log(
        '%c✓ BACKEND CONECTADO',
        'color: #10b981; font-weight: bold; font-size: 14px; background: #f0fdf4; padding: 8px 12px; border-radius: 4px;',
        `\n  URL: ${API_BASE_URL}\n  Status: ${response.status} ${response.statusText}`
      );
      backendConnectionCache = { status: true, timestamp: Date.now() };
      return true;
    } else {
      // Solo logear si ha pasado suficiente tiempo
      const now = Date.now();
      if (now - lastErrorLogged > ERROR_LOG_THROTTLE) {
        logger.warn('Backend responded with error', {
          url: API_BASE_URL,
          status: response.status
        });
        console.warn(
          '%c⚠ BACKEND RESPONDE CON ERROR',
          'color: #f59e0b; font-weight: bold; font-size: 14px; background: #fffbeb; padding: 8px 12px; border-radius: 4px;',
          `\n  URL: ${API_BASE_URL}\n  Status: ${response.status} ${response.statusText}`
        );
        lastErrorLogged = now;
      }
      backendConnectionCache = { status: false, timestamp: Date.now() };
      return false;
    }
  } catch (error) {
    // Solo logear el primer error o después del throttle
    const now = Date.now();
    if (now - lastErrorLogged > ERROR_LOG_THROTTLE) {
      if (import.meta.env.DEV) {
        logger.debug('Backend not available', { url: API_BASE_URL });
        console.log(
          '%cℹ MODO DESARROLLO',
          'color: #3b82f6; font-weight: bold; font-size: 14px; background: #eff6ff; padding: 8px 12px; border-radius: 4px;',
          `\n  Backend no disponible\n  Verifica VITE_API_URL/VITE_API_BASE_URL y el estado de la API`
        );
      } else {
        logger.error('Backend connection failed', {
          url: API_BASE_URL,
          error: error instanceof Error ? error.message : 'Connection failed'
        });
        console.error(
          '%c✗ BACKEND NO DISPONIBLE',
          'color: #ef4444; font-weight: bold; font-size: 14px; background: #fef2f2; padding: 8px 12px; border-radius: 4px;',
          `\n  URL: ${API_BASE_URL}\n  Error: ${error instanceof Error ? error.message : 'Connection failed'}`
        );
      }
      lastErrorLogged = now;
    }
    backendConnectionCache = { status: false, timestamp: Date.now() };
    return false;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export async function httpRequest<T>(
  endpoint: string,
  { method = 'GET', body, headers }: HttpClientOptions = {}
): Promise<T> {
  const startTime = performance.now();
  const url = buildUrl(endpoint);
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  
  logApiEvent.request(endpoint, method);
  
  try {
    const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const duration = performance.now() - startTime;
    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const errorMessage =
        typeof payload === 'object' && payload && 'error' in payload
          ? String((payload as { error?: string }).error || 'Request failed')
          : `HTTP ${response.status}`;

      logger.error('HTTP request failed', {
        url,
        method,
        status: response.status,
        error: errorMessage,
      });
      logApiEvent.error(endpoint, method, response.status, errorMessage);
      throw new Error(errorMessage);
    }

    logger.debug('HTTP request success', {
      url,
      method,
      status: response.status,
      duration: Math.round(duration),
    });

    logApiEvent.success(endpoint, method, duration);

    if (typeof payload === 'object' && payload && 'success' in payload) {
      const responsePayload = payload as { success: boolean; data?: unknown; error?: string };
      if (!responsePayload.success) {
        throw new Error(responsePayload.error || 'Request failed');
      }
      return responsePayload.data as T;
    }

    return payload as T;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('HTTP request failed', {
      url,
      method,
      error: errorMessage
    });
    logApiEvent.error(endpoint, method, 0, errorMessage);
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}
