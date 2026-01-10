import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import ProductCategoryGrid from '../../components/products/ProductCategoryGrid';
import Carousel from '../../components/ui/Carousel';
import { FadeIn } from '../../components/ui/FadeIn';
import { productCategories } from '../../features/catalog/mockData';
import { ROUTES } from '../../config/routes';

// Página de inicio con navegación rápida a catálogo y soporte.
function HomePage() {
  const navigate = useNavigate();

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
            <Button onClick={() => navigate(ROUTES.products)}>Ver catálogo</Button>
            <Button variant="secondary" onClick={() => navigate(ROUTES.support)}>
              Contactar soporte
            </Button>
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
            Acompañamos en la evaluación previa, en la implementación y en la operación diaria con
            especialistas de producto y servicio técnico local.
          </p>
        <div className="grid two">
          <div className="card">
            <h3>Pre venta</h3>
            <p>Demostraciones, presentaciones y acompañamiento de especialistas.</p>
          </div>
          <div className="card">
            <h3>Post venta</h3>
            <p>Servicio técnico propio, mantenimiento programado y contratos de continuidad.</p>
          </div>
        </div>
        <Button variant="secondary" onClick={() => navigate(ROUTES.support)}>
          Ver soporte
        </Button>
        </section>
      </FadeIn>

      <FadeIn direction="up" delay={0.4}>
        <section>
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
