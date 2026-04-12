// Template del auth screen del MVP.
// Responsabilidades de este módulo:
// 1. centralizar el markup de login/register fuera de index.html,
// 2. mantener una única fuente de verdad para la UI de acceso,
// 3. permitir que AuthScreen.js renderice la pantalla antes de enlazar eventos.
//
// Importante:
// - aquí no hay lógica de negocio,
// - no se toca localStorage,
// - no se registran eventos,
// - este archivo solo devuelve e inserta HTML.

const AUTH_SCREEN_ROOT_SELECTOR = "#auth-screen";

// Devuelve el markup interno del auth screen.
// Ojo: no incluye el <section id="auth-screen"> raíz,
// porque ese contenedor seguirá viviendo en index.html.
export function getAuthScreenMarkup() {
  return `
    <div class="auth-screen__content">
      <div class="auth-screen__brand">
        <p class="brand-kicker">EXPERTECH</p>
        <h1 id="auth-title" class="brand-title">Bienvenido a CV Builder</h1>
        <p class="brand-tagline">
          Crea, guarda y presenta tu currículum web con una experiencia más
          ordenada desde el primer acceso.
        </p>
      </div>

      <!-- Contenedor principal de autenticación.
           La vista login/register la controlará AuthScreen.js. -->
      <section class="auth-card" aria-labelledby="auth-card-title">
        <div class="auth-card__header">
          <p class="section-kicker">Acceso</p>
          <h2 id="auth-card-title" class="section-title">
            Entra o crea tu cuenta
          </h2>
          <p class="section-text">
            Usa email y contraseña para este MVP local. Google y GitHub quedan
            preparados para la siguiente evolución del producto.
          </p>
        </div>

        <!-- Tabs visuales de login/register. -->
        <div
          class="auth-tabs"
          role="tablist"
          aria-label="Seleccionar acceso o registro"
        >
          <button
            type="button"
            id="auth-tab-login"
            class="auth-tab auth-tab-active"
            role="tab"
            aria-selected="true"
            aria-controls="auth-panel-login"
          >
            Iniciar sesión
          </button>

          <button
            type="button"
            id="auth-tab-register"
            class="auth-tab"
            role="tab"
            aria-selected="false"
            aria-controls="auth-panel-register"
          >
            Crear cuenta
          </button>
        </div>

        <!-- Panel login. Visible por defecto. -->
        <section
          id="auth-panel-login"
          class="auth-panel"
          role="tabpanel"
          aria-labelledby="auth-tab-login"
        >
          <form
            id="login-form"
            class="auth-form"
            aria-label="Formulario de inicio de sesión"
          >
            <div class="form-grid">
              <div class="form-field form-field-full">
                <label for="login-email">Email</label>
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  placeholder="nombre@email.com"
                  autocomplete="email"
                />
              </div>

              <div class="form-field form-field-full">
                <label for="login-password">Contraseña</label>
                <input
                  type="password"
                  id="login-password"
                  name="password"
                  placeholder="Introduce tu contraseña"
                  autocomplete="current-password"
                />
              </div>
            </div>

            <p
              id="login-form-feedback"
              class="form-feedback"
              aria-live="polite"
              role="status"
            ></p>

            <div class="auth-form-actions">
              <button type="submit" class="btn btn-primary">
                Iniciar sesión
              </button>
            </div>
          </form>
        </section>

        <!-- Panel register. Empieza oculto. -->
        <section
          id="auth-panel-register"
          class="auth-panel"
          role="tabpanel"
          aria-labelledby="auth-tab-register"
          hidden
        >
          <form
            id="register-form"
            class="auth-form"
            aria-label="Formulario de creación de cuenta"
          >
            <div class="form-grid">
              <div class="form-field form-field-full">
                <label for="register-display-name">Nombre visible</label>
                <input
                  type="text"
                  id="register-display-name"
                  name="displayName"
                  placeholder="Ej. David López Sotelo"
                  autocomplete="name"
                />
              </div>

              <div class="form-field form-field-full">
                <label for="register-email">Email</label>
                <input
                  type="email"
                  id="register-email"
                  name="email"
                  placeholder="nombre@email.com"
                  autocomplete="email"
                />
              </div>

              <div class="form-field form-field-full">
                <label for="register-password">Contraseña</label>
                <input
                  type="password"
                  id="register-password"
                  name="password"
                  placeholder="Crea una contraseña"
                  autocomplete="new-password"
                />
              </div>
            </div>

            <p
              id="register-form-feedback"
              class="form-feedback"
              aria-live="polite"
              role="status"
            ></p>

            <div class="auth-form-actions">
              <button type="submit" class="btn btn-primary">
                Crear cuenta
              </button>
            </div>
          </form>
        </section>

        <!-- Acceso social preparado para siguiente MVP.
             En esta fase solo mostrará mensaje informativo. -->
        <div class="auth-divider" aria-hidden="true">
          <span>o continúa con</span>
        </div>

        <div class="auth-social-actions">
          <button
            type="button"
            id="auth-google-button"
            class="btn btn-secondary auth-social-button"
          >
            Continuar con Google
          </button>

          <button
            type="button"
            id="auth-github-button"
            class="btn btn-secondary auth-social-button"
          >
            Continuar con GitHub
          </button>
        </div>

        <p
          id="auth-social-feedback"
          class="form-feedback is-info"
          aria-live="polite"
          role="status"
        ></p>
      </section>
    </div>
  `;
}

// Renderiza el template dentro del contenedor raíz del auth screen.
// Devuelve el nodo raíz si todo va bien.
export function renderAuthScreenTemplate(target = AUTH_SCREEN_ROOT_SELECTOR) {
  const targetElement =
    typeof target === "string" ? document.querySelector(target) : target;

  if (!targetElement) {
    console.error(
      "No se pudo renderizar AuthScreenTemplate: no existe el contenedor raíz."
    );
    return null;
  }

  targetElement.innerHTML = getAuthScreenMarkup();

  return targetElement;
}