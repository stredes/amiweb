import { useState, useEffect } from 'react';
import { StockItem, InventoryStats } from '../../features/inventory/types';

interface InventoryManagementProps {
  items: StockItem[];
}

export function InventoryManagement({ items }: InventoryManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFamily, setFilterFamily] = useState('');
  const [sortBy, setSortBy] = useState<'codigo' | 'producto' | 'stock'>('producto');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;

  // Obtener familias únicas
  const families = ['all', ...new Set(items.map(item => item.familia).filter(Boolean))];

  // Establecer familia random al cargar
  useEffect(() => {
    if (items.length > 0 && !filterFamily) {
      const familiesWithoutAll = families.filter(f => f !== 'all');
      if (familiesWithoutAll.length > 0) {
        const randomFamily = familiesWithoutAll[Math.floor(Math.random() * familiesWithoutAll.length)];
        setFilterFamily(randomFamily);
      }
    }
  }, [items.length]);

  // Calcular estadísticas solo de items filtrados para mejor rendimiento
  const getFilteredItems = () => {
    return items.filter(item => {
      const matchesSearch = 
        item.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.familia.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFamily = filterFamily === 'all' || filterFamily === '' || item.familia === filterFamily;
      
      return matchesSearch && matchesFamily;
    });
  };

  const filteredItems = getFilteredItems();

  // Calcular estadísticas
  const stats: InventoryStats = {
    totalItems: filteredItems.length,
    totalStock: filteredItems.reduce((sum, item) => sum + item.saldoStock, 0),
    totalReservas: filteredItems.reduce((sum, item) => sum + item.reserva, 0),
    itemsBajoStock: filteredItems.filter(item => item.saldoStock < 10).length,
    itemsProximosVencer: filteredItems.filter(item => {
      if (!item.fechaVencimiento) return false;
      const vencimiento = new Date(item.fechaVencimiento);
      const hoy = new Date();
      const tresMeses = new Date();
      tresMeses.setMonth(tresMeses.getMonth() + 3);
      return vencimiento > hoy && vencimiento < tresMeses;
    }).length
  };

  // Ordenar filteredItems
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'codigo':
        return a.codigo.localeCompare(b.codigo);
      case 'stock':
        return b.saldoStock - a.saldoStock;
      case 'producto':
      default:
        return a.producto.localeCompare(b.producto);
    }
  });

  // Paginación
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = sortedItems.slice(startIndex, endIndex);

  // Reset a página 1 cuando cambian los filtros
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFamilyChange = (value: string) => {
    setFilterFamily(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value as any);
    setCurrentPage(1);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleDateString('es-CL');
    } catch {
      return dateStr;
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Sin Stock', color: '#F44336' };
    if (stock < 10) return { label: 'Bajo', color: '#FF9800' };
    if (stock < 50) return { label: 'Medio', color: '#2196F3' };
    return { label: 'Alto', color: '#4CAF50' };
  };

  return (
    <div className="inventory-management">
      <div className="inventory-header-info">
        <h2>📦 Gestión de Inventario</h2>
        {filterFamily && filterFamily !== 'all' && (
          <p className="muted">
            📂 Mostrando familia: <strong>{filterFamily}</strong>
            {' '}({filteredItems.length} productos)
            <button 
              onClick={() => setFilterFamily('all')}
              className="btn-link"
              style={{ marginLeft: '10px' }}
            >
              Ver todas las familias
            </button>
          </p>
        )}
      </div>

      <div className="inventory-stats-grid">
        <div className="stat-card">
          <div className="stat-card__icon">📦</div>
          <div className="stat-card__content">
            <div className="stat-card__value">{stats.totalItems}</div>
            <div className="stat-card__label">Productos</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon">📊</div>
          <div className="stat-card__content">
            <div className="stat-card__value">{stats.totalStock.toLocaleString()}</div>
            <div className="stat-card__label">Stock Total</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon">🔒</div>
          <div className="stat-card__content">
            <div className="stat-card__value">{stats.totalReservas}</div>
            <div className="stat-card__label">Reservado</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon">⚠️</div>
          <div className="stat-card__content">
            <div className="stat-card__value">{stats.itemsBajoStock}</div>
            <div className="stat-card__label">Bajo Stock</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon">⏰</div>
          <div className="stat-card__content">
            <div className="stat-card__value">{stats.itemsProximosVencer}</div>
            <div className="stat-card__label">Próximos a Vencer</div>
          </div>
        </div>
      </div>

      <div className="inventory-filters">
        <input
          type="text"
          placeholder="🔍 Buscar por producto, código o familia..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="inventory-search"
        />
        
        <select 
          value={filterFamily} 
          onChange={(e) => handleFamilyChange(e.target.value)}
          className="inventory-filter"
        >
          <option value="all">📂 Todas las familias ({items.length})</option>
          {families.filter(f => f !== 'all').map(family => {
            const count = items.filter(i => i.familia === family).length;
            return (
              <option key={family} value={family}>
                📁 {family} ({count})
              </option>
            );
          })}
        </select>

        <select 
          value={sortBy} 
          onChange={(e) => handleSortChange(e.target.value)}
          className="inventory-filter"
        >
          <option value="producto">Ordenar por Producto</option>
          <option value="codigo">Ordenar por Código</option>
          <option value="stock">Ordenar por Stock</option>
        </select>
      </div>

      {filteredItems.length === 0 ? (
        <div className="empty-state">
          <p>No se encontraron productos</p>
        </div>
      ) : (
        <div className="inventory-table-wrapper">
          <table className="inventory-table">
            <thead>
              <tr>
                <th style={{ minWidth: '100px' }}>Código</th>
                <th style={{ minWidth: '200px' }}>Producto</th>
                <th style={{ minWidth: '120px' }}>Familia</th>
                <th style={{ minWidth: '100px' }}>Bodega</th>
                <th style={{ minWidth: '100px' }}>Ubicación</th>
                <th style={{ minWidth: '80px' }}>Lote</th>
                <th style={{ minWidth: '100px' }}>Vencimiento</th>
                <th style={{ minWidth: '60px' }}>Stock</th>
                <th style={{ minWidth: '60px' }}>Reserva</th>
                <th style={{ minWidth: '80px' }}>Por Llegar</th>
                <th style={{ minWidth: '80px' }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((item) => {
                const stockStatus = getStockStatus(item.saldoStock);
                return (
                  <tr key={item.id}>
                    <td><strong>{item.codigo}</strong></td>
                    <td title={item.producto}>{item.producto}</td>
                    <td>{item.familia}</td>
                    <td>{item.bodega}</td>
                    <td>{item.ubicacion}</td>
                    <td>{item.lote}</td>
                    <td>{formatDate(item.fechaVencimiento)}</td>
                    <td className="text-center"><strong>{item.saldoStock}</strong></td>
                    <td className="text-center">{item.reserva}</td>
                    <td className="text-center">{item.porLlegar}</td>
                    <td>
                      <span 
                        className="stock-badge"
                        style={{ backgroundColor: stockStatus.color }}
                      >
                        {stockStatus.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="inventory-footer">
        <div className="inventory-pagination">
          <p className="muted">
            Mostrando {startIndex + 1} - {Math.min(endIndex, filteredItems.length)} de {filteredItems.length} productos
            {filteredItems.length !== items.length && ` (${items.length} total)`}
          </p>
          
          {totalPages > 1 && (
            <div className="pagination-controls">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="btn btn-sm"
              >
                ⏮️ Primera
              </button>
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="btn btn-sm"
              >
                ◀️ Anterior
              </button>
              
              <span className="pagination-info">
                Página {currentPage} de {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="btn btn-sm"
              >
                Siguiente ▶️
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="btn btn-sm"
              >
                Última ⏭️
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
