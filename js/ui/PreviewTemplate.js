// Template del bloque de preview del CV.
// Responsabilidades de este módulo:
// 1. centralizar el markup de la preview fuera de index.html,
// 2. mantener una única fuente de verdad del HTML estático del panel preview,
// 3. permitir que la UI renderice el bloque antes de que PreviewRenderer.js
//    pinte datos reales del estado.
//
// Importante:
// - aquí no hay lógica de negocio,
// - aquí no se toca localStorage,
// - aquí no se registran eventos,
// - este archivo solo devuelve e inserta HTML.

const PREVIEW_ROOT_SELECTOR = "#preview-panel-root";

// Devuelve el markup interno completo de la preview.
// Ojo:
// - no incluye el contenedor root externo,
// - mantiene exactamente los ids que PreviewRenderer.js ya usa,
// - deja el bloque listo para que el renderer pinte perfil y proyectos.
export function getPreviewTemplateMarkup() {
  return `
    <aside class="preview-panel" aria-labelledby="preview-panel-title">
      <div class="panel-heading">
        <p class="section-kicker">Preview</p>
        <h2 id="preview-panel-title" class="section-title">Vista previa del CV</h2>
        <p class="section-text">
          Revisa cómo verá tu perfil una persona reclutadora en tiempo real.
        </p>
      </div>

      <article class="preview-card">
        <header class="preview-card-header">
          <p id="preview-full-name" class="preview-name">Nombre Apellido</p>
          <p id="preview-headline" class="preview-role">Frontend Developer</p>
        </header>

        <div class="preview-card-body">
          <section class="preview-section" aria-labelledby="preview-summary-title">
            <h3 id="preview-summary-title" class="preview-section-title">Resumen</h3>
            <p id="preview-summary">
              Perfil profesional orientado a producto, ejecución técnica y
              comunicación clara del valor aportado.
            </p>
          </section>

          <section class="preview-section" aria-labelledby="preview-skills-title">
            <h3 id="preview-skills-title" class="preview-section-title">Skills clave</h3>
            <ul class="preview-list">
              <li>HTML5 y CSS3</li>
              <li>JavaScript</li>
              <li>Responsive design</li>
              <li>Git y GitHub</li>
            </ul>
          </section>

          <!-- Bloque de proyectos de la preview.
               PreviewRenderer.js lo usa para pintar proyectos reales desde cvState.projects. -->
          <section
            class="preview-section preview-projects-section"
            aria-labelledby="preview-projects-title"
          >
            <div class="preview-section-heading">
              <h3 id="preview-projects-title" class="preview-section-title">
                Proyectos destacados
              </h3>
              <p class="preview-section-text">
                Selección de proyectos para mostrar impacto técnico y resultados.
              </p>
            </div>

            <div
              id="preview-projects-empty-state"
              class="empty-state empty-state-preview-projects"
              hidden
            >
              <p class="empty-state-title">
                Todavía no hay proyectos destacados.
              </p>
              <p class="empty-state-text">
                Cuando selecciones repositorios, aparecerán aquí con su descripción,
                stack y enlaces.
              </p>
            </div>

            <div
              id="preview-projects-list"
              class="preview-projects-list"
              aria-live="polite"
            ></div>
          </section>

          <div
            id="preview-empty-state"
            class="empty-state empty-state-preview"
          >
            <p class="empty-state-title">
              Empieza a escribir para previsualizar tu perfil.
            </p>
            <p class="empty-state-text">
              La vista previa se actualizará en tiempo real con nombre, titular y resumen.
            </p>
          </div>
        </div>
      </article>
    </aside>
  `;
}

// Renderiza el template dentro del root de preview.
// Devuelve el nodo root si todo va bien.
export function renderPreviewTemplate(target = PREVIEW_ROOT_SELECTOR) {
  const targetElement =
    typeof target === "string" ? document.querySelector(target) : target;

  if (!targetElement) {
    console.error(
      "No se pudo renderizar PreviewTemplate: no existe el contenedor root."
    );
    return null;
  }

  targetElement.innerHTML = getPreviewTemplateMarkup();

  return targetElement;
}
