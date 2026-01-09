import { useEffect, useState } from 'react';
import './RippleButton.css';

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  rippleColor?: string;
  children: React.ReactNode;
}

interface Ripple {
  x: number;
  y: number;
  size: number;
  id: number;
}

export function RippleButton({
  variant = 'primary',
  size = 'md',
  rippleColor = 'rgba(255, 255, 255, 0.6)',
  children,
  className = '',
  onClick,
  ...props
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples((prev) => prev.slice(1));
      }, 600);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [ripples]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple: Ripple = {
      x,
      y,
      size,
      id: Date.now(),
    };

    setRipples((prev) => [...prev, newRipple]);

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      className={`ripple-button ripple-button--${variant} ripple-button--${size} ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
      <span className="ripple-button__ripples" aria-hidden="true">
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="ripple-button__ripple"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              background: rippleColor,
            }}
          />
        ))}
      </span>
    </button>
  );
}
