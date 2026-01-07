import { StockItem } from './types';

// Store simple para el inventario (puedes usar Context API si prefieres)
class InventoryStore {
  private items: StockItem[] = [];
  private listeners: Array<(items: StockItem[]) => void> = [];

  getItems(): StockItem[] {
    return this.items;
  }

  setItems(items: StockItem[]): void {
    this.items = items;
    this.notifyListeners();
  }

  addItems(newItems: StockItem[]): void {
    this.items = [...this.items, ...newItems];
    this.notifyListeners();
  }

  clearItems(): void {
    this.items = [];
    this.notifyListeners();
  }

  subscribe(listener: (items: StockItem[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.items));
  }
}

export const inventoryStore = new InventoryStore();
