
// Factory del perfil base del candidato.
// Garantiza una estructura de datos estable para el CV,
// incluso cuando todavía no se han rellenado los campos.

export function createCandidateProfile(data = {}) {
  return {
    fullName: data.fullName ?? "",
    headline: data.headline ?? "",
    summary: data.summary ?? "",
    email: data.email ?? "",
    phone: data.phone ?? "",
    location: data.location ?? "",
    linkedinUrl: data.linkedinUrl ?? "",
    githubUsername: data.githubUsername ?? "",
    avatarUrl: data.avatarUrl ?? "",
    avatarBase64: data.avatarBase64 ?? "",
    skills: Array.isArray(data.skills) ? data.skills : [],
  };
}
// Crea el objeto base del perfil del candidato con valores por defecto.
// Esto evita propiedades undefined y facilita después la persistencia y el render.
