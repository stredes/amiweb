import { SupportRequest } from './types';
import { httpRequest } from '../../lib/httpClient';

function mapServiceType(type: SupportRequest['type']):
  | 'pre_venta'
  | 'demostracion'
  | 'problema_tecnico'
  | 'mantenimiento_preventivo'
  | 'otro' {
  switch (type) {
    case 'preventa':
      return 'pre_venta';
    case 'demostracion':
      return 'demostracion';
    case 'problema_tecnico':
      return 'problema_tecnico';
    case 'mantenimiento_preventivo':
      return 'mantenimiento_preventivo';
    default:
      return 'otro';
  }
}

export async function sendSupportRequest(request: SupportRequest): Promise<{ success: boolean }> {
  await httpRequest<{ id: string }>('/api/support-requests', {
    method: 'POST',
    body: {
      serviceType: mapServiceType(request.type),
      clientName: request.name,
      organization: request.organization,
      email: request.email,
      phone: request.phone || undefined,
      equipment: request.equipment || undefined,
      serialNumber: request.serial || undefined,
      description: request.comment,
    },
  });

  return { success: true };
}
