import { useState } from 'react';
import { FiX, FiMinimize2, FiMaximize2 } from 'react-icons/fi';
import { useCompare } from '../../contexts/CompareContext';
import './CompareTable.css';

export function CompareTable() {
  const { products, removeProduct, clearCompare } = useCompare();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  if (products.length === 0) return null;

  const specs = [
    { key: 'name', label: 'Nombre' },
    { key: 'brand', label: 'Marca' },
    { key: 'familia', label: 'Familia' },
    { key: 'subfamilia', label: 'Subfamilia' },
    { key: 'code', label: 'Código' },
    { key: 'precio', label: 'Precio' },
    { key: 'stock', label: 'Stock' },
    { key: 'shortDescription', label: 'Descripción' },
  ];

  return (
    <>
      {/* Botón flotante */}
      {!isOpen && (
        <button 
          className="compare-float-button" 
          data-tour="compare-button"
          onClick={() => setIsOpen(true)} 
          title="Ver comparación"
        >
          <span className="compare-float-button__icon">⚖️</span>
          <span className="compare-float-button__badge">{products.length}</span>
          <span className="compare-float-button__text">Comparar</span>
        </button>
      )}

      {/* Modal de comparación */}
      {isOpen && (
        <div className="compare-modal-overlay" onClick={() => setIsOpen(false)}>
          <div
            className={`compare-modal ${isMinimized ? 'minimized' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="compare-modal__header">
              <h3>Comparar Productos ({products.length})</h3>
              <div className="compare-modal__actions">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  title={isMinimized ? 'Expandir' : 'Minimizar'}
                  className="action-btn"
                >
                  {isMinimized ? <FiMaximize2 size={18} /> : <FiMinimize2 size={18} />}
                </button>
                <button onClick={clearCompare} title="Limpiar comparación" className="action-btn">
                  <FiX size={18} /> Limpiar
                </button>
                <button onClick={() => setIsOpen(false)} title="Cerrar" className="action-btn">
                  <FiX size={20} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <div className="compare-modal__body">
                <div className="compare-table-container">
                  <table className="compare-table">
                    <thead>
                      <tr>
                        <th className="compare-table__spec-header">Especificación</th>
                        {products.map((product: any) => (
                          <th key={product.id} className="compare-table__product-header">
                            <div className="product-header-content">
                              <img
                                src={
                                  product.imageUrl ||
                                  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" fill="%23f8f9fa"/><text x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="12" fill="%238b1538">No image</text></svg>'
                                }
                                alt={product.name}
                                className="product-header-image"
                              />
                              <button
                                onClick={() => removeProduct(product.id)}
                                className="product-header-remove"
                                title="Eliminar de comparación"
                              >
                                <FiX size={16} />
                              </button>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {specs.map((spec) => (
                        <tr key={spec.key}>
                          <td className="compare-table__spec-cell">
                            <strong>{spec.label}</strong>
                          </td>
                          {products.map((product: any) => (
                            <td key={product.id} className="compare-table__value-cell">
                              {spec.key === 'precio' && product[spec.key]
                                ? `$${Number(product[spec.key]).toLocaleString('es-CL')}`
                                : spec.key === 'stock' && product[spec.key]
                                ? product[spec.key] > 0
                                  ? `✓ ${product[spec.key]} unidades`
                                  : '✗ Sin stock'
                                : product[spec.key as keyof typeof product] || '-'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {products.length < 4 && (
                  <div className="compare-hint">
                    💡 Puedes comparar hasta 4 productos a la vez. Agrega más desde las páginas de productos.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
