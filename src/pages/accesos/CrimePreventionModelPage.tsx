function CrimePreventionModelPage() {
  return (
    <div className="page">
      <h1>Modelo de Prevención de Delitos</h1>
      <p>
        Conoce nuestro modelo de prevención de delitos y cumplimiento. Este documento incluye las
        políticas y procedimientos adoptados por AMILAB.
      </p>
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        className="btn btn-primary"
        aria-label="Descargar Modelo de Prevención de Delitos"
      >
        {/* TODO: reemplazar por URL real al PDF */}
        Descargar documento
      </a>
    </div>
  );
}

export default CrimePreventionModelPage;
