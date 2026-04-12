import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { searchJoobleProxy } from './services/JoobleProxyService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Permitimos todos los orígenes locales temporalmente para el MVP
app.use(cors());
app.use(express.json());

app.get('/api/jobs/search', async (req, res) => {
  const { keyword, location } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: 'Falta el parámetro keyword' });
  }

  try {
    const results = await searchJoobleProxy({ keyword, location });
    res.json(results);
  } catch (err) {
    console.error('[Proxy Error]', err.message);

    // Fallback explícito: Faltan credenciales
    if (err.message === 'CREDENTIALS_MISSING') {
      return res.status(503).json({
        error: 'Servicio no disponible',
        message: 'El proxy está funcionando, pero falta JOOBLE_API_KEY en .env'
      });
    }

    res.status(500).json({ error: err.message || 'Error interno en el proxy' });
  }
});

app.listen(PORT, () => {
  const mode = process.env.JOOBLE_API_KEY
    ? 'Preparado para API Real (Jooble)'
    : 'Modo Fallback (Sin credencial)';

  console.log(`[Jooble Proxy] Servidor levantado en http://localhost:${PORT}`);
  console.log(`[Jooble Proxy] Estado: ${mode}`);
});
