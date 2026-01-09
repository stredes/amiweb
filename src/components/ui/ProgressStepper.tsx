import { FiCheck } from 'react-icons/fi';
import './ProgressStepper.css';

export interface Step {
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface ProgressStepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  className?: string;
  variant?: 'horizontal' | 'vertical';
}

export function ProgressStepper({
  steps,
  currentStep,
  onStepClick,
  className = '',
  variant = 'horizontal',
}: ProgressStepperProps) {
  const isStepCompleted = (stepIndex: number) => stepIndex < currentStep;
  const isStepActive = (stepIndex: number) => stepIndex === currentStep;

  return (
    <div className={`progress-stepper progress-stepper--${variant} ${className}`}>
      {steps.map((step, index) => {
        const completed = isStepCompleted(index);
        const active = isStepActive(index);
        const clickable = onStepClick && (completed || active);

        return (
          <div
            key={index}
            className={`progress-stepper__step ${
              completed ? 'progress-stepper__step--completed' : ''
            } ${active ? 'progress-stepper__step--active' : ''} ${
              clickable ? 'progress-stepper__step--clickable' : ''
            }`}
            onClick={() => clickable && onStepClick(index)}
          >
            <div className="progress-stepper__step-marker">
              <div className="progress-stepper__step-circle">
                {completed ? (
                  <FiCheck className="progress-stepper__step-check" />
                ) : step.icon ? (
                  <span className="progress-stepper__step-icon">{step.icon}</span>
                ) : (
                  <span className="progress-stepper__step-number">{index + 1}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className="progress-stepper__step-line" />
              )}
            </div>
            
            <div className="progress-stepper__step-content">
              <div className="progress-stepper__step-label">{step.label}</div>
              {step.description && (
                <div className="progress-stepper__step-description">
                  {step.description}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
