# InfoJobs Local Proxy Server

Este es el micro-backend local para probar la búsqueda de ofertas desde el entorno del frontend.
Su objetivo es esconder el _Client ID_ y _Client Secret_ para que el frontend nunca exponga esas claves al ejecutarse.

## Cómo arrancarlo

1. Asegúrate de tener Node.js instalado (v16 o superior recomendado).
2. Ejecuta un `npm install` dentro de la carpeta `server/` para descargar las dependencias locales de este script (cors, express, dotenv).
3. Levanta el servidor ejecutando:
   \`\`\`bash
   npm start
   # o bien
   npm run dev
   \`\`\`
   El servidor se abrirá en `http://localhost:3001` y verás los mensajes en la terminal de tu editor.

## Variables de Entorno

Si todavía no existen llaves válidas, el proxy arranca en modo _Fallback_ controlado. 
Cuando obtengas las credenciales, primero haz una copia de `.env.example` en formato local y renómbralo a `.env`:

\`\`\`env
INFOJOBS_CLIENT_ID=tus_credenciales
INFOJOBS_CLIENT_SECRET=tu_secreto
\`\`\`

## Cómo alternar entre Proxy y Mock en el Frontend

Si no configuras las variables, el Frontend devolverá un error avisando que faltan claves, y se le dejará al Proxy actuar.
Por seguridad y velocidad mientras estemos sin ellas, el Front utiliza Mocks.

Para probar la conexión real frente a este proxy:
1. Dirígete a `js/services/JobOffersService.js`.
2. Modifica la variable del objeto global a 'proxy':
   \`\`\`js
   const CONFIG = {
     mode: 'proxy', // Cámbialo a 'mock' para desconectar.
     proxyUrl: 'http://localhost:3001/api/jobs/search'
   };
   \`\`\`
3. Verás en el frontend una tarjeta simulada (`[PROXY] Oferta traída a través de backend: ...`) o un error honesto si las var de entorno no han sido rellenadas en `.env` (estado _Fallback (Sin credenciales)_).
