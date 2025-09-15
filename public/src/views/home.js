import { navigateTo } from "../router.js";
import toast from "../utils/toast.js";

export default function setupHome() {
  console.log("Configurando página de inicio (Landing Page)");

  // Limpiar cualquier intervalo que pueda estar ejecutándose desde otras páginas
  if (window.googleAuthCheckInterval) {
    clearInterval(window.googleAuthCheckInterval);
    delete window.googleAuthCheckInterval;
    console.log("Intervalos de Google Auth limpiados en home");
  }

  if (window.dashboardIntervalId) {
    clearInterval(window.dashboardIntervalId);
    delete window.dashboardIntervalId;
    console.log("Intervalos del dashboard limpiados en home");
  }

  // Botón de login en el header
  const loginButton = document.getElementById("login-button");
  if (loginButton) {
    loginButton.addEventListener("click", () => {
      console.log("Navegando a login desde header");
      navigateTo("login");
    });
  }

  // Botón de signup en el header
  const signupButton = document.getElementById("signup-button");
  if (signupButton) {
    signupButton.addEventListener("click", () => {
      console.log("Navegando a signup desde header");
      navigateTo("signup");
    });
  }

  // Botón principal "Comenzar Gratis"
  const getStartedButton = document.getElementById("get-started-button");
  if (getStartedButton) {
    getStartedButton.addEventListener("click", () => {
      console.log("Navegando a signup desde hero");
      navigateTo("signup");
    });
  }

  // Botón "Saber Más" - scroll suave a la sección de características
  const learnMoreButton = document.getElementById("learn-more-button");
  if (learnMoreButton) {
    learnMoreButton.addEventListener("click", () => {
      const featuresSection = document.querySelector(".features-section");
      if (featuresSection) {
        featuresSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  }

  // Botón CTA "Comenzar Ahora"
  const ctaSignupButton = document.getElementById("cta-signup-button");
  if (ctaSignupButton) {
    ctaSignupButton.addEventListener("click", () => {
      console.log("Navegando a signup desde CTA");
      navigateTo("signup");
    });
  }

  // Verificar si el usuario ya está logueado
  const token = localStorage.getItem("token");
  if (token) {
    // Si ya está logueado, cambiar los botones del header
    updateHeaderForLoggedUser();
  }

  // Animación de scroll para el header
  setupScrollAnimation();

  // Animación de aparición para las cards de características
  setupFeatureCardsAnimation();
}

function updateHeaderForLoggedUser() {
  const headerActions = document.querySelector(".header-actions");
  if (headerActions) {
    headerActions.innerHTML = `
            <button id="dashboard-button" class="btn-primary btn-float">Ir al Dashboard</button>
        `;

    const dashboardButton = document.getElementById("dashboard-button");
    if (dashboardButton) {
      dashboardButton.addEventListener("click", () => {
        navigateTo("dashboard");
      });
    }
  }
}

function setupScrollAnimation() {
  const header = document.querySelector(".landing-header");
  if (!header) return;

  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    // Cambiar opacidad del header basado en el scroll
    if (currentScrollY > 100) {
      header.style.background = "rgba(255, 255, 255, 0.98)";
      header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
    } else {
      header.style.background = "rgba(255, 255, 255, 0.95)";
      header.style.boxShadow = "none";
    }

    lastScrollY = currentScrollY;
  });
}

function setupFeatureCardsAnimation() {
  const featureCards = document.querySelectorAll(".feature-card");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Añadir un pequeño delay para cada card
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }, index * 100);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  featureCards.forEach((card) => {
    // Inicializar estado de animación
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease";

    observer.observe(card);
  });
}

// Función para manejar errores de navegación
function handleNavigationError(error) {
  console.error("Error en navegación:", error);
  toast.error("Error al navegar. Intenta nuevamente.");
}
