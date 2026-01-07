import { FormEvent } from 'react';
import { useSearchStore } from '../../features/search/searchStore';

type ProductSearchBarProps = {
  onSearch?: () => void;
};

function ProductSearchBar({ onSearch }: ProductSearchBarProps) {
  const { term, setTerm } = useSearchStore();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: conectar búsqueda con backend.
    console.info('Buscar productos con término:', term);
    onSearch?.();
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="product-search">
        Buscar productos
      </label>
      <input
        id="product-search"
        type="search"
        value={term}
        placeholder="Buscar por nombre, código o marca"
        onChange={(e) => setTerm(e.target.value)}
      />
      <button type="submit">Buscar</button>
    </form>
  );
}

export default ProductSearchBar;
