// Template específico para la versión exportable del CV.
// Responsabilidades:
// 1. centralizar el markup print-only fuera de index.html,
// 2. reutilizar el mismo estado del CV sin depender de la preview de pantalla,
// 3. dejar una estructura más limpia y profesional para impresión.

const PRINT_CV_ROOT_SELECTOR = "#print-cv-root";

export function getPrintCVTemplateMarkup() {
  return `
    <article class="print-cv" aria-label="Curriculum Vitae Profesional">
      <div class="print-cv-body">
        <aside class="print-cv-sidebar">
          <header class="print-cv-sidebar-header">
            <div class="print-cv-avatar-container">
              <!-- En la versión web esto puede ser la imagen de GitHub, en print un placeholder limpio si no hay src -->
              <img src="" alt="Foto de perfil" id="print-cv-avatar" class="print-cv-avatar" style="display:none;" />
              <div id="print-cv-avatar-placeholder" class="print-cv-avatar-placeholder">Foto</div>
            </div>
            <h1 id="print-cv-full-name" class="print-cv-name">Nombre Apellido</h1>
            <h2 id="print-cv-headline" class="print-cv-headline">Titular profesional</h2>
          </header>

          <div class="print-cv-sidebar-content">
            <section class="print-cv-section">
              <h3 class="print-cv-section-title">Detalles Personales</h3>
              <div id="print-cv-contact" class="print-cv-contact"></div>
            </section>

            <section class="print-cv-section" aria-labelledby="print-cv-skills-title">
              <h3 id="print-cv-skills-title" class="print-cv-section-title">Destrezas</h3>
              <div id="print-cv-skills" class="print-cv-skills">
                <!-- El stack se inyectará aquí -->
              </div>
            </section>

            <section class="print-cv-qr-section">
              <div class="print-cv-qr-container">
                <img
                  id="print-cv-qr-image"
                  class="print-cv-qr-image"
                  src=""
                  alt="Código QR del portafolio"
                />
                <div id="print-cv-qr-placeholder" class="print-cv-qr-placeholder">QR</div>
                <p class="print-cv-qr-caption">Mi portafolio digital</p>
                <a
                  id="print-cv-portfolio-url"
                  class="print-cv-portfolio-url"
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.io
                </a>
              </div>
            </section>
          </div>
        </aside>

        <main class="print-cv-main">
          <section class="print-cv-section print-cv-summary-section" aria-labelledby="print-cv-summary-title">
            <h2 id="print-cv-summary-title" class="print-cv-main-title">Perfil Profesional</h2>
            <p id="print-cv-summary" class="print-cv-summary">
              Resumen profesional del perfil.
            </p>
          </section>

          <section
            id="print-cv-projects-section"
            class="print-cv-section"
            aria-labelledby="print-cv-projects-title"
          >
            <h2 id="print-cv-projects-title" class="print-cv-main-title">
              Experiencia Laboral y Proyectos
            </h2>
            <div id="print-cv-projects-list" class="print-cv-projects-list"></div>
          </section>
        </main>
      </div>
    </article>
  `;
}

export function renderPrintCVTemplate(target = PRINT_CV_ROOT_SELECTOR) {
  const targetElement =
    typeof target === "string" ? document.querySelector(target) : target;

  if (!targetElement) {
    console.error(
      "No se pudo renderizar PrintCVTemplate: no existe el contenedor root."
    );
    return null;
  }

  targetElement.innerHTML = getPrintCVTemplateMarkup();

  return targetElement;
}
