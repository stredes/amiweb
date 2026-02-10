import { useEffect, useMemo, useState } from 'react';
import { backendApi, WarehouseStockSummary } from '../../features/api/backendApiService';
import { API_BASE_URL } from '../../config/env';
import './WarehouseStock.css';

const stockTabs = [
  'Stock fisico',
  'Stock de bodega temporal',
  'Informe de existencias',
  'Inventario inmovilizado',
  'Producto vencido o por vencer',
  'Stock critico/optimo',
  'Tipo de documento'
];

export function WarehouseStock() {
  const [activeTab, setActiveTab] = useState(stockTabs[0]);
  const [familias, setFamilias] = useState<string[]>([]);
  const [subfamilias, setSubfamilias] = useState<string[]>([]);
  const [bodegas, setBodegas] = useState<string[]>([]);
  const [ubicaciones, setUbicaciones] = useState<string[]>([]);
  const [marcas, setMarcas] = useState<string[]>([]);
  const [origenes, setOrigenes] = useState<string[]>([]);
  const [unidadesNegocio, setUnidadesNegocio] = useState<string[]>([]);
  const [items, setItems] = useState<Array<Record<string, any>>>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<WarehouseStockSummary | null>(null);
  const [filters, setFilters] = useState({
    date: new Date().toISOString().slice(0, 10),
    familia: '',
    subfamilia: '',
    bodega: '',
    ubicacion: '',
    codigoArticulo: '',
    unidadNegocio: '',
    marca: '',
    origen: '',
    includeTemporaryStock: true,
    hideNoStock: true
  });
  const [searchTerm, setSearchTerm] = useState('');

  const summaryTotals = useMemo(() => {
    const fallback = items.reduce(
      (acc, item) => ({
        porLlegar: acc.porLlegar + (Number(item.porLlegar) || 0),
        reserva: acc.reserva + (Number(item.reserva) || 0),
        saldoStock: acc.saldoStock + (Number(item.saldoStock) || 0)
      }),
      { porLlegar: 0, reserva: 0, saldoStock: 0 }
    );

    return {
      porLlegar: summary?.totalPorLlegar ?? fallback.porLlegar,
      reserva: summary?.totalReserva ?? fallback.reserva,
      saldoStock: summary?.totalStock ?? fallback.saldoStock
    };
  }, [items, summary]);

  const buildStockParams = (override: Partial<typeof filters> = {}) => {
    const merged = { ...filters, ...override };
    return {
      ...merged,
      search: searchTerm.trim() || undefined,
      page,
      pageSize
    };
  };

  const handleExport = (format: 'csv' | 'xlsx') => {
    const params = buildStockParams();
    const url = new URL('/api/warehouse/stock/export', API_BASE_URL);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, value.toString());
      }
    });
    url.searchParams.set('format', format);
    window.open(url.toString(), '_blank');
  };

  useEffect(() => {
    const loadCatalog = async (endpoint: string, setter: (values: string[]) => void, params?: Record<string, string>) => {
      try {
        const response = await backendApi.listWarehouseCatalog(endpoint, params);
        const data = response.data as any;
        const values = Array.isArray(data) ? data : data?.items || [];
        setter(values);
      } catch (err) {
        console.error(`Error loading catalog ${endpoint}:`, err);
      }
    };

    loadCatalog('familias', setFamilias);
    loadCatalog('bodegas', setBodegas);
    loadCatalog('marcas', setMarcas);
    loadCatalog('origenes', setOrigenes);
    loadCatalog('unidades-negocio', setUnidadesNegocio);
  }, []);

  useEffect(() => {
    const loadSubfamilias = async () => {
      if (!filters.familia) {
        setSubfamilias([]);
        return;
      }
      try {
        const response = await backendApi.listWarehouseCatalog('subfamilias', { familia: filters.familia });
        const data = response.data as any;
        setSubfamilias(Array.isArray(data) ? data : data?.items || []);
      } catch (err) {
        console.error('Error loading subfamilias:', err);
      }
    };

    loadSubfamilias();
  }, [filters.familia]);

  useEffect(() => {
    const loadUbicaciones = async () => {
      if (!filters.bodega) {
        setUbicaciones([]);
        return;
      }
      try {
        const response = await backendApi.listWarehouseCatalog('ubicaciones', { bodega: filters.bodega });
        const data = response.data as any;
        setUbicaciones(Array.isArray(data) ? data : data?.items || []);
      } catch (err) {
        console.error('Error loading ubicaciones:', err);
      }
    };

    loadUbicaciones();
  }, [filters.bodega]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await backendApi.listWarehouseStock(buildStockParams());
        if (!response.success) {
          throw new Error(response.error || 'No se pudo cargar el stock');
        }
        setItems(response.data.items || []);
        setTotal(response.data.total || 0);
        setSummary(response.data.summary || null);
      } catch (err: any) {
        console.error('Error loading stock:', err);
        const message = err?.message === 'Failed to fetch'
          ? 'No se pudo conectar al backend.'
          : err?.message || 'Error al cargar stock';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [filters, page, pageSize, searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [filters, searchTerm]);

  return (
    <div className="warehouse-stock">
      <div className="warehouse-stock__banner">
        <span>Importante: La opcion "Stock fuera de bodega" ahora es "Stock de bodega temporal".</span>
        <button className="warehouse-stock__close" type="button" aria-label="Cerrar aviso">×</button>
      </div>

      <div className="warehouse-stock__tabs">
        {stockTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`warehouse-stock__tab ${activeTab === tab ? 'is-active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="warehouse-stock__filters">
        <div className="filter-field">
          <label htmlFor="warehouse-filter-date">Fecha</label>
          <input
            id="warehouse-filter-date"
            type="date"
            value={filters.date}
            onChange={(event) => setFilters(prev => ({ ...prev, date: event.target.value }))}
            name="date"
          />
        </div>
        <div className="filter-field">
          <label htmlFor="warehouse-filter-familia">Familia</label>
          <select
            id="warehouse-filter-familia"
            value={filters.familia}
            onChange={(event) => setFilters(prev => ({ ...prev, familia: event.target.value, subfamilia: '' }))}
            name="familia"
          >
            <option value="">Todas</option>
            {familias.map((familia) => (
              <option key={familia} value={familia}>{familia}</option>
            ))}
          </select>
        </div>
        <div className="filter-field">
          <label htmlFor="warehouse-filter-subfamilia">SubFamilia</label>
          <select
            id="warehouse-filter-subfamilia"
            value={filters.subfamilia}
            onChange={(event) => setFilters(prev => ({ ...prev, subfamilia: event.target.value }))}
            name="subfamilia"
          >
            <option value="">Todas</option>
            {subfamilias.map((subfamilia) => (
              <option key={subfamilia} value={subfamilia}>{subfamilia}</option>
            ))}
          </select>
        </div>
        <div className="filter-field">
          <label htmlFor="warehouse-filter-bodega">Bodega</label>
          <select
            id="warehouse-filter-bodega"
            value={filters.bodega}
            onChange={(event) => setFilters(prev => ({ ...prev, bodega: event.target.value }))}
            name="bodega"
          >
            <option value="">Todas</option>
            {bodegas.map((bodega) => (
              <option key={bodega} value={bodega}>{bodega}</option>
            ))}
          </select>
        </div>
        <div className="filter-field">
          <label htmlFor="warehouse-filter-ubicacion">Ubicación</label>
          <select
            id="warehouse-filter-ubicacion"
            value={filters.ubicacion}
            onChange={(event) => setFilters(prev => ({ ...prev, ubicacion: event.target.value }))}
            name="ubicacion"
          >
            <option value="">Todas</option>
            {ubicaciones.map((ubicacion) => (
              <option key={ubicacion} value={ubicacion}>{ubicacion}</option>
            ))}
          </select>
        </div>
        <div className="filter-field filter-field--wide">
          <label htmlFor="warehouse-filter-codigo">Código de artículo</label>
          <div className="filter-input-group">
            <button type="button" className="filter-pill" aria-label="Limpiar código">×</button>
            <input
              id="warehouse-filter-codigo"
              type="text"
              value={filters.codigoArticulo}
              onChange={(event) => setFilters(prev => ({ ...prev, codigoArticulo: event.target.value }))}
              placeholder="Código…"
              aria-label="Código de artículo"
              name="codigoArticulo"
              autoComplete="off"
            />
            <input type="text" placeholder="Descripción…" aria-label="Descripción del artículo" autoComplete="off" />
            <button type="button" className="filter-icon" aria-label="Buscar código">🔍</button>
          </div>
        </div>
        <div className="filter-field filter-field--wide">
          <label htmlFor="warehouse-filter-unidad">Unidad de negocio</label>
          <div className="filter-input-group">
            <button type="button" className="filter-pill" aria-label="Limpiar unidad de negocio">×</button>
            <input
              id="warehouse-filter-unidad"
              type="text"
              list="unidades-negocio"
              value={filters.unidadNegocio}
              onChange={(event) => setFilters(prev => ({ ...prev, unidadNegocio: event.target.value }))}
              placeholder="Buscar unidad de negocio…"
              aria-label="Unidad de negocio"
              name="unidadNegocio"
              autoComplete="off"
            />
            <input type="text" placeholder="Descripción…" aria-label="Descripción de unidad de negocio" autoComplete="off" />
            <button type="button" className="filter-icon" aria-label="Buscar unidad de negocio">🔍</button>
          </div>
        </div>
        <div className="filter-field filter-field--wide">
          <label htmlFor="warehouse-filter-marca">Marca</label>
          <div className="filter-input-group">
            <button type="button" className="filter-pill" aria-label="Limpiar marca">×</button>
            <input
              id="warehouse-filter-marca"
              type="text"
              list="marcas"
              value={filters.marca}
              onChange={(event) => setFilters(prev => ({ ...prev, marca: event.target.value }))}
              aria-label="Marca"
              name="marca"
              autoComplete="off"
            />
            <input type="text" placeholder="Descripción…" aria-label="Descripción de marca" autoComplete="off" />
            <button type="button" className="filter-icon" aria-label="Buscar marca">🔍</button>
          </div>
        </div>
        <div className="filter-field filter-field--wide">
          <label htmlFor="warehouse-filter-origen">Origen</label>
          <div className="filter-input-group">
            <button type="button" className="filter-pill" aria-label="Limpiar origen">×</button>
            <input
              id="warehouse-filter-origen"
              type="text"
              list="origenes"
              value={filters.origen}
              onChange={(event) => setFilters(prev => ({ ...prev, origen: event.target.value }))}
              aria-label="Origen"
              name="origen"
              autoComplete="off"
            />
            <input type="text" placeholder="Descripción…" aria-label="Descripción de origen" autoComplete="off" />
            <button type="button" className="filter-icon" aria-label="Buscar origen">🔍</button>
          </div>
        </div>
        <div className="filter-field filter-field--checkbox">
          <label>
            <input
              type="checkbox"
              checked={filters.includeTemporaryStock}
              onChange={(event) => setFilters(prev => ({ ...prev, includeTemporaryStock: event.target.checked }))}
            />
            Incluir stock de bodega temporal
          </label>
        </div>
        <div className="filter-field filter-field--checkbox">
          <label>
            <input type="checkbox" />
            Informacion adicional en excel
          </label>
        </div>
        <div className="filter-field filter-field--checkbox">
          <label>
            <input type="checkbox" />
            Incluir fecha comprometida
          </label>
        </div>
        <div className="filter-field filter-field--checkbox">
          <label>
            <input
              type="checkbox"
              checked={filters.hideNoStock}
              onChange={(event) => setFilters(prev => ({ ...prev, hideNoStock: event.target.checked }))}
            />
            Ocultar productos sin stock
          </label>
        </div>
        <div className="filter-field filter-field--checkbox">
          <label>
            <input type="checkbox" />
            Mostrar marca
          </label>
        </div>
      </div>

      <div className="warehouse-stock__actions">
        <button className="btn btn--primary" type="button" onClick={() => handleExport('xlsx')}>
          Generar informe
        </button>
        <button className="btn btn--ghost" type="button" onClick={() => handleExport('csv')}>
          Revisar stock con BI
        </button>
      </div>

      <div className="warehouse-stock__table-toolbar">
        <div className="toolbar-left">
          <span>Mostrar</span>
          <select
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
            aria-label="Cantidad de registros por página"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
          <span>registros</span>
        </div>
        <div className="toolbar-right">
          <label htmlFor="warehouse-search">Buscar</label>
          <input
            id="warehouse-search"
            type="search"
            placeholder="Buscar…"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            aria-label="Buscar en resultados"
            name="search"
            inputMode="search"
            autoComplete="off"
          />
        </div>
      </div>

      {error && (
        <div className="warehouse-stock__error" role="alert">
          {error}
        </div>
      )}

      <div className="warehouse-stock__table" role="table" aria-label="Resultados de stock" aria-live="polite">
        <div className="warehouse-stock__table-head" role="row">
          <span role="columnheader">Familia</span>
          <span role="columnheader">Subfamilia</span>
          <span role="columnheader">Producto</span>
          <span role="columnheader">Unidad</span>
          <span role="columnheader">Unidad neg.</span>
          <span role="columnheader">Bodega</span>
          <span role="columnheader">Ubicación</span>
          <span role="columnheader">N° serie</span>
          <span role="columnheader">Lote</span>
          <span role="columnheader">Fecha ven.</span>
          <span role="columnheader">Por llegar</span>
          <span role="columnheader">Reserva</span>
          <span role="columnheader">Saldo stock</span>
        </div>
        {isLoading && (
          <div className="warehouse-stock__table-row warehouse-stock__table-row--empty" role="row">
            <span role="cell">Cargando resultados…</span>
          </div>
        )}
        {!isLoading && items.length === 0 && (
          <div className="warehouse-stock__table-row warehouse-stock__table-row--empty" role="row">
            <span role="cell">{error ? 'No se pudo cargar la informacion.' : 'No hay registros para los filtros actuales.'}</span>
          </div>
        )}
        {!isLoading && items.map((item, index) => (
          <div key={`${item.producto}-${item.serie}-${index}`} className="warehouse-stock__table-row" role="row">
            <span role="cell">{item.familia || '-'}</span>
            <span role="cell">{item.subfamilia || '-'}</span>
            <span role="cell">{item.producto || '-'}</span>
            <span role="cell">{item.unidad || '-'}</span>
            <span role="cell">{item.unidadNegocio || '-'}</span>
            <span role="cell">{item.bodega || '-'}</span>
            <span role="cell">{item.ubicacion || '-'}</span>
            <span role="cell">{item.serie || '-'}</span>
            <span role="cell">{item.lote || '-'}</span>
            <span role="cell">{item.fechaVencimiento || '-'}</span>
            <span role="cell">{item.porLlegar ?? 0}</span>
            <span role="cell">{item.reserva ?? 0}</span>
            <span role="cell">{item.saldoStock ?? 0}</span>
          </div>
        ))}
        {!isLoading && items.length > 0 && (
          <div className="warehouse-stock__table-row warehouse-stock__table-row--total" role="row">
            <span role="cell">Total</span>
            <span role="cell"></span>
            <span role="cell"></span>
            <span role="cell"></span>
            <span role="cell"></span>
            <span role="cell"></span>
            <span role="cell"></span>
            <span role="cell"></span>
            <span role="cell"></span>
            <span role="cell"></span>
            <span role="cell">{summaryTotals.porLlegar}</span>
            <span role="cell">{summaryTotals.reserva}</span>
            <span role="cell">{summaryTotals.saldoStock}</span>
          </div>
        )}
      </div>

      {!error && (
        <div className="warehouse-stock__pagination">
          <span>
            Mostrando {total === 0 ? 0 : (page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} de {total} registros
          </span>
          <div className="pagination-actions">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page <= 1}
            >
              Anterior
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setPage(prev => prev + 1)}
              disabled={page * pageSize >= total}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      <datalist id="unidades-negocio">
        {unidadesNegocio.map((unidad) => (
          <option key={unidad} value={unidad} />
        ))}
      </datalist>
      <datalist id="marcas">
        {marcas.map((marca) => (
          <option key={marca} value={marca} />
        ))}
      </datalist>
      <datalist id="origenes">
        {origenes.map((origen) => (
          <option key={origen} value={origen} />
        ))}
      </datalist>
    </div>
  );
}
