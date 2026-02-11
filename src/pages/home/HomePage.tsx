import { Link } from 'react-router-dom';
import ProductCategoryGrid from '../../components/products/ProductCategoryGrid';
import Carousel from '../../components/ui/Carousel';
import { FadeIn } from '../../components/ui/FadeIn';
import { productCategories } from '../../features/catalog/mockData';
import { ROUTES } from '../../config/routes';

// Página de inicio con navegación rápida a catálogo y soporte.
function HomePage() {
  return (
    <div className="page">
      <FadeIn direction="up">
        <section className="hero">
          <div>
            <p className="badge">Soluciones integrales para laboratorios clínicos</p>
          <h1>Equipos, reactivos e insumos con soporte técnico especializado.</h1>
          <p>
            Nuestra empresa está orientada a satisfacer las necesidades del laboratorio, y en especial 
            las de los Laboratorios Clínicos, en cuanto a Equipos, Reactivos, insumos y Servicio Técnico 
            se refiere. Contamos con importantes representaciones al alcance de cualquier laboratorio, 
            con productos de muy buena calidad.
          </p>
          <div className="actions">
            <Link to={ROUTES.products} className="btn btn-primary home-cta-catalog">Ver catálogo</Link>
            <Link to={ROUTES.support} className="btn btn-secondary">Contactar soporte</Link>
          </div>
        </div>
        <div className="hero__visual">
          <div className="hero-carousel">
            <Carousel
              baseWidth={600}
              autoplay={true}
              autoplayDelay={5000}
              pauseOnHover={true}
              loop={true}
              round={false}
            />
          </div>
        </div>
        </section>
      </FadeIn>

      <FadeIn direction="up" delay={0.2}>
        <ProductCategoryGrid categories={productCategories} />
      </FadeIn>

      <FadeIn direction="up" delay={0.3}>
        <section className="support-block">
          <h2>Soporte integral</h2>
          <p className="support-block__description">
            Acompañamos en la evaluación previa, implementación y operación diaria con especialistas
            clínicos y servicio técnico local.
          </p>
        <div className="grid two support-block__options">
          <div className="card support-option-card" role="button" tabIndex={0} aria-label="Soporte de pre venta">
            <h3><span aria-hidden="true">✓</span> Pre venta</h3>
            <p>Demostraciones, presentaciones clínicas y acompañamiento de especialistas.</p>
          </div>
          <div className="card support-option-card" role="button" tabIndex={0} aria-label="Soporte de post venta">
            <h3><span aria-hidden="true">✓</span> Post venta</h3>
            <p>Servicio técnico propio, mantenimiento programado y contratos de continuidad.</p>
          </div>
        </div>
        <Link to={ROUTES.support} className="btn btn-secondary support-block__cta">Ver soporte</Link>
        </section>
      </FadeIn>

      <FadeIn direction="up" delay={0.4}>
        <section className="home-trust-section">
        <h2>Confianza y experiencia</h2>
        <div className="grid three">
          <div className="card">
            <h3>Años de experiencia</h3>
            <p>Equipo con trayectoria atendiendo laboratorios clínicos y centros de diagnóstico.</p>
          </div>
          <div className="card">
            <h3>Representaciones</h3>
            <p>Marcas de referencia como Becton Dickinson, Olympus, Mindray, entre otras.</p>
          </div>
          <div className="card">
            <h3>Alcance</h3>
            <p>Cobertura nacional con soporte técnico y representantes locales.</p>
          </div>
        </div>
        </section>
      </FadeIn>
    </div>
  );
}

export default HomePage;
