// Template específico para la versión exportable del CV.
// Responsabilidades:
// 1. centralizar el markup print-only fuera de index.html,
// 2. reutilizar el mismo estado del CV sin depender de la preview de pantalla,
// 3. dejar una estructura más limpia y profesional para impresión.

const PRINT_CV_ROOT_SELECTOR = "#print-cv-root";

export function getPrintCVTemplateMarkup() {
  return `
    <section class="print-cv" aria-label="Versión exportable del CV">
      <header class="print-cv-header">
        <h1 id="print-cv-full-name" class="print-cv-name">Nombre Apellido</h1>
        <p id="print-cv-headline" class="print-cv-headline">
          Titular profesional
        </p>
      </header>

      <section class="print-cv-section" aria-labelledby="print-cv-summary-title">
        <h2 id="print-cv-summary-title" class="print-cv-section-title">Resumen</h2>
        <p id="print-cv-summary" class="print-cv-summary">
          Resumen profesional del perfil.
        </p>
      </section>

      <section
        id="print-cv-projects-section"
        class="print-cv-section"
        aria-labelledby="print-cv-projects-title"
      >
        <h2 id="print-cv-projects-title" class="print-cv-section-title">
          Proyectos destacados
        </h2>

        <div id="print-cv-projects-list" class="print-cv-projects-list"></div>
      </section>
    </section>
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
