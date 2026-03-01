import { FadeIn } from '../../components/ui/FadeIn';

function CrimePreventionModelPage() {
  return (
    <div className="page">
      <FadeIn direction="up">
        <h1>Modelo de Prevención de Delitos</h1>
      <p>
        Conoce nuestro modelo de prevención de delitos y cumplimiento. Este documento incluye las
        políticas y procedimientos adoptados por AMILAB.
      </p>
      </FadeIn>
      <FadeIn direction="up" delay={0.2}>
        <button
          type="button"
          className="btn btn-primary"
          aria-label="Descarga disponible próximamente"
          disabled
        >
          Descarga disponible próximamente
        </button>
      </FadeIn>
    </div>
  );
}

export default CrimePreventionModelPage;
