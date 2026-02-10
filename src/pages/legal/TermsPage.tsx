import './LegalPage.css';

function TermsPage() {
  return (
    <div className="page legal-page">
      <header className="page__header">
        <h1>Términos y Condiciones</h1>
        <p className="legal-page__meta">Última actualización: 27 de enero de 2026</p>
      </header>

      <section>
        <h2>1. Uso del sitio</h2>
        <p>
          Al utilizar este sitio aceptas estos términos. Si no estás de acuerdo, debes abstenerte de
          usar la plataforma. La información publicada puede cambiar sin previo aviso.
        </p>
      </section>

      <section>
        <h2>2. Cotizaciones y compras</h2>
        <p>
          Las cotizaciones están sujetas a disponibilidad, validación técnica y aprobación comercial.
          Los precios finales pueden variar por condiciones logísticas, impuestos o acuerdos
          específicos con cada cliente.
        </p>
      </section>

      <section>
        <h2>3. Propiedad intelectual</h2>
        <p>
          El contenido, marca y material gráfico son propiedad de SP Dental o de sus representadas. No
          se permite la reproducción total o parcial sin autorización previa por escrito.
        </p>
      </section>

      <section>
        <h2>4. Garantías y soporte</h2>
        <p>
          La garantía de productos y servicios se rige por los términos del fabricante y los acuerdos
          comerciales vigentes. El soporte técnico se brinda según los niveles de servicio contratados.
        </p>
      </section>

      <section>
        <h2>5. Limitación de responsabilidad</h2>
        <p>
          SP Dental no será responsable por daños indirectos derivados del uso del sitio o por
          interrupciones fuera de su control. Nuestra responsabilidad se limita al marco legal
          aplicable y a los contratos específicos con clientes.
        </p>
      </section>

      <section>
        <h2>6. Contacto</h2>
        <p>
          Para consultas sobre estos términos, escribe a <strong>contacto@spdental.cl</strong> o llama al
          <strong> +56 2 2345 6789</strong>.
        </p>
      </section>
    </div>
  );
}

export default TermsPage;
