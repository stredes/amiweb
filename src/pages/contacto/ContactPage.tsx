import ContactForm from '../../components/contact/ContactForm';
import LocationMap from '../../components/contact/LocationMap';

function ContactPage() {
  return (
    <div className="page">
      <header className="page__header">
        <h1>Contacto</h1>
        <p>¿Necesitas más información? Déjanos un mensaje y te responderemos a la brevedad.</p>
      </header>

      <div className="grid two">
        <div className="card">
          <h2>Datos de AMILAB</h2>
          <p>Dirección: Canadá 9450, La Florida, Santiago, Chile.</p>
          <p>Teléfono: +562 22878707.</p>
          <p>
            Correo: <a href="mailto:amilab@amilab.cl">amilab@amilab.cl</a>
          </p>
          <LocationMap />
        </div>
        <div className="card">
          <h2>Déjenos un mensaje</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
