import SelectInput from '../ui/SelectInput';
import { ProductCategory } from '../../features/catalog/types';

type ProductFiltersProps = {
  categories: ProductCategory[];
  selectedCategory: string;
  searchTerm: string;
  minPrice: string;
  maxPrice: string;
  onCategoryChange: (categoryId: string) => void;
  onSearchChange: (value: string) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
};

function ProductFilters({
  categories,
  selectedCategory,
  searchTerm,
  minPrice,
  maxPrice,
  onCategoryChange,
  onSearchChange,
  onMinPriceChange,
  onMaxPriceChange
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
        placeholder="Todas las categorías…"
        name="category"
      />
      <div className="form-control">
        <label htmlFor="search-term">Buscar</label>
        <input
          id="search-term"
          type="search"
          value={searchTerm}
          placeholder="Buscar por nombre o marca…"
          onChange={(e) => onSearchChange(e.target.value)}
          name="searchTerm"
          inputMode="search"
          autoComplete="off"
        />
      </div>
      <div className="form-control">
        <label htmlFor="min-price">Precio mínimo</label>
        <input
          id="min-price"
          type="number"
          min="0"
          step="1"
          value={minPrice}
          placeholder="0"
          onChange={(e) => onMinPriceChange(e.target.value)}
          name="minPrice"
          inputMode="numeric"
        />
      </div>
      <div className="form-control">
        <label htmlFor="max-price">Precio máximo</label>
        <input
          id="max-price"
          type="number"
          min="0"
          step="1"
          value={maxPrice}
          placeholder="Sin tope"
          onChange={(e) => onMaxPriceChange(e.target.value)}
          name="maxPrice"
          inputMode="numeric"
        />
      </div>
    </div>
  );
}

export default ProductFilters;
