import { useEffect, useRef } from 'react';
import './FadeIn.css';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
  threshold?: number;
  className?: string;
}

export function FadeIn({
  children,
  delay = 0,
  direction = 'up',
  duration = 0.6,
  threshold = 0.1,
  className = '',
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            element.classList.add('fade-in-visible');
            observer.unobserve(element);
          }
        });
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  const style = {
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
  };

  return (
    <div
      ref={ref}
      className={`fade-in fade-in-${direction} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className = '',
}: StaggerContainerProps) {
  return (
    <div className={`stagger-container ${className}`}>
      {Array.isArray(children)
        ? children.map((child, index) => (
            <FadeIn key={index} delay={index * staggerDelay}>
              {child}
            </FadeIn>
          ))
        : children}
    </div>
  );
}
