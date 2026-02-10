import { Product, ProductCategory } from './types';

// Categorías principales del catálogo (familias de productos reales de Firestore).
export const productCategories: ProductCategory[] = [
  {
    id: 'ESTETICA',
    name: 'Estética y Blanqueamiento',
    description: 'Soluciones para estética dental, blanqueamiento y cuidado del paciente.'
  },
  {
    id: 'RESTAURADORA',
    name: 'Odontología Restauradora',
    description: 'Materiales restauradores, adhesivos y resinas de alta calidad clínica.'
  },
  {
    id: 'CIRUGIA',
    name: 'Cirugía e Implantología',
    description: 'Instrumental, suturas y biomateriales para procedimientos quirúrgicos.'
  },
  {
    id: 'ENDODONCIA',
    name: 'Endodoncia',
    description: 'Instrumental y consumibles para tratamientos endodónticos eficientes.'
  },
  {
    id: 'IMAGENOLOGIA',
    name: 'Imagenología y Equipos',
    description: 'Equipamiento para diagnóstico, profilaxis y flujo digital.'
  },
  {
    id: 'CONSUMIBLES',
    name: 'Consumibles Clínicos',
    description: 'Insumos de uso diario para la operación de la clínica.'
  }
];

// Productos mock con información extendida para vistas y ficha técnica.
export const products: Product[] = [
  {
    id: 'p-est-01',
    code: 'FGM-WH-01',
    name: 'Kit de blanqueamiento FGM',
    categoryId: 'ESTETICA',
    brand: 'FGM Dental Group',
    shortDescription: 'Sistema de blanqueamiento clínico y domiciliario.',
    longDescription:
      'Kit integral para blanqueamiento con formulaciones seguras y resultados consistentes, ideal para protocolos en clínica.',
    specs: {
      Presentación: 'Jeringas + accesorios',
      Protocolos: 'Clínico y domiciliario',
      Compatibilidad: 'Uso profesional'
    },
    requiresInstallation: false,
    imageUrl: ''
  },
  {
    id: 'p-res-01',
    code: 'WIS-COMP-02',
    name: 'Resina compuesta universal',
    categoryId: 'RESTAURADORA',
    brand: 'Wisedent',
    shortDescription: 'Resina estética para restauraciones directas.',
    longDescription:
      'Resina de alta estabilidad cromática y excelente pulido, diseñada para restauraciones anteriores y posteriores.',
    specs: {
      Tonalidades: 'Amplia gama',
      Manipulación: 'Baja contracción',
      Acabado: 'Pulido brillante'
    },
    requiresInstallation: false,
    imageUrl: ''
  },
  {
    id: 'p-cir-01',
    code: 'SMI-SUT-01',
    name: 'Suturas quirúrgicas SMI',
    categoryId: 'CIRUGIA',
    brand: 'SMI',
    shortDescription: 'Suturas para procedimientos quirúrgicos e implantología.',
    longDescription:
      'Suturas confiables con excelente manejo para procedimientos de cirugía oral e implantología.',
    specs: {
      Material: 'Monofilamento',
      Uso: 'Cirugía oral',
      Presentación: 'Varias medidas'
    },
    requiresInstallation: false,
    imageUrl: ''
  },
  {
    id: 'p-end-01',
    code: 'WIS-ENDO-04',
    name: 'Limas endodónticas NiTi',
    categoryId: 'ENDODONCIA',
    brand: 'Wisedent',
    shortDescription: 'Instrumental NiTi para endodoncia rotatoria.',
    longDescription:
      'Limas NiTi con alta flexibilidad y resistencia, diseñadas para tratamientos seguros y eficientes.',
    specs: {
      Sistema: 'Rotatorio',
      Material: 'NiTi',
      Compatibilidad: 'Motores estándar'
    },
    requiresInstallation: false,
    imageUrl: ''
  },
  {
    id: 'p-img-01',
    code: 'ACT-ULTRA-01',
    name: 'Ultrasonido clínico Acteon',
    categoryId: 'IMAGENOLOGIA',
    brand: 'Acteon',
    shortDescription: 'Equipo de ultrasonido para profilaxis y periodoncia.',
    longDescription:
      'Ultrasonido de alta precisión para profilaxis y tratamientos periodontales con múltiples insertos.',
    specs: {
      Modos: 'Profilaxis y perio',
      Ergonomía: 'Pieza de mano liviana',
      Accesorios: 'Insertos intercambiables'
    },
    requiresInstallation: true,
    imageUrl: ''
  },
  {
    id: 'p-con-01',
    code: 'DIM-GLO-01',
    name: 'Guantes de nitrilo',
    categoryId: 'CONSUMIBLES',
    brand: 'Dimed',
    shortDescription: 'Guantes resistentes para uso clínico diario.',
    longDescription:
      'Guantes de nitrilo con ajuste cómodo y resistencia mejorada para procedimientos clínicos.',
    specs: {
      Tallas: 'S, M, L',
      Color: 'Azul',
      Uso: 'Desechable'
    },
    requiresInstallation: false,
    imageUrl: ''
  }
];
