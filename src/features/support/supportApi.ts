import { SupportRequest } from './types';

export async function sendSupportRequest(request: SupportRequest): Promise<{ success: boolean }> {
  // TODO: reemplazar por llamada HTTP real al backend.
  console.info('Enviando solicitud de soporte (mock)', request);
  return Promise.resolve({ success: true });
}
