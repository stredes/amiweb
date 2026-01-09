import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { RichFooter } from './RichFooter';

function MainLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-content">
        <Outlet />
      </main>
      <RichFooter />
    </div>
  );
}

export default MainLayout;
