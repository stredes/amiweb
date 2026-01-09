import SelectInput from '../ui/SelectInput';
import { ProductCategory } from '../../features/catalog/types';

type ProductFiltersProps = {
  categories: ProductCategory[];
  selectedCategory: string;
  searchTerm: string;
  onCategoryChange: (categoryId: string) => void;
  onSearchChange: (value: string) => void;
};

function ProductFilters({
  categories,
  selectedCategory,
  searchTerm,
  onCategoryChange,
  onSearchChange
}: ProductFiltersProps) {
  return (
    <div className="filters" data-tour="filters-button">
      <SelectInput
        id="category-filter"
        label="Categoría"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        options={categories.map((category) => ({
          value: category.id,
          label: category.name
        }))}
        placeholder="Todas las categorías"
      />
      <div className="form-control">
        <label htmlFor="search-term">Buscar</label>
        <input
          id="search-term"
          type="search"
          value={searchTerm}
          placeholder="Buscar por nombre o marca"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <p className="muted">
        {/* TODO: agregar filtros avanzados (marca, stock, etc.) y conectarlos a backend */}
        Filtros básicos de catálogo aplicados en el frontend (mock).
      </p>
    </div>
  );
}

export default ProductFilters;
