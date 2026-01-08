import { Link } from 'react-router-dom';
import { Product } from '../../features/catalog/types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import GlareHover from '../ui/GlareHover';
import TiltedCard from '../ui/TiltedCard';
import { ROUTES } from '../../config/routes';

type ProductCardProps = {
  product: Product;
  categoryName?: string;
  onQuote: (product: Product) => void;
};

function ProductCard({ product, categoryName, onQuote }: ProductCardProps) {
  const detailPath = ROUTES.productDetail.replace(':productId', product.id);
  const imageSrc =
    product.imageUrl ||
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420"><rect width="640" height="420" fill="%23f3f4f6"/><rect x="40" y="40" width="560" height="340" rx="24" fill="%23ffffff" stroke="%23d1d5db" stroke-width="2"/><text x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="28" fill="%238b1538">AMILAB</text></svg>';

  return (
    <GlareHover
      className="product-card-glare"
      width="100%"
      height="auto"
      background="transparent"
      borderRadius="var(--radius-lg)"
      borderColor="transparent"
      glareColor="#ffffff"
      glareOpacity={0.2}
      glareAngle={-30}
      glareSize={220}
      transitionDuration={700}
    >
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
        <div className="product-card-media">
          <TiltedCard
            imageSrc={imageSrc}
            altText={product.name}
            captionText={product.name}
            containerHeight="200px"
            containerWidth="100%"
            imageHeight="200px"
            imageWidth="100%"
            rotateAmplitude={10}
            scaleOnHover={1.05}
            showMobileWarning={false}
            showTooltip={false}
            displayOverlayContent={true}
            overlayContent={<span className="product-card-overlay-title">{product.name}</span>}
          />
        </div>
        <p className="muted">{product.brand}</p>
        <p>Categoría: {categoryName}</p>
        <p className="muted">{product.shortDescription}</p>
      </Card>
    </GlareHover>
  );
}

export default ProductCard;
