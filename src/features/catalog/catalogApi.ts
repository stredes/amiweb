import { products, productCategories } from './mockData';
import { Product, ProductCategory, ProductFilters } from './types';

// Devuelve categorías mock (sustituir por fetch a backend en el futuro).
export async function getCategories(): Promise<ProductCategory[]> {
  // TODO: reemplazar por llamada HTTP real al backend.
  return Promise.resolve(productCategories);
}

// Filtra productos mock por categoría y término de búsqueda.
export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  // TODO: reemplazar por llamada HTTP real al backend.
  let result = products;

  if (filters?.categoryId) {
    result = result.filter((product) => product.categoryId === filters.categoryId);
  }

  if (filters?.search) {
    const term = filters.search.toLowerCase();
    result = result.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.brand.toLowerCase().includes(term) ||
        product.shortDescription.toLowerCase().includes(term)
    );
  }

  return Promise.resolve(result);
}

// Obtiene un producto por id desde el mock.
export async function getProductById(productId: string): Promise<Product | undefined> {
  // TODO: reemplazar por llamada HTTP real al backend.
  const product = products.find((item) => item.id === productId);
  return Promise.resolve(product);
}
