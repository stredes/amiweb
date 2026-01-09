function MaintenancePlans() {
  return (
    <section>
      <h2>Planes de mantenimiento</h2>
      <p className="muted">
        Selecciona el plan que mejor se adapte a tu laboratorio. Ajustamos la cobertura según criticidad y volumen.
      </p>
      <div className="support-plans-grid">
        <div className="card support-plan-card">
          <h3>Plan Esencial</h3>
          <ul>
            <li>Checklist anual de equipos críticos.</li>
            <li>Soporte remoto y diagnóstico inicial.</li>
            <li>Recomendaciones de continuidad.</li>
          </ul>
        </div>
        <div className="card support-plan-card support-plan-card--featured">
          <h3>Plan Continuidad</h3>
          <ul>
            <li>Visitas preventivas programadas.</li>
            <li>Prioridad de agenda y repuestos.</li>
            <li>Informes técnicos y seguimiento.</li>
          </ul>
        </div>
        <div className="card support-plan-card">
          <h3>Plan Total</h3>
          <ul>
            <li>Soporte integral multiárea.</li>
            <li>Monitoreo y recomendaciones proactivas.</li>
            <li>Capacitación a equipos de laboratorio.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default MaintenancePlans;
