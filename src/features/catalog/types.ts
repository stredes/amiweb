export interface ProductCategory {
  id: string;
  name: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  brand: string;
  shortDescription: string;
  longDescription: string;
  specs: Record<string, string>;
  requiresInstallation: boolean;
  imageUrl?: string;
  code?: string;
  familia?: string;
  subfamilia?: string;
  precio?: number;
  stock?: number;
}

export interface ProductFilters {
  categoryId?: string;
  search?: string;
}
