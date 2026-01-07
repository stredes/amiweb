import { useState, useRef, ChangeEvent } from 'react';
import { StockItem } from '../../features/inventory/types';
import { inventoryStore } from '../../features/inventory/inventoryStore';

interface StockUploaderProps {
  onUploadComplete: (items: StockItem[]) => void;
}

export function StockUploader({ onUploadComplete }: StockUploaderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processChunk = (lines: string[], startIndex: number): StockItem[] => {
    const items: StockItem[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = line.split(/[,\t]/);
      
      // Mapear columnas del Excel
      const item: StockItem = {
        id: `stock-${Date.now()}-${startIndex + i}`,
        familia: values[0]?.trim() || '',
        subfamilia: values[1]?.trim() || '',
        codigo: values[2]?.trim() || '',
        producto: values[3]?.trim() || '',
        unidad: values[4]?.trim() || '',
        unidadDe: values[5]?.trim() || '',
        bodega: values[6]?.trim() || '',
        ubicacion: values[7]?.trim() || '',
        nSerie: values[8]?.trim() || '',
        lote: values[9]?.trim() || '',
        fechaVencimiento: values[10]?.trim() || '',
        porLlegar: parseInt(values[11]) || 0,
        reserva: parseInt(values[12]) || 0,
        saldoStock: parseInt(values[13]) || 0
      };
      
      items.push(item);
    }
    
    return items;
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setSuccess(null);
    setProgress(0);

    try {
      const text = await file.text();
      const lines = text.split('\n');
      
      // Saltar header
      const dataLines = lines.slice(1);
      
      // Procesar en chunks de 1000 líneas
      const chunkSize = 1000;
      const allItems: StockItem[] = [];
      
      for (let i = 0; i < dataLines.length; i += chunkSize) {
        const chunk = dataLines.slice(i, Math.min(i + chunkSize, dataLines.length));
        const chunkItems = processChunk(chunk, i);
        allItems.push(...chunkItems);
        
        // Actualizar progreso
        const currentProgress = Math.round(((i + chunk.length) / dataLines.length) * 100);
        setProgress(currentProgress);
        
        // Dar tiempo al navegador para actualizar UI
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      inventoryStore.setItems(allItems);
      
      // Esperar a que React actualice el estado antes de notificar
      await new Promise(resolve => setTimeout(resolve, 100));
      
      onUploadComplete(allItems);
      setSuccess(`✅ ${allItems.length} productos cargados correctamente`);
      setProgress(100);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el archivo');
      setProgress(0);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClearStock = () => {
    if (confirm('¿Estás seguro de eliminar todo el inventario cargado?')) {
      inventoryStore.clearItems();
      setSuccess('Inventario limpiado');
      setError(null);
    }
  };

  return (
    <div className="stock-uploader">
      <div className="stock-uploader__header">
        <h3>📊 Cargar Inventario desde Excel</h3>
        <p className="muted">
          Sube un archivo CSV o Excel con las columnas: Familia, Subfamilia, Código, Producto, etc.
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          ❌ {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      {isProcessing && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="progress-text">Procesando archivo... {progress}%</p>
        </div>
      )}

      <div className="stock-uploader__actions">
        <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
          {isProcessing ? '⏳ Procesando...' : '📁 Seleccionar Archivo'}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls,.txt"
            onChange={handleFileChange}
            disabled={isProcessing}
            style={{ display: 'none' }}
          />
        </label>

        <button
          onClick={handleClearStock}
          className="btn btn-secondary"
          disabled={isProcessing}
        >
          🗑️ Limpiar Inventario
        </button>
      </div>

      <div className="stock-uploader__info">
        <h4>📋 Formato esperado:</h4>
        <ul>
          <li>Familia, Subfamilia, Código, Producto, Unidad</li>
          <li>Unidad de, Bodega, Ubicación, N° Serie, Lote</li>
          <li>Fecha Vencimiento, Por llegar, Reserva, Saldo stock</li>
        </ul>
        <p className="muted">
          <strong>Nota:</strong> El archivo debe ser CSV (separado por comas o tabulaciones) o puedes copiar desde Excel y pegar en un archivo .txt
        </p>
      </div>
    </div>
  );
}
