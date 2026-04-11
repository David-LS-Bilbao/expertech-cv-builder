// Renderizador de la preview del CV.
// Responsabilidades de este módulo:
// 1. renderizar el bloque base de preview cuando exista un root-template,
// 2. localizar los nodos principales del preview en el DOM,
// 3. pintar nombre, titular y resumen a partir del estado,
// 4. mostrar u ocultar el empty-state general del perfil,
// 5. renderizar los proyectos destacados desde cvState.projects,
// 6. permitir re-render cuando cambie el estado del CV.
//
// Importante:
// - no guarda nada en localStorage,
// - no lee directamente del formulario,
// - no consulta GitHub por su cuenta,
// - solo refleja en la UI datos ya existentes del estado,
// - mantiene compatibilidad con el HTML antiguo mientras hacemos la transición.

import { createPortfolioCV } from "../models/PortfolioCV.js";
import { renderPreviewTemplate } from "./PreviewTemplate.js";

// Textos fallback por si algún campo todavía está vacío.
// Así evitamos que la preview quede rota o con huecos raros.
const PREVIEW_FALLBACKS = {
  fullName: "Nombre Apellido",
  headline: "Titular profesional",
  summary:
    "Añade un resumen profesional para ver aquí una vista previa recruiter-friendly.",
  projectName: "Proyecto sin nombre",
  projectDescription:
    "Este proyecto todavía no tiene descripción visible en el CV.",
};

