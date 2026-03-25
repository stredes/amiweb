import type { BlogPost, BlogCategory } from './types';
import amilabLogo from '../../assets/images/amilab/logo-amilab.jpg';
import equiposClinicosCover from '../../assets/images/amilab/equipos-clinicos.png';
import hematologiaCover from '../../assets/images/amilab/hematologia.png';
import orinasCover from '../../assets/images/amilab/orinas.png';
import microbiologiaCover from '../../assets/images/amilab/microbiologia.png';
import electrolitosCover from '../../assets/images/amilab/electrolitos.png';

export const blogCategories: BlogCategory[] = [
  {
    id: '1',
    name: 'Química Clínica',
    slug: 'quimica-clinica',
    description: 'Tecnologías, automatización y control analítico para el laboratorio clínico.',
    icon: '🧪',
  },
  {
    id: '2',
    name: 'Hematología',
    slug: 'hematologia',
    description: 'Equipos, desempeño operativo y control de calidad hematológico.',
    icon: '🩸',
  },
  {
    id: '3',
    name: 'Microbiología',
    slug: 'microbiologia',
    description: 'Procesos de identificación, cultivos y continuidad diagnóstica.',
    icon: '🧫',
  },
  {
    id: '4',
    name: 'Operación de Laboratorio',
    slug: 'operacion-laboratorio',
    description: 'Buenas prácticas de continuidad, soporte técnico y productividad clínica.',
    icon: '⚙️',
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Química Clínica Automatizada: cómo mejorar continuidad y trazabilidad',
    slug: 'quimica-clinica-automatizada-trazabilidad',
    excerpt:
      'Una visión práctica sobre automatización analítica, continuidad operacional y trazabilidad de resultados en química clínica.',
    content: `
# Química Clínica Automatizada: cómo mejorar continuidad y trazabilidad

Los laboratorios clínicos necesitan combinar velocidad analítica, estabilidad operativa y trazabilidad en cada corrida. La automatización en química clínica permite reducir variabilidad manual, mejorar el flujo de muestras y sostener tiempos de respuesta más consistentes.

## Estandarización del proceso analítico

Cuando un laboratorio estandariza preparación, carga y validación, disminuye la probabilidad de retrabajos y de errores en etapas críticas.

## Continuidad operativa

La continuidad no depende solo del equipo. También requiere soporte técnico oportuno, disponibilidad de reactivos y un flujo ordenado entre preanalítica, análisis y liberación de resultados.

## Indicadores que vale la pena seguir

- Tiempo de respuesta por sección
- Repeticiones por muestra
- Consumo de reactivos por volumen real
- Incidencias técnicas por equipo

La decisión correcta no es solo incorporar tecnología, sino hacerlo con acompañamiento técnico y criterios de operación diaria.
    `,
    coverImage: equiposClinicosCover,
    author: {
      name: 'Equipo AMILAB',
      avatar: amilabLogo,
      role: 'Especialistas en Laboratorio Clínico',
    },
    category: 'quimica-clinica',
    tags: ['Química Clínica', 'Automatización', 'Trazabilidad'],
    publishedAt: '2026-03-12',
    readingTime: 5,
    views: 1250,
    featured: true,
  },
  {
    id: '2',
    title: 'Hematología de Alto Rendimiento: claves para laboratorios con alta demanda',
    slug: 'hematologia-alto-rendimiento-laboratorios',
    excerpt:
      'Factores técnicos y operativos para sostener productividad, control de calidad y continuidad en hematología.',
    content: `
# Hematología de Alto Rendimiento: claves para laboratorios con alta demanda

En hematología, la combinación entre volumen de muestras, estabilidad del equipo y control de calidad diario define buena parte del rendimiento del laboratorio.

## Productividad sin perder confiabilidad

No basta con procesar más muestras. También es necesario mantener consistencia en resultados, alarmas interpretables y protocolos claros de verificación.

## Soporte técnico y mantenimiento

La disponibilidad del equipo depende de mantenimiento preventivo, soporte técnico oportuno y capacitación continua del personal.

## Qué revisar en la práctica

- Tiempos de respuesta por turno
- Frecuencia de detenciones
- Controles internos fuera de rango
- Disponibilidad de consumibles críticos

Una estrategia robusta en hematología permite sostener productividad incluso en escenarios de alta carga operativa.
    `,
    coverImage: hematologiaCover,
    author: {
      name: 'Equipo AMILAB',
      avatar: amilabLogo,
      role: 'Soporte de Aplicaciones Clínicas',
    },
    category: 'hematologia',
    tags: ['Hematología', 'Continuidad', 'Control de Calidad'],
    publishedAt: '2026-03-08',
    readingTime: 6,
    views: 980,
    featured: true,
  },
  {
    id: '3',
    title: 'Uroanálisis y Orinas: eficiencia diagnóstica con flujos bien definidos',
    slug: 'uroanalisis-orinas-eficiencia-diagnostica',
    excerpt:
      'Cómo mejorar la eficiencia del procesamiento de muestras de orina con equipos confiables y una operación más ordenada.',
    content: `
# Uroanálisis y Orinas: eficiencia diagnóstica con flujos bien definidos

Las áreas de orinas requieren rapidez, estandarización y una gestión simple del flujo de muestras. La eficiencia mejora cuando el laboratorio alinea tecnología, consumibles y criterios operativos claros.

## Flujo de muestras

Desde recepción hasta lectura y validación, cada etapa debe reducir esperas innecesarias y evitar retrabajos.

## Consistencia operativa

La estandarización ayuda a mantener resultados comparables entre turnos, operadores y cargas variables.

## Buenas prácticas recomendadas

- Protocolos claros de ingreso y rechazo
- Tiempos máximos por etapa
- Control visual de carga de trabajo
- Soporte técnico preventivo

Un flujo bien diseñado impacta directamente en productividad y en percepción de calidad por parte del cliente clínico.
    `,
    coverImage: orinasCover,
    author: {
      name: 'Equipo AMILAB',
      avatar: amilabLogo,
      role: 'Consultoría Operativa',
    },
    category: 'operacion-laboratorio',
    tags: ['Orinas', 'Uroanálisis', 'Productividad'],
    publishedAt: '2026-03-04',
    readingTime: 5,
    views: 760,
    featured: false,
  },
  {
    id: '4',
    title: 'Microbiología y Hemocultivos: velocidad de respuesta con respaldo técnico',
    slug: 'microbiologia-hemocultivos-respaldo-tecnico',
    excerpt:
      'La respuesta oportuna en microbiología depende tanto de la tecnología como del soporte y la continuidad de la operación.',
    content: `
# Microbiología y Hemocultivos: velocidad de respuesta con respaldo técnico

La microbiología exige procesos estables, trazables y bien acompañados. En áreas de hemocultivos, cada detención o desviación impacta de forma directa en tiempos diagnósticos.

## Tecnología y continuidad

Los equipos y consumibles deben responder al ritmo del laboratorio, pero también estar respaldados por un modelo de servicio claro.

## Riesgos comunes

- Quiebres de stock
- Retrasos en soporte técnico
- Falta de visibilidad del estado de las corridas
- Escasa estandarización de criterios operativos

Una operación microbiológica madura requiere visibilidad, soporte local y control continuo del proceso.
    `,
    coverImage: microbiologiaCover,
    author: {
      name: 'Equipo AMILAB',
      avatar: amilabLogo,
      role: 'Especialistas de Microbiología',
    },
    category: 'microbiologia',
    tags: ['Microbiología', 'Hemocultivos', 'Continuidad'],
    publishedAt: '2026-02-26',
    readingTime: 7,
    views: 1120,
    featured: false,
  },
  {
    id: '5',
    title: 'Electrolitos en Áreas Críticas: disponibilidad, rapidez y soporte',
    slug: 'electrolitos-areas-criticas-soporte',
    excerpt:
      'Las soluciones de electrolitos deben responder con rapidez y estabilidad en entornos donde cada minuto operativo importa.',
    content: `
# Electrolitos en Áreas Críticas: disponibilidad, rapidez y soporte

En unidades de urgencia, toma de muestras y laboratorios de alto recambio, los sistemas de electrolitos deben ofrecer velocidad, estabilidad y soporte oportuno.

## Lo que define una operación robusta

No solo importa la velocidad analítica. También cuentan la facilidad de uso, la disponibilidad de reactivos y la capacidad de soporte ante contingencias.

## Enfoque recomendado

- Monitorear tiempos de respuesta reales
- Mantener inventario crítico bajo control
- Definir protocolos de contingencia
- Coordinar servicio técnico preventivo

La tecnología adecuada mejora la continuidad clínica cuando está acompañada por una operación bien diseñada.
    `,
    coverImage: electrolitosCover,
    author: {
      name: 'Equipo AMILAB',
      avatar: amilabLogo,
      role: 'Especialistas de Soporte Técnico',
    },
    category: 'operacion-laboratorio',
    tags: ['Electrolitos', 'Urgencia', 'Soporte Técnico'],
    publishedAt: '2026-02-20',
    readingTime: 6,
    views: 1080,
    featured: true,
  },
];
