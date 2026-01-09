import { Product, ProductCategory } from './types';

// Categorías principales del catálogo (familias de productos reales de Firestore).
export const productCategories: ProductCategory[] = [
  {
    id: 'CONTROL DE CALIDAD',
    name: 'Control de Calidad',
    description: 'Productos y soluciones para el control de calidad en laboratorios clínicos, asegurando la precisión y confiabilidad de los resultados.'
  },
  {
    id: 'QC CORE',
    name: 'QC Core',
    description: 'Controles de calidad especializados para áreas críticas del laboratorio.'
  },
  {
    id: 'CORE',
    name: 'Core',
    description: 'Productos esenciales para las áreas centrales del laboratorio clínico: Coagulación, Electrolitos, HPLC, Hematología, Inmunología, Química Clínica, Uroanálisis, VHS y Veterinaria.'
  },
  {
    id: 'INSUMOS',
    name: 'Insumos',
    description: 'Material de plástico, papeles y etiquetas, test rápidos y productos para toma de muestras.'
  },
  {
    id: 'INTERNO',
    name: 'Interno',
    description: 'Productos complementarios, bioplates, EPP, despensa, papelería y material de marketing.'
  },
  {
    id: 'MICROBIOLOGÍA',
    name: 'Microbiología',
    description: 'Soluciones completas para microbiología: cultivos acelerados, hemocultivos, identificación y antibiograma, medios de cultivo, molecular y parasitológicos. Respaldado por Becton Dickinson.'
  },
  {
    id: 'PERIFÉRICOS',
    name: 'Periféricos',
    description: 'Equipamiento periférico y complementario: centrífugas, computación, microscopios y otros periféricos de equipamiento.'
  }
];

// Productos mock con información extendida para vistas y ficha técnica.
export const products: Product[] = [
  {
    id: 'p-chem-01',
    code: 'CHEM-400',
    name: 'Analizador de química clínica AU400',
    categoryId: 'chemistry',
    brand: 'Olympus',
    shortDescription: 'Analizador automatizado para laboratorios medianos.',
    longDescription:
      'Equipo de química clínica con alta estabilidad y versatilidad para laboratorios que requieren alta disponibilidad y menú amplio de pruebas.',
    specs: {
      Rendimiento: 'Hasta 400 pruebas/hora',
      Reactivos: 'Módulo refrigerado con detección de nivel',
      Conectividad: 'Interfaz LIS adaptable'
    },
    requiresInstallation: true,
    imageUrl: ''
  },
  {
    id: 'p-chem-02',
    code: 'CHEM-RCT-01',
    name: 'Kit de reactivos enzimáticos',
    categoryId: 'chemistry',
    brand: 'AMILAB',
    shortDescription: 'Reactivos listos para usar con estabilidad extendida.',
    longDescription:
      'Formulación lista para usar para pruebas enzimáticas de rutina, con calibradores y controles incluidos para simplificar la operación.',
    specs: {
      Presentación: 'Formato líquido estable',
      Incluye: 'Calibradores y controles',
      Compatibilidad: 'Múltiples plataformas de química'
    },
    requiresInstallation: false,
    imageUrl: ''
  },
  {
    id: 'p-hem-01',
    code: 'HEM-3000',
    name: 'Analizador hematológico 5 partes',
    categoryId: 'hematology',
    brand: 'Mindray',
    shortDescription: 'Equipo compacto para hemogramas de 5 partes.',
    longDescription:
      'Analizador hematológico para laboratorios con alto flujo, automatiza la dilución y limpieza reduciendo la intervención manual.',
    specs: {
      Rendimiento: '40 muestras/hora',
      Interfaz: 'Pantalla táctil 10"',
      Limpieza: 'Ciclos automáticos programables'
    },
    requiresInstallation: true,
    imageUrl: ''
  },
  {
    id: 'p-ur-01',
    code: 'UR-STRP',
    name: 'Tiras reactivas para orina',
    categoryId: 'urinalysis',
    brand: 'Bayer',
    shortDescription: 'Tiras multianalito para lectura manual o en analizador.',
    longDescription:
      'Tiras de orina con 10 parámetros para uso en laboratorios clínicos; resultados consistentes en 60 segundos.',
    specs: {
      Parámetros: '10 parámetros',
      Tiempo: 'Lectura en 60 segundos',
      Formato: 'Alta estabilidad y contraste de color'
    },
    requiresInstallation: false,
    imageUrl: ''
  },
  {
    id: 'p-micro-01',
    code: 'MICRO-MEDIA',
    name: 'Medios de cultivo listos para usar',
    categoryId: 'microbiology',
    brand: 'Britania',
    shortDescription: 'Placas preparadas con control de calidad.',
    longDescription:
      'Medios de cultivo listos para usar con trazabilidad y control de calidad, ideales para aislamientos rápidos en microbiología.',
    specs: {
      Variedad: 'Medios selectivos y diferenciales',
      VidaUtil: 'Larga vida útil refrigerada',
      Empaque: 'Empaque seguro y apilable'
    },
    requiresInstallation: false,
    imageUrl: ''
  },
  {
    id: 'p-elec-01',
    code: 'ELEC-200',
    name: 'Analizador de electrolitos iSE',
    categoryId: 'electrolytes',
    brand: 'ABL',
    shortDescription: 'Equipo rápido para Na/K/Cl en entornos críticos.',
    longDescription:
      'Analizador compacto de electrolitos con resultados en un minuto, ideal para servicios de urgencia y unidades críticas.',
    specs: {
      Tiempo: 'Resultados en 60 segundos',
      Consumo: 'Bajo consumo de reactivos',
      Interfaz: 'Pantalla táctil'
    },
    requiresInstallation: true,
    imageUrl: ''
  },
  {
    id: 'p-tbc-01',
    code: 'TBC-STAIN',
    name: 'Kit de tinción para baciloscopía',
    categoryId: 'tbc',
    brand: 'AMILAB',
    shortDescription: 'Kit completo para tinción y diagnóstico de TBC.',
    longDescription:
      'Incluye colorantes y fijadores para protocolos estandarizados de baciloscopía, compatible con controles externos.',
    specs: {
      Componentes: 'Colorantes y fijadores',
      Protocolos: 'Protocolos estandarizados',
      Compatibilidad: 'Adaptable a diferentes laboratorios'
    },
    requiresInstallation: false,
    imageUrl: ''
  },
  {
    id: 'p-sampling-01',
    code: 'SAMP-VAC',
    name: 'Sistema de tubos al vacío',
    categoryId: 'sampling',
    brand: 'Becton Dickinson',
    shortDescription: 'Tubería al vacío para extracción segura y trazable.',
    longDescription:
      'Sistema de toma de muestras al vacío con tapas codificadas por color, diseñado para seguridad del paciente y del operador.',
    specs: {
      Seguridad: 'Agujas con doble protección',
      Compatibilidad: 'Usables con sistemas automáticos',
      Trazabilidad: 'Tapas codificadas por color'
    },
    requiresInstallation: false,
    imageUrl: ''
  }
];
