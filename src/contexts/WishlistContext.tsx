import { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from '../components/ui/Toast';

export interface WishlistItem {
  id: string;
  name: string;
  price?: number;
  image?: string;
  slug?: string;
  brand?: string;
  category?: string;
  addedAt?: number;
}

export interface WishlistList {
  id: string;
  name: string;
  description?: string;
  items: WishlistItem[];
  createdAt: number;
  isDefault?: boolean;
}

interface WishlistContextType {
  lists: WishlistList[];
  currentListId: string;
  currentList: WishlistList | undefined;
  
  // Gestión de listas
  createList: (name: string, description?: string) => void;
  deleteList: (listId: string) => void;
  renameList: (listId: string, newName: string) => void;
  setCurrentList: (listId: string) => void;
  
  // Gestión de items
  addItem: (item: WishlistItem, listId?: string) => void;
  removeItem: (itemId: string, listId?: string) => void;
  moveItem: (itemId: string, fromListId: string, toListId: string) => void;
  isInWishlist: (itemId: string, listId?: string) => boolean;
  clearList: (listId?: string) => void;
  
  // Utilidades
  exportList: (listId?: string) => void;
  getShareableLink: (listId?: string) => string;
  getTotalItems: () => number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = 'amilab_wishlists';
const DEFAULT_LIST_ID = 'default';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [lists, setLists] = useState<WishlistList[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading wishlists:', error);
    }
    
    // Lista por defecto
    return [
      {
        id: DEFAULT_LIST_ID,
        name: 'Mi Lista de Deseos',
        items: [],
        createdAt: Date.now(),
        isDefault: true,
      },
    ];
  });

  const [currentListId, setCurrentListId] = useState<string>(DEFAULT_LIST_ID);

  const currentList = lists.find((list) => list.id === currentListId);

  const saveToStorage = (newLists: WishlistList[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newLists));
      setLists(newLists);
    } catch (error) {
      console.error('Error saving wishlists:', error);
      toast.error('Error al guardar la lista');
    }
  };

  const createList = (name: string, description?: string) => {
    const newList: WishlistList = {
      id: `list-${Date.now()}`,
      name,
      description,
      items: [],
      createdAt: Date.now(),
    };
    saveToStorage([...lists, newList]);
    setCurrentListId(newList.id);
    toast.success(`Lista "${name}" creada`);
  };

  const deleteList = (listId: string) => {
    const list = lists.find((l) => l.id === listId);
    if (list?.isDefault) {
      toast.error('No puedes eliminar la lista por defecto');
      return;
    }
    
    const newLists = lists.filter((l) => l.id !== listId);
    saveToStorage(newLists);
    
    if (currentListId === listId) {
      setCurrentListId(DEFAULT_LIST_ID);
    }
    
    toast.success(`Lista "${list?.name}" eliminada`);
  };

  const renameList = (listId: string, newName: string) => {
    const newLists = lists.map((list) =>
      list.id === listId ? { ...list, name: newName } : list
    );
    saveToStorage(newLists);
    toast.success('Lista renombrada');
  };

  const addItem = (item: WishlistItem, listId?: string) => {
    const targetListId = listId || currentListId;
    const newLists = lists.map((list) => {
      if (list.id === targetListId) {
        if (list.items.some((i) => i.id === item.id)) {
          toast.error('El producto ya está en esta lista');
          return list;
        }
        return {
          ...list,
          items: [...list.items, { ...item, addedAt: Date.now() }],
        };
      }
      return list;
    });
    saveToStorage(newLists);
    toast.success('Agregado a favoritos ❤️');
  };

  const removeItem = (itemId: string, listId?: string) => {
    const targetListId = listId || currentListId;
    const newLists = lists.map((list) => {
      if (list.id === targetListId) {
        return {
          ...list,
          items: list.items.filter((item) => item.id !== itemId),
        };
      }
      return list;
    });
    saveToStorage(newLists);
    toast.success('Eliminado de favoritos');
  };

  const moveItem = (itemId: string, fromListId: string, toListId: string) => {
    const fromList = lists.find((l) => l.id === fromListId);
    const item = fromList?.items.find((i) => i.id === itemId);
    
    if (!item) return;
    
    let newLists = lists.map((list) => {
      if (list.id === fromListId) {
        return {
          ...list,
          items: list.items.filter((i) => i.id !== itemId),
        };
      }
      if (list.id === toListId) {
        if (list.items.some((i) => i.id === itemId)) {
          toast.error('El producto ya está en la lista destino');
          return list;
        }
        return {
          ...list,
          items: [...list.items, item],
        };
      }
      return list;
    });
    
    saveToStorage(newLists);
    toast.success('Producto movido');
  };

  const isInWishlist = (itemId: string, listId?: string) => {
    if (listId) {
      const list = lists.find((l) => l.id === listId);
      return list?.items.some((item) => item.id === itemId) || false;
    }
    return lists.some((list) => list.items.some((item) => item.id === itemId));
  };

  const clearList = (listId?: string) => {
    const targetListId = listId || currentListId;
    const newLists = lists.map((list) =>
      list.id === targetListId ? { ...list, items: [] } : list
    );
    saveToStorage(newLists);
    toast.success('Lista vaciada');
  };

  const exportList = (listId?: string) => {
    const targetListId = listId || currentListId;
    const list = lists.find((l) => l.id === targetListId);
    
    if (!list) return;
    
    const csvContent = [
      ['Nombre', 'Marca', 'Categoría', 'Precio', 'Fecha Agregado'].join(','),
      ...list.items.map((item) =>
        [
          item.name,
          item.brand || '-',
          item.category || '-',
          item.price ? `$${item.price}` : '-',
          item.addedAt ? new Date(item.addedAt).toLocaleDateString('es-CL') : '-',
        ].join(',')
      ),
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `wishlist-${list.name}-${Date.now()}.csv`;
    link.click();
    
    toast.success('Lista exportada');
  };

  const getShareableLink = (listId?: string) => {
    const targetListId = listId || currentListId;
    const list = lists.find((l) => l.id === targetListId);
    
    if (!list) return '';
    
    const encodedData = btoa(JSON.stringify({
      name: list.name,
      items: list.items.map((item) => item.id),
    }));
    
    return `${window.location.origin}/wishlist/shared/${encodedData}`;
  };

  const getTotalItems = () => {
    return lists.reduce((total, list) => total + list.items.length, 0);
  };

  return (
    <WishlistContext.Provider
      value={{
        lists,
        currentListId,
        currentList,
        createList,
        deleteList,
        renameList,
        setCurrentList: setCurrentListId,
        addItem,
        removeItem,
        moveItem,
        isInWishlist,
        clearList,
        exportList,
        getShareableLink,
        getTotalItems,
      }}
    >
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
