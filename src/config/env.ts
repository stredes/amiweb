function normalizeBaseUrl(raw?: string): string {
  if (!raw) return '';
  const trimmed = raw.trim();
  const unquoted =
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
      ? trimmed.slice(1, -1)
      : trimmed;
  return unquoted.replace(/\/+$/, '');
}

export const API_BASE_URL = normalizeBaseUrl(
  ((import.meta.env.VITE_API_URL as string | undefined) ??
    (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
    'http://localhost:3000')
);
export const API_TIMEOUT_MS = 10000;
export const API_VERSION = ((import.meta.env.VITE_API_VERSION as string | undefined) ?? 'legacy').toLowerCase();
export const ENABLE_API_DIAGNOSTICS =
  (import.meta.env.VITE_ENABLE_API_DIAGNOSTICS as string | undefined) === 'true';

export const ENABLE_LOGIN_MOCK =
  (import.meta.env.VITE_ENABLE_LOGIN_MOCK as string | undefined) === 'true' ||
  import.meta.env.DEV;
