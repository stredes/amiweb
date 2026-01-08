import { API_BASE_URL } from '../../config/env';
import { InventoryUploadProduct, InventoryUploadResult } from './types';

type UploadInventoryOptions = {
  token: string;
  overwriteExisting?: boolean;
};

export async function uploadInventory(
  products: InventoryUploadProduct[],
  { token, overwriteExisting = false }: UploadInventoryOptions
): Promise<InventoryUploadResult> {
  const response = await fetch(`${API_BASE_URL}/api/inventory/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      products,
      overwriteExisting,
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    const message =
      typeof payload?.error === 'string'
        ? payload.error
        : 'Error al subir inventario';
    throw new Error(message);
  }

  return payload as InventoryUploadResult;
}
