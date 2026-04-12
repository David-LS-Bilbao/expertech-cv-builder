/**
 * Servicio proxy local para InfoJobs.
 * Evolucionará de Fallback Honesto -> Request Real usando las API Keys en el slice posterior.
 */

export async function searchInfoJobsProxy({ keyword, location }) {
  const clientId = process.env.INFOJOBS_CLIENT_ID;
  const clientSecret = process.env.INFOJOBS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    // Si no hay credenciales lanzamos el error esperado por el middleware del express
    throw new Error('CREDENTIALS_MISSING');
  }

  // CUANDO HAYA CREDENTIALS: 
  // TODO: Implementar OAuth2 real Basic auth header a InfoJobs
  // const token = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  // const url = `https://api.infojobs.net/api/9/offer?q=${keyword}...`;
  // const res = await fetch(url, { headers: { Authorization: `Basic ${token}` }});
  
  // Por el momento, aunque alguien ponga random strings en client ID en .env, 
  // simularemos un éxito a través de Proxy para demostrar integración backend-frontend
  return [
    {
      id: "proxy-real-1",
      title: "[PROXY] Oferta traída a través de backend: " + keyword,
      company: "Integración InfoJobs SA",
      location: location || "España",
      date: new Date().toISOString(),
      link: "#"
    }
  ];
}
