import { createContext, useContext, useState, ReactNode } from 'react';

interface WishlistItem {
  id: string;
  name: string;
  price?: number;
  image?: string;
  slug?: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const saveToStorage = (newItems: WishlistItem[]) => {
    localStorage.setItem('wishlist', JSON.stringify(newItems));
    setItems(newItems);
  };

  const addItem = (item: WishlistItem) => {
    const newItems = [...items, item];
    saveToStorage(newItems);
  };

  const removeItem = (id: string) => {
    const newItems = items.filter((item) => item.id !== id);
    saveToStorage(newItems);
  };

  const isInWishlist = (id: string) => {
    return items.some((item) => item.id === id);
  };

  const clearWishlist = () => {
    saveToStorage([]);
  };

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, isInWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}
