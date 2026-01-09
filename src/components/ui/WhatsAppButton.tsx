import { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import './WhatsAppButton.css';

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
  position?: 'bottom-right' | 'bottom-left';
}

export function WhatsAppButton({
  phoneNumber,
  message = 'Hola! Tengo una consulta',
  position = 'bottom-right',
}: WhatsAppButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(url, '_blank');
  };

  return (
    <div className={`whatsapp-button whatsapp-button--${position}`}>
      {showTooltip && (
        <div className="whatsapp-button__tooltip">
          <button
            className="whatsapp-button__tooltip-close"
            onClick={() => setShowTooltip(false)}
            aria-label="Close"
          >
            <FiX />
          </button>
          <p className="whatsapp-button__tooltip-text">
            ¿Necesitas ayuda? Chatea con nosotros en WhatsApp
          </p>
        </div>
      )}
      
      <button
        className="whatsapp-button__btn"
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp className="whatsapp-button__icon" />
      </button>
    </div>
  );
}
