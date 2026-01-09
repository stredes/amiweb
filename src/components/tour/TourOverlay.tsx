import { useEffect, useState, useRef } from 'react';
import { useTour } from '../../contexts/TourContext';
import { FiX, FiArrowLeft, FiArrowRight, FiSkipForward } from 'react-icons/fi';
import './TourOverlay.css';

export function TourOverlay() {
  const { isActive, currentStep, steps, nextStep, prevStep, skipTour, endTour } = useTour();
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const currentStepData = steps[currentStep];

  useEffect(() => {
    if (!isActive || !currentStepData) return;

    const updatePosition = () => {
      const element = document.querySelector(currentStepData.target);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);

        // Calculate tooltip position
        if (tooltipRef.current) {
          const tooltipRect = tooltipRef.current.getBoundingClientRect();
          const padding = 20;
          let top = 0;
          let left = 0;

          switch (currentStepData.placement) {
            case 'top':
              top = rect.top - tooltipRect.height - padding;
              left = rect.left + rect.width / 2 - tooltipRect.width / 2;
              break;
            case 'bottom':
              top = rect.bottom + padding;
              left = rect.left + rect.width / 2 - tooltipRect.width / 2;
              break;
            case 'left':
              top = rect.top + rect.height / 2 - tooltipRect.height / 2;
              left = rect.left - tooltipRect.width - padding;
              break;
            case 'right':
              top = rect.top + rect.height / 2 - tooltipRect.height / 2;
              left = rect.right + padding;
              break;
            default:
              top = rect.bottom + padding;
              left = rect.left + rect.width / 2 - tooltipRect.width / 2;
          }

          // Keep tooltip within viewport
          const maxLeft = window.innerWidth - tooltipRect.width - 10;
          const maxTop = window.innerHeight - tooltipRect.height - 10;
          left = Math.max(10, Math.min(left, maxLeft));
          top = Math.max(10, Math.min(top, maxTop));

          setTooltipPosition({ top, left });
        }
      } else {
        // Target not found, center tooltip
        setTargetRect(null);
        if (tooltipRef.current) {
          const tooltipRect = tooltipRef.current.getBoundingClientRect();
          setTooltipPosition({
            top: window.innerHeight / 2 - tooltipRect.height / 2,
            left: window.innerWidth / 2 - tooltipRect.width / 2,
          });
        }
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    // Highlight element
    const element = document.querySelector(currentStepData.target);
    if (element) {
      element.classList.add('tour-highlight');
    }

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
      if (element) {
        element.classList.remove('tour-highlight');
      }
    };
  }, [isActive, currentStep, currentStepData]);

  if (!isActive || !currentStepData) return null;

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="tour-overlay">
      {/* Backdrop */}
      <div className="tour-backdrop" onClick={skipTour} />

      {/* Spotlight */}
      {targetRect && (
        <div
          className="tour-spotlight"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
          }}
        />
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="tour-tooltip"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
        }}
      >
        <div className="tour-tooltip__header">
          <h3 className="tour-tooltip__title">{currentStepData.title}</h3>
          <button
            className="tour-tooltip__close"
            onClick={skipTour}
            aria-label="Cerrar tour"
          >
            <FiX />
          </button>
        </div>

        <div className="tour-tooltip__content">
          <p>{currentStepData.content}</p>
        </div>

        <div className="tour-tooltip__footer">
          <div className="tour-tooltip__progress">
            {currentStep + 1} / {steps.length}
          </div>

          <div className="tour-tooltip__actions">
            {!isFirstStep && (
              <button
                className="tour-tooltip__btn tour-tooltip__btn--secondary"
                onClick={prevStep}
              >
                <FiArrowLeft />
                Anterior
              </button>
            )}

            {!isLastStep && (
              <button
                className="tour-tooltip__btn tour-tooltip__btn--ghost"
                onClick={skipTour}
              >
                <FiSkipForward />
                Saltar
              </button>
            )}

            <button
              className="tour-tooltip__btn tour-tooltip__btn--primary"
              onClick={isLastStep ? endTour : nextStep}
            >
              {isLastStep ? 'Finalizar' : 'Siguiente'}
              {!isLastStep && <FiArrowRight />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
