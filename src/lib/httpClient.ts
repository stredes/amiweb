import { API_BASE_URL, API_TIMEOUT_MS } from '../config/env';

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
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    
    if (response.ok) {
      console.log(
        '%c✓ BACKEND CONECTADO',
        'color: #10b981; font-weight: bold; font-size: 14px; background: #f0fdf4; padding: 8px 12px; border-radius: 4px;',
        `\n  URL: ${API_BASE_URL}\n  Status: ${response.status} ${response.statusText}`
      );
      return true;
    } else {
      console.warn(
        '%c⚠ BACKEND RESPONDE CON ERROR',
        'color: #f59e0b; font-weight: bold; font-size: 14px; background: #fffbeb; padding: 8px 12px; border-radius: 4px;',
        `\n  URL: ${API_BASE_URL}\n  Status: ${response.status} ${response.statusText}`
      );
      return false;
    }
  } catch (error) {
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
  // TODO: reemplazar por fetch/axios apuntando al backend real.
  console.info('HTTP mock request', {
    url: `${API_BASE_URL}${endpoint}`,
    method,
    body,
    headers,
    timeout: API_TIMEOUT_MS
  });
  return Promise.resolve({} as T);
}
