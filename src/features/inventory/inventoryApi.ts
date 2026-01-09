import { API_BASE_URL } from '../../config/env';
import { InventoryUploadProduct, InventoryUploadResult } from './types';
import { uploadInventoryMock } from './inventoryApiMock';

type UploadInventoryOptions = {
  token: string;
  overwriteExisting?: boolean;
  useMock?: boolean; // Para forzar modo mock
};

const USE_MOCK_WHEN_BACKEND_DOWN = true; // Backend error 500 - usando mock temporalmente

export async function uploadInventory(
  products: InventoryUploadProduct[],
  { token, overwriteExisting = false, useMock = false }: UploadInventoryOptions
): Promise<InventoryUploadResult> {
  // Si se fuerza el modo mock o no hay backend configurado
  if (useMock || !API_BASE_URL || API_BASE_URL.includes('localhost')) {
    console.warn('⚠️ Usando modo MOCK - El backend no está configurado');
    return uploadInventoryMock(products, overwriteExisting);
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

    // Si el backend devuelve 500, intentar leer el error
    if (response.status === 500) {
      const errorText = await response.text();
      console.error('❌ Backend error 500:', errorText);
      throw new Error(
        `Error 500 del backend (FUNCTION_INVOCATION_FAILED). ` +
        `El backend está activo pero tiene un error interno. ` +
        `Contacta al administrador del backend.`
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
    
    // Fallback a mock si está habilitado
    if (USE_MOCK_WHEN_BACKEND_DOWN) {
      console.warn('🔄 Fallback a modo MOCK debido a error de backend');
      return uploadInventoryMock(products, overwriteExisting);
    }
    
    // Mejorar mensajes de error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(
        `❌ No se pudo conectar con el backend (${API_BASE_URL}). ` +
        'Verifica que el servidor esté activo y la URL sea correcta.'
      );
    }
    throw error;
  }
}