// Crea el renderizador de preview.
// Recibe selectores configurables por si en el futuro cambia el HTML.
export function createPreviewRenderer({
  previewRootSelector = "#preview-panel-root",
  fullNameSelector = "#preview-full-name",
  headlineSelector = "#preview-headline",
  summarySelector = "#preview-summary",
  emptyStateSelector = "#preview-empty-state",
  projectsListSelector = "#preview-projects-list",
  projectsEmptyStateSelector = "#preview-projects-empty-state",
  initialCVState,
} = {}) {
  // Normalizamos el estado para trabajar siempre con la misma estructura.
  let currentCVState = createPortfolioCV(initialCVState);

  // Si existe el root nuevo del template, lo renderizamos.
  // Si todavía no existe, mantenemos compatibilidad con el HTML anterior.
  const previewRootElement = document.querySelector(previewRootSelector);

  if (previewRootElement) {
    renderPreviewTemplate(previewRootElement);
  }

  // Buscamos los nodos principales de la preview.
  const fullNameElement = document.querySelector(fullNameSelector);
  const headlineElement = document.querySelector(headlineSelector);
  const summaryElement = document.querySelector(summarySelector);
  const emptyStateElement = document.querySelector(emptyStateSelector);

  // Buscamos los nodos específicos del bloque de proyectos.
  const projectsListElement = document.querySelector(projectsListSelector);
  const projectsEmptyStateElement = document.querySelector(
    projectsEmptyStateSelector
  );

  // Los tres nodos principales del perfil sí son obligatorios.
  if (!fullNameElement || !headlineElement || !summaryElement) {
    console.error("No se pudo inicializar PreviewRenderer: faltan nodos del preview.");
    return null;
  }

  // Devuelve texto útil para preview:
  // - si hay valor, usa el valor real
  // - si no, usa el fallback visual
  function getDisplayValue(value, fallback) {
    const normalizedValue = String(value ?? "").trim();
    return normalizedValue || fallback;
  }

  // Indica si el perfil tiene contenido real suficiente
  // como para considerar que la preview general ya no está vacía.
  // Regla MVP:
  // si hay al menos uno de estos campos con texto, ocultamos la ayuda.
  function hasPreviewContent(profileData = {}) {
    const fullName = String(profileData.fullName ?? "").trim();
    const headline = String(profileData.headline ?? "").trim();
    const summary = String(profileData.summary ?? "").trim();

    return Boolean(fullName || headline || summary);
  }

  // Muestra u oculta el empty-state general del preview.
  // Si no existe el nodo en el HTML, no rompemos la app.
  function renderEmptyState(profileData = {}) {
    if (!emptyStateElement) {
      return;
    }

    const shouldShowEmptyState = !hasPreviewContent(profileData);

    // Usamos la propiedad hidden porque es simple, semántica y suficiente para este MVP.
    emptyStateElement.hidden = !shouldShowEmptyState;
  }

  // Pinta el bloque de perfil en la preview.
  function renderProfile(profileData = {}) {
    fullNameElement.textContent = getDisplayValue(
      profileData.fullName,
      PREVIEW_FALLBACKS.fullName
    );

    headlineElement.textContent = getDisplayValue(
      profileData.headline,
      PREVIEW_FALLBACKS.headline
    );

    summaryElement.textContent = getDisplayValue(
      profileData.summary,
      PREVIEW_FALLBACKS.summary
    );

    renderEmptyState(profileData);
  }

  // Limpia por completo el contenedor de proyectos antes de volver a pintarlo.
  function clearProjectsList() {
    if (!projectsListElement) {
      return;
    }

    projectsListElement.innerHTML = "";
  }

  // Determina si un proyecto tiene contenido suficiente para ser visible.
  // No exigimos todos los campos; basta con que tenga algún dato útil.
  function isRenderableProject(projectData = {}) {
    const name = String(projectData.name ?? "").trim();
    const description = String(projectData.description ?? "").trim();
    const repoUrl = String(projectData.repoUrl ?? "").trim();
    const demoUrl = String(projectData.demoUrl ?? "").trim();
    const stack = Array.isArray(projectData.stack) ? projectData.stack : [];

    return Boolean(name || description || repoUrl || demoUrl || stack.length > 0);
  }

  // Devuelve proyectos útiles para la preview.
  // Regla de esta feature:
  // - si hay proyectos featured válidos, mostramos esos
  // - si no, mostramos todos los proyectos válidos
  function getVisibleProjects(projects = []) {
    if (!Array.isArray(projects)) {
      return [];
    }

    const renderableProjects = projects.filter((project) =>
      isRenderableProject(project)
    );

    const featuredProjects = renderableProjects.filter(
      (project) => Boolean(project.featured)
    );

    return featuredProjects.length > 0 ? featuredProjects : renderableProjects;
  }

  // Crea una lista visual compacta del stack del proyecto.
  // Si no hay stack, devolvemos null y no pintamos ese bloque.
  function createProjectStack(projectData = {}) {
    const stack = Array.isArray(projectData.stack) ? projectData.stack : [];
    const normalizedStack = stack
      .map((item) => String(item ?? "").trim())
      .filter(Boolean);

    if (normalizedStack.length === 0) {
      return null;
    }

    const stackListElement = document.createElement("ul");
    stackListElement.className = "preview-project-stack";
    stackListElement.setAttribute("aria-label", "Stack del proyecto");

    normalizedStack.forEach((tech) => {
      const stackItemElement = document.createElement("li");
      stackItemElement.className = "preview-project-stack-item";
      stackItemElement.textContent = tech;
      stackListElement.appendChild(stackItemElement);
    });

    return stackListElement;
  }

  // Crea los enlaces visibles del proyecto.
  // Solo pintamos enlaces que realmente existan.
  function createProjectLinks(projectData = {}) {
    const repoUrl = String(projectData.repoUrl ?? "").trim();
    const demoUrl = String(projectData.demoUrl ?? "").trim();

    if (!repoUrl && !demoUrl) {
      return null;
    }

    const linksWrapperElement = document.createElement("div");
    linksWrapperElement.className = "preview-project-links";

    if (repoUrl) {
      const repoLinkElement = document.createElement("a");
      repoLinkElement.className = "preview-project-link";
      repoLinkElement.href = repoUrl;
      repoLinkElement.target = "_blank";
      repoLinkElement.rel = "noopener noreferrer";
      repoLinkElement.textContent = "Repositorio";
      linksWrapperElement.appendChild(repoLinkElement);
    }

    if (demoUrl) {
      const demoLinkElement = document.createElement("a");
      demoLinkElement.className = "preview-project-link";
      demoLinkElement.href = demoUrl;
      demoLinkElement.target = "_blank";
      demoLinkElement.rel = "noopener noreferrer";
      demoLinkElement.textContent = "Demo";
      linksWrapperElement.appendChild(demoLinkElement);
    }

    return linksWrapperElement;
  }

  // Crea una card compacta de proyecto para la preview.
  // Priorizamos lectura rápida:
  // - nombre
  // - descripción
  // - stack
  // - enlaces
  function createProjectCard(projectData = {}) {
    const projectCardElement = document.createElement("article");
    projectCardElement.className = "preview-project-card";

    const projectNameElement = document.createElement("h4");
    projectNameElement.className = "preview-project-name";
    projectNameElement.textContent = getDisplayValue(
      projectData.name,
      PREVIEW_FALLBACKS.projectName
    );

    const projectDescriptionElement = document.createElement("p");
    projectDescriptionElement.className = "preview-project-description";
    projectDescriptionElement.textContent = getDisplayValue(
      projectData.description,
      PREVIEW_FALLBACKS.projectDescription
    );

    projectCardElement.appendChild(projectNameElement);
    projectCardElement.appendChild(projectDescriptionElement);

    const projectStackElement = createProjectStack(projectData);
    if (projectStackElement) {
      projectCardElement.appendChild(projectStackElement);
    }

    const projectLinksElement = createProjectLinks(projectData);
    if (projectLinksElement) {
      projectCardElement.appendChild(projectLinksElement);
    }

    return projectCardElement;
  }

  // Muestra u oculta el empty-state específico de proyectos.
  function renderProjectsEmptyState(shouldShow) {
    if (!projectsEmptyStateElement) {
      return;
    }

    projectsEmptyStateElement.hidden = !shouldShow;
  }

  // Pinta el bloque de proyectos del preview usando currentCVState.projects.
  function renderProjects(projects = []) {
    // Si el HTML todavía no tiene estos nodos, no rompemos la app.
    if (!projectsListElement) {
      return;
    }

    clearProjectsList();

    const visibleProjects = getVisibleProjects(projects);

    if (visibleProjects.length === 0) {
      renderProjectsEmptyState(true);
      return;
    }

    renderProjectsEmptyState(false);

    const fragment = document.createDocumentFragment();

    visibleProjects.forEach((project) => {
      const projectCardElement = createProjectCard(project);
      fragment.appendChild(projectCardElement);
    });

    projectsListElement.appendChild(fragment);
  }

  // Render principal de esta feature.
  // Ahora renderiza:
  // - profile
  // - projects
  function render() {
    renderProfile(currentCVState.profile);
    renderProjects(currentCVState.projects);
  }

  // Permite actualizar el estado desde fuera y volver a pintar.
  // Esto será lo normal cuando la capa superior reciba cambios del formulario
  // o cuando otras features actualicen el CV persistido.
  function updateCVState(nextCVState) {
    currentCVState = createPortfolioCV(nextCVState);
    render();
  }

  // Inicializa el renderizador pintando el estado inicial.
  function init() {
    render();
  }

  // API pública mínima del módulo.
  return {
    init,
    render,
    updateCVState,
    getCVState: () => createPortfolioCV(currentCVState),
    getElements: () => ({
      previewRootElement,
      fullNameElement,
      headlineElement,
      summaryElement,
      emptyStateElement,
      projectsListElement,
      projectsEmptyStateElement,
    }),
  };
}