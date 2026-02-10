import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { RichFooter } from './RichFooter';

const BASE_TITLE = 'SP Dental | Soluciones odontológicas';
const BASE_DESCRIPTION =
  'Insumos, equipamiento y tecnología dental con soporte técnico, capacitación y acompañamiento clínico.';

const getMetaForPath = (pathname: string) => {
  if (pathname.startsWith('/productos/')) {
    return {
      title: 'SP Dental | Detalle de producto',
      description: 'Especificaciones, disponibilidad y asesoría para equipamiento e insumos odontológicos.'
    };
  }
  if (pathname.startsWith('/productos')) {
    return {
      title: 'SP Dental | Catálogo de productos',
      description: 'Explora insumos, equipamiento y tecnología dental con soporte especializado.'
    };
  }
  if (pathname.startsWith('/blog')) {
    return {
      title: 'SP Dental | Blog',
      description: 'Noticias, guías y buenas prácticas para clínicas dentales.'
    };
  }
  switch (pathname) {
    case '/':
      return {
        title: 'SP Dental | Soluciones para clínicas dentales',
        description: BASE_DESCRIPTION
      };
    case '/nosotros':
      return {
        title: 'SP Dental | Nosotros',
        description: 'Conoce nuestra trayectoria, equipo clínico y representaciones internacionales.'
      };
    case '/soporte':
      return {
        title: 'SP Dental | Soporte técnico',
        description: 'Acompañamiento preventivo y correctivo con especialistas locales y stock de repuestos.'
      };
    case '/contacto':
      return {
        title: 'SP Dental | Contacto',
        description: 'Escríbenos para cotizaciones, soporte y coordinación de servicio técnico.'
      };
    case '/privacidad':
      return {
        title: 'SP Dental | Política de Privacidad',
        description: 'Conoce cómo protegemos y tratamos tu información personal.'
      };
    case '/terminos':
      return {
        title: 'SP Dental | Términos y condiciones',
        description: 'Condiciones de uso, garantías y responsabilidades de la plataforma SP Dental.'
      };
    case '/cookies':
      return {
        title: 'SP Dental | Política de cookies',
        description: 'Detalles sobre el uso de cookies y cómo administrarlas.'
      };
    default:
      return {
        title: BASE_TITLE,
        description: BASE_DESCRIPTION
      };
  }
};

function MainLayout() {
  const location = useLocation();

  useEffect(() => {
    const { title, description } = getMetaForPath(location.pathname);
    document.title = title;

    const descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) {
      descriptionTag.setAttribute('content', description);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description);
    }
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', `${window.location.origin}${location.pathname}`);
    }

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', title);
    }
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', description);
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', `${window.location.origin}${location.pathname}`);
    }
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Saltar al contenido principal
      </a>
      <Navbar />
      <main id="main-content" className="app-content" tabIndex={-1}>
        <Outlet />
      </main>
      <RichFooter />
    </div>
  );
}

export default MainLayout;
