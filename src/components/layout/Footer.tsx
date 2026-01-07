import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes';

function Footer() {
  return (
    <footer className="footer">
      <div>
        <h4>AMILAB</h4>
        <p>Canadá 9450, La Florida, Santiago, Chile</p>
        <p>Teléfono: +562 22878707</p>
        <p>
          Correo: <a href="mailto:amilab@amilab.cl">amilab@amilab.cl</a>
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
        <p>© {new Date().getFullYear()} AMILAB. Catálogo de insumos médicos.</p>
      </div>
    </footer>
  );
}

export default Footer;
