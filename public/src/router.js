// Importar utilidades para mejorar la carga de páginas
import { ensurePageLoaded } from "./utils/page-loader.js";

// Función para obtener la ruta actual
function getCurrentRoute() {
  const path = window.location.pathname;
  const hash = window.location.hash.slice(1);

  // Extraer solo el path sin query parameters
  const cleanPath = path.split("?")[0].slice(1);
  const cleanHash = hash.split("?")[0];

  console.log("Path detectado:", path, "Hash detectado:", hash);

  // Si estamos en la raíz y hay un token, ir al dashboard directamente
  if (
    (cleanPath === "" || cleanPath === "index.html") &&
    localStorage.getItem("token")
  ) {
    return "dashboard";
  }

  // Si estamos en la raíz y no hay token, mostrar la landing page (home)
  if (cleanPath === "" || cleanPath === "index.html") {
    return "home";
  }

  return cleanHash || cleanPath || "home";
}

// Función para obtener query parameters
function getQueryParams() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams;
}

// Función para manejar las rutas
export function handleRouting() {
  // Evitar ejecutar si estamos en medio de una navegación programática
  if (window.navigatingProgrammatically) {
    console.log("Navegación programática en curso, saltando handleRouting");
    return;
  }

  const route = getCurrentRoute();
  const queryParams = getQueryParams();

  console.log("Current route:", route);
  console.log("Query params:", Object.fromEntries(queryParams));

  // Mapeo de rutas
  const routeMap = {
    "/": "home",
    "": "home",
    home: "home",
    login: "login",
    signup: "signup",
    recovery: "recovery",
    reset: "reset",
    dashboard: "dashboard",
    "auth-callback": "auth-callback",
  };

  const viewName = routeMap[route] || "login";

  // Verificación especial para reset - debe tener token
  if (viewName === "reset") {
    const token = queryParams.get("token");
    if (!token) {
      console.warn(
        "Reset route accessed without token, redirecting to recovery"
      );
      navigateTo("recovery");
      return;
    }
  }

  navigateTo(viewName);
}

// Función para navegar programáticamente
export function navigate(route) {
  // Actualizar la URL
  history.pushState({}, "", `/${route}`);
  // Cargar la vista
  navigateTo(route);
}

// Función para cargar vistas dinámicamente
export async function navigateTo(viewName) {
  try {
    // Marcar que estamos navegando programáticamente
    window.navigatingProgrammatically = true;

    console.log(`Intentando cargar vista: ${viewName}`);
    console.log(`URL actual antes del cambio: ${window.location.pathname}`);

    // Verificar si tenemos token válido para el dashboard
    if (viewName === "dashboard") {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn(
          "Intentando acceder al dashboard sin token, redirigiendo a login"
        );
        // Cambiar viewName en lugar de hacer llamada recursiva
        viewName = "login";
      }
    }

    // Actualizar la URL del navegador para mantener sincronía
    const newUrl = viewName === "home" ? "/" : `/${viewName}`;
    if (window.location.pathname !== newUrl) {
      console.log(
        `Actualizando URL de ${window.location.pathname} a ${newUrl}`
      );
      history.pushState({}, "", newUrl);
      console.log(`URL actualizada: ${window.location.pathname}`);
    } else {
      console.log(`URL ya está correcta: ${newUrl}`);
    }

    // Convertir a formato de archivo (primera letra minúscula)
    const fileViewName = viewName.charAt(0).toLowerCase() + viewName.slice(1);

    // Caso especial para auth-callback
    if (viewName === "auth-callback") {
      // Redireccionar a la página completa, no como una SPA
      window.location.href = "/public/src/views/auth-callback.html";
      return;
    }

    // Cargar la vista desde public/src/views
    let res;
    try {
      res = await fetch(`/src/views/${fileViewName}.html`);
      if (!res.ok) throw new Error(`Vista no encontrada: ${fileViewName}`);
    } catch (e) {
      console.error("Error al cargar vista:", e);
      throw new Error(`Error al cargar vista: ${e.message}`);
    }

    if (!res.ok) {
      throw new Error(`Error al cargar vista: ${res.status} ${res.statusText}`);
    }

    const html = await res.text();

    // Extraer los enlaces CSS del contenido HTML (si hay alguno)
    const cssLinks = [];
    const linkRegex =
      /<link\s+rel=["']stylesheet["']\s+href=["']([^"']+)["']\s*\/?>/g;
    let match;

    while ((match = linkRegex.exec(html)) !== null) {
      cssLinks.push(match[1]);
    }

    // Limpiar el HTML de los enlaces CSS
    const cleanHtml = html.replace(
      /<link\s+rel=["']stylesheet["']\s+href=["'][^"']+["']\s*\/?>/g,
      ""
    );

    // Obtener el contenedor de la aplicación
    const appContainer = document.querySelector("#app");
    if (!appContainer) {
      console.error("No se encontró el contenedor #app");
      throw new Error("No se encontró el contenedor #app");
    }

    // Aplicar el HTML limpio
    appContainer.innerHTML = cleanHtml;
    console.log(`Vista ${viewName} cargada correctamente`);

    // Agregar los enlaces CSS extraídos al head del documento
    if (cssLinks.length > 0) {
      cssLinks.forEach((href) => {
        // Verificar si el link ya existe para evitar duplicados
        const existingLink = document.querySelector(`link[href="${href}"]`);
        if (!existingLink) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = href;
          document.head.appendChild(link);
          console.log(`CSS agregado: ${href}`);
        }
      });
    }

    // Importa el script asociado a la vista
    try {
      console.log(`Intentando cargar script: ./views/${fileViewName}.js`);
      // Limpiamos caché para forzar la recarga del módulo
      const moduleUrl = `./views/${fileViewName}.js?v=${Date.now()}`;
      const module = await import(moduleUrl);

      if (module.default) {
        console.log(`Ejecutando setup de ${viewName}`);
        module.default(); // Ejecuta setup si existe

        // Verificar carga correcta después de un momento
        setTimeout(() => {
          if (!ensurePageLoaded(viewName)) {
            console.warn(
              `Posible error al cargar ${viewName}, reintentando...`
            );
          }
        }, 300);
      }
    } catch (error) {
      console.error(`Error al cargar script de ${viewName}:`, error);
    }
  } catch (error) {
    console.error(`No se pudo cargar la vista: ${viewName}`, error);
    document.querySelector(
      "#app"
    ).innerHTML = `<h2>Error al cargar ${viewName}</h2><p>${error.message}</p>`;
  } finally {
    // Desmarcar la bandera de navegación programática
    setTimeout(() => {
      window.navigatingProgrammatically = false;
    }, 100);
  }
}

// Escuchar cambios en el historial del navegador
window.addEventListener("popstate", handleRouting);

// Inicializar el routing cuando se carga la página
document.addEventListener("DOMContentLoaded", handleRouting);

// Asegurarse de que el routing también se ejecute si el DOM ya estaba cargado
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  // Evitar interferir con navegación manual, solo ejecutar al cargar inicialmente
  if (!window.routerInitialized) {
    setTimeout(handleRouting, 100);
    window.routerInitialized = true;
  }
}
