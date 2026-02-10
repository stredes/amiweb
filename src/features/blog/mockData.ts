import type { BlogPost, BlogCategory } from './types';

export const blogCategories: BlogCategory[] = [
  {
    id: '1',
    name: 'Odontología Digital',
    slug: 'odontologia-digital',
    description: 'Tendencias en tecnología y flujo digital dental',
    icon: '🦷',
  },
  {
    id: '2',
    name: 'Clínica',
    slug: 'clinica',
    description: 'Buenas prácticas y protocolos clínicos',
    icon: '🩺',
  },
  {
    id: '3',
    name: 'Gestión',
    slug: 'gestion',
    description: 'Optimización y eficiencia en clínicas dentales',
    icon: '📈',
  },
  {
    id: '4',
    name: 'Casos de Éxito',
    slug: 'casos-exito',
    description: 'Historias de clínicas que modernizaron su práctica',
    icon: '✨',
  },
];

export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Flujo digital en odontología: por dónde empezar',
    slug: 'flujo-digital-odontologia',
    excerpt:
      'Una guía clara para implementar flujo digital en tu clínica y mejorar la experiencia del paciente.',
    content: `
# Flujo digital en odontología: por dónde empezar

El flujo digital permite diagnósticos más precisos, tratamientos más rápidos y mejores resultados…

## Escaneo e imagenología

La captura digital reduce tiempos y mejora la comunicación con el paciente…

## Planificación clínica

Define objetivos, tiempos y responsables para una transición efectiva…
    `,
    coverImage: 'https://picsum.photos/800/400?random=11',
    author: {
      name: 'Dra. Valentina Rojas',
      avatar: 'https://i.pravatar.cc/150?img=12',
      role: 'Especialista en Odontología Digital',
    },
    category: 'odontologia-digital',
    tags: ['Flujo Digital', 'Tecnología', 'Imagenología'],
    publishedAt: '2024-06-18',
    readingTime: 6,
    views: 980,
    featured: true,
  },
  {
    id: '2',
    title: 'Blanqueamiento seguro en clínica: claves para mejores resultados',
    slug: 'blanqueamiento-seguro-clinica',
    excerpt:
      'Recomendaciones prácticas para protocolos de blanqueamiento con seguridad y alta satisfacción del paciente.',
    content: `
# Blanqueamiento seguro en clínica

Un protocolo correcto protege tejidos y mejora la percepción de resultados…
    `,
    coverImage: 'https://picsum.photos/800/400?random=12',
    author: {
      name: 'Dr. Nicolás Fuentes',
      avatar: 'https://i.pravatar.cc/150?img=5',
      role: 'Odontólogo Estético',
    },
    category: 'clinica',
    tags: ['Estética', 'Blanqueamiento', 'Protocolos'],
    publishedAt: '2024-05-30',
    readingTime: 5,
    views: 720,
    featured: true,
  },
  {
    id: '3',
    title: 'Gestión de insumos: cómo reducir quiebres de stock en tu clínica',
    slug: 'gestion-insumos-clinica',
    excerpt:
      'Estrategias simples para mantener continuidad operativa y ahorrar costos en insumos odontológicos.',
    content: `
# Gestión de insumos en clínica dental

Controlar stock reduce costos y evita retrasos en agenda…
    `,
    coverImage: 'https://picsum.photos/800/400?random=13',
    author: {
      name: 'Carla Mena',
      avatar: 'https://i.pravatar.cc/150?img=8',
      role: 'Gerente de Operaciones',
    },
    category: 'gestion',
    tags: ['Gestión', 'Stock', 'Eficiencia'],
    publishedAt: '2024-05-10',
    readingTime: 7,
    views: 640,
    featured: false,
  },
  {
    id: '4',
    title: 'Caso de éxito: modernización de una clínica con imagenología avanzada',
    slug: 'caso-exito-imagenologia-avanzada',
    excerpt:
      'Cómo una clínica aumentó su productividad con equipos de imagenología y soporte técnico especializado.',
    content: `
# Caso de éxito: modernización con imagenología

La incorporación de equipos avanzados mejoró el diagnóstico y redujo tiempos…
    `,
    coverImage: 'https://picsum.photos/800/400?random=14',
    author: {
      name: 'Luis Herrera',
      avatar: 'https://i.pravatar.cc/150?img=9',
      role: 'Consultor Clínico',
    },
    category: 'casos-exito',
    tags: ['Casos', 'Imagenología', 'Productividad'],
    publishedAt: '2024-04-22',
    readingTime: 6,
    views: 830,
    featured: false,
  },
  {
    id: '5',
    title: 'Endodoncia eficiente con NiTi: mejores prácticas',
    slug: 'endodoncia-niti-mejores-practicas',
    excerpt:
      'Recomendaciones para mejorar la seguridad y precisión en tratamientos endodónticos.',
    content: `
# Endodoncia eficiente con NiTi

La selección correcta de instrumental NiTi mejora el control clínico…
    `,
    coverImage: 'https://picsum.photos/800/400?random=15',
    author: {
      name: 'Dra. Camila Vega',
      avatar: 'https://i.pravatar.cc/150?img=11',
      role: 'Endodoncista',
    },
    category: 'clinica',
    tags: ['Endodoncia', 'NiTi', 'Protocolos'],
    publishedAt: '2024-04-02',
    readingTime: 6,
    views: 520,
    featured: true,
  },
];
