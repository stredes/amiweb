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
            <p className="badge">Soluciones integrales para clínicas dentales</p>
          <h1>Insumos, equipamiento y tecnología odontológica con soporte especializado.</h1>
          <p>
            En SP Dental conectamos a clínicas, especialistas y universidades con las mejores marcas
            del mercado dental. Trabajamos con un enfoque consultivo, soporte técnico certificado y
            formación continua para que tu práctica evolucione con confianza.
          </p>
          <div className="actions">
            <Link to={ROUTES.products} className="btn btn-primary">Ver catálogo</Link>
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
          <p>
            Acompañamos en la evaluación previa, implementación y operación diaria con especialistas
            clínicos y servicio técnico local.
          </p>
        <div className="grid two">
          <div className="card">
            <h3>Pre venta</h3>
            <p>Demostraciones, presentaciones clínicas y acompañamiento de especialistas.</p>
          </div>
          <div className="card">
            <h3>Post venta</h3>
            <p>Servicio técnico propio, mantenimiento programado y contratos de continuidad.</p>
          </div>
        </div>
        <Link to={ROUTES.support} className="btn btn-secondary">Ver soporte</Link>
        </section>
      </FadeIn>

      <FadeIn direction="up" delay={0.4}>
        <section>
        <h2>Confianza y experiencia</h2>
        <div className="grid three">
          <div className="card">
            <h3>Años de experiencia</h3>
            <p>Equipo con trayectoria atendiendo clínicas y especialistas en todo Chile.</p>
          </div>
          <div className="card">
            <h3>Representaciones</h3>
            <p>Marcas líderes como FGM Dental Group, Wisedent, Dimed, SMI y Acteon.</p>
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
