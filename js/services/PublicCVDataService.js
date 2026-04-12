// Servicio de datos públicos estáticos del CV.
// Responsabilidades de este módulo:
// 1. cargar un snapshot público del CV desde un JSON versionado,
// 2. normalizar la estructura con el modelo raíz del portfolio,
// 3. mantener la vista pública desacoplada del localStorage del editor.

import { createPortfolioCV } from "../models/PortfolioCV.js";

export async function loadPublicCVData({
  publicDataUrl = "./data/public-cv.json",
} = {}) {
  const response = await fetch(publicDataUrl, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `No se pudo cargar la demo pública del CV. Código: ${response.status}`
    );
  }

  const payload = await response.json();

  return createPortfolioCV(payload);
}
