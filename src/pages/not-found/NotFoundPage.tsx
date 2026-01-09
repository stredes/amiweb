import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiSearch, FiPackage } from 'react-icons/fi';
import { RippleButton } from '../../components/ui/RippleButton';
import { FadeIn } from '../../components/ui/FadeIn';
import { ROUTES } from '../../config/routes';
import './NotFoundPage.css';

function NotFoundPage() {
  const navigate = useNavigate();

  const suggestedLinks = [
    { to: ROUTES.home, label: 'Inicio', icon: <FiHome /> },
    { to: '/productos', label: 'Productos', icon: <FiPackage /> },
    { to: ROUTES.contact, label: 'Contacto', icon: <FiSearch /> },
  ];

  return (
    <div className="not-found-page">
      <div className="not-found-page__content">
        <FadeIn direction="up">
          <div className="not-found-page__illustration">
          <div className="not-found-page__code">404</div>
          <div className="not-found-page__emoji">🔍</div>
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={0.1}>
          <h1 className="not-found-page__title">Página no encontrada</h1>
        <p className="not-found-page__description">
          Lo sentimos, la página que buscas no existe o ha sido movida.
          <br />
          Puede que hayas escrito mal la dirección o que la página ya no esté disponible.
        </p>
        </FadeIn>

        <FadeIn direction="up" delay={0.2}>
          <div className="not-found-page__actions">
          <RippleButton variant="primary" size="lg" onClick={() => navigate(-1)}>
            Volver atrás
          </RippleButton>
          <RippleButton variant="outline" size="lg" onClick={() => navigate(ROUTES.home)}>
            <FiHome />
            Ir al inicio
          </RippleButton>
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={0.3}>
          <div className="not-found-page__suggestions">
          <h3 className="not-found-page__suggestions-title">¿Qué estabas buscando?</h3>
          <div className="not-found-page__links">
            {suggestedLinks.map((link, index) => (
              <Link key={index} to={link.to} className="not-found-page__link">
                <span className="not-found-page__link-icon">{link.icon}</span>
                <span className="not-found-page__link-label">{link.label}</span>
              </Link>
            ))}
          </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

export default NotFoundPage;
