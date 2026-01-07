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
