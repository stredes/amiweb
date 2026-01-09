import { createContext, useContext, useState, ReactNode } from 'react';

export interface CompareProduct {
  id: string;
  name: string;
  price?: number;
  image?: string;
  slug?: string;
  brand?: string;
  category?: string;
  specs?: Record<string, string>;
  rating?: number;
}

interface CompareContextType {
  products: CompareProduct[];
  addProduct: (product: CompareProduct) => boolean;
  removeProduct: (id: string) => void;
  isInCompare: (id: string) => boolean;
  clearCompare: () => void;
  maxProducts: number;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children, maxProducts = 4 }: { children: ReactNode; maxProducts?: number }) {
  const [products, setProducts] = useState<CompareProduct[]>(() => {
    const saved = localStorage.getItem('compare');
    return saved ? JSON.parse(saved) : [];
  });

  const saveToStorage = (newProducts: CompareProduct[]) => {
    localStorage.setItem('compare', JSON.stringify(newProducts));
    setProducts(newProducts);
  };

  const addProduct = (product: CompareProduct): boolean => {
    if (products.length >= maxProducts) {
      return false;
    }
    if (isInCompare(product.id)) {
      return false;
    }
    const newProducts = [...products, product];
    saveToStorage(newProducts);
    return true;
  };

  const removeProduct = (id: string) => {
    const newProducts = products.filter((p) => p.id !== id);
    saveToStorage(newProducts);
  };

  const isInCompare = (id: string) => {
    return products.some((p) => p.id === id);
  };

  const clearCompare = () => {
    saveToStorage([]);
  };

  return (
    <CompareContext.Provider value={{ products, addProduct, removeProduct, isInCompare, clearCompare, maxProducts }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within CompareProvider');
  }
  return context;
}
