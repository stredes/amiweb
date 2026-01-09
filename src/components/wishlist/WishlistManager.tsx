import { useState } from 'react';
import { FiHeart, FiPlus, FiEdit2, FiTrash2, FiShare2, FiDownload, FiX, FiMove } from 'react-icons/fi';
import { useWishlist } from '../../contexts/WishlistContext';
import './WishlistManager.css';

export function WishlistManager() {
  const {
    lists,
    currentListId,
    currentList,
    createList,
    deleteList,
    renameList,
    setCurrentList,
    removeItem,
    moveItem,
    clearList,
    exportList,
    getShareableLink,
    getTotalItems,
  } = useWishlist();

  const [isOpen, setIsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [renameListId, setRenameListId] = useState('');

  const handleCreateList = () => {
    if (!newListName.trim()) return;
    createList(newListName, newListDescription);
    setNewListName('');
    setNewListDescription('');
    setShowCreateModal(false);
  };

  const handleRenameList = () => {
    if (!newListName.trim() || !renameListId) return;
    renameList(renameListId, newListName);
    setNewListName('');
    setRenameListId('');
    setShowRenameModal(false);
  };

  const handleShare = () => {
    const link = getShareableLink();
    navigator.clipboard.writeText(link);
    alert('¡Link copiado al portapapeles!');
  };

  const handleMoveItem = (toListId: string) => {
    if (selectedItemId) {
      moveItem(selectedItemId, currentListId, toListId);
      setShowMoveModal(false);
      setSelectedItemId('');
    }
  };

  const totalItems = getTotalItems();

  return (
    <>
      {/* Botón flotante */}
      <button
        className="wishlist-float-button"
        data-tour="wishlist-button"
        onClick={() => setIsOpen(!isOpen)}
        title="Mis listas de deseos"
      >
        <FiHeart size={24} />
        {totalItems > 0 && <span className="wishlist-float-button__badge">{totalItems}</span>}
      </button>

      {/* Panel principal */}
      {isOpen && (
        <>
          <div className="wishlist-overlay" onClick={() => setIsOpen(false)} />
          <div className="wishlist-panel">
            <div className="wishlist-panel__header">
              <h3>
                <FiHeart size={20} /> Mis Listas de Deseos
              </h3>
              <button onClick={() => setIsOpen(false)} className="close-btn">
                <FiX size={24} />
              </button>
            </div>

            {/* Selector de listas */}
            <div className="wishlist-panel__lists">
              <div className="list-selector">
                {lists.map((list) => (
                  <button
                    key={list.id}
                    className={`list-tab ${list.id === currentListId ? 'active' : ''}`}
                    onClick={() => setCurrentList(list.id)}
                  >
                    {list.name}
                    <span className="list-tab__count">{list.items.length}</span>
                  </button>
                ))}
                <button className="list-tab list-tab--add" onClick={() => setShowCreateModal(true)}>
                  <FiPlus size={16} /> Nueva lista
                </button>
              </div>

              {/* Acciones de lista */}
              {currentList && (
                <div className="list-actions">
                  <button
                    onClick={() => {
                      setRenameListId(currentListId);
                      setNewListName(currentList.name);
                      setShowRenameModal(true);
                    }}
                    className="action-btn"
                    title="Renombrar lista"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button onClick={handleShare} className="action-btn" title="Compartir lista">
                    <FiShare2 size={16} />
                  </button>
                  <button onClick={() => exportList()} className="action-btn" title="Exportar CSV">
                    <FiDownload size={16} />
                  </button>
                  {!currentList.isDefault && (
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar lista "${currentList.name}"?`)) {
                          deleteList(currentListId);
                        }
                      }}
                      className="action-btn action-btn--danger"
                      title="Eliminar lista"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Items de la lista */}
            <div className="wishlist-panel__items">
              {currentList && currentList.items.length === 0 ? (
                <div className="wishlist-empty">
                  <FiHeart size={48} />
                  <p>No hay productos en esta lista</p>
                  <span>Explora nuestro catálogo y agrega tus favoritos</span>
                </div>
              ) : (
                currentList?.items.map((item) => (
                  <div key={item.id} className="wishlist-item">
                    <img
                      src={item.image || 'https://via.placeholder.com/80'}
                      alt={item.name}
                      className="wishlist-item__image"
                    />
                    <div className="wishlist-item__info">
                      <h4>{item.name}</h4>
                      {item.brand && <span className="wishlist-item__brand">{item.brand}</span>}
                      {item.price && (
                        <span className="wishlist-item__price">${item.price.toLocaleString('es-CL')}</span>
                      )}
                    </div>
                    <div className="wishlist-item__actions">
                      {lists.length > 1 && (
                        <button
                          onClick={() => {
                            setSelectedItemId(item.id);
                            setShowMoveModal(true);
                          }}
                          className="wishlist-item-btn"
                          title="Mover a otra lista"
                        >
                          <FiMove size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="wishlist-item-btn wishlist-item-btn--danger"
                        title="Eliminar"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {currentList && currentList.items.length > 0 && (
              <div className="wishlist-panel__footer">
                <button
                  onClick={() => {
                    if (confirm('¿Vaciar toda la lista?')) {
                      clearList();
                    }
                  }}
                  className="wishlist-clear-btn"
                >
                  <FiTrash2 size={16} /> Vaciar lista
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal: Crear lista */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Nueva Lista de Deseos</h3>
            <input
              type="text"
              placeholder="Nombre de la lista"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              className="modal-input"
              autoFocus
            />
            <textarea
              placeholder="Descripción (opcional)"
              value={newListDescription}
              onChange={(e) => setNewListDescription(e.target.value)}
              className="modal-textarea"
              rows={3}
            />
            <div className="modal-actions">
              <button onClick={() => setShowCreateModal(false)} className="modal-btn modal-btn--secondary">
                Cancelar
              </button>
              <button onClick={handleCreateList} className="modal-btn modal-btn--primary">
                Crear Lista
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Renombrar lista */}
      {showRenameModal && (
        <div className="modal-overlay" onClick={() => setShowRenameModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Renombrar Lista</h3>
            <input
              type="text"
              placeholder="Nuevo nombre"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              className="modal-input"
              autoFocus
            />
            <div className="modal-actions">
              <button onClick={() => setShowRenameModal(false)} className="modal-btn modal-btn--secondary">
                Cancelar
              </button>
              <button onClick={handleRenameList} className="modal-btn modal-btn--primary">
                Renombrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Mover item */}
      {showMoveModal && (
        <div className="modal-overlay" onClick={() => setShowMoveModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Mover a otra lista</h3>
            <div className="modal-list">
              {lists
                .filter((list) => list.id !== currentListId)
                .map((list) => (
                  <button
                    key={list.id}
                    onClick={() => handleMoveItem(list.id)}
                    className="modal-list-item"
                  >
                    {list.name}
                    <span className="modal-list-item__count">{list.items.length} items</span>
                  </button>
                ))}
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowMoveModal(false)} className="modal-btn modal-btn--secondary">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
