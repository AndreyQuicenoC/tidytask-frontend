import { navigate } from "../router.js";
import { get, del } from "../services/api.js";

// Estado de la aplicación
let userProfile = null;
let isLoading = false;
let isNavigating = false; // Nueva bandera para evitar bucles
let isInitialized = false; // Nueva bandera para evitar múltiples inicializaciones

/**
 * Configuración inicial de la página de perfil
 */
function initProfile() {
  console.log("Inicializando página de perfil");

  // Limpiar cualquier intervalo del dashboard que pueda estar ejecutándose
  if (window.dashboardIntervalId) {
    clearInterval(window.dashboardIntervalId);
    window.dashboardIntervalId = null;
    console.log("Intervalos del dashboard limpiados en profile");
  }

  // Limpiar cualquier intervalo de Google Auth que pueda estar ejecutándose
  if (window.googleAuthCheckInterval) {
    clearInterval(window.googleAuthCheckInterval);
    delete window.googleAuthCheckInterval;
    console.log("Intervalos de Google Auth limpiados en profile");
  }

  // Evitar reinicialización si ya estamos navegando o inicializados
  if (isNavigating || isInitialized) {
    console.log(
      "Ya estamos navegando o inicializados, evitando reinicialización"
    );
    return;
  }

  isInitialized = true;

  // Verificar autenticación
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("No hay token, redirigiendo a login");
    isNavigating = true;
    navigate("login");
    return;
  }

  // Configurar event listeners
  setupEventListeners();

  // Cargar perfil del usuario
  loadUserProfile();
}

/**
 * Configurar todos los event listeners
 */
function setupEventListeners() {
  // Botón de editar perfil
  const editBtn = document.getElementById("edit-profile-btn");
  if (editBtn) {
    editBtn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Navegando a profile-edit...");
      navigate("profile-edit");
    });
  } else {
    console.error("Botón edit-profile-btn no encontrado");
  }

  // Botón de eliminar cuenta
  const deleteBtn = document.getElementById("delete-account-btn");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", showDeleteModal);
  }

  // Botón de reintentar
  const retryBtn = document.getElementById("retry-btn");
  if (retryBtn) {
    retryBtn.addEventListener("click", loadUserProfile);
  }

  // Botón de logout
  const logoutBtn = document.getElementById("logout-button");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Cerrando sesión...");
      handleLogout();
    });
  } else {
    console.error("Botón logout-button no encontrado");
  }

  // Botón de volver al dashboard
  const backToDashboardBtn = document.getElementById("back-to-dashboard");
  if (backToDashboardBtn) {
    backToDashboardBtn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Navegando al dashboard...");
      navigate("dashboard");
    });
  } else {
    console.error("Botón back-to-dashboard no encontrado");
  }

  // Modal de eliminar cuenta
  setupDeleteModal();
}

/**
 * Configurar modal de eliminación de cuenta
 */
function setupDeleteModal() {
  const modal = document.getElementById("delete-modal");
  const closeBtn = document.getElementById("close-modal");
  const cancelBtn = document.getElementById("cancel-delete");
  const confirmBtn = document.getElementById("confirm-delete");

  if (closeBtn) {
    closeBtn.addEventListener("click", hideDeleteModal);
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", hideDeleteModal);
  }

  if (confirmBtn) {
    confirmBtn.addEventListener("click", handleDeleteAccount);
  }

  // Cerrar modal al hacer clic fuera
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        hideDeleteModal();
      }
    });
  }
}

/**
 * Cargar perfil del usuario desde el backend
 */
async function loadUserProfile() {
  if (isLoading) return;

  isLoading = true;
  showSkeleton();

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token no encontrado");
    }

    // Usar el servicio API en lugar de fetch directo
    const data = await get("/users/me", true);

    if (data.success && data.data) {
      userProfile = data.data;
      displayProfile(userProfile);
      updateHeaderInfo(userProfile);
      updateNavInfo(userProfile); // Agregar actualización del nav
    } else {
      throw new Error("Datos de perfil no válidos");
    }
  } catch (error) {
    console.error("Error loading profile:", error);

    if (error.message === "Error del servidor") {
      // Solo mostrar en dev
      if (process.env.NODE_ENV === "development") {
        console.error("Server error details:", error);
      }
      showError("No pudimos obtener tu perfil");
    } else {
      showError(error.message || "Error al cargar el perfil");
    }
  } finally {
    isLoading = false;
  }
}

/**
 * Mostrar skeleton de carga
 */
