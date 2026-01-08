import { InventoryUploadProduct, InventoryUploadResult } from './types';

/**
 * Mock para desarrollo/testing cuando el backend no está disponible
 */
export async function uploadInventoryMock(
  products: InventoryUploadProduct[],
  overwriteExisting: boolean = false
): Promise<InventoryUploadResult> {
  console.log('🔧 Modo MOCK activado - Simulando carga de inventario');
  console.log(`📦 Productos a cargar: ${products.length}`);
  console.log(`🔄 Overwrite: ${overwriteExisting}`);

  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simular algunos errores aleatorios para testing
  const errors = products
    .filter((_, index) => Math.random() < 0.02) // 2% de errores
    .map((product, index) => ({
      index,
      name: product.name,
      slug: product.slug,
      error: 'Error simulado para testing',
      isTransient: Math.random() < 0.5,
    }));

  const successful = products.length - errors.length;

  const result: InventoryUploadResult = {
    success: true,
    data: {
      successful,
      failed: errors.length,
      errors,
    },
  };

  console.log('✅ Mock upload completado:', result);
  return result;
}
