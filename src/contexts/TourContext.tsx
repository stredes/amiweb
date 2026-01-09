import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface TourStep {
  id: string;
  target: string; // CSS selector
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  beforeShow?: () => void;
  afterShow?: () => void;
}

interface TourContextType {
  isActive: boolean;
  currentStep: number;
  steps: TourStep[];
  startTour: () => void;
  endTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  hasCompletedTour: boolean;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

const STORAGE_KEY = 'amilab_tour_completed';

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    target: 'body',
    title: '¡Bienvenido a AMILAB!',
    content: 'Te mostraremos las características principales de nuestra plataforma B2B. Este tour tomará solo 2 minutos.',
    placement: 'bottom',
  },
  {
    id: 'navbar',
    target: '.navbar',
    title: 'Barra de Navegación',
    content: 'Aquí encontrarás acceso rápido a todas las secciones: Productos, Soporte, Nosotros y Contacto.',
    placement: 'bottom',
  },
  {
    id: 'search',
    target: '[data-tour="search-bar"]',
    title: 'Búsqueda de Productos',
    content: 'Busca entre nuestros 846 productos de laboratorio por nombre, código o categoría.',
    placement: 'bottom',
  },
  {
    id: 'filters',
    target: '[data-tour="filters-button"]',
    title: 'Filtros Avanzados',
    content: 'Refina tu búsqueda por precio, marca, disponibilidad y más. También puedes ordenar los resultados.',
    placement: 'left',
  },
  {
    id: 'wishlist',
    target: '[data-tour="wishlist-button"]',
    title: 'Lista de Deseos',
    content: 'Guarda productos para después. Puedes crear múltiples listas, compartirlas y exportarlas a CSV.',
    placement: 'left',
    beforeShow: () => {
      // Scroll to bottom to show floating buttons
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    },
  },
  {
    id: 'compare',
    target: '[data-tour="compare-button"]',
    title: 'Comparador de Productos',
    content: 'Compara hasta 4 productos lado a lado para ver sus especificaciones y tomar la mejor decisión.',
    placement: 'left',
  },
  {
    id: 'cart',
    target: '[data-tour="cart-button"]',
    title: 'Carrito de Cotizaciones',
    content: 'Agrega productos y genera cotizaciones. Puedes agregar notas por item y exportar todo a CSV.',
    placement: 'left',
  },
  {
    id: 'notifications',
    target: '[data-tour="notifications-button"]',
    title: 'Centro de Notificaciones',
    content: 'Mantente informado sobre el estado de tus cotizaciones y pedidos.',
    placement: 'bottom',
    beforeShow: () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  },
  {
    id: 'complete',
    target: 'body',
    title: '¡Tour Completado!',
    content: 'Ya conoces las características principales. ¡Comienza a explorar nuestro catálogo de productos de laboratorio!',
    placement: 'bottom',
  },
];

export function TourProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompletedTour, setHasCompletedTour] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  });

  const startTour = () => {
    setIsActive(true);
    setCurrentStep(0);
  };

  const endTour = () => {
    setIsActive(false);
    setCurrentStep(0);
    localStorage.setItem(STORAGE_KEY, 'true');
    setHasCompletedTour(true);
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      endTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    endTour();
  };

  // Execute step hooks
  useEffect(() => {
    if (isActive && tourSteps[currentStep]) {
      const step = tourSteps[currentStep];
      step.beforeShow?.();
      
      const timer = setTimeout(() => {
        step.afterShow?.();
      }, 100);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isActive, currentStep]);

  // Auto-start tour for new users after a delay
  useEffect(() => {
    if (!hasCompletedTour) {
      const timer = setTimeout(() => {
        startTour();
      }, 2000); // Wait 2 seconds before showing tour

      return () => clearTimeout(timer);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCompletedTour]);

  return (
    <TourContext.Provider
      value={{
        isActive,
        currentStep,
        steps: tourSteps,
        startTour,
        endTour,
        nextStep,
        prevStep,
        skipTour,
        hasCompletedTour,
      }}
    >
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
}
