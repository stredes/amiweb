import { Link } from 'react-router-dom';
import { ProductCategory } from '../../features/catalog/types';
import { ROUTES } from '../../config/routes';

type ProductCategoryGridProps = {
  categories: ProductCategory[];
};

function ProductCategoryGrid({ categories }: ProductCategoryGridProps) {
  return (
    <section className="category-grid">
      <h2>Categorías principales</h2>
      <div className="grid">
        {categories.map((category) => (
          <div key={category.id} className="category-card">
            <h3>{category.name}</h3>
            <p>{category.description}</p>
            <Link
              className="btn btn-secondary"
              to={`${ROUTES.products}?categoryId=${category.id}`}
            >
              Ver productos
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProductCategoryGrid;
