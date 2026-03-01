import type { BlogPost, BlogCategory } from './types';

export const blogCategories: BlogCategory[] = [
  {
    id: '1',
    name: 'Tecnología',
    slug: 'tecnologia',
    description: 'Últimas tendencias en tecnología industrial',
    icon: '🔧',
  },
  {
    id: '2',
    name: 'Seguridad',
    slug: 'seguridad',
    description: 'Noticias sobre seguridad y control de accesos',
    icon: '🔒',
  },
  {
    id: '3',
    name: 'Automatización',
    slug: 'automatizacion',
    description: 'Innovaciones en automatización industrial',
    icon: '🤖',
  },
  {
    id: '4',
    name: 'Casos de Éxito',
    slug: 'casos-exito',
    description: 'Historias de clientes satisfechos',
    icon: '✨',
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Sistemas de Control de Acceso: Tendencias 2024',
    slug: 'sistemas-control-acceso-2024',
    excerpt:
      'Descubre las últimas tendencias en sistemas de control de acceso biométrico y cómo están revolucionando la seguridad empresarial.',
    content: `
# Sistemas de Control de Acceso: Tendencias 2024

Los sistemas de control de acceso han evolucionado significativamente en los últimos años...

## Biometría Facial

La tecnología de reconocimiento facial se ha convertido en el estándar...

## Integración Cloud

La conectividad cloud permite gestión remota y análisis en tiempo real...

## Acceso Móvil

Las credenciales móviles están reemplazando las tarjetas tradicionales...
    `,
    coverImage: 'https://picsum.photos/800/400?random=1',
    author: {
      name: 'Carlos Rodríguez',
      avatar: 'https://i.pravatar.cc/150?img=12',
      role: 'Especialista en Seguridad',
    },
    category: 'seguridad',
    tags: ['Control de Acceso', 'Biometría', 'Tecnología'],
    publishedAt: '2024-01-15',
    readingTime: 5,
    views: 1250,
    featured: true,
  },
  {
    id: '2',
    title: 'Automatización Industrial: ROI y Beneficios',
    slug: 'automatizacion-industrial-roi',
    excerpt:
      'Análisis completo del retorno de inversión en proyectos de automatización industrial y sus beneficios a largo plazo.',
    content: `
# Automatización Industrial: ROI y Beneficios

La automatización industrial representa una inversión estratégica...
    `,
    coverImage: 'https://picsum.photos/800/400?random=2',
    author: {
      name: 'María González',
      avatar: 'https://i.pravatar.cc/150?img=5',
      role: 'Ingeniera Industrial',
    },
    category: 'automatizacion',
    tags: ['Automatización', 'ROI', 'Productividad'],
    publishedAt: '2024-01-10',
    readingTime: 8,
    views: 890,
    featured: true,
  },
  {
    id: '3',
    title: 'Caso de Éxito: Implementación en Planta Industrial',
    slug: 'caso-exito-planta-industrial',
    excerpt:
      'Cómo una planta industrial redujo sus costos operativos en un 30% con nuestras soluciones de automatización.',
    content: `
# Caso de Éxito: Implementación en Planta Industrial

Cliente líder del sector manufacturero logró resultados excepcionales...
    `,
    coverImage: 'https://picsum.photos/800/400?random=3',
    author: {
      name: 'Juan Pérez',
      avatar: 'https://i.pravatar.cc/150?img=8',
      role: 'Gerente de Proyectos',
    },
    category: 'casos-exito',
    tags: ['Caso de Éxito', 'Manufactura', 'Optimización'],
    publishedAt: '2024-01-05',
    readingTime: 6,
    views: 1520,
    featured: false,
  },
  {
    id: '4',
    title: 'Ciberseguridad en Sistemas Industriales',
    slug: 'ciberseguridad-sistemas-industriales',
    excerpt:
      'Protege tu infraestructura industrial contra amenazas cibernéticas con estas mejores prácticas de seguridad.',
    content: `
# Ciberseguridad en Sistemas Industriales

La seguridad digital es crítica en la industria moderna...
    `,
    coverImage: 'https://picsum.photos/800/400?random=4',
    author: {
      name: 'Ana Martínez',
      avatar: 'https://i.pravatar.cc/150?img=9',
      role: 'Experta en Ciberseguridad',
    },
    category: 'seguridad',
    tags: ['Ciberseguridad', 'Protección', 'Industria 4.0'],
    publishedAt: '2023-12-28',
    readingTime: 7,
    views: 760,
    featured: false,
  },
  {
    id: '5',
    title: 'IoT en la Industria: Conectividad Inteligente',
    slug: 'iot-industria-conectividad',
    excerpt:
      'Descubre cómo el Internet de las Cosas está transformando la manufactura con conectividad inteligente.',
    content: `
# IoT en la Industria: Conectividad Inteligente

El IoT industrial permite monitoreo y control en tiempo real...
    `,
    coverImage: 'https://picsum.photos/800/400?random=5',
    author: {
      name: 'Roberto Silva',
      avatar: 'https://i.pravatar.cc/150?img=11',
      role: 'Consultor IoT',
    },
    category: 'tecnologia',
    tags: ['IoT', 'Conectividad', 'Smart Factory'],
    publishedAt: '2023-12-20',
    readingTime: 9,
    views: 1100,
    featured: true,
  },
];
