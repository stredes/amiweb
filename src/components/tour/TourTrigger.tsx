import { FiHelpCircle } from 'react-icons/fi';
import { useTour } from '../../contexts/TourContext';
import './TourTrigger.css';

export function TourTrigger() {
  const { startTour, hasCompletedTour } = useTour();

  return (
    <button
      className="tour-trigger"
      onClick={startTour}
      title={hasCompletedTour ? 'Ver tour nuevamente' : 'Iniciar tour guiado'}
      aria-label="Iniciar tour guiado"
    >
      <FiHelpCircle />
      {!hasCompletedTour && <span className="tour-trigger__badge" />}
    </button>
  );
}
