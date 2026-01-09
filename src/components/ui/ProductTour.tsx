import { useState, useEffect } from 'react';
import './ProductTour.css';
import { FiX, FiArrowRight, FiArrowLeft } from 'react-icons/fi';

export interface TourStep {
  target: string; // CSS selector
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void;
}

interface ProductTourProps {
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export function ProductTour({ steps, isOpen, onClose, onComplete }: ProductTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!isOpen || !steps[currentStep]) return;

    const updatePosition = () => {
      const element = document.querySelector(steps[currentStep].target);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
        
        // Scroll to element if needed
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [currentStep, steps, isOpen]);

  useEffect(() => {
    if (isOpen && steps[currentStep]?.action) {
      steps[currentStep].action?.();
    }
  }, [currentStep, steps, isOpen]);

  if (!isOpen || !targetRect) return null;

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      onComplete?.();
      onClose();
      localStorage.setItem('tour-completed', 'true');
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleSkip = () => {
    onClose();
    localStorage.setItem('tour-skipped', 'true');
  };

  // Calculate tooltip position
  const getTooltipStyle = (): React.CSSProperties => {
    const position = step.position || 'bottom';
    const offset = 16;
    
    let style: React.CSSProperties = {
      position: 'fixed',
      zIndex: 10002,
    };

    switch (position) {
      case 'top':
        style.left = targetRect.left + targetRect.width / 2;
        style.top = targetRect.top - offset;
        style.transform = 'translate(-50%, -100%)';
        break;
      case 'bottom':
        style.left = targetRect.left + targetRect.width / 2;
        style.top = targetRect.bottom + offset;
        style.transform = 'translateX(-50%)';
        break;
      case 'left':
        style.right = window.innerWidth - targetRect.left + offset;
        style.top = targetRect.top + targetRect.height / 2;
        style.transform = 'translateY(-50%)';
        break;
      case 'right':
        style.left = targetRect.right + offset;
        style.top = targetRect.top + targetRect.height / 2;
        style.transform = 'translateY(-50%)';
        break;
    }

    return style;
  };

  return (
    <>
      {/* Overlay */}
      <div className="tour-overlay" onClick={handleSkip}>
        {/* Spotlight */}
        <div
          className="tour-spotlight"
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
          }}
        />
      </div>

      {/* Tooltip */}
      <div className="tour-tooltip" style={getTooltipStyle()}>
        <button className="tour-tooltip__close" onClick={handleSkip}>
          <FiX />
        </button>

        <div className="tour-tooltip__header">
          <h3>{step.title}</h3>
          <div className="tour-tooltip__progress">
            {currentStep + 1} / {steps.length}
          </div>
        </div>

        <div className="tour-tooltip__content">
          <p>{step.content}</p>
        </div>

        <div className="tour-tooltip__actions">
          <button onClick={handleSkip} className="tour-tooltip__skip">
            Saltar tour
          </button>
          <div className="tour-tooltip__navigation">
            {!isFirstStep && (
              <button onClick={handlePrevious} className="tour-tooltip__prev">
                <FiArrowLeft />
                Anterior
              </button>
            )}
            <button onClick={handleNext} className="tour-tooltip__next">
              {isLastStep ? 'Finalizar' : 'Siguiente'}
              {!isLastStep && <FiArrowRight />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export function useTour(tourId: string) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(`tour-${tourId}-completed`);
    const skipped = localStorage.getItem(`tour-${tourId}-skipped`);
    
    if (!completed && !skipped) {
      // Show tour after a short delay
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [tourId]);

  const startTour = () => setIsOpen(true);
  const closeTour = () => setIsOpen(false);
  
  const completeTour = () => {
    localStorage.setItem(`tour-${tourId}-completed`, 'true');
    setIsOpen(false);
  };

  return { isOpen, startTour, closeTour, completeTour };
}
