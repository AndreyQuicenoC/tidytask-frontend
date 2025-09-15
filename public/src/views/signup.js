// src/views/signup.js
import { signup } from "../services/authService.js";
import { navigateTo } from "../router.js";
import { initiateGoogleAuth } from "../utils/safe-google-auth.js";
import toast from "../utils/toast.js";

export default function setupSignup() {
  // Referencias a elementos del DOM
  const form = document.getElementById("signup-form");
  const submitButton = document.getElementById("signup-button");
  const buttonText = document.getElementById("button-text");
  const spinner = document.getElementById("spinner");

  // Referencias a campos de entrada
  const firstNameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");
  const emailInput = document.getElementById("email");
  const ageInput = document.getElementById("age");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");

  // Referencias a contenedores de errores
  const firstNameError = document.getElementById("firstName-error");
  const lastNameError = document.getElementById("lastName-error");
  const emailError = document.getElementById("email-error");
  const ageError = document.getElementById("age-error");
  const passwordError = document.getElementById("password-error");
  const confirmPasswordError = document.getElementById("confirmPassword-error");

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

  // Validación de nombre
  function validateName(input, errorElement) {
    const value = input.value.trim();

    if (value.length === 0) {
      showError(input, errorElement, "Este campo es obligatorio");
      return false;
    }

    if (value.length < 2) {
      showError(
        input,
        errorElement,
        "El nombre debe tener al menos 2 caracteres"
      );
      return false;
    }

    markValid(input);
    return true;
  }

  // Validación de email
  function validateEmail(input, errorElement) {
    const value = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (value.length === 0) {
      showError(input, errorElement, "El email es obligatorio");
      return false;
    }

    if (!emailRegex.test(value)) {
      showError(
        input,
        errorElement,
        "Por favor ingrese un correo electrónico válido"
      );
      return false;
    }

    markValid(input);
    return true;
  }

  // Validación de edad
  function validateAge(input, errorElement) {
    const value = input.value.trim();
    const age = parseInt(value);

    if (value.length === 0) {
      showError(input, errorElement, "La edad es obligatoria");
      return false;
    }

    if (isNaN(age) || !Number.isInteger(age)) {
      showError(input, errorElement, "La edad debe ser un número entero");
      return false;
    }

    if (age < 13) {
      showError(input, errorElement, "Debes tener al menos 13 años");
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

    if (value.length < 8) {
      showError(
        input,
        errorElement,
        "La contraseña debe tener al menos 8 caracteres"
      );
      return false;
    }

    // Debe contener al menos una mayúscula
    if (!/[A-Z]/.test(value)) {
      showError(
        input,
        errorElement,
        "La contraseña debe contener al menos una letra mayúscula"
      );
      return false;
    }

    // Debe contener al menos una minúscula
    if (!/[a-z]/.test(value)) {
      showError(
        input,
        errorElement,
        "La contraseña debe contener al menos una letra minúscula"
      );
      return false;
    }

    // Debe contener al menos un número
    if (!/[0-9]/.test(value)) {
      showError(
        input,
        errorElement,
        "La contraseña debe contener al menos un número"
      );
      return false;
    }

    // Debe contener al menos un carácter especial
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
      showError(
        input,
        errorElement,
        "La contraseña debe contener al menos un carácter especial"
      );
      return false;
    }

    markValid(input);
    return true;
  }

  // Validación de confirmación de contraseña
  function validateConfirmPassword(input, errorElement) {
    const confirmValue = input.value;
    const passwordValue = passwordInput.value;

    if (confirmValue.length === 0) {
      showError(input, errorElement, "Por favor confirme su contraseña");
      return false;
    }

    if (confirmValue !== passwordValue) {
      showError(input, errorElement, "Las contraseñas no coinciden");
      return false;
    }

    markValid(input);
    return true;
  }

  // Validar todos los campos
  function validateAll() {
    const isFirstNameValid = validateName(firstNameInput, firstNameError);
    const isLastNameValid = validateName(lastNameInput, lastNameError);
    const isEmailValid = validateEmail(emailInput, emailError);
    const isAgeValid = validateAge(ageInput, ageError);
    const isPasswordValid = validatePassword(passwordInput, passwordError);
    const isConfirmPasswordValid = validateConfirmPassword(
      confirmPasswordInput,
      confirmPasswordError
    );

    return (
      isFirstNameValid &&
      isLastNameValid &&
      isEmailValid &&
      isAgeValid &&
      isPasswordValid &&
      isConfirmPasswordValid
    );
  }

  // Limpiar errores cuando el usuario escribe (sin mostrar errores nuevos)
  firstNameInput.addEventListener("input", () => {
    clearError(firstNameInput, firstNameError);
  });

  lastNameInput.addEventListener("input", () => {
    clearError(lastNameInput, lastNameError);
  });

  emailInput.addEventListener("input", () => {
    clearError(emailInput, emailError);
  });

  ageInput.addEventListener("input", () => {
    clearError(ageInput, ageError);
  });

  passwordInput.addEventListener("input", () => {
    clearError(passwordInput, passwordError);
    // Si el campo de confirmación ya tiene contenido, limpiar su error también
    if (confirmPasswordInput.value.length > 0) {
      clearError(confirmPasswordInput, confirmPasswordError);
    }
  });

  confirmPasswordInput.addEventListener("input", () => {
    clearError(confirmPasswordInput, confirmPasswordError);
  });

  // Event listener para el envío del formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validar todos los campos antes de enviar (mostrar errores solo aquí)
    if (!validateAll()) {
      return;
    }

    // Mostrar spinner y deshabilitar botón
    buttonText.textContent = "Creando Cuenta...";
    spinner.classList.remove("hidden");
    submitButton.disabled = true; // Recoger datos del formulario
    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const email = emailInput.value.trim();
    const age = parseInt(ageInput.value.trim());
    const password = passwordInput.value;

    try {
      const userData = {
        firstName,
        lastName,
        email,
        age,
        password,
      };

      console.log("Sending registration data:", userData);

      // Simular un tiempo mínimo de procesamiento (mínimo 1s, máximo 3s)
      const startTime = Date.now();
      const res = await signup(userData);
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 1000 - elapsedTime);

      await new Promise((resolve) => setTimeout(resolve, remainingTime));

      console.log("Server response:", res);

      // Guardar token y usuario
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      // Mostrar toast de éxito
      toast.success("Cuenta creada exitosamente");

      // Esperar un momento y redireccionar
      setTimeout(() => {
        navigateTo("login");
      }, 300);
    } catch (err) {
      console.error("Signup error:", err);

      // Restablecer botón
      buttonText.textContent = "Crear Cuenta";
      spinner.classList.add("hidden");
      submitButton.disabled = false;

      // Manejar error específico para email ya registrado
      if (err.message && err.message.includes("already registered")) {
        showError(emailInput, emailError, "Este email ya está registrado");
        toast.error("Este email ya está registrado");
      } else if (err.message && err.message.includes("500")) {
        // Error del servidor
        toast.error("Error al crear la cuenta. Por favor intente más tarde.");

        // En modo dev, mostrar en consola
        if (process.env.NODE_ENV !== "production") {
          console.error("Server error details:", err);
        }
      } else {
        toast.error(
          "Error al crear la cuenta. Por favor verifique su información e intente nuevamente."
        );
      }
    }
  });

  // Navegar a login
  document.getElementById("go-login").addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo("login");
  });

  // Botón de signup con Google
  const googleLoginButton = document.querySelector(".google-login");
  if (googleLoginButton) {
    googleLoginButton.addEventListener("click", () => {
      // URL específica para Google Auth (usar la URL correcta según el entorno)
      const isProduction = window.location.hostname !== "localhost";
      const baseUrl = isProduction
        ? "https://tidytasks-80b95fdaeb61.herokuapp.com"
        : "http://localhost:3001";
      const googleAuthUrl = `${baseUrl}/api/auth/google`;

    // Mostrar spinner durante la autenticación
    buttonText.textContent = "Autenticando...";
    spinner.classList.remove("hidden");
    submitButton.disabled = true; // Usar el nuevo método seguro para iniciar la autenticación
    const auth = initiateGoogleAuth(googleAuthUrl);

    // Configurar el verificador de estado
    auth.checkAuthStatus((error, user) => {
      // Restablecer botón en cualquier caso
      buttonText.textContent = "Registrarse";
      spinner.classList.add("hidden");
      submitButton.disabled = false;

      if (error) {
        console.error("Error de autenticación con Google:", error);
        toast.error("La autenticación con Google no pudo completarse");
        return;
      }

      if (user) {
        console.log("Autenticación con Google exitosa");

        // Mostrar toast y redirigir al dashboard
        toast.success(`¡Bienvenido, ${user.firstName}!`);

        // Redirigir al dashboard después de un breve momento
        setTimeout(() => {
          navigateTo("dashboard");
        }, 300);
      }
    });
  });

  // Inicializar validaciones para habilitar/deshabilitar botón
  validateAll();
}
