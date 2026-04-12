import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { searchInfoJobsProxy } from './services/InfoJobsProxyService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Restringir CORS al entorno local predecible (Live Server, Vite, etc.)
const corsOptions = {
  origin: [
    'http://localhost:5500', 
    'http://127.0.0.1:5500',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173'
  ],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/api/jobs/search', async (req, res) => {
  const { keyword, location } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: 'Falta el parámetro keyword' });
  }

  try {
    const results = await searchInfoJobsProxy({ keyword, location });
    res.json(results);
  } catch (err) {
    console.error('[Proxy Error]', err.message);

    // Fallback explícito: Faltan credenciales
    if (err.message === 'CREDENTIALS_MISSING') {
      return res.status(503).json({
        error: 'Servicio no disponible',
        message: 'El proxy está funcionando, pero faltan las credenciales reales de InfoJobs en .env'
      });
    }

    res.status(500).json({ error: 'Error interno en el proxy' });
  }
});

app.listen(PORT, () => {
  const mode = (process.env.INFOJOBS_CLIENT_ID && process.env.INFOJOBS_CLIENT_SECRET)
    ? 'Preparado para API Real'
    : 'Modo Fallback (Sin credenciales)';

  console.log(`[InfoJobs Proxy] Servidor levantado en http://localhost:${PORT}`);
  console.log(`[InfoJobs Proxy] Estado: ${mode}`);
});
