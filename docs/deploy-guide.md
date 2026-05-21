# Guía de despliegue V2 · EXPERTECH CV

> Esta guía cubre el despliegue de la V2 en plataformas cloud gratuitas
> (nivel básico): **Railway** para el backend y la base de datos, y
> **Vercel** para el frontend. Tiempo estimado: 20–30 minutos.
>
> Requisitos previos: cuenta en GitHub, cuenta en Railway, cuenta en Vercel.
> No se requiere VPS ni configuración de servidor.

---

## Arquitectura del despliegue

```
Usuario
  └─→  https://tu-app.vercel.app  (Vercel, frontend React)
         └─→  https://tu-api.railway.app  (Railway, backend Node.js)
                └─→  PostgreSQL  (Railway, base de datos)
```

En este modelo el frontend llama directamente al backend usando la URL
completa de Railway (`VITE_API_URL`). No hay Nginx en producción — la
separación por servicios la gestiona la plataforma.

---

## 1. Desplegar el backend en Railway

### 1.1 Crear el proyecto

1. Abre [railway.app](https://railway.app) y haz login con GitHub.
2. **New Project → Deploy from GitHub repo**.
3. Selecciona el repositorio `expertech-cv-builder`.
4. Railway detectará el `apps/api/Dockerfile` automáticamente.

> Si Railway no detecta el Dockerfile, ve a **Settings → Source** y
> establece el **Root Directory** en `apps/api`.

### 1.2 Añadir PostgreSQL

1. En el mismo proyecto, haz clic en **+ Add Service → Database → PostgreSQL**.
2. Railway crea la base de datos y expone `DATABASE_URL` como variable interna.
3. En el servicio de la API, ve a **Variables → Reference** y añade la
   variable `DATABASE_URL` referenciando la DB recién creada.

### 1.3 Variables de entorno del backend (Railway)

En el servicio `api`, ve a **Variables** y añade:

| Variable | Valor |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `3002` |
| `DATABASE_URL` | *(referencia a la DB de Railway)* |
| `ALLOWED_ORIGINS` | `https://tu-app.vercel.app` *(rellena después de Vercel)* |
| `JOOBLE_API_KEY` | *(tu clave real de Jooble)* |
| `BCRYPT_ROUNDS` | `12` |

> **Nota**: `ALLOWED_ORIGINS` requiere la URL de Vercel, que solo conoces
> tras el paso 2. Desplega Vercel primero con un valor temporal, obtén la
> URL y vuelve aquí a actualizarlo.

### 1.4 Dominio de Railway

1. En **Settings → Networking → Generate Domain** obtén la URL pública.
2. Guárdala. La necesitarás como `VITE_API_URL` en Vercel.

---

## 2. Desplegar el frontend en Vercel

### 2.1 Importar el proyecto

1. Abre [vercel.com](https://vercel.com) y haz login con GitHub.
2. **Add New → Project → Import Git Repository**.
3. Selecciona `expertech-cv-builder`.
4. En **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `apps/web`
   - **Build Command**: `npm run build` (o déjalo en blanco)
   - **Output Directory**: `dist`

### 2.2 Variables de entorno del frontend (Vercel)

En la sección **Environment Variables** antes de desplegar:

| Variable | Valor |
|---|---|
| `VITE_API_URL` | `https://tu-api.railway.app` *(URL de Railway del paso 1.4)* |

> Esta variable se embebe en el bundle de Vite durante el build. Si la
> cambias después, debes **redeployar** para que tenga efecto.

### 2.3 Desplegar

1. Haz clic en **Deploy**.
2. Vercel construye el frontend con `VITE_API_URL` embebida.
3. Obtienes una URL del tipo `https://tu-app.vercel.app`.

---

## 3. Conectar frontend y backend

1. Copia la URL de Vercel (`https://tu-app.vercel.app`).
2. En Railway → servicio `api` → **Variables** → actualiza `ALLOWED_ORIGINS`:
   ```
   ALLOWED_ORIGINS=https://tu-app.vercel.app
   ```
3. Railway redespliega automáticamente.
4. Abre `https://tu-app.vercel.app` en el navegador, regístrate y prueba.

---

## 4. Variables de entorno (resumen)

### Backend (Railway)

```
NODE_ENV=production
PORT=3002
DATABASE_URL=<url interna Railway>
ALLOWED_ORIGINS=https://tu-app.vercel.app
JOOBLE_API_KEY=<tu clave real>
BCRYPT_ROUNDS=12
```

### Frontend (Vercel build vars)

```
VITE_API_URL=https://tu-api.railway.app
```

---

## 5. Migraciones de base de datos

El contenedor del backend ejecuta `prisma migrate deploy` al arrancar.
Railway aplica las migraciones automáticamente en cada despliegue.

Si necesitas ejecutarlas manualmente:
```bash
# Railway CLI (instalado con npm i -g @railway/cli)
railway run npx prisma migrate deploy
```

---

## 6. Rollback

### Frontend (Vercel)

1. Ve a **Deployments** en Vercel.
2. Encuentra el deployment anterior marcado como **Ready**.
3. Haz clic en **Promote to Production**.
4. El rollback es instantáneo, sin pérdida de datos.

### Backend (Railway)

1. Ve a **Deployments** en el servicio `api`.
2. Selecciona el deployment anterior y haz clic en **Rollback**.
3. Railway reinicia el contenedor con la imagen anterior.
4. Si la migración del nuevo código creó tablas o columnas incompatibles,
   puede ser necesario restaurar la DB desde un snapshot.

### Base de datos (Railway PostgreSQL)

Railway incluye backups automáticos en planes de pago. En el plan gratuito:
1. Exporta la DB antes de cada despliegue con migraciones destructivas:
   ```bash
   railway run pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
   ```
2. Para restaurar:
   ```bash
   railway run psql $DATABASE_URL < backup_YYYYMMDD.sql
   ```

---

## 7. Alternativas de despliegue

| Plataforma | Descripción |
|---|---|
| **Fly.io** | Similar a Railway; deploy con `fly.toml` por servicio. Soporte Docker nativo. |
| **Render** | Free tier con DB PostgreSQL. Deploy automático desde GitHub. |
| **VPS con Docker** | Usa el `docker-compose.yml` de la raíz del repo. Requiere servidor propio con Docker instalado. |

Para VPS con Docker:
```bash
git clone <repo> && cd expertech-cv-builder
cp apps/api/.env.example apps/api/.env   # editar con valores reales
docker compose up -d --build
```

---

## 8. Checklist pre-deploy

Consulta [`docs/security-checklist.md`](./security-checklist.md) antes de
hacer público el despliegue.
