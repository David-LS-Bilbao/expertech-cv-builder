// Controlador para la interfaz del buscador de empleo.
// Responsabilidades:
// 1. capturar la interacción de búsqueda.
// 2. gestionar los estados de UI (loading, success, empty, error).
// 3. coordinar la petición con el servicio de ofertas.
// 4. renderizar el listado en base a los resultados (mock).

import { renderJobSearchBlockTemplate } from "./JobSearchBlockTemplate.js";
import { searchOffers } from "../services/JobOffersService.js";

export function createJobSearchIntegration() {
  let isInitialized = false;
  let rootElement = null;
  let elements = {};

  function init() {
    if (isInitialized) {
      return;
    }

    rootElement = renderJobSearchBlockTemplate();

    if (!rootElement) {
      console.error("Falló la inyección del bloque de Búsqueda de Empleo.");
      return;
    }

    elements = {
      form: rootElement.querySelector("#job-search-form"),
      keywordInput: rootElement.querySelector("#job-search-keyword"),
      locationInput: rootElement.querySelector("#job-search-location"),
      feedback: rootElement.querySelector("#job-search-form-feedback"),
      badge: rootElement.querySelector("#job-search-status-badge"),
      emptyState: rootElement.querySelector("#job-search-empty-state"),
      emptyStateTitle: rootElement.querySelector(".empty-state-title"),
      emptyStateText: rootElement.querySelector(".empty-state-text"),
      resultsSection: rootElement.querySelector("#job-search-results-section"),
      resultsList: rootElement.querySelector("#job-search-results-list"),
      resultsCount: rootElement.querySelector("#job-search-results-count"),
      submitBtn: rootElement.querySelector("#job-search-submit-btn"),
    };

    if (elements.form) {
      elements.form.addEventListener("submit", handleSubmit);
    }

    isInitialized = true;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    
    // Limpiamos espacios
    const keyword = elements.keywordInput.value.trim();
    const location = elements.locationInput.value.trim();

    if (!keyword) {
      showError("Debes escribir una palabra clave para buscar.");
      return;
    }

    showLoading();

    try {
      const results = await searchOffers({ keyword, location });
      if (results.length === 0) {
        showEmptyResults();
      } else {
        showResults(results);
        if (results._fallbackWarning) {
          showWarning(`API temporalmente no disponible (${results._fallbackWarning}). Mostrando datos simulados.`);
        }
      }
    } catch (error) {
      showError(error.message || "Ocurrió un error inesperado al buscar ofertas.");
    }
  }

  function showLoading() {
    elements.feedback.textContent = "";
    elements.feedback.hidden = true;
    
    elements.badge.textContent = "Buscando...";
    elements.badge.className = "status-badge status-badge-warn"; 
    
    elements.emptyState.hidden = true;
    elements.resultsSection.hidden = true;
    elements.resultsList.innerHTML = "";
    
    elements.submitBtn.disabled = true;
  }

  function showError(msg) {
    elements.feedback.textContent = msg;
    elements.feedback.hidden = false;
    elements.feedback.classList.remove("form-feedback-success");
    // Usamos el de error que ya pueda existir (usado indirectamente o creamos estilo inline o en CSS si falta)
    elements.feedback.style.color = "var(--color-danger, #ef4444)";

    elements.badge.textContent = "Error";
    elements.badge.className = "status-badge status-badge-error";

    elements.emptyStateTitle.textContent = "Error en la búsqueda";
    elements.emptyStateText.textContent = msg;
    elements.emptyState.hidden = false;

    elements.resultsSection.hidden = true;
    elements.submitBtn.disabled = false;
  }

  function showWarning(msg) {
    elements.feedback.textContent = msg;
    elements.feedback.hidden = false;
    elements.feedback.classList.remove("form-feedback-success");
    // Aviso visible pero menos crítico que el error total que corta la ejecución
    elements.feedback.style.color = "var(--color-warn, #f59e0b)";
  }

  function showEmptyResults() {
    elements.feedback.textContent = "";
    elements.feedback.hidden = true;

    elements.badge.textContent = "Sin resultados";
    elements.badge.className = "status-badge status-badge-muted";

    elements.emptyStateTitle.textContent = "No se encontraron ofertas";
    elements.emptyStateText.textContent = "La búsqueda con el término elegido no devolvió resultados en el mock provider.";
    elements.emptyState.hidden = false;

    elements.resultsSection.hidden = true;
    elements.submitBtn.disabled = false;
  }

  function showResults(results) {
    elements.feedback.textContent = "";
    elements.feedback.hidden = true;

    elements.badge.textContent = `${results.length} resultados`;
    // Simularemos la clase de exito o usaremos var(--color-success)
    elements.badge.className = "status-badge status-badge-success";

    elements.emptyState.hidden = true;
    elements.resultsSection.hidden = false;
    elements.resultsCount.textContent = `${results.length} listadas`;

    const fragment = document.createDocumentFragment();

    results.forEach((job) => {
      const card = document.createElement("article");
      card.className = "preview-card";
      card.style.marginBottom = "0.75rem";

      const header = document.createElement("header");
      header.className = "preview-card-header";
      header.style.display = "flex";
      header.style.flexDirection = "column";
      header.style.alignItems = "flex-start";
      header.style.gap = "0.25rem";

      const title = document.createElement("h5");
      title.className = "preview-name";
      title.style.margin = "0";
      title.style.fontSize = "1rem";
      title.textContent = String(job.title ?? "Oferta sin título");

      const meta = document.createElement("p");
      meta.className = "preview-role";
      meta.style.margin = "0";
      meta.style.fontSize = "0.85rem";
      meta.style.color = "var(--color-text-light, #64748b)";

      const company = document.createElement("strong");
      company.textContent = String(job.company ?? "Empresa no disponible");

      const locationText = document.createTextNode(
        ` · ${String(job.location ?? "Ubicación no disponible")}`
      );

      meta.appendChild(company);
      meta.appendChild(locationText);

      header.appendChild(title);
      header.appendChild(meta);

      const body = document.createElement("div");
      body.className = "preview-card-body";
      body.style.marginTop = "0.5rem";

      const link = document.createElement("a");
      link.className = "btn btn-secondary";
      link.style.padding = "0.25rem 0.5rem";
      link.style.fontSize = "0.75rem";
      link.style.textDecoration = "none";
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      const safeLink = String(job.link ?? "").trim();
      link.href = safeLink || "#";
      link.textContent = "Ver detalle";

      body.appendChild(link);
      card.appendChild(header);
      card.appendChild(body);

      fragment.appendChild(card);
    });

    elements.resultsList.innerHTML = "";
    elements.resultsList.appendChild(fragment);

    elements.submitBtn.disabled = false;
  }

  return { init };
}
