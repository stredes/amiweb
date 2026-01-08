import TextType from '../../components/ui/TextType';

function AboutPage() {
  return (
    <div className="page">
      <h1>Nosotros</h1>
      <section>
        <TextType
          as="h2"
          text="Quiénes somos"
          typingSpeed={60}
          pauseDuration={800}
          showCursor={false}
          loop={false}
          startOnVisible={true}
        />
        <p>
          AMILAB es un equipo especializado en soluciones para laboratorios clínicos. Trabajamos con
          foco en relaciones de largo plazo, acompañando la operación diaria con soporte técnico y
          asesoría especializada.
        </p>
      </section>
      <section>
        <TextType
          as="h2"
          text="Qué hacemos"
          typingSpeed={60}
          pauseDuration={800}
          showCursor={false}
          loop={false}
          startOnVisible={true}
        />
        <p>
          Proveemos equipamiento, reactivos e insumos, además de servicio técnico propio para asegurar
          continuidad operacional. Diseñamos soluciones integrales para laboratorios clínicos,
          alineadas con estándares de calidad y trazabilidad.
        </p>
      </section>
      <section>
        <TextType
          as="h2"
          text="Representaciones"
          typingSpeed={60}
          pauseDuration={800}
          showCursor={false}
          loop={false}
          startOnVisible={true}
        />
        <p>Marcas y socios (mock):</p>
        <ul>
          <li>Becton Dickinson</li>
          <li>Olympus / Beckman (analítica de química)</li>
          <li>Mindray (hematología y equipos clínicos)</li>
          <li>Britania (microbiología)</li>
        </ul>
      </section>
      <section>
        <TextType
          as="h2"
          text="Ventajas competitivas"
          typingSpeed={60}
          pauseDuration={800}
          showCursor={false}
          loop={false}
          startOnVisible={true}
        />
        <ul>
          <li>Experiencia demostrable en laboratorios clínicos.</li>
          <li>Soporte técnico propio con repuestos y mantenimiento preventivo.</li>
          <li>Cobertura nacional con respuesta ágil.</li>
          <li>Capacitación constante a usuarios y equipos técnicos.</li>
        </ul>
      </section>
    </div>
  );
}

export default AboutPage;