function showSkeleton() {
  const skeleton = document.getElementById("profile-skeleton");
  const content = document.getElementById("profile-content");
  const error = document.getElementById("profile-error");

  if (skeleton) skeleton.style.display = "block";
  if (content) content.style.display = "none";
  if (error) error.style.display = "none";
}

/**
 * Mostrar contenido del perfil
 */
function displayProfile(profile) {
  const skeleton = document.getElementById("profile-skeleton");
  const content = document.getElementById("profile-content");
  const error = document.getElementById("profile-error");

  if (skeleton) skeleton.style.display = "none";
  if (content) content.style.display = "block";
  if (error) error.style.display = "none";

  // Actualizar información del perfil
  const elements = {
    "profile-full-name": `${profile.firstName} ${profile.lastName}`,
    "profile-first-name": profile.firstName,
    "profile-last-name": profile.lastName,
    "profile-age": profile.age.toString(),
    "profile-email": profile.email,
    "profile-member-since": formatDate(profile.createdAt),
  };

  Object.entries(elements).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  });

  // Actualizar avatar
  const avatarLetter = document.getElementById("profile-avatar-letter");

  if (avatarLetter) {
    avatarLetter.textContent = profile.firstName.charAt(0).toUpperCase();
  }
}

/**
 * Mostrar estado de error
 */
function showError(message) {
  const skeleton = document.getElementById("profile-skeleton");
  const content = document.getElementById("profile-content");
  const error = document.getElementById("profile-error");
  const errorMessage = document.getElementById("error-message");

  if (skeleton) skeleton.style.display = "none";
  if (content) content.style.display = "none";
  if (error) error.style.display = "block";
  if (errorMessage) errorMessage.textContent = message;
}

/**
 * Actualizar información del header
 */
function updateHeaderInfo(profile) {
  const userNameElement = document.getElementById("user-name");
  const userAvatarElement = document.getElementById("user-avatar-letter");

  if (userNameElement) {
    userNameElement.textContent = `${profile.firstName} ${profile.lastName}`;
  }

  if (userAvatarElement) {
    userAvatarElement.textContent = profile.firstName.charAt(0).toUpperCase();
  }
}

/**
 * Actualizar información del usuario en la navegación
 */
function updateNavInfo(profile) {
  // Los elementos ya se actualizan en updateHeaderInfo
  // Pero agreguemos logs para debugging
  console.log("Actualizando info del nav con perfil:", profile);
  
  // También actualizar localStorage para que otros componentes lo usen
  const userData = {
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    age: profile.age
  };
  
  localStorage.setItem("user", JSON.stringify(userData));
  console.log("Datos de usuario guardados en localStorage");
}

/**
 * Formatear fecha para mostrar
 */
function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    return "Fecha no disponible";
  }
}

/**
 * Mostrar modal de eliminación de cuenta
 */
function showDeleteModal() {
  const modal = document.getElementById("delete-modal");
  if (modal) {
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }
}

/**
 * Ocultar modal de eliminación de cuenta
 */
function hideDeleteModal() {
  const modal = document.getElementById("delete-modal");
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

/**
 * Manejar eliminación de cuenta
 */
async function handleDeleteAccount() {
  const confirmBtn = document.getElementById("confirm-delete");
  const spinner = document.getElementById("delete-spinner");

  if (!confirmBtn || !spinner) return;

  // Mostrar spinner
  spinner.style.display = "inline-block";
  confirmBtn.disabled = true;

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token no encontrado");
    }

    // Usar el servicio API en lugar de fetch directo
    await del("/users/me", true);

    // Cuenta eliminada exitosamente
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.toast?.show("Tu cuenta ha sido eliminada exitosamente", "success");
    navigate("home");
  } catch (error) {
    console.error("Error deleting account:", error);
    window.toast?.show("Error al eliminar la cuenta", "error");
  } finally {
    // Ocultar spinner
    spinner.style.display = "none";
    confirmBtn.disabled = false;
    hideDeleteModal();
  }
}

/**
 * Manejar logout
 */
function handleLogout() {
  console.log("Ejecutando logout...");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  
  // Mostrar mensaje de éxito
  if (window.toast) {
    window.toast.show("Sesión cerrada exitosamente", "success");
  }
  
  // Limpiar estado de la aplicación
  userProfile = null;
  isLoading = false;
  isNavigating = false;
  isInitialized = false;
  
  // Navegar al home
  setTimeout(() => {
    navigate("home");
  }, 100);
}

// Exportar función de inicialización
export default initProfile;
