export interface SupportRequest {
  id?: string;
  type: 'preventa' | 'demostracion' | 'problema_tecnico' | 'mantenimiento_preventivo' | 'otro' | '';
  name: string;
  organization: string;
  email: string;
  phone: string;
  comment: string;
  equipment: string;
  serial?: string;
}
