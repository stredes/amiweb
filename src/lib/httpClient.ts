import { API_BASE_URL, API_TIMEOUT_MS } from '../config/env';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type HttpClientOptions = {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
};

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
