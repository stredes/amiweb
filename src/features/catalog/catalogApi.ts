import { httpRequest } from '../../lib/httpClient';
import { Product, ProductCategory, ProductFilters } from './types';

type ProductListResponse = {
  items: Array<Record<string, unknown>>;
  total: number;
  page: number;
  pageSize: number;
};

function toProduct(data: Record<string, unknown>): Product {
  const id = String(data.id || '');
  const categoryId = String(data.categoryId || data.familia || '');

  return {
    id,
    name: String(data.name || data.nombre || 'Producto sin nombre'),
    categoryId,
    brand: String(data.brand || data.marca || ''),
    shortDescription: String(data.shortDescription || data.descripcion || ''),
    longDescription: String(data.longDescription || data.descripcion || ''),
    specs: (data.specs as Record<string, string>) || {},
    requiresInstallation: Boolean(data.requiresInstallation || false),
    imageUrl: (data.imageUrl as string) || (data.imagen as string) || undefined,
    code: (data.code as string) || (data.codigo as string) || undefined,
    familia: (data.familia as string) || undefined,
    subfamilia: (data.subfamilia as string) || undefined,
    precio: typeof data.precio === 'number' ? data.precio : undefined,
    stock: typeof data.stock === 'number' ? data.stock : undefined,
  };
}

export async function getCategories(): Promise<ProductCategory[]> {
  const categories = await httpRequest<Array<Record<string, unknown>>>('/api/categories', { method: 'GET' });

  return categories.map((category) => ({
    id: String(category.id || ''),
    name: String(category.name || ''),
    description: String(category.description || ''),
  }));
}

export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  const params = new URLSearchParams();

  if (filters?.categoryId) {
    params.append('categoryId', filters.categoryId);
  }

  if (filters?.search) {
    params.append('search', filters.search);
  }

  params.append('page', '1');
  params.append('pageSize', '200');

  const queryString = params.toString();
  const endpoint = `/api/products${queryString ? `?${queryString}` : ''}`;
  const response = await httpRequest<ProductListResponse>(endpoint, { method: 'GET' });

  return (response.items || []).map((item) => toProduct(item));
}

export async function getProductById(productId: string): Promise<Product | undefined> {
  const product = await httpRequest<Record<string, unknown> | null>(`/api/products/${productId}`, {
    method: 'GET',
  }).catch(() => null);

  if (!product) {
    return undefined;
  }

  return toProduct(product);
}
