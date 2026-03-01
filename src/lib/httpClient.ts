import { API_BASE_URL as RAW_API_BASE_URL, API_TIMEOUT_MS, API_VERSION, ENABLE_API_DIAGNOSTICS } from '../config/env';
import { logger } from './logger';
import { logApiEvent } from './eventLogger';
import { auth } from './firebase';
import { ApiEnvelope, ApiRequestError, mapApiErrorMessage, resolveApiEndpoint } from './apiContract';

// Normalizar URL: remover trailing slash si existe
const API_BASE_URL = RAW_API_BASE_URL?.endsWith('/')
  ? RAW_API_BASE_URL.slice(0, -1)
  : RAW_API_BASE_URL;

function buildUrl(endpoint: string) {
  if (!API_BASE_URL) {
    return '';
  }

  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const resolvedEndpoint = resolveApiEndpoint(normalizedEndpoint, API_VERSION);
  return `${API_BASE_URL}${resolvedEndpoint}`;
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

function toHeaderMap(headers: Headers): Record<string, string> {
  return {
    'x-request-id': headers.get('x-request-id') || '',
    'x-vercel-id': headers.get('x-vercel-id') || '',
    'access-control-allow-origin': headers.get('access-control-allow-origin') || '',
  };
}

function getRequestId(headers: Headers, payload?: unknown): string | undefined {
  const headerRequestId = headers.get('x-request-id') || headers.get('x-vercel-id') || undefined;
  if (headerRequestId) {
    return headerRequestId;
  }

  if (payload && typeof payload === 'object' && payload !== null) {
    const details = (payload as Record<string, unknown>).details;
    if (details && typeof details === 'object' && details !== null) {
      const detailsRequestId = (details as Record<string, unknown>).requestId;
      if (typeof detailsRequestId === 'string') {
        return detailsRequestId;
      }
    }
  }

  return undefined;
}

function isApiEnvelope(value: unknown): value is ApiEnvelope<unknown> {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return 'success' in (value as Record<string, unknown>);
}

export function logApiRuntimeDiagnostics() {
  if (!ENABLE_API_DIAGNOSTICS) {
    return;
  }

  console.info('[API diagnostics]', {
    origin: window.location.origin,
    apiBaseUrl: API_BASE_URL,
    apiVersion: API_VERSION,
    mode: import.meta.env.MODE,
    viteApiUrl: import.meta.env.VITE_API_URL,
    viteApiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  });
}

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
        status: response.status,
        requestId: response.headers.get('x-request-id') || response.headers.get('x-vercel-id') || undefined,
      });
      console.log(
        '%c✓ BACKEND CONECTADO',
        'color: #10b981; font-weight: bold; font-size: 14px; background: #f0fdf4; padding: 8px 12px; border-radius: 4px;',
        `\n  URL: ${API_BASE_URL}\n  Status: ${response.status} ${response.statusText}`
      );
      backendConnectionCache = { status: true, timestamp: Date.now() };
      return true;
    }

    const now = Date.now();
    if (now - lastErrorLogged > ERROR_LOG_THROTTLE) {
      logger.warn('Backend responded with error', {
        url: API_BASE_URL,
        status: response.status,
        requestId: response.headers.get('x-request-id') || response.headers.get('x-vercel-id') || undefined,
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
  } catch (error) {
    const now = Date.now();
    if (now - lastErrorLogged > ERROR_LOG_THROTTLE) {
      if (import.meta.env.DEV) {
        logger.debug('Backend not available', { url: API_BASE_URL });
        console.log(
          '%cℹ MODO DESARROLLO',
          'color: #3b82f6; font-weight: bold; font-size: 14px; background: #eff6ff; padding: 8px 12px; border-radius: 4px;',
          '\n  Backend no disponible\n  Verifica VITE_API_URL/VITE_API_BASE_URL y el estado de la API'
        );
      } else {
        logger.error('Backend connection failed', {
          url: API_BASE_URL,
          error: error instanceof Error ? error.message : 'Connection failed',
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
  if (!url) {
    throw new ApiRequestError({
      message: 'Backend no configurado. Define VITE_API_URL o VITE_API_BASE_URL.',
      endpoint,
      url: '',
      code: 'BACKEND_NOT_CONFIGURED',
      status: 0,
    });
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  logApiEvent.request(endpoint, method);

  try {
    const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;

    const resolvedHeaders: Record<string, string> = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    };

    if (body !== undefined && !resolvedHeaders['Content-Type']) {
      resolvedHeaders['Content-Type'] = 'application/json';
    }

    if (ENABLE_API_DIAGNOSTICS) {
      console.info('[API request]', {
        endpoint,
        method,
        url,
        origin: window.location.origin,
      });
    }

    const response = await fetch(url, {
      method,
      headers: resolvedHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const duration = performance.now() - startTime;
    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    const requestId = getRequestId(response.headers, payload);
    const responseHeaders = toHeaderMap(response.headers);

    if (ENABLE_API_DIAGNOSTICS) {
      console.info('[API response]', {
        endpoint,
        url,
        status: response.status,
        requestId,
        headers: responseHeaders,
      });
    }

    if (!response.ok) {
      const envelopeCode =
        payload && typeof payload === 'object' && 'code' in (payload as Record<string, unknown>)
          ? String((payload as Record<string, unknown>).code || '')
          : undefined;

      const fallbackMessage =
        payload && typeof payload === 'object' && 'error' in (payload as Record<string, unknown>)
          ? String((payload as Record<string, unknown>).error || `HTTP ${response.status}`)
          : `HTTP ${response.status}`;

      const message = mapApiErrorMessage(envelopeCode, fallbackMessage);

      const error = new ApiRequestError({
        message: requestId ? `${message} (requestId: ${requestId})` : message,
        endpoint,
        url,
        code: envelopeCode,
        status: response.status,
        requestId,
        details:
          payload && typeof payload === 'object' && 'details' in (payload as Record<string, unknown>)
            ? ((payload as Record<string, unknown>).details as Record<string, unknown>)
            : undefined,
        responseHeaders,
      });

      logger.error('HTTP request failed', {
        url,
        endpoint,
        method,
        status: response.status,
        code: envelopeCode,
        requestId,
        message,
      });
      logApiEvent.error(endpoint, method, response.status, message);
      throw error;
    }

    if (isApiEnvelope(payload)) {
      if (!payload.success) {
        const message = mapApiErrorMessage(payload.code, payload.error || 'Request failed');
        const requestIdFromDetails = payload.details?.requestId || requestId;

        const error = new ApiRequestError({
          message: requestIdFromDetails ? `${message} (requestId: ${requestIdFromDetails})` : message,
          endpoint,
          url,
          code: payload.code,
          status: response.status,
          requestId: requestIdFromDetails,
          details: payload.details,
          responseHeaders,
        });

        logger.error('API envelope marked as failure', {
          url,
          endpoint,
          method,
          status: response.status,
          code: payload.code,
          requestId: requestIdFromDetails,
          message,
        });
        logApiEvent.error(endpoint, method, response.status, message);
        throw error;
      }

      logger.debug('HTTP request success', {
        url,
        endpoint,
        method,
        status: response.status,
        duration: Math.round(duration),
        requestId,
      });
      logApiEvent.success(endpoint, method, duration);
      return payload.data as T;
    }

    logger.debug('HTTP request success (raw response)', {
      url,
      endpoint,
      method,
      status: response.status,
      duration: Math.round(duration),
      requestId,
    });
    logApiEvent.success(endpoint, method, duration);
    return payload as T;
  } catch (error) {
    if (error instanceof ApiRequestError) {
      throw error;
    }

    const rawMessage = error instanceof Error ? error.message : 'Unknown error';
    const isNetworkError = rawMessage.includes('Failed to fetch') || rawMessage.includes('NetworkError') || rawMessage.includes('aborted');
    const code = isNetworkError ? 'NETWORK_ERROR' : 'REQUEST_FAILED';
    const message = mapApiErrorMessage(code, rawMessage);

    logger.error('HTTP request failed', {
      url,
      endpoint,
      method,
      code,
      error: message,
    });
    logApiEvent.error(endpoint, method, 0, message);

    throw new ApiRequestError({
      message,
      endpoint,
      url,
      code,
      status: 0,
    });
  } finally {
    window.clearTimeout(timeoutId);
  }
}
