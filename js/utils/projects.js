// Utilidades puras para evaluación y filtrado de proyectos.
// Responsabilidades de este módulo:
// 1. determinar si un proyecto tiene contenido suficiente para renderizarse,
// 2. filtrar proyectos visibles (featured si existen, todos si no).
//
// Importante:
// - funciones puras sin dependencias de DOM,
// - reutilizable en PreviewRenderer, PrintCVRenderer, PublicCVRenderer,
// - no modifica el estado, solo evalúa datos.

// Determina si un proyecto tiene contenido suficiente para ser visible.
// No exigimos todos los campos; basta con que tenga algún dato útil.
export function isRenderableProject(projectData = {}) {
  const name = String(projectData.name ?? "").trim();
  const description = String(projectData.description ?? "").trim();
  const repoUrl = String(projectData.repoUrl ?? "").trim();
  const demoUrl = String(projectData.demoUrl ?? "").trim();
  const stack = Array.isArray(projectData.stack) ? projectData.stack : [];

  return Boolean(name || description || repoUrl || demoUrl || stack.length > 0);
}

// Devuelve proyectos útiles para renderizar.
// Regla:
// - si hay proyectos featured válidos, mostramos esos
// - si no, mostramos todos los proyectos válidos
export function getVisibleProjects(projects = []) {
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
