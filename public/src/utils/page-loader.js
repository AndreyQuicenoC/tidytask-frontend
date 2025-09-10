// Utility para asegurar una carga correcta de la página
// y manejar la navegación de forma confiable

import { navigateTo } from "../router.js";

// Función para reintentar navegación si algo sale mal
export function ensurePageLoaded(route) {
  // Verificar si la página tiene el contenido esperado
  const appContainer = document.querySelector("#app");

  // Si el contenedor está vacío o solo tiene un mensaje de error, reintentar
  if (
    !appContainer ||
    appContainer.innerHTML.trim() === "" ||
    appContainer.innerHTML.includes("Error al cargar")
  ) {
    console.log("Detectada página no cargada correctamente, reintentando...");

    // Pequeño retraso para permitir que el DOM se estabilice
    setTimeout(() => {
      navigateTo(route);
    }, 300);

    return false;
  }

  return true;
}

// Función para asegurar que las cargas de scripts funcionen correctamente
export function setupPageEvents(setupFn, pageName) {
  console.log(`Configurando eventos para ${pageName}...`);

  // Verificar si el DOM está listo
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setupFn();
    });
  } else {
    // DOM ya está listo
    setupFn();
  }

  // Verificar nuevamente con un retraso por si hay problemas
  setTimeout(() => {
    ensurePageLoaded(pageName);
  }, 500);
}

// Exportar función para verificar autenticación y redirigir si es necesario
export function checkAuth(requiredAuth = true) {
  const hasToken = !!localStorage.getItem("token");

  if (requiredAuth && !hasToken) {
    console.log("Se requiere autenticación, redirigiendo a login...");
    navigateTo("login");
    return false;
  }

  if (!requiredAuth && hasToken) {
    console.log("Usuario ya autenticado, redirigiendo a dashboard...");
    navigateTo("dashboard");
    return false;
  }

  return true;
}
