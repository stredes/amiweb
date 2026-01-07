import { Link } from 'react-router-dom';
import { Product } from '../../features/catalog/types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { ROUTES } from '../../config/routes';

type ProductCardProps = {
  product: Product;
  categoryName?: string;
  onQuote: (product: Product) => void;
};

function ProductCard({ product, categoryName, onQuote }: ProductCardProps) {
  const detailPath = ROUTES.productDetail.replace(':productId', product.id);

  return (
    <Card
      title={product.name}
      actions={
        <>
          <Link to={detailPath}>
            <Button variant="secondary">Ver detalle</Button>
          </Link>
          <Button type="button" onClick={() => onQuote(product)}>
            Solicitar cotización
          </Button>
        </>
      }
    >
      <p className="muted">{product.brand}</p>
      <p>Categoría: {categoryName}</p>
      <p className="muted">{product.shortDescription}</p>
    </Card>
  );
}

export default ProductCard;
