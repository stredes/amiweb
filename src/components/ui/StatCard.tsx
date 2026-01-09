import CountUp from 'react-countup';
import { useEffect, useRef, useState } from 'react';
import './StatCard.css';

interface StatCardProps {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  icon?: React.ReactNode;
  color?: string;
}

export function StatCard({
  value,
  label,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 2.5,
  icon,
  color = 'var(--color-primary)',
}: StatCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="stat-card" style={{ '--stat-color': color } as React.CSSProperties}>
      {icon && <div className="stat-card__icon">{icon}</div>}
      <div className="stat-card__content">
        <div className="stat-card__value">
          {isVisible ? (
            <>
              {prefix}
              <CountUp end={value} duration={duration} decimals={decimals} separator="," />
              {suffix}
            </>
          ) : (
            '0'
          )}
        </div>
        <div className="stat-card__label">{label}</div>
      </div>
    </div>
  );
}

interface StatsGridProps {
  stats: Array<{
    value: number;
    label: string;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    icon?: React.ReactNode;
    color?: string;
  }>;
  columns?: number;
  className?: string;
}

export function StatsGrid({ stats, columns = 4, className = '' }: StatsGridProps) {
  return (
    <div
      className={`stats-grid ${className}`}
      style={{ '--stats-columns': columns } as React.CSSProperties}
    >
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
