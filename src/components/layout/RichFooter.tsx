import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiFacebook,
  FiInstagram,
  FiLinkedin,
  FiTwitter,
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
} from 'react-icons/fi';
import { toast } from '../ui/Toast';
import './RichFooter.css';

export function RichFooter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('¡Suscripción exitosa! Revisa tu email.');
      setEmail('');
    } catch (error) {
      toast.error('Error al suscribirse. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="rich-footer">
      <div className="rich-footer__container">
        {/* Newsletter Section */}
        <div className="rich-footer__newsletter">
          <h3>Suscríbete a nuestro Newsletter</h3>
          <p>Recibe las últimas novedades, ofertas y contenido exclusivo</p>
          <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
            <div className="newsletter-form__input-group">
              <FiMail className="newsletter-form__icon" aria-hidden="true" />
              <label className="sr-only" htmlFor="newsletter-email">
                Email para suscripción
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu email…"
                required
                disabled={isSubmitting}
                autoComplete="email"
                name="newsletterEmail"
              />
            </div>
            <button type="submit" disabled={isSubmitting}>
              <FiSend aria-hidden="true" />
              {isSubmitting ? 'Enviando…' : 'Suscribirse'}
            </button>
          </form>
        </div>

        {/* Main Footer Content */}
        <div className="rich-footer__content">
          {/* Company Info */}
          <div className="rich-footer__section">
            <h4>SP Dental</h4>
            <p className="rich-footer__description">
              Insumos, equipamiento y tecnología odontológica con soporte técnico especializado.
              Soluciones integrales para clínicas dentales con servicio preventivo y correctivo.
            </p>
            <div className="rich-footer__social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FiFacebook aria-hidden="true" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FiInstagram aria-hidden="true" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FiLinkedin aria-hidden="true" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FiTwitter aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="rich-footer__section">
            <h4>Enlaces Rápidos</h4>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/productos">Productos</Link></li>
              <li><Link to="/nosotros">Nosotros</Link></li>
              <li><Link to="/soporte">Soporte</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
            </ul>
          </div>

          {/* Products */}
          <div className="rich-footer__section">
            <h4>Categorías</h4>
            <ul>
              <li><Link to="/productos?categoryId=ESTETICA">Estética y Blanqueamiento</Link></li>
              <li><Link to="/productos?categoryId=RESTAURADORA">Odontología Restauradora</Link></li>
              <li><Link to="/productos?categoryId=CIRUGIA">Cirugía e Implantología</Link></li>
              <li><Link to="/productos?categoryId=ENDODONCIA">Endodoncia</Link></li>
              <li><Link to="/productos?categoryId=IMAGENOLOGIA">Imagenología y Equipos</Link></li>
              <li><Link to="/productos?categoryId=CONSUMIBLES">Consumibles Clínicos</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="rich-footer__section">
            <h4>Contacto</h4>
            <ul className="rich-footer__contact">
              <li>
                <FiMapPin aria-hidden="true" />
                <span>Santiago, Chile</span>
              </li>
              <li>
                <FiPhone aria-hidden="true" />
                <a href="tel:+56223456789">+56 2 2345 6789</a>
              </li>
              <li>
                <FiMail aria-hidden="true" />
                <a href="mailto:contacto@spdental.cl">contacto@spdental.cl</a>
              </li>
            </ul>
            <div className="rich-footer__hours">
              <strong>Horario de Atención:</strong>
              <p>Lunes a Viernes: 8:30 AM - 6:00 PM</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="rich-footer__bottom">
          <div>
            <div className="rich-footer__legal">
              <p>&copy; {currentYear} SP Dental. Todos los derechos reservados.</p>
              <div className="rich-footer__legal-links">
                <Link to="/privacidad">Política de Privacidad</Link>
                <span>•</span>
                <Link to="/terminos">Términos y Condiciones</Link>
                <span>•</span>
                <Link to="/cookies">Cookies</Link>
              </div>
            </div>
            <div className="rich-footer__payments">
              <span>Representaciones:</span>
              <div className="rich-footer__payment-icons">
                <span style={{fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.85)'}}>FGM Dental Group • Wisedent • Dimed • SMI • Acteon</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
