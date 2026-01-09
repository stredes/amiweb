import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, increment } from 'firebase/firestore';

/**
 * Servicio para integrar órdenes con el inventario
 */
class InventoryOrderService {
  private productsCollection = 'products';

  /**
   * Reduce el stock de productos al crear una orden
   */
  async reduceStockForOrder(products: Array<{ id: string; quantity: number }>): Promise<void> {
    try {
      const updatePromises = products.map(async ({ id, quantity }) => {
        const productRef = doc(db, this.productsCollection, id);
        
        // Usar increment negativo para reducir el stock
        await updateDoc(productRef, {
          stock: increment(-quantity),
          updatedAt: new Date().toISOString(),
        });
      });

      await Promise.all(updatePromises);
      console.log('✅ Stock actualizado para la orden');
    } catch (error) {
      console.error('❌ Error al reducir stock:', error);
      throw new Error('No se pudo actualizar el inventario');
    }
  }

  /**
   * Restaura el stock de productos al cancelar una orden
   */
  async restoreStockForOrder(products: Array<{ id: string; quantity: number }>): Promise<void> {
    try {
      const updatePromises = products.map(async ({ id, quantity }) => {
        const productRef = doc(db, this.productsCollection, id);
        
        // Usar increment positivo para restaurar el stock
        await updateDoc(productRef, {
          stock: increment(quantity),
          updatedAt: new Date().toISOString(),
        });
      });

      await Promise.all(updatePromises);
      console.log('✅ Stock restaurado tras cancelación');
    } catch (error) {
      console.error('❌ Error al restaurar stock:', error);
      throw new Error('No se pudo restaurar el inventario');
    }
  }

  /**
   * Verifica disponibilidad de stock antes de crear una orden
   */
  async checkStockAvailability(products: Array<{ id: string; quantity: number }>): Promise<{
    available: boolean;
    unavailableProducts: Array<{ id: string; name: string; requested: number; available: number }>;
  }> {
    try {
      const unavailableProducts: Array<{ id: string; name: string; requested: number; available: number }> = [];

      for (const { id, quantity } of products) {
        const productSnap = await getDocs(query(collection(db, this.productsCollection), where('__name__', '==', id)));
        
        if (!productSnap.empty) {
          const productData = productSnap.docs[0].data();
          const currentStock = productData.stock || 0;

          if (currentStock < quantity) {
            unavailableProducts.push({
              id,
              name: productData.name || 'Producto desconocido',
              requested: quantity,
              available: currentStock,
            });
          }
        } else {
          unavailableProducts.push({
            id,
            name: 'Producto no encontrado',
            requested: quantity,
            available: 0,
          });
        }
      }

      return {
        available: unavailableProducts.length === 0,
        unavailableProducts,
      };
    } catch (error) {
      console.error('❌ Error al verificar stock:', error);
      throw new Error('No se pudo verificar la disponibilidad');
    }
  }

  /**
   * Obtiene el stock actual de un producto
   */
  async getProductStock(productId: string): Promise<number> {
    try {
      const productSnap = await getDocs(query(collection(db, this.productsCollection), where('__name__', '==', productId)));
      
      if (!productSnap.empty) {
        const productData = productSnap.docs[0].data();
        return productData.stock || 0;
      }
      
      return 0;
    } catch (error) {
      console.error('❌ Error al obtener stock:', error);
      return 0;
    }
  }

  /**
   * Reserva stock temporalmente (útil para el carrito)
   */
  async reserveStock(products: Array<{ id: string; quantity: number }>, userId: string): Promise<void> {
    try {
      const reservations = products.map(async ({ id, quantity }) => {
        const productRef = doc(db, this.productsCollection, id);
        
        await updateDoc(productRef, {
          [`reservations.${userId}`]: quantity,
          updatedAt: new Date().toISOString(),
        });
      });

      await Promise.all(reservations);
      console.log('✅ Stock reservado temporalmente');
    } catch (error) {
      console.error('❌ Error al reservar stock:', error);
      // No lanzar error, las reservas son opcionales
    }
  }

  /**
   * Libera stock reservado
   */
  async releaseStock(products: Array<{ id: string }>, userId: string): Promise<void> {
    try {
      const releases = products.map(async ({ id }) => {
        const productRef = doc(db, this.productsCollection, id);
        
        await updateDoc(productRef, {
          [`reservations.${userId}`]: 0,
          updatedAt: new Date().toISOString(),
        });
      });

      await Promise.all(releases);
      console.log('✅ Stock liberado');
    } catch (error) {
      console.error('❌ Error al liberar stock:', error);
      // No lanzar error, las reservas son opcionales
    }
  }
}

export const inventoryOrderService = new InventoryOrderService();
