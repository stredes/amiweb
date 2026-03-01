import { ContactMessage } from './types';
import { httpRequest } from '../../lib/httpClient';

export async function sendContactMessage(message: ContactMessage): Promise<{ success: boolean }> {
  await httpRequest<{ id: string }>('/api/contact-messages', {
    method: 'POST',
    body: {
      name: message.name,
      email: message.email,
      message: message.message,
      origin: 'frontend',
    },
  });

  return { success: true };
}
