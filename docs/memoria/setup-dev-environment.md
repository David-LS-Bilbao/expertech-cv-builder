# Setup: Entorno de Desarrollo Local

**Rama:** `fix/stabilize-authenticated-app-listeners`  
**Fecha:** 2026-05-20  
**Objetivo:** Ejecutar el servidor proxy y el frontend en local para pruebas manuales

---

## ⚙️ Requisitos previos

- **Node.js** instalado (cualquier versión reciente)
- **npm** disponible en la consola
- Las dependencias del servidor ya están instaladas (`server/node_modules` existe)
- La API key de Jooble está configurada en `server/.env`

---

## 🚀 Levantamiento del entorno

### 1. Terminal 1: Servidor proxy (Express)

```powershell
cd server
npm run dev
```

**Resultado esperado:**
```
Server running on http://localhost:3000
```

El servidor proxy escucha en puerto **3000** y actúa de intermediario entre el frontend y la API de Jooble.

---

### 2. Terminal 2: Servidor estático (Frontend)

Elige **una** de estas opciones:

#### Opción A: Live Server en VS Code (recomendado)

1. Instala la extensión **Live Server** (Five Server) si aún no la tienes
2. Clic derecho en `index.html`
3. Selecciona **"Open with Live Server"**
4. Se abrirá automáticamente en `http://localhost:5500` (o puerto similar)

#### Opción B: Python (si lo tienes instalado)

```powershell
# En la raíz del proyecto
python -m http.server 8000
```

Luego abre `http://localhost:8000` en el navegador.

#### Opción C: Node.js (con npx)

```powershell
# En la raíz del proyecto
npx http-server
```

Sigue las instrucciones en consola para el puerto.

---

## ✅ Verificación

Una vez levantados ambos servidores:

1. Abre `http://localhost:PUERTO/index.html` en el navegador
2. Deberías ver la pantalla de login
3. Abre la consola del navegador (F12) → **Console**
4. No debería haber errores de CORS ni de conexión

---

## 🧪 Pruebas manuales (4 casos)

### Caso 1: Todos los botones presentes

```
1. Login con Usuario1 (email: test1@example.com, contraseña: test123)
2. Editar y guardar un nombre reconocible (ej: "Alice Test")
3. Click en "Exportar PDF" → debe aparecer print dialog de navegador ✅
4. Click en "Ver Demo Pública" → abre public.html en tab nueva ✅
5. Click en botón de tema (☀️/🌙) → alterna oscuro/claro ✅
6. Abrir console → sin errores ✅

RESULTADO ESPERADO: Todos funcionan sin errores
```

### Caso 2: PDF button falta (edge case)

```
1. Abrir DevTools (F12) → Inspector
2. Buscar #export-pdf-button
3. Clic derecho → "Delete element"
4. Recargar página (F5)
5. Click en "Ver Demo Pública" → DEBE funcionar ✅
6. Click en tema toggle → DEBE funcionar ✅
7. Abrir console → sin errores ✅

RESULTADO ESPERADO: Vista Pública y tema funcionan aunque falte PDF
```

### Caso 3: init() llamada múltiples veces

```
1. Abrir console (F12)
2. Escribir: window.cvAppDebug.authenticatedCVApp.init()
3. Repetir paso 2 varias veces (5-10 veces)
4. Click en PDF, Vista Pública, tema
5. DevTools Inspector → Eventos → selecciona #export-pdf-button
6. Inspecciona "Event Listeners" tab

RESULTADO ESPERADO: Sin errores, sin duplicación visible de listeners
```

### Caso 4: Re-login (CRÍTICO)

```
1. Login con Usuario1
2. Editar nombre y guardar (ej: "User One")
3. Click "Cerrar sesión"
4. Login con Usuario2 (email diferente, ej: user2@example.com)
5. COMPROBAR: CV vacío, NO muestra "User One" ✅
6. Click en "Exportar PDF" → funciona ✅
7. Click en "Ver Demo Pública" → funciona ✅
8. Toggle tema → funciona ✅
9. Abrir console → sin listeners duplicados, sin errores ✅

RESULTADO ESPERADO: 
- Usuario2 ve su propio CV vacío (not User1's data)
- Todos los botones funcionan
- Sin errores en console
- Sin listeners duplicados
```

---

## 🛑 Solución de problemas

| Problema | Solución |
|---|---|
| **CORS error** | Verificar que el servidor proxy está en puerto 3000 y levantado |
| **Cannot find module** en server | Ejecutar `npm install` en carpeta `server/` |
| **API key no funciona** | Verificar `server/.env` tiene `JOOBLE_API_KEY=...` |
| **Localhost rechazado** | Usar `http://127.0.0.1:PUERTO` en lugar de `localhost` |
| **Public.html no carga JSON** | Asegúrate de usar servidor estático, no `file://` |
| **Listeners duplicados** | Hard refresh (Ctrl+Shift+R) o limpiar localStorage |

---

## 📋 Checklist antes de commitar

- [ ] Caso 1: Todos los botones presentes ✅
- [ ] Caso 2: PDF button falta ✅
- [ ] Caso 3: init() múltiples veces ✅
- [ ] Caso 4: Re-login funciona correctamente ✅
- [ ] Console limpio (sin warnings ni errors)
- [ ] DevTools no muestra listeners duplicados
- [ ] Usuario2 ve su CV, NOT Usuario1's data

---

## 📌 Notas finales

- El servidor proxy se necesita **solo** para la búsqueda de empleo (JobSearchIntegration)
- Si solo vas a testear listeners y re-login, el proxy puede no levantarse
- Las pruebas de listeners y re-login son **independientes** del proxy
- El re-login es la prueba **más crítica** para validar ambos refactors

---

*Documento generado en rama `fix/stabilize-authenticated-app-listeners` el 2026-05-20.*
