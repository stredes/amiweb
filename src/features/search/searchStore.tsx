import { createContext, ReactNode, useContext, useState } from 'react';

export type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'newest' | 'popular';
export type ViewMode = 'grid' | 'list';

type SearchContextValue = {
  term: string;
  setTerm: (value: string) => void;
  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;
  viewMode: ViewMode;
  setViewMode: (value: ViewMode) => void;
  priceRange: [number, number];
  setPriceRange: (value: [number, number]) => void;
  selectedBrands: string[];
  setSelectedBrands: (value: string[]) => void;
  inStock: boolean;
  setInStock: (value: boolean) => void;
  clearFilters: () => void;
};

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [term, setTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStock, setInStock] = useState(false);

  const clearFilters = () => {
    setTerm('');
    setSortBy('name-asc');
    setPriceRange([0, 10000000]);
    setSelectedBrands([]);
    setInStock(false);
  };

  return (
    <SearchContext.Provider
      value={{
        term,
        setTerm,
        sortBy,
        setSortBy,
        viewMode,
        setViewMode,
        priceRange,
        setPriceRange,
        selectedBrands,
        setSelectedBrands,
        inStock,
        setInStock,
        clearFilters,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchStore() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchStore debe usarse dentro de SearchProvider');
  }
  return context;
}

