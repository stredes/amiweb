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
    console.info('[backend] Health check', {
      url: `${API_BASE_URL}/health`,
      status: response.status,
    });
  } catch (error) {
    console.info('[backend] Health check failed', {
      url: `${API_BASE_URL}/health`,
      error,
    });
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
