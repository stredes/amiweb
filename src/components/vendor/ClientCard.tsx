import { User } from '../../features/auth/types';

interface ClientCardProps {
  client: Omit<User, 'password'>;
}

export function ClientCard({ client }: ClientCardProps) {
  return (
    <div className="client-card">
      <div className="client-card__header">
        <div className="client-avatar">
          {client.name.charAt(0).toUpperCase()}
        </div>
        <div className="client-info">
          <h3>{client.name}</h3>
          {client.company && <p className="muted">{client.company}</p>}
        </div>
      </div>
      
      <div className="client-card__details">
        <div className="client-detail-item">
          <span className="client-detail-icon">📧</span>
          <a href={`mailto:${client.email}`}>{client.email}</a>
        </div>
        {client.phone && (
          <div className="client-detail-item">
            <span className="client-detail-icon">📱</span>
            <a href={`tel:${client.phone}`}>{client.phone}</a>
          </div>
        )}
      </div>

      <div className="client-card__actions">
        <button className="btn btn-primary btn-sm">
          Ver Pedidos
        </button>
        <button className="btn btn-secondary btn-sm">
          Contactar
        </button>
      </div>
    </div>
  );
}
