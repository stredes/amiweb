import { Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import MainLayout from '../components/layout/MainLayout';
import Loader from '../components/ui/Loader';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { ROUTES } from '../config/routes';

// Lazy loading de páginas para code splitting
const HomePage = lazy(() => import('../pages/home/HomePage'));
const AboutPage = lazy(() => import('../pages/nosotros/AboutPage'));
const ProductsPage = lazy(() => import('../pages/productos/ProductsPage'));
const ProductDetailPage = lazy(() => import('../pages/productos/ProductDetailPage'));
const SupportPage = lazy(() => import('../pages/soporte/SupportPage'));
const ContactPage = lazy(() => import('../pages/contacto/ContactPage'));
const CrimePreventionModelPage = lazy(() => import('../pages/accesos/CrimePreventionModelPage'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const PartnerPortalPage = lazy(() => import('../pages/portal/PartnerPortalPage').then(m => ({ default: m.PartnerPortalPage })));
const OrderDetailPage = lazy(() => import('../pages/portal/OrderDetailPage').then(m => ({ default: m.OrderDetailPage })));
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const VendorDashboardPage = lazy(() => import('../pages/vendor/VendorDashboardPage').then(m => ({ default: m.VendorDashboardPage })));
const WarehouseDashboardPage = lazy(() => import('../pages/warehouse/WarehouseDashboardPage'));
const NotFoundPage = lazy(() => import('../pages/not-found/NotFoundPage'));
const BlogPage = lazy(() => import('../pages/blog/BlogPage').then(m => ({ default: m.BlogPage })));
const BlogPostPage = lazy(() => import('../pages/blog/BlogPostPage').then(m => ({ default: m.BlogPostPage })));

// Loader centralizado para Suspense
const PageLoader = () => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    minHeight: '100vh',
    background: 'var(--color-bg-primary)'
  }}>
    <Loader />
  </div>
);

function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
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
            path="/portal/orders/:orderId" 
            element={
              <ProtectedRoute>
                <OrderDetailPage />
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
          <Route 
            path={ROUTES.warehouseDashboard} 
            element={
              <ProtectedRoute>
                <WarehouseDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path={ROUTES.notFound} element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AppRouter;
