import { useNavigate } from 'react-router-dom';
import { ProductCategory } from '../../features/catalog/types';
import { ROUTES } from '../../config/routes';
import Button from '../ui/Button';

type ProductCategoryGridProps = {
  categories: ProductCategory[];
};

function ProductCategoryGrid({ categories }: ProductCategoryGridProps) {
  const navigate = useNavigate();

  return (
    <section className="category-grid">
      <h2>Categorías principales</h2>
      <div className="grid">
        {categories.map((category) => (
          <div key={category.id} className="category-card">
            <h3>{category.name}</h3>
            <p>{category.description}</p>
            <Button
              variant="secondary"
              onClick={() => navigate(`${ROUTES.products}?categoryId=${category.id}`)}
            >
              Ver productos
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProductCategoryGrid;
