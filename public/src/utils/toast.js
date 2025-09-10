/**
 * Sistema de notificaciones toast mejorado
 * Permite mostrar múltiples notificaciones con diferentes estilos y animaciones
 */
class ToastManager {
  constructor() {
    // Crear el contenedor de toasts si no existe
    this.container = document.querySelector(".toast-container");
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.className = "toast-container";
      document.body.appendChild(this.container);
    }

    this.toasts = [];
    this.maxToasts = 3; // Máximo número de toasts visibles simultáneamente
  }

  /**
   * Muestra un toast con el mensaje y tipo especificados
   * @param {string} message - El mensaje a mostrar
   * @param {string} type - El tipo de toast (success, error, warning, info)
   * @param {number} duration - Duración en ms (por defecto 5000ms)
   */
  show(message, type = "info", duration = 5000) {
    // Crear elemento toast
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `${message}`;

    // Añadir el toast al contenedor
    this.container.appendChild(toast);
    this.toasts.push(toast);

    // Mostrar el toast con un pequeño retraso para permitir la animación
    setTimeout(() => {
      toast.classList.add("show");
    }, 10);

    // Eliminar toast después de la duración especificada
    setTimeout(() => {
      this.remove(toast);
    }, duration);

    // Limitar el número de toasts visibles
    this.limitToasts();

    return toast;
  }

  /**
   * Elimina un toast específico
   * @param {HTMLElement} toast - El elemento toast a eliminar
   */
  remove(toast) {
    toast.classList.remove("show");

    // Eliminar elemento después de que termine la animación
    setTimeout(() => {
      if (toast.parentNode === this.container) {
        this.container.removeChild(toast);
      }
      this.toasts = this.toasts.filter((t) => t !== toast);
    }, 400); // Tiempo de la transición en CSS
  }

  /**
   * Limita el número de toasts visibles
   */
  limitToasts() {
    if (this.toasts.length > this.maxToasts) {
      const toastsToRemove = this.toasts.slice(
        0,
        this.toasts.length - this.maxToasts
      );
      toastsToRemove.forEach((toast) => this.remove(toast));
    }
  }

  /**
   * Métodos de conveniencia para diferentes tipos de toast
   */
  success(message, duration) {
    return this.show(message, "success", duration);
  }

  error(message, duration) {
    return this.show(message, "error", duration);
  }

  warning(message, duration) {
    return this.show(message, "warning", duration);
  }

  info(message, duration) {
    return this.show(message, "info", duration);
  }
}

// Crear instancia global
const toast = new ToastManager();

// Reemplazar el método alert nativo
const originalAlert = window.alert;
window.alert = function (message) {
  toast.info(message);
};

export default toast;
