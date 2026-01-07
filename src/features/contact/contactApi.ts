import { ContactMessage } from './types';

export async function sendContactMessage(message: ContactMessage): Promise<{ success: boolean }> {
  // TODO: reemplazar por llamada HTTP real al backend.
  console.info('Enviando mensaje de contacto (mock)', message);
  return Promise.resolve({ success: true });
}
