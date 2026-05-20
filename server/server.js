import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { searchJoobleProxy } from './services/JoobleProxyService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS: Orígenes autorizados desde env var o defaults locales
const allowedOrigins = (process.env.ALLOWED_ORIGINS || [
  'http://localhost:5500',
  'http://localhost:8000',
  'http://localhost:3000',
  'http://127.0.0.1:5500',
  'http://127.0.0.1:8000',
  'http://127.0.0.1:3000'
].join(',')).split(',').map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS no permitido para este origen'));
    }
  },
  credentials: false
}));

app.use(express.json());

// Rate limiting básico: máx 10 requests por IP por minuto
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minuto
const RATE_LIMIT_MAX = 10;

function getRateLimitKey(req) {
  return req.ip || req.connection.remoteAddress;
}

function checkRateLimit(req) {
  const key = getRateLimitKey(req);
  const now = Date.now();

  if (!requestCounts.has(key)) {
    requestCounts.set(key, []);
  }

  const timestamps = requestCounts.get(key);
  const recentRequests = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);

  if (recentRequests.length >= RATE_LIMIT_MAX) {
    return false;
  }

  recentRequests.push(now);
  requestCounts.set(key, recentRequests);
  return true;
}

// Validación de parámetros
function validateJobSearchParams(keyword, location) {
  const errors = [];

  if (typeof keyword !== 'string' || keyword.trim().length === 0) {
    errors.push('keyword debe ser string no-vacío');
  }
  if (keyword && keyword.length > 100) {
    errors.push('keyword excede máximo de 100 caracteres');
  }

  if (location && typeof location !== 'string') {
    errors.push('location debe ser string');
  }
  if (location && location.length > 100) {
    errors.push('location excede máximo de 100 caracteres');
  }

  return errors;
}

app.get('/api/jobs/search', async (req, res) => {
  // Rate limiting
  if (!checkRateLimit(req)) {
    return res.status(429).json({
      error: 'Too Many Requests',
      message: 'Máximo 10 búsquedas por minuto. Intenta más tarde.'
    });
  }

  const { keyword, location } = req.query;
  const validationErrors = validateJobSearchParams(keyword, location);

  if (validationErrors.length > 0) {
    return res.status(400).json({
      error: 'Validación fallida',
      details: validationErrors
    });
  }

  try {
    const results = await searchJoobleProxy({ keyword, location });
    res.json(results);
  } catch (err) {
    console.error('[Proxy Error]', err.message);

    if (err.message === 'CREDENTIALS_MISSING') {
      return res.status(503).json({
        error: 'Servicio no disponible',
        message: 'Proxy funcionando, pero falta JOOBLE_API_KEY en .env'
      });
    }

    res.status(500).json({
      error: 'Error en el proxy de búsqueda',
      message: err.message || 'Error interno'
    });
  }
});

app.listen(PORT, () => {
  const mode = process.env.JOOBLE_API_KEY
    ? 'Preparado para API Real (Jooble)'
    : 'Modo Fallback (Sin credencial)';

  console.log(`[Jooble Proxy] Servidor levantado en http://localhost:${PORT}`);
  console.log(`[Jooble Proxy] Estado: ${mode}`);
});
