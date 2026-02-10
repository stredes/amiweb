import './LegalPage.css';

function CookiesPage() {
  return (
    <div className="page legal-page">
      <header className="page__header">
        <h1>Política de Cookies</h1>
        <p className="legal-page__meta">Última actualización: 27 de enero de 2026</p>
      </header>

      <section>
        <h2>1. ¿Qué son las cookies?</h2>
        <p>
          Las cookies son pequeños archivos que se almacenan en tu dispositivo para recordar
          preferencias, mejorar la navegación y ayudar a comprender el uso del sitio.
        </p>
      </section>

      <section>
        <h2>2. Tipos de cookies que usamos</h2>
        <ul>
          <li><strong>Esenciales:</strong> necesarias para funciones básicas y seguridad.</li>
          <li><strong>Funcionales:</strong> recuerdan configuraciones como idioma o tema.</li>
          <li><strong>Analíticas:</strong> ayudan a mejorar la experiencia del usuario.</li>
        </ul>
      </section>

      <section>
        <h2>3. Gestión de cookies</h2>
        <p>
          Puedes aceptar, rechazar o eliminar cookies desde la configuración de tu navegador.
          Ten en cuenta que bloquear cookies esenciales puede afectar el funcionamiento del sitio.
        </p>
      </section>

      <section>
        <h2>4. Actualizaciones</h2>
        <p>
          Esta política puede actualizarse para reflejar cambios legales o técnicos. Te recomendamos
          revisarla periódicamente.
        </p>
      </section>
    </div>
  );
}

export default CookiesPage;
