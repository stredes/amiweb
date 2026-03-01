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
  if (!API_BASE_URL) {
    throw new Error('Backend no configurado. Define VITE_API_URL o VITE_API_BASE_URL.');
  }

  try {
    const url = `${API_BASE_URL}/api/inventory/upload`;
    console.log('📤 Uploading to:', url);
    console.log('📦 Products count:', products.length);
    
    const response = await fetch(url, {
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

    if (response.status === 500) {
      const errorText = await response.text();
      console.error('❌ Backend error 500:', errorText);
      throw new Error(
        'Error interno del backend durante la carga de inventario.'
      );
    }

    const payload = await response.json();

    if (!response.ok) {
      const message =
        typeof payload?.error === 'string'
          ? payload.error
          : `Error ${response.status}: ${response.statusText}`;
      throw new Error(message);
    }

    return payload as InventoryUploadResult;
  } catch (error) {
    console.error('❌ Error en uploadInventory:', error);

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(
        `No se pudo conectar con el backend (${API_BASE_URL}). ` +
        'Verifica que el servidor esté activo y la URL sea correcta.'
      );
    }
    throw error;
  }
}
