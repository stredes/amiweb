import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes';

function NotFoundPage() {
  return (
    <div className="page">
      <h1>Página no encontrada</h1>
      <p>La página que buscas no existe o fue movida.</p>
      <Link to={ROUTES.home} className="btn btn-primary">
        Volver al inicio
      </Link>
    </div>
  );
}

export default NotFoundPage;
