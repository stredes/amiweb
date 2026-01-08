export interface StockItem {
  id: string;
  familia: string;
  subfamilia: string;
  codigo: string;
  producto: string;
  unidad: string;
  unidadDe: string;
  bodega: string;
  ubicacion: string;
  nSerie: string;
  lote: string;
  fechaVencimiento: string;
  porLlegar: number;
  reserva: number;
  saldoStock: number;
}

export interface InventoryStats {
  totalItems: number;
  totalStock: number;
  totalReservas: number;
  itemsBajoStock: number;
  itemsProximosVencer: number;
}

export interface InventoryUploadProduct {
  sku?: string;
  name: string;
  slug: string;
  categoryId: string;
  brand: string;
  shortDescription: string;
  longDescription: string;
  specs?: Record<string, string>;
  requiresInstallation?: boolean;
  isActive?: boolean;
  stock?: number;
  price?: number;
}

export interface InventoryUploadError {
  index: number;
  name: string;
  slug?: string;
  error: string;
  isTransient?: boolean;
}

export interface InventoryUploadResult {
  success: boolean;
  data: {
    totalProcessed: number;
    successful: number;
    failed: number;
    skipped: number;
    errors: InventoryUploadError[];
    createdIds: string[];
  };
}
