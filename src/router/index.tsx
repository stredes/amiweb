import { Route, Routes } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import HomePage from '../pages/home/HomePage';
import AboutPage from '../pages/nosotros/AboutPage';
import ProductsPage from '../pages/productos/ProductsPage';
import ProductDetailPage from '../pages/productos/ProductDetailPage';
import SupportPage from '../pages/soporte/SupportPage';
import ContactPage from '../pages/contacto/ContactPage';
import CrimePreventionModelPage from '../pages/accesos/CrimePreventionModelPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { PartnerPortalPage } from '../pages/portal/PartnerPortalPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { VendorDashboardPage } from '../pages/vendor/VendorDashboardPage';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import NotFoundPage from '../pages/not-found/NotFoundPage';
import { ROUTES } from '../config/routes';

function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.login} element={<LoginPage />} />
      
      <Route element={<MainLayout />}>
        <Route path={ROUTES.home} element={<HomePage />} />
        <Route path={ROUTES.about} element={<AboutPage />} />
        <Route path={ROUTES.products} element={<ProductsPage />} />
        <Route path={ROUTES.productDetail} element={<ProductDetailPage />} />
        <Route path={ROUTES.support} element={<SupportPage />} />
        <Route path={ROUTES.contact} element={<ContactPage />} />
        <Route path={ROUTES.crimePrevention} element={<CrimePreventionModelPage />} />
        <Route 
          path={ROUTES.partnerPortal} 
          element={
            <ProtectedRoute>
              <PartnerPortalPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path={ROUTES.adminDashboard} 
          element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path={ROUTES.vendorDashboard} 
          element={
            <ProtectedRoute>
              <VendorDashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route path={ROUTES.notFound} element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
