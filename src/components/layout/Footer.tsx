import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes';

function Footer() {
  return (
    <footer className="footer">
      <div>
        <h4>SP Dental</h4>
        <p>Santiago, Chile</p>
        <p>Teléfono: +56 2 2345 6789</p>
        <p>
          Correo: <a href="mailto:contacto@spdental.cl">contacto@spdental.cl</a>
        </p>
      </div>
      <div className="footer__links">
        <Link to={ROUTES.home}>Inicio</Link>
        <Link to={ROUTES.products}>Productos</Link>
        <Link to={ROUTES.support}>Soporte</Link>
        <Link to={ROUTES.contact}>Contacto</Link>
        <Link to={ROUTES.crimePrevention}>Modelo de Prevención de Delitos</Link>
      </div>
      <div className="footer__meta">
        <p>© {new Date().getFullYear()} SP Dental. Soluciones odontológicas.</p>
      </div>
    </footer>
  );
}

export default Footer;
