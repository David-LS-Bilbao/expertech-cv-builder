// Template del bloque GitHub del editor.
// Responsabilidades de este módulo:
// 1. centralizar el markup del bloque GitHub fuera de index.html,
// 2. mantener una única fuente de verdad del HTML base del bloque,
// 3. permitir que GitHubIntegration.js siga usando los mismos ids/selectors.
//
// Importante:
// - aquí no hay lógica de negocio,
// - aquí no se toca localStorage,
// - aquí no se registran eventos,
// - este archivo solo devuelve e inserta HTML.

const GITHUB_BLOCK_ROOT_SELECTOR = "#github-block-root";

// Devuelve el markup completo del bloque GitHub.
// Mantiene exactamente los ids y clases que GitHubIntegration.js ya espera.
export function getGitHubBlockTemplateMarkup() {
  return `
    <article class="editor-block" aria-labelledby="github-block-title">
      <div class="block-heading">
        <div class="block-heading-top">
          <h3 id="github-block-title" class="block-title">Conexión GitHub</h3>
          <span id="github-status-badge" class="status-badge status-badge-muted">
            Sin conectar
          </span>
        </div>
        <p class="block-text">
          Conecta un perfil público de GitHub para completar tu información y
          seleccionar repositorios que quieras destacar.
        </p>
      </div>

      <!-- Formulario independiente para la búsqueda en GitHub.
           Mantiene el flujo manual del perfil como base segura si la API falla. -->
      <form
        id="github-form"
        class="github-form"
        aria-label="Formulario de búsqueda de perfil de GitHub"
      >
        <div class="form-grid">
          <div class="form-field">
            <label for="github-username-search">Usuario de GitHub</label>
            <input
              type="text"
              id="github-username-search"
              name="githubUsernameSearch"
              placeholder="Ej. David-LS-Bilbao"
              autocomplete="username"
            />
          </div>
        </div>

        <p
          id="github-form-feedback"
          class="form-feedback"
          aria-live="polite"
          role="status"
        ></p>

        <div class="profile-form-actions github-form-actions">
          <button type="submit" class="btn btn-primary">Buscar perfil</button>
        </div>
      </form>

      <div id="github-empty-state" class="empty-state">
        <p class="empty-state-title">Aún no has cargado un perfil de GitHub.</p>
        <p class="empty-state-text">
          Introduce un usuario público para traer datos del perfil y revisar
          repositorios candidatos para tu CV.
        </p>
      </div>

      <section
        id="github-profile-result"
        class="github-profile-result"
        aria-labelledby="github-profile-result-title"
        hidden
      >
        <h4 id="github-profile-result-title" class="preview-section-title">
          Perfil público encontrado
        </h4>

        <article class="preview-card github-profile-card">
          <header class="preview-card-header">
            <img
              id="github-profile-avatar"
              class="github-profile-avatar"
              src=""
              alt=""
            />
            <div class="github-profile-meta">
              <p id="github-profile-name" class="preview-name">Nombre GitHub</p>
              <p id="github-profile-login" class="preview-role">@login</p>
            </div>
          </header>

          <div class="preview-card-body">
            <p id="github-profile-bio">
              Biografía pública del perfil de GitHub.
            </p>
            <p>
              <a
                id="github-profile-link"
                href="#"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver perfil en GitHub
              </a>
            </p>
          </div>
        </article>
      </section>

      <section
        id="github-repositories-section"
        class="github-repositories-section"
        aria-labelledby="github-repositories-title"
        hidden
      >
        <div class="block-heading">
          <div class="block-heading-top">
            <h4 id="github-repositories-title" class="block-title">
              Repositorios candidatos
            </h4>
            <span id="github-repositories-count" class="status-badge status-badge-muted">
              0 encontrados
            </span>
          </div>
          <p class="block-text">
            Selecciona manualmente los repositorios que quieras destacar en el CV.
          </p>
        </div>

        <div
          id="github-repositories-list"
          class="github-repositories-list"
          aria-live="polite"
        ></div>
      </section>

      <section
        id="github-selected-repositories-section"
        class="github-selected-repositories-section"
        aria-labelledby="github-selected-repositories-title"
        hidden
      >
        <div class="block-heading">
          <div class="block-heading-top">
            <h4 id="github-selected-repositories-title" class="block-title">
              Repositorios destacados seleccionados
            </h4>
            <span
              id="github-selected-repositories-count"
              class="status-badge status-badge-muted"
            >
              0 seleccionados
            </span>
          </div>
          <p class="block-text">
            Esta selección se usa para construir la sección de proyectos del CV.
          </p>
        </div>

        <div
          id="github-selected-repositories-list"
          class="github-selected-repositories-list"
          aria-live="polite"
        ></div>
      </section>

      <p class="helper-note">
        Mantén una selección breve y relevante para que el CV sea más claro al primer vistazo.
      </p>
    </article>
  `;
}

// Renderiza el template dentro del root del bloque GitHub.
// Devuelve el nodo root si todo va bien.
export function renderGitHubBlockTemplate(target = GITHUB_BLOCK_ROOT_SELECTOR) {
  const targetElement =
    typeof target === "string" ? document.querySelector(target) : target;

  if (!targetElement) {
    console.error(
      "No se pudo renderizar GitHubBlockTemplate: no existe el contenedor root."
    );
    return null;
  }

  targetElement.innerHTML = getGitHubBlockTemplateMarkup();

  return targetElement;
}
