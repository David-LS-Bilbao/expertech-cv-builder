// Template del bloque de Búsqueda de Empleo del editor.
// Responsabilidades:
// 1. centralizar el markup del bloque de ofertas de empleo.
// 2. inyectarlo dinámicamente en el editor, específicamente después del bloque de GitHub.
// 3. no contener lógica de negocio, solo markup e inserción DOM.

export function getJobSearchBlockTemplateMarkup() {
  return `
    <article class="editor-block" aria-labelledby="job-search-block-title">
      <div class="block-heading">
        <div class="block-heading-top">
          <h3 id="job-search-block-title" class="block-title">Búsqueda de Empleo</h3>
          <span id="job-search-status-badge" class="status-badge status-badge-muted">
            Desconectado
          </span>
        </div>
        <p class="block-text">
          Busca ofertas relevantes para tu perfil técnico. El listado mostrado usa datos simulados (Mock) en esta fase.
        </p>
      </div>

      <form
        id="job-search-form"
        class="github-form"
        aria-label="Formulario de búsqueda de ofertas de empleo"
      >
        <div class="form-grid">
          <div class="form-field">
            <label for="job-search-keyword">Palabra clave (obligatoria)</label>
            <input
              type="text"
              id="job-search-keyword"
              name="jobSearchKeyword"
              placeholder="Ej. React, Node, Frontend..."
              required
            />
          </div>
          <div class="form-field">
            <label for="job-search-location">Ubicación (opcional)</label>
            <input
              type="text"
              id="job-search-location"
              name="jobSearchLocation"
              placeholder="Ej. Remoto, Madrid..."
            />
          </div>
        </div>

        <p
          id="job-search-form-feedback"
          class="form-feedback"
          aria-live="polite"
          role="status"
          hidden
        ></p>

        <div class="profile-form-actions job-search-form-actions">
          <button type="submit" class="btn btn-primary" id="job-search-submit-btn">Buscar ofertas</button>
        </div>
      </form>

      <div id="job-search-empty-state" class="empty-state">
        <p class="empty-state-title">Aún no has buscado ofertas.</p>
        <p class="empty-state-text">
          Introduce una palabra clave para ver oportunidades profesionales (usa "sinresultados" o "error-test" para validar otros estados).
        </p>
      </div>

      <section
        id="job-search-results-section"
        class="github-repositories-section"
        aria-labelledby="job-search-results-title"
        hidden
      >
        <div class="block-heading">
          <div class="block-heading-top">
            <h4 id="job-search-results-title" class="block-title">
              Ofertas de empleo candidatas
            </h4>
            <span id="job-search-results-count" class="status-badge status-badge-muted">
              0 encontradas
            </span>
          </div>
        </div>

        <div
          id="job-search-results-list"
          class="github-repositories-list"
          aria-live="polite"
        ></div>
      </section>
    </article>
  `;
}

// Renderiza dinámicamente el bloque de empleo después del bloque HTML de GitHub
// para no modificar directamente index.html
export function renderJobSearchBlockTemplate() {
  const GITHUB_BLOCK_ROOT_SELECTOR = "#github-block-root";
  const targetElement = document.querySelector(GITHUB_BLOCK_ROOT_SELECTOR);

  if (!targetElement) {
    console.error(
      "No se pudo inyectar JobSearchBlockTemplate: no existe el contenedor de GitHub."
    );
    return null;
  }

  let jobRoot = document.querySelector("#job-search-root");

  if (!jobRoot) {
    targetElement.insertAdjacentHTML('afterend', '<div id="job-search-root"></div>');
    jobRoot = document.querySelector("#job-search-root");
  }

  jobRoot.innerHTML = getJobSearchBlockTemplateMarkup();

  return jobRoot;
}
