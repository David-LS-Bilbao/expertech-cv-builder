# Jooble Local Proxy Server

Este es el micro-backend local para probar la búsqueda de ofertas desde el entorno del frontend.
Su objetivo es esconder la _API KEY_ de Jooble para que el frontend nunca exponga la clave al ejecutarse.

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

Si todavía no existe una llave válida, el proxy arranca en modo _Fallback_ controlado. 
Cuando obtengas la credencial de Jooble, primero haz una copia de `.env.example` y renómbralo a `.env`:

\`\`\`env
JOOBLE_API_KEY=tu_api_key_aqui
\`\`\`

## Cómo alternar entre Proxy y Mock en el Frontend

Si no configuras la variable, el Frontend devolverá un error avisando que falta la llave, y se le dejará al Proxy actuar.
Por seguridad y velocidad mientras probamos la UI, el Front utiliza Mocks.

Para probar la conexión real frente a este proxy:
1. Dirígete a `js/services/JobOffersService.js`.
2. Modifica la variable del objeto global a 'proxy':
   \`\`\`js
   const CONFIG = {
     mode: 'proxy', // Cámbialo a 'mock' para desconectar.
     proxyUrl: 'http://localhost:3001/api/jobs/search'
   };
   \`\`\`
3. Verás en el frontend una tarjeta simulada (`[JOOBLE API PROXY] Oferta traída a través de backend: ...`) o un error honesto si las var de entorno no han sido rellenadas en `.env`.
