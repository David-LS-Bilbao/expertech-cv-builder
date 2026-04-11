// Renderizador específico de la versión exportable del CV.
// Responsabilidades:
// 1. renderizar una salida print-only más limpia que la preview de pantalla,
// 2. reutilizar el mismo estado del CV ya persistido,
// 3. pintar solo contenido útil para PDF.

import { createPortfolioCV } from "../models/PortfolioCV.js";
import { renderPrintCVTemplate } from "./PrintCVTemplate.js";

const PRINT_CV_FALLBACKS = {
  fullName: "Nombre Apellido",
  headline: "Titular profesional",
  summary: "Añade un resumen profesional para generar una versión exportable del CV.",
  projectName: "Proyecto sin nombre",
  projectDescription: "Descripción pendiente de completar.",
};

export function createPrintCVRenderer({
  printRootSelector = "#print-cv-root",
  fullNameSelector = "#print-cv-full-name",
  headlineSelector = "#print-cv-headline",
  summarySelector = "#print-cv-summary",
  projectsSectionSelector = "#print-cv-projects-section",
  projectsListSelector = "#print-cv-projects-list",
  initialCVState,
} = {}) {
  let currentCVState = createPortfolioCV(initialCVState);

  const printRootElement = document.querySelector(printRootSelector);

  if (printRootElement) {
    renderPrintCVTemplate(printRootElement);
  }

  const fullNameElement = document.querySelector(fullNameSelector);
  const headlineElement = document.querySelector(headlineSelector);
  const summaryElement = document.querySelector(summarySelector);
  const projectsSectionElement = document.querySelector(projectsSectionSelector);
  const projectsListElement = document.querySelector(projectsListSelector);

  if (!fullNameElement || !headlineElement || !summaryElement || !projectsListElement) {
    console.error(
      "No se pudo inicializar PrintCVRenderer: faltan nodos de la vista exportable."
    );
    return null;
  }

  function getDisplayValue(value, fallback) {
    const normalizedValue = String(value ?? "").trim();
    return normalizedValue || fallback;
  }

  function isRenderableProject(projectData = {}) {
    const name = String(projectData.name ?? "").trim();
    const description = String(projectData.description ?? "").trim();
    const repoUrl = String(projectData.repoUrl ?? "").trim();
    const demoUrl = String(projectData.demoUrl ?? "").trim();
    const stack = Array.isArray(projectData.stack) ? projectData.stack : [];

    return Boolean(name || description || repoUrl || demoUrl || stack.length > 0);
  }

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

  function createProjectSource(projectData = {}) {
    const sourceProvider = String(projectData.sourceProvider ?? "").trim();
    const sourceRepositoryFullName = String(
      projectData.sourceRepositoryFullName ?? ""
    ).trim();

    if (!sourceProvider) {
      return null;
    }

    const sourceElement = document.createElement("p");
    sourceElement.className = "print-cv-project-source";

    const providerLabel = sourceProvider === "github" ? "GitHub" : sourceProvider;
    const sourceText = sourceRepositoryFullName
      ? `Origen: ${providerLabel} / ${sourceRepositoryFullName}`
      : `Origen: ${providerLabel}`;

    sourceElement.textContent = sourceText;
    return sourceElement;
  }

  function createProjectStack(projectData = {}) {
    const stack = Array.isArray(projectData.stack) ? projectData.stack : [];
    const normalizedStack = stack
      .map((item) => String(item ?? "").trim())
      .filter(Boolean);

    if (normalizedStack.length === 0) {
      return null;
    }

    const stackElement = document.createElement("p");
    stackElement.className = "print-cv-project-stack";
    stackElement.textContent = normalizedStack.join(" · ");

    return stackElement;
  }

  function createProjectLinks(projectData = {}) {
    const repoUrl = String(projectData.repoUrl ?? "").trim();
    const demoUrl = String(projectData.demoUrl ?? "").trim();

    if (!repoUrl && !demoUrl) {
      return null;
    }

    const linksElement = document.createElement("p");
    linksElement.className = "print-cv-project-links";

    const parts = [];

    if (repoUrl) {
      parts.push(`<a href="${repoUrl}" target="_blank" rel="noopener noreferrer">Repositorio</a>`);
    }

    if (demoUrl) {
      parts.push(`<a href="${demoUrl}" target="_blank" rel="noopener noreferrer">Demo</a>`);
    }

    linksElement.innerHTML = parts.join(" · ");

    return linksElement;
  }

  function createProjectItem(projectData = {}) {
    const itemElement = document.createElement("article");
    itemElement.className = "print-cv-project";

    const titleElement = document.createElement("h3");
    titleElement.className = "print-cv-project-name";
    titleElement.textContent = getDisplayValue(
      projectData.name,
      PRINT_CV_FALLBACKS.projectName
    );

    const descriptionElement = document.createElement("p");
    descriptionElement.className = "print-cv-project-description";
    descriptionElement.textContent = getDisplayValue(
      projectData.description,
      PRINT_CV_FALLBACKS.projectDescription
    );

    itemElement.appendChild(titleElement);
    itemElement.appendChild(descriptionElement);

    const sourceElement = createProjectSource(projectData);
    if (sourceElement) {
      itemElement.appendChild(sourceElement);
    }

    const stackElement = createProjectStack(projectData);
    if (stackElement) {
      itemElement.appendChild(stackElement);
    }

    const linksElement = createProjectLinks(projectData);
    if (linksElement) {
      itemElement.appendChild(linksElement);
    }

    return itemElement;
  }

  function renderProfile(profileData = {}) {
    fullNameElement.textContent = getDisplayValue(
      profileData.fullName,
      PRINT_CV_FALLBACKS.fullName
    );

    headlineElement.textContent = getDisplayValue(
      profileData.headline,
      PRINT_CV_FALLBACKS.headline
    );

    summaryElement.textContent = getDisplayValue(
      profileData.summary,
      PRINT_CV_FALLBACKS.summary
    );
  }

  function renderProjects(projects = []) {
    projectsListElement.innerHTML = "";

    const visibleProjects = getVisibleProjects(projects);

    if (projectsSectionElement) {
      projectsSectionElement.hidden = visibleProjects.length === 0;
    }

    if (visibleProjects.length === 0) {
      return;
    }

    const fragment = document.createDocumentFragment();

    visibleProjects.forEach((project) => {
      fragment.appendChild(createProjectItem(project));
    });

    projectsListElement.appendChild(fragment);
  }

  function render() {
    renderProfile(currentCVState.profile);
    renderProjects(currentCVState.projects);
  }

  function updateCVState(nextCVState) {
    currentCVState = createPortfolioCV(nextCVState);
    render();
  }

  function init() {
    render();
  }

  return {
    init,
    render,
    updateCVState,
    getCVState: () => createPortfolioCV(currentCVState),
    getElements: () => ({
      printRootElement,
      fullNameElement,
      headlineElement,
      summaryElement,
      projectsSectionElement,
      projectsListElement,
    }),
  };
}
