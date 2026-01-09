import { memo } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  change?: {
    value: string;
    isPositive: boolean;
  };
  color?: string;
}

export const AdminStatCard = memo(function AdminStatCard({ title, value, icon, change, color = 'var(--color-primary)' }: StatCardProps) {
  return (
    <div className="admin-stat-card" style={{ '--card-color': color } as any}>
      <div className="admin-stat-card__icon">{icon}</div>
      <div className="admin-stat-card__content">
        <h3 className="admin-stat-card__title">{title}</h3>
        <div className="admin-stat-card__value">{value}</div>
        {change && (
          <div className={`admin-stat-card__change ${change.isPositive ? 'positive' : 'negative'}`}>
            {change.isPositive ? '↑' : '↓'} {change.value}
          </div>
        )}
      </div>
    </div>
  );
});
