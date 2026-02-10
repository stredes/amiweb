export const ROUTES = {
  home: '/',
  about: '/nosotros',
  products: '/productos',
  productDetail: '/productos/:productId',
  support: '/soporte',
  contact: '/contacto',
  privacy: '/privacidad',
  terms: '/terminos',
  cookies: '/cookies',
  crimePrevention: '/accesos/modelo-prevencion-delitos',
  login: '/login',
  partnerPortal: '/portal-socios',
  adminDashboard: '/admin',
  vendorDashboard: '/vendedor',
  warehouseDashboard: '/bodega',
  notFound: '*'
} as const;

export type RouteKeys = keyof typeof ROUTES;
