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
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [uploadResult, setUploadResult] = useState<InventoryUploadResult | null>(null);
  const [overwriteExisting, setOverwriteExisting] = useState(false);
  const [progressLabel, setProgressLabel] = useState<string | null>(null);
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

  const normalizeKey = (value: string) => {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  };

  const getNormalizedRow = (row: Record<string, unknown>) => {
    const normalized: Record<string, unknown> = {};
    Object.entries(row).forEach(([key, value]) => {
      normalized[normalizeKey(key)] = value;
    });
    return normalized;
  };

  const getRowValue = (row: Record<string, unknown>, keys: string[]) => {
    for (const key of keys) {
      if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
        return row[key];
      }
    }
    return '';
  };

  const getNormalizedValue = (row: Record<string, unknown>, keys: string[]) => {
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
      const normalizedRow = getNormalizedRow(row);
      const rowValues = Object.values(row).map((value) => normalizeText(value));
      if (rowValues.length === 0 || rowValues.every((value) => value === '')) {
        return;
      }

      const name = normalizeText(
        getRowValue(row, ['Nombre', 'name', 'Name']) ||
          getNormalizedValue(normalizedRow, ['producto', 'product'])
      );
      const slugInput = normalizeText(
        getRowValue(row, ['Slug', 'slug']) ||
          getNormalizedValue(normalizedRow, ['slug'])
      );
      const sku = normalizeText(
        getRowValue(row, ['SKU', 'sku']) || getNormalizedValue(normalizedRow, ['codigo'])
      );
      const loteValue = normalizeText(getNormalizedValue(normalizedRow, ['lote']));
      const numeroSerieValue = normalizeText(
        getNormalizedValue(normalizedRow, ['n serie', 'numero serie'])
      );
      const slug = slugInput || (name ? generateSlug(name) : '');
      const slugParts = [slug];
      if (sku) slugParts.push(generateSlug(sku));
      if (loteValue) slugParts.push(generateSlug(loteValue));
      else if (numeroSerieValue) slugParts.push(generateSlug(numeroSerieValue));
      const slugWithSku = slugParts.filter(Boolean).join('-');
      const categoryId = normalizeText(
        getRowValue(row, ['Categoria ID', 'categoryId', 'CategoriaId']) ||
          getNormalizedValue(normalizedRow, ['categoria id', 'categoria', 'subfamilia', 'familia'])
      );
      const brand = normalizeText(
        getRowValue(row, ['Marca', 'brand']) ||
          getNormalizedValue(normalizedRow, ['marca', 'unidad de negocio', 'unidad negocio'])
      );
      const shortDescription = normalizeText(
        getRowValue(row, ['Descripcion Corta', 'shortDescription', 'Descripcion corta']) ||
          name
      );
      const longDescription = normalizeText(
        getRowValue(row, ['Descripcion', 'longDescription', 'Descripción', 'Descripcion larga']) ||
          name
      );
      const specsValue = normalizeText(
        getRowValue(row, ['Especificaciones', 'specs']) ||
          getNormalizedValue(normalizedRow, ['especificaciones'])
      );
      const requiresInstallation = parseBoolean(
        getRowValue(row, ['Requiere Instalacion', 'requiresInstallation']) ||
          getNormalizedValue(normalizedRow, ['requiere instalacion'])
      );
      const isActiveRaw = getRowValue(row, ['Activo', 'isActive', 'Activa']);
      const isActiveText = normalizeText(isActiveRaw);
      const isActive = isActiveText ? parseBoolean(isActiveRaw) : true;
      const stockValue = parseNumber(
        getRowValue(row, ['Stock']) || getNormalizedValue(normalizedRow, ['saldo stock', 'stock'])
      );
      const priceValue = parseNumber(
        getRowValue(row, ['Precio', 'price']) || getNormalizedValue(normalizedRow, ['precio'])
      );

      const derivedSpecs = {
        codigo: normalizeText(getNormalizedValue(normalizedRow, ['codigo'])),
        lote: loteValue,
        bodega: normalizeText(getNormalizedValue(normalizedRow, ['bodega'])),
        ubicacion: normalizeText(getNormalizedValue(normalizedRow, ['ubicacion'])),
        unidad: normalizeText(getNormalizedValue(normalizedRow, ['unidad'])),
        numeroSerie: numeroSerieValue,
      };
      const derivedSpecsText = Object.entries(derivedSpecs)
        .filter(([, value]) => value)
        .map(([key, value]) => `${key}:${value}`)
        .join(';');

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
        slug: slugWithSku,
        categoryId,
        brand,
        shortDescription,
        longDescription,
        specs: parseSpecs(specsValue || derivedSpecsText),
        requiresInstallation,
        isActive,
        stock: typeof stockValue === 'number' ? Math.trunc(stockValue) : undefined,
        price: typeof priceValue === 'number' ? priceValue : undefined,
      });
    });

    return { products: parsedProducts, errors };
  };

  const dedupeProducts = (products: InventoryUploadProduct[]) => {
    const seen = new Set<string>();
    const counts = new Map<string, number>();
    const deduped: InventoryUploadProduct[] = [];
    const duplicates: string[] = [];

    products.forEach((product, index) => {
      const baseSlugKey = product.slug.toLowerCase();
      const count = counts.get(baseSlugKey) ?? 0;
      counts.set(baseSlugKey, count + 1);

      if (count > 0) {
        const uniqueSlug = `${product.slug}-dup-${count + 1}`;
        duplicates.push(
          `Fila ${index + 2}: slug duplicado (${product.slug}), ajustado a ${uniqueSlug}`
        );
        seen.add(uniqueSlug.toLowerCase());
        deduped.push({ ...product, slug: uniqueSlug });
        return;
      }

      seen.add(baseSlugKey);
      deduped.push(product);
    });

    return { deduped, duplicates };
  };

  const chunkProducts = (products: InventoryUploadProduct[], size: number) => {
    const chunks: InventoryUploadProduct[][] = [];
    for (let i = 0; i < products.length; i += size) {
      chunks.push(products.slice(i, i + size));
    }
    return chunks;
  };

  const mergeResults = (base: InventoryUploadResult, next: InventoryUploadResult) => {
    return {
      success: base.success && next.success,
      data: {
        totalProcessed: base.data.totalProcessed + next.data.totalProcessed,
        successful: base.data.successful + next.data.successful,
        failed: base.data.failed + next.data.failed,
        skipped: base.data.skipped + next.data.skipped,
        errors: [...base.data.errors, ...next.data.errors],
        createdIds: [...base.data.createdIds, ...next.data.createdIds],
      },
    };
  };

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const reconcileRetryResult = (
    aggregate: InventoryUploadResult,
    retryResult: InventoryUploadResult,
    retryProducts: InventoryUploadProduct[]
  ) => {
    const retryErrorKeys = new Set(
      retryResult.data.errors.map((item) => item.slug ?? item.name)
    );
    const retryProductKeys = retryProducts.map((item) => item.slug ?? item.name);
    const recoveredKeys = retryProductKeys.filter((key) => !retryErrorKeys.has(key));
    const recoveredCount = recoveredKeys.length;

    const remainingErrorKeys = new Set(
      retryResult.data.errors.map((item) => item.slug ?? item.name)
    );

    const updatedErrors = aggregate.data.errors
      .filter((item) => {
        const key = item.slug ?? item.name;
        return !recoveredKeys.includes(key) && !remainingErrorKeys.has(key);
      })
      .concat(retryResult.data.errors);

    return {
      ...aggregate,
      data: {
        ...aggregate.data,
        successful: aggregate.data.successful + recoveredCount,
        failed: Math.max(0, aggregate.data.failed - recoveredCount),
        errors: updatedErrors,
      },
    };
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setSuccess(null);
    setProgress(0);
    setValidationErrors([]);
    setValidationWarnings([]);
    setUploadResult(null);
    setProgressLabel('Leyendo archivo...');

    try {
      setProgress(10);
      const { products, errors } = await parseExcelFile(file);
      const { deduped, duplicates } = dedupeProducts(products);
      setValidationErrors(errors);
      setValidationWarnings(duplicates);
      setProgress(30);

      if (deduped.length === 0) {
        throw new Error('El archivo no contiene productos válidos');
      }

      const user = auth.currentUser;
      if (!user) {
        throw new Error('Usuario no autenticado en Firebase');
      }

      const token = await user.getIdToken();
      setProgressLabel('Subiendo productos al backend...');
      setProgress(40);

      const batchSize = 200;
      const batches = chunkProducts(deduped, batchSize);
      let aggregateResult: InventoryUploadResult | null = null;
      const totalSteps = batches.length * 2;
      let completedSteps = 0;
      const retryDelays = [800, 1600];

      for (let i = 0; i < batches.length; i += 1) {
        const batch = batches[i];
        setProgressLabel(`Subiendo lote ${i + 1} de ${batches.length}...`);
        let batchResult: InventoryUploadResult;

        try {
          batchResult = await uploadInventory(batch, {
            token,
            overwriteExisting,
          });
        } catch (uploadError) {
          setProgressLabel(`Reintentando lote ${i + 1}...`);
          await sleep(retryDelays[0]);
          batchResult = await uploadInventory(batch, {
            token,
            overwriteExisting,
          });
        }

        aggregateResult = aggregateResult ? mergeResults(aggregateResult, batchResult) : batchResult;
        completedSteps += 1;
        setProgress(Math.min(90, Math.round((completedSteps / totalSteps) * 100)));

        const transientErrors = batchResult.data.errors.filter((item) => item.isTransient);
        let retryProducts = transientErrors
          .map((item) => batch[item.index])
          .filter((item): item is InventoryUploadProduct => Boolean(item));

        for (let attempt = 0; attempt < retryDelays.length && retryProducts.length > 0; attempt += 1) {
          setProgressLabel(`Reintentando ${retryProducts.length} productos...`);
          await sleep(retryDelays[attempt]);
          const retryResult = await uploadInventory(retryProducts, {
            token,
            overwriteExisting,
          });

          if (aggregateResult) {
            aggregateResult = reconcileRetryResult(aggregateResult, retryResult, retryProducts);
          }

          retryProducts = retryResult.data.errors
            .filter((item) => item.isTransient)
            .map((item) => retryProducts[item.index])
            .filter((item): item is InventoryUploadProduct => Boolean(item));
        }

        completedSteps += 1;
        setProgress(Math.min(95, Math.round((completedSteps / totalSteps) * 100)));
        await sleep(200);
      }

      if (!aggregateResult) {
        throw new Error('No se obtuvo respuesta del backend');
      }

      setUploadResult(aggregateResult);
      onUploadComplete([]);
      setSuccess(
        `✅ Carga completada: ${aggregateResult.data.successful} exitosos, ${aggregateResult.data.failed} fallidos`
      );
      setProgress(100);
      setProgressLabel('Carga finalizada');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el archivo');
      setProgress(0);
      setProgressLabel(null);
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

      {validationWarnings.length > 0 && (
        <div className="alert alert-warning">
          <strong>Avisos de validación:</strong>
          <ul>
            {validationWarnings.slice(0, 6).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {validationWarnings.length > 6 && (
            <p className="muted">
              Se omitieron {validationWarnings.length - 6} avisos más.
            </p>
          )}
        </div>
      )}

      {uploadResult && uploadResult.data.errors.length > 0 && (
        <div className="alert alert-warning">
          <strong>Errores del backend:</strong>
          <ul>
            {uploadResult.data.errors.slice(0, 6).map((item) => (
              <li key={`${item.index}-${item.name}`}>
                #{item.index}: {item.name}
                {item.slug ? ` (${item.slug})` : ''} - {item.error}
                {item.isTransient ? ' (reintento recomendado)' : ''}
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
          <p className="progress-text">
            {progressLabel ?? 'Procesando archivo...'} {progress}%
          </p>
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
