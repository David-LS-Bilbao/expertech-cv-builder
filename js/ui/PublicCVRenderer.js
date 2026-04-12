import { createPortfolioCV } from "../models/PortfolioCV.js";
import { createPreviewRenderer } from "./PreviewRenderer.js";

/**
 * PublicCVRenderer
 * Se encarga de renderizar la demo pública del CV
 * a partir de un estado ya cargado por la capa superior.
 */
export function createPublicCVRenderer({
  rootSelector = "#public-cv-root",
  pageEyebrowSelector = "#public-page-eyebrow",
  pageTitleSelector = "#public-page-title",
  pageDescriptionSelector = "#public-page-description",
  avatarSelector = "#public-page-avatar",
  avatarPlaceholderSelector = "#public-page-avatar-placeholder",
  statusTitleSelector = "#public-status-title",
  statusTextSelector = "#public-status-text",
  noteTitleSelector = "#public-note-title",
  noteTextSelector = "#public-note-text",
  skillsListSelector = "#public-skills-list",
  documentCaptionTextSelector = "#public-document-caption-text",
} = {}) {
  let cvRenderer = null;
  const PUBLIC_SKILL_ICON_MAP = {
    html: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    css: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    javascript:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    git: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    github:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
  };

  function getRootElement() {
    return document.querySelector(rootSelector);
  }

  function updateDocumentTitle(cvState = {}) {
    const normalizedCV = createPortfolioCV(cvState);
    const fullName = String(normalizedCV.profile?.fullName ?? "").trim();

    document.title = fullName
      ? `${fullName} | Expertech CV`
      : "Perfil Profesional | Expertech CV";
  }

  function getDisplayValue(value, fallback) {
    const normalizedValue = String(value ?? "").trim();
    return normalizedValue || fallback;
  }

  function countVisibleProjects(projects = []) {
    if (!Array.isArray(projects)) {
      return 0;
    }

    return projects.filter((projectData = {}) => {
      const name = String(projectData.name ?? "").trim();
      const description = String(projectData.description ?? "").trim();
      const repoUrl = String(projectData.repoUrl ?? "").trim();
      const demoUrl = String(projectData.demoUrl ?? "").trim();
      const stack = Array.isArray(projectData.stack) ? projectData.stack : [];

      return Boolean(name || description || repoUrl || demoUrl || stack.length > 0);
    }).length;
  }

  function getSkillIconUrl(skillLabel = "") {
    const normalizedSkill = String(skillLabel).trim().toLowerCase();

    if (normalizedSkill.includes("html")) {
      return PUBLIC_SKILL_ICON_MAP.html;
    }

    if (normalizedSkill.includes("css")) {
      return PUBLIC_SKILL_ICON_MAP.css;
    }

    if (normalizedSkill.includes("javascript")) {
      return PUBLIC_SKILL_ICON_MAP.javascript;
    }

    if (normalizedSkill === "git") {
      return PUBLIC_SKILL_ICON_MAP.git;
    }

    if (normalizedSkill.includes("github")) {
      return PUBLIC_SKILL_ICON_MAP.github;
    }

    return "";
  }

  function renderPublicSkills(profileData = {}) {
    const skillsListElement = document.querySelector(skillsListSelector);

    if (!skillsListElement) {
      return;
    }

    const skills = Array.isArray(profileData.skills) ? profileData.skills : [];
    const normalizedSkills = skills
      .map((skill) => String(skill ?? "").trim())
      .filter(Boolean);

    skillsListElement.innerHTML = "";

    if (normalizedSkills.length === 0) {
      skillsListElement.innerHTML = `
        <li class="public-skill-item">
          <span class="public-skill-text-only">Tecnologías pendientes de definir.</span>
        </li>
      `;
      return;
    }

    const fragment = document.createDocumentFragment();

    normalizedSkills.forEach((skillLabel) => {
      const listItemElement = document.createElement("li");
      listItemElement.className = "public-skill-item";

      const iconUrl = getSkillIconUrl(skillLabel);

      if (iconUrl) {
        const iconElement = document.createElement("img");
        iconElement.className = "public-skill-icon";
        iconElement.src = iconUrl;
        iconElement.alt = `Icono de ${skillLabel}`;
        listItemElement.appendChild(iconElement);
      }

      const labelElement = document.createElement("span");
      labelElement.className = "public-skill-label";
      labelElement.textContent = skillLabel;
      listItemElement.appendChild(labelElement);

      fragment.appendChild(listItemElement);
    });

    skillsListElement.appendChild(fragment);
  }

  function renderPublicPageChrome(cvState = {}) {
    const normalizedCV = createPortfolioCV(cvState);
    const profile = normalizedCV.profile ?? {};
    const visibleProjectsCount = countVisibleProjects(normalizedCV.projects);

    const pageEyebrowElement = document.querySelector(pageEyebrowSelector);
    const pageTitleElement = document.querySelector(pageTitleSelector);
    const pageDescriptionElement = document.querySelector(pageDescriptionSelector);
    const avatarElement = document.querySelector(avatarSelector);
    const avatarPlaceholderElement = document.querySelector(
      avatarPlaceholderSelector
    );
    const statusTitleElement = document.querySelector(statusTitleSelector);
    const statusTextElement = document.querySelector(statusTextSelector);
    const noteTitleElement = document.querySelector(noteTitleSelector);
    const noteTextElement = document.querySelector(noteTextSelector);
    const documentCaptionTextElement = document.querySelector(
      documentCaptionTextSelector
    );

    if (pageEyebrowElement) {
      pageEyebrowElement.textContent = profile.location
        ? `Perfil público · ${profile.location}`
        : "Perfil público";
    }

    const fallbackGithubAvatar = profile.githubUsername
      ? `https://github.com/${profile.githubUsername}.png`
      : "";

    const avatarSrc = String(
      profile.avatarBase64 || profile.avatarUrl || fallbackGithubAvatar || ""
    ).trim();

    if (avatarElement && avatarPlaceholderElement) {
      if (avatarSrc) {
        avatarElement.src = avatarSrc;
        avatarElement.hidden = false;
        avatarPlaceholderElement.hidden = true;
      } else {
        avatarElement.src = "";
        avatarElement.hidden = true;
        avatarPlaceholderElement.hidden = false;
      }
    }

    if (pageTitleElement) {
      pageTitleElement.textContent = getDisplayValue(
        profile.fullName,
        "Perfil profesional"
      );
    }

    if (pageDescriptionElement) {
      const headline = String(profile.headline ?? "").trim();
      const summary = String(profile.summary ?? "").trim();
      const descriptionParts = [headline, summary].filter(Boolean);

      pageDescriptionElement.textContent =
        descriptionParts.join(". ") ||
        "Perfil profesional con proyectos seleccionados y presentación clara.";
    }

    if (statusTitleElement) {
      statusTitleElement.textContent = getDisplayValue(
        profile.headline,
        "Perfil profesional"
      );
    }

    if (statusTextElement) {
      const statusParts = [];

      if (profile.location) {
        statusParts.push(profile.location);
      }

      if (profile.githubUsername) {
        statusParts.push(`GitHub: ${profile.githubUsername}`);
      }

      if (profile.linkedinUrl) {
        statusParts.push("LinkedIn disponible");
      }

      statusTextElement.textContent =
        statusParts.join(" · ") || "Perfil preparado para revisión pública.";
    }

    if (noteTitleElement) {
      noteTitleElement.textContent = "Tecnologías";
    }

    if (noteTextElement) {
      noteTextElement.textContent =
        "Stack visible del perfil con tecnologías y herramientas principales.";
    }

    if (documentCaptionTextElement) {
      documentCaptionTextElement.textContent =
        visibleProjectsCount > 0
          ? `Perfil y ${visibleProjectsCount} proyectos seleccionados para revisión pública.`
          : "Perfil preparado para revisión pública.";
    }

    renderPublicSkills(profile);
  }

  function renderUnavailableState({
    title = "La vista pública todavía no está disponible",
    message = "No se ha podido cargar el contenido público del CV.",
  } = {}) {
    const root = getRootElement();

    if (!root) {
      console.error("No se encontró el contenedor para la vista pública.");
      return;
    }

    document.title = "Perfil Profesional | Expertech CV";
    root.innerHTML = `
      <article class="preview-card">
        <div class="preview-card-body">
          <section class="preview-section">
            <h2 class="preview-section-title">${title}</h2>
            <p>${message}</p>
          </section>
        </div>
      </article>
    `;
  }

  function init(initialCVState = {}) {
    const root = getRootElement();
    if (!root) {
      console.error("No se encontró el contenedor para la vista pública.");
      return;
    }

    const cvData = createPortfolioCV(initialCVState);
    updateDocumentTitle(cvData);
    renderPublicPageChrome(cvData);

    cvRenderer = createPreviewRenderer({
      previewRootSelector: rootSelector,
      initialCVState: cvData
    });

    if (cvRenderer) {
      cvRenderer.init();
      console.log("Vista pública demo renderizada con éxito.");
    }
  }

  function updateCVState(nextCVState = {}) {
    const cvData = createPortfolioCV(nextCVState);
    updateDocumentTitle(cvData);
    renderPublicPageChrome(cvData);

    if (!cvRenderer) {
      init(cvData);
      return;
    }

    cvRenderer.updateCVState(cvData);
  }

  return {
    init,
    updateCVState,
    renderUnavailableState,
  };
}
