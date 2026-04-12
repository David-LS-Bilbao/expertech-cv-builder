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

const DEFAULT_PUBLIC_PORTFOLIO_URL =
  "https://david-ls-bilbao.github.io/expertech-cv-builder/public.html";
const QR_IMAGE_PROVIDER_URL = "https://api.qrserver.com/v1/create-qr-code/";

export function createPrintCVRenderer({
  printRootSelector = "#print-cv-root",
  fullNameSelector = "#print-cv-full-name",
  headlineSelector = "#print-cv-headline",
  summarySelector = "#print-cv-summary",
  projectsSectionSelector = "#print-cv-projects-section",
  projectsListSelector = "#print-cv-projects-list",
  contactSelector = "#print-cv-contact",
  skillsSelector = "#print-cv-skills",
  initialCVState,
} = {}) {
  let currentCVState = createPortfolioCV(initialCVState);

  const printRootElement = document.querySelector(printRootSelector);

  if (printRootElement) {
    renderPrintCVTemplate(printRootElement);
  }

  const avatarElement = document.querySelector("#print-cv-avatar");
  const avatarPlaceholder = document.querySelector("#print-cv-avatar-placeholder");

  const fullNameElement = document.querySelector(fullNameSelector);
  const headlineElement = document.querySelector(headlineSelector);
  const summaryElement = document.querySelector(summarySelector);
  const projectsSectionElement = document.querySelector(projectsSectionSelector);
  const projectsListElement = document.querySelector(projectsListSelector);
  const contactElement = document.querySelector(contactSelector);
  const skillsElement = document.querySelector(skillsSelector);
  const qrImageElement = document.querySelector("#print-cv-qr-image");
  const qrPlaceholderElement = document.querySelector("#print-cv-qr-placeholder");
  const portfolioUrlElement = document.querySelector("#print-cv-portfolio-url");

  if (!fullNameElement || !headlineElement || !summaryElement || !projectsListElement) {
    console.error(
      "No se pudo inicializar PrintCVRenderer: faltan nodos de la vista exportable."
    );
    return null;
  }

  function formatCleanUrl(url) {
    return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  }

  function resolvePublicPortfolioUrl() {
    const isGitHubPages = String(window.location.hostname || "").endsWith(
      "github.io"
    );
    const firstPathSegment = String(window.location.pathname || "")
      .split("/")
      .filter(Boolean)[0];

    if (isGitHubPages && firstPathSegment) {
      return `${window.location.origin}/${firstPathSegment}/public.html`;
    }

    return DEFAULT_PUBLIC_PORTFOLIO_URL;
  }

  function getQrImageUrl(targetUrl) {
    const queryParams = new URLSearchParams({
      size: "220x220",
      format: "png",
      qzone: "1",
      data: targetUrl,
    });

    return `${QR_IMAGE_PROVIDER_URL}?${queryParams.toString()}`;
  }

  function renderPortfolioQr() {
    const publicPortfolioUrl = resolvePublicPortfolioUrl();

    if (portfolioUrlElement) {
      portfolioUrlElement.href = publicPortfolioUrl;
      portfolioUrlElement.textContent = formatCleanUrl(publicPortfolioUrl);
    }

    if (!qrImageElement) {
      return;
    }

    qrImageElement.style.display = "none";
    qrImageElement.alt = `Código QR del portafolio: ${publicPortfolioUrl}`;
    qrImageElement.onload = null;
    qrImageElement.onerror = null;

    qrImageElement.onload = () => {
      qrImageElement.style.display = "block";

      if (qrPlaceholderElement) {
        qrPlaceholderElement.style.display = "none";
      }
    };

    qrImageElement.onerror = () => {
      qrImageElement.style.display = "none";

      if (qrPlaceholderElement) {
        qrPlaceholderElement.style.display = "flex";
      }
    };

    qrImageElement.src = getQrImageUrl(publicPortfolioUrl);
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
      parts.push(`<a class="cv-link badge-repo" href="${repoUrl}" target="_blank" rel="noopener noreferrer"><span class="link-label">Repo: </span><span class="link-url">${formatCleanUrl(repoUrl)}</span></a>`);
    }

    if (demoUrl) {
      parts.push(`<a class="cv-link badge-live" href="${demoUrl}" target="_blank" rel="noopener noreferrer"><span class="link-label">Live: </span><span class="link-url">${formatCleanUrl(demoUrl)}</span></a>`);
    }

    linksElement.innerHTML = parts.join(' <span class="link-separator">·</span> ');

    return linksElement;
  }

  function createProjectItem(projectData = {}) {
    const itemElement = document.createElement("article");
    itemElement.className = "print-cv-project";

    const titleElement = document.createElement("h3");
    titleElement.className = "print-cv-project-name";

    const projectName = getDisplayValue(projectData.name, PRINT_CV_FALLBACKS.projectName);
    const stack = Array.isArray(projectData.stack) ? projectData.stack : [];
    const normalizedStack = stack.map((item) => String(item ?? "").trim()).filter(Boolean);
    const stackSnippet = normalizedStack.length > 0 ? ` [${normalizedStack.join(", ")}]` : "";

    titleElement.textContent = `${projectName}${stackSnippet}`;

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

    const linksElement = createProjectLinks(projectData);
    if (linksElement) {
      itemElement.appendChild(linksElement);
    }

    return itemElement;
  }

  function renderProfile(profileData = {}) {
    // Manejo del avatar
    // Si no han sincronizado con la API o subido foto, GitHub sirve fotos puras
    // añadiendo .png al nombre de su usuario. ¡Magia!
    const fallbackGithubPic = profileData.githubUsername
      ? `https://github.com/${profileData.githubUsername}.png`
      : "";

    const avatarSrc = profileData.avatarBase64 || profileData.avatarUrl || fallbackGithubPic;

    if (avatarSrc && avatarElement && avatarPlaceholder) {
      avatarElement.src = avatarSrc;
      avatarElement.style.display = "";
      avatarPlaceholder.style.display = "none";
    } else if (avatarElement && avatarPlaceholder) {
      avatarElement.src = "";
      avatarElement.style.display = "none";
      avatarPlaceholder.style.display = "";
    }

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

    if (contactElement) {
      const contactLinks = [];
      if (profileData.email) {
        contactLinks.push(`<a href="mailto:${profileData.email}">${profileData.email}</a>`);
      }
      if (profileData.githubUsername) {
        contactLinks.push(`<a href="https://github.com/${profileData.githubUsername}" target="_blank">github.com/${profileData.githubUsername}</a>`);
      }
      if (profileData.linkedinUrl) {
        contactLinks.push(`<a href="${profileData.linkedinUrl}" target="_blank">${formatCleanUrl(profileData.linkedinUrl)}</a>`);
      }
      if (profileData.location) {
        contactLinks.push(`<span>${profileData.location}</span>`);
      }
      contactElement.innerHTML = contactLinks.join("");
    }

    if (skillsElement) {
      const skills = Array.isArray(profileData.skills) ? profileData.skills : [];
      if (skills.length > 0) {
        skillsElement.innerHTML = `<ul>${skills.map(s => `<li>${String(s).trim()}</li>`).join("")}</ul>`;
      } else {
        skillsElement.innerHTML = "<p>Sin habilidades especificadas.</p>";
      }
    }
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
    renderPortfolioQr();
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
