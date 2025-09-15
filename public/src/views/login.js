// src/views/login.js
import { login } from "../services/authService.js";
import { navigateTo } from "../router.js";
import { getCurrentUser } from "../services/authService.js";
import toast from "../utils/toast.js";
import { checkAuth } from "../utils/page-loader.js";

export default function setupLogin() {
  // Verificar si ya hay una sesión activa y redirigir si es necesario
  if (!checkAuth(false)) {
    // Si hay sesión, checkAuth ya redirigió al dashboard
    return;
  }
  // Referencias a elementos del DOM
  const form = document.getElementById("login-form");
  const submitButton = document.getElementById("login-button");
  const buttonText = document.getElementById("button-text");
  const spinner = document.getElementById("spinner");

  // Referencias a campos de entrada
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  // Referencias a contenedores de errores
  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");

  // Verificar mensaje de logout
  const logoutMessage = localStorage.getItem("logout_message");
  if (logoutMessage) {
    toast.success(logoutMessage);
    localStorage.removeItem("logout_message");
  }

  // Verificar si ya hay una sesión activa y redirigir si es necesario
  const checkExistingSession = () => {
    const token = localStorage.getItem("token");
    if (token) {
      // Verificar si el token es válido
      try {
        const tokenData = JSON.parse(atob(token.split(".")[1]));
        const expirationTime = tokenData.exp * 1000; // Convertir a milisegundos

        if (Date.now() < expirationTime) {
          // El token es válido, redirigir al dashboard
          navigateTo("dashboard");
          return true;
        } else {
          // El token ha expirado, limpiarlo
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          toast.warning(
            "Tu sesión ha expirado. Por favor, inicia sesión de nuevo."
          );
        }
      } catch (e) {
        console.error("Error al verificar el token:", e);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    return false;
  };

  // Verificar sesión al cargar
  if (checkExistingSession()) {
    return;
  }

  // Función para mostrar error en un campo
  function showError(input, errorElement, message) {
    input.classList.remove("valid");
    input.classList.add("error");
    errorElement.textContent = message;
    errorElement.classList.add("visible");
  }

  // Función para limpiar error en un campo
  function clearError(input, errorElement) {
    input.classList.remove("error");
    errorElement.textContent = "";
    errorElement.classList.remove("visible");
  }

  // Función para marcar un campo como válido
  function markValid(input) {
    clearError(input, document.getElementById(`${input.id}-error`));
    input.classList.add("valid");
  }

  // Validación de email
  function validateEmail(input, errorElement) {
    const value = input.value.trim();

    // RFC 5322 regex para validar email
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (value.length === 0) {
      showError(input, errorElement, "El correo electrónico es obligatorio");
      return false;
    }

    if (!emailRegex.test(value)) {
      showError(
        input,
        errorElement,
        "Por favor, ingresa un correo electrónico válido"
      );
      return false;
    }

    markValid(input);
    return true;
  }

  // Validación de contraseña
  function validatePassword(input, errorElement) {
    const value = input.value;

    if (value.length === 0) {
      showError(input, errorElement, "La contraseña es obligatoria");
      return false;
    }

    markValid(input);
    return true;
  }

  // Función para validar todos los campos
  function validateAll() {
    const isEmailValid = validateEmail(emailInput, emailError);
    const isPasswordValid = validatePassword(passwordInput, passwordError);

    return isEmailValid && isPasswordValid;
  }

  // Limpiar errores cuando el usuario escribe (sin mostrar errores nuevos)
  emailInput.addEventListener("input", () => {
    clearError(emailInput, emailError);
  });

  passwordInput.addEventListener("input", () => {
    clearError(passwordInput, passwordError);
  });

  // Event listener para el envío del formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validar todos los campos antes de enviar (mostrar errores solo aquí)
    if (!validateAll()) {
      return;
    }

    // Mostrar spinner y cambiar texto del botón
    buttonText.textContent = "Iniciando sesión...";
    spinner.classList.remove("hidden");
    submitButton.disabled = true;

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    try {
      console.log("Intentando iniciar sesión con:", { email });

      // Guardar tiempo de inicio para asegurar un tiempo mínimo de procesamiento
      const startTime = Date.now();
      const res = await login(email, password);
      const elapsedTime = Date.now() - startTime;

      // Asegurar que la pantalla de carga se muestre al menos por 1 segundo
      // pero no más de 3 segundos como indica el requisito
      const remainingTime = Math.min(3000, Math.max(0, 1000 - elapsedTime));
      await new Promise((resolve) => setTimeout(resolve, remainingTime));

      console.log("Respuesta del servidor:", res);

      // Guardamos token y usuario en localStorage
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      // Mostrar toast de éxito
      toast.success(`¡Bienvenido, ${res.user.firstName}!`);

      // Esperar un momento y redirigir
      setTimeout(() => {
        navigateTo("dashboard");
      }, 300);
    } catch (err) {
      console.error("Login error:", err);

      // Restablecer botón
      buttonText.textContent = "Iniciar sesión";
      spinner.classList.add("hidden");
      submitButton.disabled = false;

      // Manejar errores específicos según el código HTTP
      if (err.message && err.message.includes("401")) {
        showError(emailInput, emailError, "Correo o contraseña inválidos");
        showError(
          passwordInput,
          passwordError,
          "Correo o contraseña inválidos"
        );
        toast.error("Correo o contraseña inválidos");
      } else if (err.message && err.message.includes("423")) {
        toast.error("Cuenta temporalmente bloqueada");
      } else if (err.message && err.message.includes("429")) {
        toast.error(
          "Demasiados intentos de inicio de sesión. Inténtalo más tarde."
        );
      } else if (err.message && /5\d\d/.test(err.message)) {
        // Error 5xx - Error del servidor
        toast.error("Error del servidor. Por favor, inténtalo más tarde");

        // En modo dev, mostrar en consola
        if (process.env.NODE_ENV !== "production") {
          console.error("Server error details:", err);
        }
      } else {
        toast.error("Ocurrió un error. Por favor, inténtalo de nuevo.");
      }
    }
  });

  // Navegar a signup
  document.getElementById("go-signup").addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo("signup");
  });

  // Navegar a recovery
  document.getElementById("go-recovery").addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo("recovery");
  });

  // Botón de login con Google
  document.querySelector(".google-login").addEventListener("click", () => {
    // URL específica para Google Auth (usar la URL correcta según el entorno)
    const isProduction = window.location.hostname !== "localhost";
    const baseUrl = isProduction
      ? "https://tidytasks-80b95fdaeb61.herokuapp.com"
      : "http://localhost:3001";
    const googleAuthUrl = `${baseUrl}/api/auth/google`;

    // Guardar timestamp para verificar autenticación reciente
    localStorage.setItem("google_auth_attempt", Date.now().toString());

    // Crear ventana de autenticación
    const authWindow = window.open(
      googleAuthUrl,
      "googleAuth",
      "width=600,height=700,top=100,left=100"
    );

    // Mostrar spinner durante la autenticación
    buttonText.textContent = "Autenticando...";
    spinner.classList.remove("hidden");
    submitButton.disabled = true;

    // Configurar listener para mensajes de la ventana emergente
    const messageListener = function (event) {
      // Verificar que el mensaje sea de autenticación exitosa
      if (event.data && event.data.type === "AUTH_SUCCESS") {
        // Limpiar listener para evitar duplicados
        window.removeEventListener("message", messageListener);

        // Limpiar cualquier intervalo de verificación que pueda estar corriendo
        if (window.googleAuthCheckInterval) {
          clearInterval(window.googleAuthCheckInterval);
          delete window.googleAuthCheckInterval;
        }

        // Procesar el usuario autenticado
        const user = event.data.user;
        if (user) {
          console.log("Autenticación con Google exitosa a través de mensaje");

          // Mostrar toast de éxito
          toast.success(`¡Bienvenido, ${user.firstName}!`);

          // Redirigir al dashboard después de un breve momento
          setTimeout(() => {
            navigateTo("dashboard");
          }, 300);
        }
      }
    };

    // Registrar el listener de mensajes
    window.addEventListener("message", messageListener);

    // Verificador alternativo que comprueba periódicamente si hay un nuevo token
    const checkAuth = setInterval(() => {
      const authAttemptTime = parseInt(
        localStorage.getItem("google_auth_attempt") || "0"
      );
      const currentTime = Date.now();
      const token = localStorage.getItem("token");

      // Si hay un token nuevo dentro de la ventana de tiempo relevante
      if (token && currentTime - authAttemptTime < 30000) {
        clearInterval(checkAuth);

        // Guardar la referencia global para poder cancelarla desde el listener de mensajes
        window.googleAuthCheckInterval = checkAuth;

        // Limpiar el listener de mensajes
        window.removeEventListener("message", messageListener);

        try {
          const user = JSON.parse(localStorage.getItem("user"));
          console.log(
            "Autenticación con Google exitosa a través de localStorage"
          );

          // Mostrar toast de éxito
          toast.success(`¡Bienvenido, ${user.firstName}!`);

          // Redirigir al dashboard
          setTimeout(() => {
            navigateTo("dashboard");
          }, 300);
        } catch (e) {
          console.error("Error al procesar datos de usuario:", e);
          // Restablecer botón
          buttonText.textContent = "Iniciar sesión";
          spinner.classList.add("hidden");
          submitButton.disabled = false;
          toast.error("Error al procesar la autenticación");
        }
      }

      // Verificar si la ventana se cerró sin errores COOP
      try {
        if (authWindow && authWindow.closed) {
          // Intentar una última verificación del token
          const newToken = localStorage.getItem("token");
          if (newToken && newToken !== token) {
            try {
              const user = JSON.parse(localStorage.getItem("user"));
              console.log("Autenticación detectada después de cerrar ventana");

              toast.success(`¡Bienvenido, ${user.firstName}!`);
              setTimeout(() => {
                navigateTo("dashboard");
              }, 300);
            } catch (e) {
              console.error("Error al procesar datos de usuario:", e);
              // Restablecer botón
              buttonText.textContent = "Iniciar sesión";
              spinner.classList.add("hidden");
              submitButton.disabled = false;
            }
          } else {
            // Si la ventana se cerró pero no hay token, restaurar botón
            buttonText.textContent = "Iniciar sesión";
            spinner.classList.add("hidden");
            submitButton.disabled = false;
          }
          clearInterval(checkAuth);
        }
      } catch (e) {
        // Ignorar errores COOP, seguir con el intervalo
        console.log("No se puede acceder a la ventana (política COOP)");
      }
    }, 1000);

    // Limitar el tiempo de verificación a 30 segundos
    setTimeout(() => {
      clearInterval(checkAuth);
      window.removeEventListener("message", messageListener);

      // Restaurar botón si no se completó la autenticación
      if (!localStorage.getItem("token")) {
        buttonText.textContent = "Iniciar sesión";
        spinner.classList.add("hidden");
        submitButton.disabled = false;
        toast.warning("Autenticación cancelada");
      }
    }, 30000);
  });
}
