import { FormEvent } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { useSearchStore } from '../../features/search/searchStore';
import { useAuth } from '../../features/auth/authStore';
import { ThemeToggle } from '../ui/ThemeToggle';
import { NotificationCenter } from '../notifications/NotificationCenter';

function Navbar() {
  const { term, setTerm } = useSearchStore();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const linkClassName = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'active' : undefined;

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: conectar con búsqueda global y backend.
    const query = term ? `?q=${encodeURIComponent(term)}` : '';
    navigate(`${ROUTES.products}${query}`);
    console.info('Buscar productos con término:', term);
  };

  return (
    <header className="navbar">
      <div className="navbar__brand" role="banner">
        <div className="navbar__logo" aria-label="SP Dental logo">
          <img src="/logo.png" alt="SP Dental" width={140} height={60} loading="eager" />
          <span className="navbar__brand-name">SP DENTAL</span>
        </div>
      </div>
      <nav className="navbar__nav" aria-label="Menú principal">
        <NavLink to={ROUTES.home} className={linkClassName}>
          Inicio
        </NavLink>
        <NavLink to={ROUTES.about} className={linkClassName}>
          Nosotros
        </NavLink>
        <NavLink to={ROUTES.products} className={linkClassName}>
          Productos
        </NavLink>
        <NavLink to={ROUTES.support} className={linkClassName}>
          Soporte
        </NavLink>
        <NavLink to="/blog" className={linkClassName}>
          Blog
        </NavLink>
        <NavLink to={ROUTES.contact} className={linkClassName}>
          Contacto
        </NavLink>
        {isAuthenticated ? (
          <>
            {(user?.role === 'admin' || user?.role === 'root') ? (
              <NavLink to={ROUTES.adminDashboard} className={linkClassName}>
                {user.role === 'root' ? '🔧' : '👑'} Admin
              </NavLink>
            ) : user?.role === 'vendedor' ? (
              <NavLink to={ROUTES.vendorDashboard} className={linkClassName}>
                💼 Vendedor
              </NavLink>
            ) : user?.role === 'bodega' ? (
              <NavLink to={ROUTES.warehouseDashboard} className={linkClassName}>
                📦 Bodega
              </NavLink>
            ) : (
              <NavLink to={ROUTES.partnerPortal} className={linkClassName}>
                🔐 Portal
              </NavLink>
            )}
          </>
        ) : (
          <NavLink to={ROUTES.login} className={linkClassName}>
            Iniciar Sesión
          </NavLink>
        )}
      </nav>
      <div className="navbar__actions">
        <form className="navbar__search" data-tour="search-bar" onSubmit={handleSearchSubmit}>
          <label className="sr-only" htmlFor="navbar-search">
            Buscar productos
          </label>
          <input
            id="navbar-search"
            type="search"
            value={term}
            placeholder="Buscar productos…"
            onChange={(e) => setTerm(e.target.value)}
            inputMode="search"
            autoComplete="off"
            name="navbarSearch"
          />
          <button type="submit">Buscar</button>
        </form>
        <NotificationCenter />
        <ThemeToggle />
      </div>
    </header>
  );
}

export default Navbar;
