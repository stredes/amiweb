import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { RichFooter } from './RichFooter';

function MainLayout() {
  const { pathname } = useLocation();
  const isWideDashboard =
    pathname.startsWith('/root') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/vendedor') ||
    pathname.startsWith('/bodega');

  return (
    <div className="app-shell">
      <Navbar />
      <main className={`app-content ${isWideDashboard ? 'app-content--wide' : ''}`}>
        <Outlet />
      </main>
      <RichFooter />
    </div>
  );
}

export default MainLayout;
