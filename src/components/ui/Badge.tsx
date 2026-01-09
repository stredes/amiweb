import './Badge.css';

interface BadgeProps {
  icon?: React.ReactNode;
  label: string;
  variant?: 'success' | 'info' | 'warning' | 'error' | 'default';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Badge({
  icon,
  label,
  variant = 'default',
  size = 'md',
  className = '',
}: BadgeProps) {
  return (
    <div className={`badge badge--${variant} badge--${size} ${className}`}>
      {icon && <span className="badge__icon">{icon}</span>}
      <span className="badge__label">{label}</span>
    </div>
  );
}

interface TrustBadgesProps {
  badges: Array<{
    icon: React.ReactNode;
    label: string;
    description?: string;
  }>;
  className?: string;
}

export function TrustBadges({ badges, className = '' }: TrustBadgesProps) {
  return (
    <div className={`trust-badges ${className}`}>
      {badges.map((badge, index) => (
        <div key={index} className="trust-badge">
          <div className="trust-badge__icon">{badge.icon}</div>
          <div className="trust-badge__content">
            <div className="trust-badge__label">{badge.label}</div>
            {badge.description && (
              <div className="trust-badge__description">{badge.description}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

interface PaymentMethodsProps {
  methods: Array<{ name: string; icon: React.ReactNode }>;
  className?: string;
}

export function PaymentMethods({ methods, className = '' }: PaymentMethodsProps) {
  return (
    <div className={`payment-methods ${className}`}>
      <h4 className="payment-methods__title">Métodos de Pago Aceptados</h4>
      <div className="payment-methods__grid">
        {methods.map((method, index) => (
          <div key={index} className="payment-method" title={method.name}>
            {method.icon}
          </div>
        ))}
      </div>
    </div>
  );
}
