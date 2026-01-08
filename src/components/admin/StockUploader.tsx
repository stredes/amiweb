import { useState, useRef, ChangeEvent } from 'react';
import * as XLSX from 'xlsx';
import { StockItem, InventoryUploadProduct, InventoryUploadResult } from '../../features/inventory/types';
import { uploadInventory } from '../../features/inventory/inventoryApi';
import { auth } from '../../lib/firebase';

interface StockUploaderProps {
  onUploadComplete: (items: StockItem[]) => void;
}

export function StockUploader({ onUploadComplete }: StockUploaderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [uploadResult, setUploadResult] = useState<InventoryUploadResult | null>(null);
  const [overwriteExisting, setOverwriteExisting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const normalizeText = (value: unknown) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value.trim();
    if (typeof value === 'number') return `${value}`.trim();
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    return `${value}`.trim();
  };

  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const parseSpecs = (specsString: string): Record<string, string> => {
    if (!specsString) return {};
    const specs: Record<string, string> = {};
    const pairs = specsString.split(';');
    pairs.forEach((pair) => {
      const [key, value] = pair.split(':');
      if (key && value) {
        specs[key.trim()] = value.trim();
      }
    });
    return specs;
  };

  const parseBoolean = (value: unknown) => {
    if (typeof value === 'boolean') return value;
    const normalized = normalizeText(value).toLowerCase();
    return ['si', 'sí', 'true', '1', 'yes'].includes(normalized);
  };

  const parseNumber = (value: unknown) => {
    if (value === null || value === undefined || value === '') return undefined;
    const normalized = normalizeText(value).replace(/,/g, '.');
    const numberValue = Number(normalized);
    if (Number.isFinite(numberValue)) return numberValue;
    return undefined;
  };

  const getRowValue = (row: Record<string, unknown>, keys: string[]) => {
    for (const key of keys) {
      if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
        return row[key];
      }
    }
    return '';
  };

  const parseExcelFile = async (file: File) => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, {
      defval: '',
    });

    const parsedProducts: InventoryUploadProduct[] = [];
    const errors: string[] = [];

    rows.forEach((row, index) => {
      const rowValues = Object.values(row).map((value) => normalizeText(value));
      if (rowValues.length === 0 || rowValues.every((value) => value === '')) {
        return;
      }

      const name = normalizeText(getRowValue(row, ['Nombre', 'name', 'Name']));
      const slugInput = normalizeText(getRowValue(row, ['Slug', 'slug']));
      const slug = slugInput || (name ? generateSlug(name) : '');
      const categoryId = normalizeText(getRowValue(row, ['Categoria ID', 'categoryId', 'CategoriaId']));
      const brand = normalizeText(getRowValue(row, ['Marca', 'brand']));
      const shortDescription = normalizeText(
        getRowValue(row, ['Descripcion Corta', 'shortDescription', 'Descripcion corta'])
      );
      const longDescription = normalizeText(
        getRowValue(row, ['Descripcion', 'longDescription', 'Descripción', 'Descripcion larga'])
      );
      const specsValue = normalizeText(getRowValue(row, ['Especificaciones', 'specs']));
      const requiresInstallation = parseBoolean(
        getRowValue(row, ['Requiere Instalacion', 'requiresInstallation'])
      );
      const isActiveRaw = getRowValue(row, ['Activo', 'isActive', 'Activa']);
      const isActiveText = normalizeText(isActiveRaw);
      const isActive = isActiveText ? parseBoolean(isActiveRaw) : true;
      const stockValue = parseNumber(getRowValue(row, ['Stock']));
      const priceValue = parseNumber(getRowValue(row, ['Precio', 'price']));
      const sku = normalizeText(getRowValue(row, ['SKU', 'sku']));

      const rowErrors: string[] = [];
      if (!name || name.length < 2) rowErrors.push('name');
      if (!slug || slug.length < 2) rowErrors.push('slug');
      if (!categoryId) rowErrors.push('categoryId');
      if (!brand) rowErrors.push('brand');
      if (!shortDescription || shortDescription.length < 2) rowErrors.push('shortDescription');
      if (!longDescription || longDescription.length < 2) rowErrors.push('longDescription');

      if (rowErrors.length > 0) {
        errors.push(
          `Fila ${index + 2}: faltan o son inválidos (${rowErrors.join(', ')})`
        );
        return;
      }

      parsedProducts.push({
        sku: sku || undefined,
        name,
        slug,
        categoryId,
        brand,
        shortDescription,
        longDescription,
        specs: parseSpecs(specsValue),
        requiresInstallation,
        isActive,
        stock: typeof stockValue === 'number' ? Math.trunc(stockValue) : undefined,
        price: typeof priceValue === 'number' ? priceValue : undefined,
      });
    });

    return { products: parsedProducts, errors };
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setSuccess(null);
    setProgress(0);
    setValidationErrors([]);
    setUploadResult(null);

    try {
      setProgress(20);
      const { products, errors } = await parseExcelFile(file);
      setValidationErrors(errors);
      setProgress(50);

      if (products.length === 0) {
        throw new Error('El archivo no contiene productos válidos');
      }
      if (products.length > 500) {
        throw new Error('Máximo 500 productos por carga');
      }

      const user = auth.currentUser;
      if (!user) {
        throw new Error('Usuario no autenticado en Firebase');
      }

      const token = await user.getIdToken();
      setProgress(70);

      const result = await uploadInventory(products, {
        token,
        overwriteExisting,
      });

      setUploadResult(result);
      onUploadComplete([]);
      setSuccess(
        `✅ Carga completada: ${result.data.successful} exitosos, ${result.data.failed} fallidos`
      );
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

  return (
    <div className="stock-uploader">
      <div className="stock-uploader__header">
        <h3>📊 Cargar Inventario desde Excel</h3>
        <p className="muted">
          Sube un archivo CSV o Excel con columnas de productos (Nombre, Slug, Categoria ID, Marca, etc.).
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

      {validationErrors.length > 0 && (
        <div className="alert alert-warning">
          <strong>Errores de validación:</strong>
          <ul>
            {validationErrors.slice(0, 6).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {validationErrors.length > 6 && (
            <p className="muted">Se omitieron {validationErrors.length - 6} errores más.</p>
          )}
        </div>
      )}

      {uploadResult && uploadResult.data.errors.length > 0 && (
        <div className="alert alert-warning">
          <strong>Errores del backend:</strong>
          <ul>
            {uploadResult.data.errors.slice(0, 6).map((item) => (
              <li key={`${item.index}-${item.name}`}>
                #{item.index}: {item.name} - {item.error}
              </li>
            ))}
          </ul>
          {uploadResult.data.errors.length > 6 && (
            <p className="muted">Se omitieron {uploadResult.data.errors.length - 6} errores más.</p>
          )}
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
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            disabled={isProcessing}
            style={{ display: 'none' }}
          />
        </label>

        <label className="checkbox-inline">
          <input
            type="checkbox"
            checked={overwriteExisting}
            onChange={(event) => setOverwriteExisting(event.target.checked)}
            disabled={isProcessing}
          />
          <span>Actualizar existentes (overwrite)</span>
        </label>
      </div>

      <div className="stock-uploader__info">
        <h4>📋 Formato esperado:</h4>
        <ul>
          <li>Nombre, Slug, Categoria ID, Marca</li>
          <li>Descripcion Corta, Descripcion, Especificaciones</li>
          <li>Requiere Instalacion, Stock, Precio</li>
        </ul>
        <p className="muted">
          <strong>Nota:</strong> Maximo 500 productos por carga. Slug puede omitirse y se genera desde el nombre.
        </p>
      </div>
    </div>
  );
}
