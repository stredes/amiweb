interface SalesMetricCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: string;
    isUp: boolean;
  };
  color?: string;
}

export function SalesMetricCard({ title, value, icon, trend, color = 'var(--color-primary)' }: SalesMetricCardProps) {
  return (
    <div className="sales-metric-card" style={{ '--metric-color': color } as any}>
      <div className="sales-metric-card__header">
        <div className="sales-metric-card__icon">{icon}</div>
        {trend && (
          <div className={`sales-trend ${trend.isUp ? 'up' : 'down'}`}>
            {trend.isUp ? '↗' : '↘'} {trend.value}
          </div>
        )}
      </div>
      <div className="sales-metric-card__content">
        <div className="sales-metric-card__value">{value}</div>
        <div className="sales-metric-card__title">{title}</div>
      </div>
    </div>
  );
}
