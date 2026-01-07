import { Vendor, SupportContact } from '../../features/auth/types';

interface ContactCardProps {
  contact: Vendor | SupportContact;
  type: 'vendor' | 'support';
}

export function ContactCard({ contact, type }: ContactCardProps) {
  const isVendor = type === 'vendor';
  const vendor = isVendor ? (contact as Vendor) : null;
  const support = !isVendor ? (contact as SupportContact) : null;

  return (
    <div className="contact-card">
      {vendor?.avatar && (
        <div className="contact-card__avatar">
          {vendor.avatar}
        </div>
      )}
      
      <div className="contact-card__info">
        <h3>{contact.name}</h3>
        {support && (
          <p className="contact-card__department">{support.department}</p>
        )}
        {isVendor && (
          <span className="badge">Tu Vendedor</span>
        )}
      </div>

      <div className="contact-card__details">
        <div className="contact-item">
          <span className="contact-icon">📧</span>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </div>
        <div className="contact-item">
          <span className="contact-icon">📱</span>
          <a href={`tel:${contact.phone}`}>{contact.phone}</a>
        </div>
      </div>

      {support?.available && (
        <div className="contact-status">
          <span className="status-indicator status-online"></span>
          <span>Disponible</span>
        </div>
      )}
    </div>
  );
}
