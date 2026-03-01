export const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  'http://localhost:3000';
export const API_TIMEOUT_MS = 10000;

export const ENABLE_LOGIN_MOCK =
  (import.meta.env.VITE_ENABLE_LOGIN_MOCK as string | undefined) === 'true' ||
  import.meta.env.DEV;
