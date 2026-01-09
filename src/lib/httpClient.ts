import { API_BASE_URL, API_TIMEOUT_MS } from '../config/env';
import { logger } from './logger';
import { logApiEvent } from './eventLogger';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type HttpClientOptions = {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
};

export async function checkBackendConnection() {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 5000);

  try {
    logger.debug('Checking backend connection', { url: API_BASE_URL });
    const response = await fetch(`${API_BASE_URL}/health`, {
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
      return true;
    } else {
      logger.warn('Backend responded with error', {
        url: API_BASE_URL,
        status: response.status
      });
      console.warn(
        '%c⚠ BACKEND RESPONDE CON ERROR',
        'color: #f59e0b; font-weight: bold; font-size: 14px; background: #fffbeb; padding: 8px 12px; border-radius: 4px;',
        `\n  URL: ${API_BASE_URL}\n  Status: ${response.status} ${response.statusText}`
      );
      return false;
    }
  } catch (error) {
    logger.error('Backend connection failed', {
      url: API_BASE_URL,
      error: error instanceof Error ? error.message : 'Connection failed'
    });
    console.error(
      '%c✗ BACKEND NO DISPONIBLE',
      'color: #ef4444; font-weight: bold; font-size: 14px; background: #fef2f2; padding: 8px 12px; border-radius: 4px;',
      `\n  URL: ${API_BASE_URL}\n  Error: ${error instanceof Error ? error.message : 'Connection failed'}`
    );
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
  const url = `${API_BASE_URL}${endpoint}`;
  
  logApiEvent.request(endpoint, method);
  
  try {
    // TODO: reemplazar por fetch/axios apuntando al backend real.
    logger.debug('HTTP mock request', {
      url,
      method,
      body,
      headers,
      timeout: API_TIMEOUT_MS
    });
    
    const duration = performance.now() - startTime;
    logApiEvent.success(endpoint, method, duration);
    
    return Promise.resolve({} as T);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('HTTP request failed', {
      url,
      method,
      error: errorMessage
    });
    logApiEvent.error(endpoint, method, 0, errorMessage);
    throw error;
  }
}
