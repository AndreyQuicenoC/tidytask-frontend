import { handleRouting } from "./router.js";
import "./utils/google-auth-handler.js"; // Importar el manejador de autenticación de Google
import toast from "./utils/toast.js"; // Importar el sistema de toast

// Exponer sistema de toast globalmente
window.toast = toast;

// Para depuración
console.log("Aplicación iniciada");

// Verificar si hay una redirección pendiente desde autenticación
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM cargado, iniciando routing");

  const needsDashboardRedirect = localStorage.getItem(
    "needs_dashboard_redirect"
  );

  if (needsDashboardRedirect === "true") {
    console.log("Detectada redirección pendiente al dashboard");
    localStorage.removeItem("needs_dashboard_redirect");
  }

  // Inicializar el routing
  handleRouting();
});

// También manejar casos donde el DOM ya está cargado
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  console.log("DOM ya está cargado, iniciando routing inmediatamente");
  handleRouting();
}
