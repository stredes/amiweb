import ContactForm from '../../components/contact/ContactForm';
import LocationMap from '../../components/contact/LocationMap';
import { FadeIn } from '../../components/ui/FadeIn';

function ContactPage() {
  return (
    <div className="page">
      <FadeIn direction="up">
        <header className="page__header">
          <h1>Contacto</h1>
          <p>¿Necesitas más información? Déjanos un mensaje y te responderemos a la brevedad.</p>
        </header>
      </FadeIn>

      <FadeIn direction="up" delay={0.2}>
        <div className="grid two">
        <div className="card">
          <h2>Dónde encontrarnos</h2>
          <p><strong>Dirección:</strong><br />Canadá 9450, La Florida, Santiago, Chile.</p>
          <p><strong>Teléfono:</strong><br />+562 22878707</p>
          <p>
            <strong>Correo:</strong><br />
            <a href="mailto:amilab@amilab.cl">amilab@amilab.cl</a>
          </p>
          <LocationMap />
        </div>
        <div className="card">
          <h2>Déjenos un mensaje</h2>
          <ContactForm />
        </div>
        </div>
      </FadeIn>
    </div>
  );
}

export default ContactPage;
