import { createContext, ReactNode, useContext, useState } from 'react';

type SearchContextValue = {
  term: string;
  setTerm: (value: string) => void;
};

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [term, setTerm] = useState('');

  return <SearchContext.Provider value={{ term, setTerm }}>{children}</SearchContext.Provider>;
}

export function useSearchStore() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchStore debe usarse dentro de SearchProvider');
  }
  return context;
}
