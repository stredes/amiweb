import './LegalPage.css';

function PrivacyPolicyPage() {
  return (
    <div className="page legal-page">
      <header className="page__header">
        <h1>Política de Privacidad</h1>
        <p className="legal-page__meta">Última actualización: 27 de enero de 2026</p>
      </header>

      <section>
        <h2>1. Información que recopilamos</h2>
        <p>
          Recopilamos datos de contacto y facturación cuando solicitas cotizaciones, realizas compras
          o interactúas con nuestros canales de soporte. También registramos datos técnicos básicos
          (por ejemplo, navegador, dispositivo y página de origen) para mejorar la experiencia de
          uso y la seguridad de la plataforma.
        </p>
      </section>

      <section>
        <h2>2. Uso de la información</h2>
        <ul>
          <li>Gestionar solicitudes de productos, cotizaciones y órdenes.</li>
          <li>Proveer soporte técnico y seguimiento post venta.</li>
          <li>Mejorar el rendimiento, la seguridad y el contenido del sitio.</li>
          <li>Enviar comunicaciones operacionales relevantes, con opción de baja.</li>
        </ul>
      </section>

      <section>
        <h2>3. Compartición con terceros</h2>
        <p>
          Compartimos información únicamente con proveedores necesarios para operar el servicio
          (plataformas de pagos, logística, hosting o correo), bajo acuerdos de confidencialidad y
          solo con los datos estrictamente necesarios. No vendemos datos personales.
        </p>
      </section>

      <section>
        <h2>4. Seguridad</h2>
        <p>
          Aplicamos controles técnicos y organizativos para proteger la información. Sin embargo,
          ningún sistema es infalible. Te recomendamos mantener tus credenciales seguras y
          notificarnos ante cualquier sospecha de uso indebido.
        </p>
      </section>

      <section>
        <h2>5. Conservación de datos</h2>
        <p>
          Conservamos los datos mientras sea necesario para cumplir obligaciones legales, contractuales
          o de soporte. Luego, se eliminan o anonimizan conforme a la normativa aplicable.
        </p>
      </section>

      <section>
        <h2>6. Tus derechos</h2>
        <p>
          Puedes solicitar acceso, corrección o eliminación de tus datos. Para ello, contáctanos en
          <strong> contacto@spdental.cl </strong> o al teléfono <strong>+56 2 2345 6789</strong>.
        </p>
      </section>
    </div>
  );
}

export default PrivacyPolicyPage;
