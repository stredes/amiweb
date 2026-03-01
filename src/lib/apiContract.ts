export type ApiErrorDetails = {
  requestId?: string;
  payload?: Record<string, unknown>;
  [key: string]: unknown;
};

export type ApiErrorEnvelope = {
  success: false;
  error?: string;
  code?: string;
  details?: ApiErrorDetails;
};

export type ApiSuccessEnvelope<T> = {
  success: true;
  data: T;
};

export type ApiEnvelope<T> = ApiSuccessEnvelope<T> | ApiErrorEnvelope;

const ERROR_MESSAGES: Record<string, string> = {
  TOKEN_MISSING: 'Debes iniciar sesión para continuar.',
  TOKEN_INVALID: 'Tu sesión no es válida. Inicia sesión nuevamente.',
  TOKEN_EXPIRED: 'Tu sesión expiró. Inicia sesión nuevamente.',
  UNAUTHORIZED: 'No autorizado para realizar esta acción.',
  FORBIDDEN: 'No tienes permisos para realizar esta acción.',
  NOT_FOUND: 'No se encontró el recurso solicitado.',
  CONFLICT: 'El recurso ya existe o está en conflicto.',
  VALIDATION_ERROR: 'Hay datos inválidos en la solicitud.',
  USER_ALREADY_EXISTS: 'Ya existe un usuario con ese correo.',
  INTERNAL_ERROR: 'Ocurrió un error interno en el servidor.',
  NETWORK_ERROR: 'No se pudo conectar con el backend.',
};

export class ApiRequestError extends Error {
  code?: string;
  status?: number;
  requestId?: string;
  endpoint: string;
  url: string;
  details?: ApiErrorDetails;
  responseHeaders?: Record<string, string>;

  constructor(params: {
    message: string;
    endpoint: string;
    url: string;
    code?: string;
    status?: number;
    requestId?: string;
    details?: ApiErrorDetails;
    responseHeaders?: Record<string, string>;
  }) {
    super(params.message);
    this.name = 'ApiRequestError';
    this.code = params.code;
    this.status = params.status;
    this.requestId = params.requestId;
    this.endpoint = params.endpoint;
    this.url = params.url;
    this.details = params.details;
    this.responseHeaders = params.responseHeaders;
  }
}

export function resolveApiEndpoint(endpoint: string, apiVersion: string): string {
  if (apiVersion !== 'v1') {
    return endpoint;
  }

  if (endpoint.startsWith('/api/v1')) {
    return endpoint;
  }

  if (endpoint === '/api') {
    return '/api/v1';
  }

  if (endpoint.startsWith('/api/')) {
    return endpoint.replace('/api/', '/api/v1/');
  }

  return endpoint;
}

export function mapApiErrorMessage(code?: string, fallback?: string): string {
  if (code && ERROR_MESSAGES[code]) {
    return ERROR_MESSAGES[code];
  }

  return fallback || 'No se pudo completar la operación.';
}

