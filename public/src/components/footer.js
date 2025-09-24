// src/components/footer.js
import { navigate } from "../router.js";

/**
 * Footer Component with Site Map
 * Creates a comprehensive footer with navigation links, company info, and animations
 */
export default class FooterComponent {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    this.createFooterStructure();
    this.setupEventListeners();
    this.addAnimations();
  }

  createFooterStructure() {
    this.container = document.createElement("footer");
    this.container.className = "site-footer";
    this.container.innerHTML = `
      <div class="footer-container">
        <!-- Main Footer Content -->
        <div class="footer-main">
          <!-- Brand Section -->
          <div class="footer-brand">
            <div class="footer-logo">
              <img
                src="/src/assets/content/logo-tidytasks.png"
                alt="TidyTasks Logo"
                class="footer-logo-img"
              />
              <h3 class="footer-brand-name">TidyTasks</h3>
            </div>
            <p class="footer-description">
              La aplicación definitiva para gestionar tus tareas de manera eficiente.
              Organiza tu vida, aumenta tu productividad y alcanza tus objetivos.
            </p>
            <div class="footer-social">
              <a href="#" class="social-link" title="Facebook" aria-label="Seguir en Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" class="social-link" title="Twitter" aria-label="Seguir en Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" class="social-link" title="LinkedIn" aria-label="Seguir en LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" class="social-link" title="GitHub" aria-label="Ver código en GitHub">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Navigation Links -->
          <div class="footer-nav">
            <div class="footer-nav-section">
              <h4 class="footer-nav-title">Aplicación</h4>
              <ul class="footer-nav-list">
                <li><a href="#" class="footer-link" data-route="home">Inicio</a></li>
                <li><a href="#" class="footer-link" data-route="dashboard">Dashboard</a></li>
                <li><a href="#" class="footer-link" data-route="profile">Mi Perfil</a></li>
                <li><a href="#" class="footer-link" data-route="profile/edit">Editar Perfil</a></li>
              </ul>
            </div>

            <div class="footer-nav-section">
              <h4 class="footer-nav-title">Cuenta</h4>
              <ul class="footer-nav-list">
                <li><a href="#" class="footer-link" data-route="login">Iniciar Sesión</a></li>
                <li><a href="#" class="footer-link" data-route="signup">Registrarse</a></li>
                <li><a href="#" class="footer-link" data-route="recovery">Recuperar Cuenta</a></li>
                <li><a href="#" class="footer-link" data-route="reset">Restablecer Contraseña</a></li>
              </ul>
            </div>

            <div class="footer-nav-section">
              <h4 class="footer-nav-title">Soporte</h4>
              <ul class="footer-nav-list">
                <li><a href="#" class="footer-link" data-action="help">Centro de Ayuda</a></li>
                <li><a href="#" class="footer-link" data-action="contact">Contacto</a></li>
                <li><a href="#" class="footer-link" data-action="feedback">Enviar Feedback</a></li>
                <li><a href="#" class="footer-link" data-action="report">Reportar Problema</a></li>
              </ul>
            </div>

            <div class="footer-nav-section">
              <h4 class="footer-nav-title">Legal</h4>
              <ul class="footer-nav-list">
                <li><a href="#" class="footer-link" data-action="privacy">Política de Privacidad</a></li>
                <li><a href="#" class="footer-link" data-action="terms">Términos de Servicio</a></li>
                <li><a href="#" class="footer-link" data-action="cookies">Política de Cookies</a></li>
                <li><a href="#" class="footer-link" data-action="security">Seguridad</a></li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Footer Bottom -->
        <div class="footer-bottom">
          <div class="footer-bottom-content">
            <div class="footer-copyright">
              <p>&copy; ${new Date().getFullYear()} TidyTasks. Todos los derechos reservados.</p>
              <p class="footer-tagline">Organiza tu vida, alcanza tus metas.</p>
            </div>
            
            <div class="footer-utilities">
              <button class="scroll-to-top" id="scroll-to-top" title="Volver arriba" aria-label="Volver al inicio de la página">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="18,15 12,9 6,15"></polyline>
                </svg>
              </button>
              
              <div class="footer-theme-toggle">
                <button class="theme-toggle" id="theme-toggle" title="Cambiar tema" aria-label="Alternar tema claro/oscuro">
                  <svg class="theme-icon theme-icon-light" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                  <svg class="theme-icon theme-icon-dark" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Back to Top Indicator -->
          <div class="footer-progress-bar">
            <div class="progress-fill" id="progress-fill"></div>
          </div>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    // Navigation links
    this.container.addEventListener("click", (e) => {
      if (e.target.classList.contains("footer-link")) {
        e.preventDefault();
        
        const route = e.target.dataset.route;
        const action = e.target.dataset.action;

        if (route) {
          this.handleNavigation(route);
        } else if (action) {
          this.handleAction(action);
        }
      }
    });

    // Scroll to top button
    const scrollButton = this.container.querySelector("#scroll-to-top");
    if (scrollButton) {
      scrollButton.addEventListener("click", this.scrollToTop);
    }

    // Theme toggle
    const themeToggle = this.container.querySelector("#theme-toggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", this.toggleTheme);
    }

    // Scroll progress indicator
    this.setupScrollProgress();

    // Intersection Observer for footer animations
    this.setupIntersectionObserver();
  }

  handleNavigation(route) {
    // Add click animation
    const link = event.target;
    link.classList.add("footer-link-clicked");
    
    setTimeout(() => {
      navigate(route);
      link.classList.remove("footer-link-clicked");
    }, 200);
  }

  handleAction(action) {
    const link = event.target;
    link.classList.add("footer-link-clicked");

    switch (action) {
      case "help":
        this.showModal("Centro de Ayuda", "Aquí encontrarás respuestas a las preguntas más frecuentes sobre TidyTasks.");
        break;
      case "contact":
        this.showModal("Contacto", "¿Necesitas ayuda? Escríbenos a: support@tidytasks.com");
        break;
      case "feedback":
        this.showModal("Feedback", "Tu opinión es importante para nosotros. Comparte tus sugerencias para mejorar TidyTasks.");
        break;
      case "report":
        this.showModal("Reportar Problema", "Si encontraste un error o problema, por favor describe los detalles y te ayudaremos a solucionarlo.");
        break;
      case "privacy":
        this.showModal("Política de Privacidad", "En TidyTasks respetamos tu privacidad y protegemos tus datos personales según las mejores prácticas de seguridad.");
        break;
      case "terms":
        this.showModal("Términos de Servicio", "Al usar TidyTasks, aceptas nuestros términos y condiciones de uso del servicio.");
        break;
      case "cookies":
        this.showModal("Política de Cookies", "Utilizamos cookies para mejorar tu experiencia en TidyTasks y personalizar el contenido.");
        break;
      case "security":
        this.showModal("Seguridad", "Tu seguridad es nuestra prioridad. Implementamos las mejores prácticas de seguridad para proteger tus datos.");
        break;
    }

    setTimeout(() => {
      link.classList.remove("footer-link-clicked");
    }, 200);
  }

  showModal(title, content) {
    // Create modal if it doesn't exist
    let modal = document.querySelector("#footer-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "footer-modal";
      modal.className = "footer-modal";
      modal.innerHTML = `
        <div class="footer-modal-content">
          <div class="footer-modal-header">
            <h3 class="footer-modal-title"></h3>
            <button class="footer-modal-close" aria-label="Cerrar modal">&times;</button>
          </div>
          <div class="footer-modal-body">
            <p class="footer-modal-text"></p>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      // Setup modal event listeners
      modal.addEventListener("click", (e) => {
        if (e.target === modal || e.target.classList.contains("footer-modal-close")) {
          this.closeModal();
        }
      });
    }

    // Update modal content
    modal.querySelector(".footer-modal-title").textContent = title;
    modal.querySelector(".footer-modal-text").textContent = content;
    
    // Show modal with animation
    modal.style.display = "flex";
    setTimeout(() => modal.classList.add("show"), 10);
  }

  closeModal() {
    const modal = document.querySelector("#footer-modal");
    if (modal) {
      modal.classList.remove("show");
      setTimeout(() => {
        modal.style.display = "none";
      }, 300);
    }
  }

  scrollToTop() {
    const scrollDuration = 800;
    const scrollStep = -window.scrollY / (scrollDuration / 15);
    
    const scrollInterval = setInterval(() => {
      if (window.scrollY !== 0) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 15);
  }

  toggleTheme() {
    const body = document.body;
    const currentTheme = body.classList.contains("dark-theme") ? "dark" : "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    
    body.classList.toggle("dark-theme");
    localStorage.setItem("theme", newTheme);
    
    // Add transition effect
    body.style.transition = "background-color 0.3s ease, color 0.3s ease";
    setTimeout(() => {
      body.style.transition = "";
    }, 300);
  }

  setupScrollProgress() {
    const progressFill = this.container.querySelector("#progress-fill");
    const scrollButton = this.container.querySelector("#scroll-to-top");
    
    if (!progressFill || !scrollButton) return;

    window.addEventListener("scroll", () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      progressFill.style.width = `${scrollPercent}%`;
      
      // Show/hide scroll to top button
      if (scrollTop > 300) {
        scrollButton.classList.add("show");
      } else {
        scrollButton.classList.remove("show");
      }
    });
  }

  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("footer-animate-in");
        }
      });
    }, observerOptions);

    // Observe footer sections for animation
    const sections = this.container.querySelectorAll(".footer-nav-section, .footer-brand");
    sections.forEach(section => observer.observe(section));
  }

  addAnimations() {
    // Add staggered animation delays to navigation sections
    const navSections = this.container.querySelectorAll(".footer-nav-section");
    navSections.forEach((section, index) => {
      section.style.animationDelay = `${index * 0.1}s`;
    });

    // Add hover animations to links
    const links = this.container.querySelectorAll(".footer-link");
    links.forEach(link => {
      link.addEventListener("mouseenter", () => {
        link.classList.add("footer-link-hover");
      });
      
      link.addEventListener("mouseleave", () => {
        link.classList.remove("footer-link-hover");
      });
    });
  }

  // Method to inject footer into page
  appendTo(parentElement) {
    if (parentElement && this.container) {
      parentElement.appendChild(this.container);
    }
  }

  // Method to remove footer from page
  remove() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }

  // Method to get the footer container
  getContainer() {
    return this.container;
  }

  // Method to update footer based on user authentication status
  updateAuthenticationState(isAuthenticated) {
    const accountLinks = this.container.querySelectorAll('[data-route="login"], [data-route="signup"], [data-route="recovery"], [data-route="reset"]');
    const appLinks = this.container.querySelectorAll('[data-route="dashboard"], [data-route="profile"], [data-route="profile/edit"]');
    
    if (isAuthenticated) {
      // Show app links, hide auth links
      appLinks.forEach(link => link.style.display = "");
      accountLinks.forEach(link => link.style.display = "none");
    } else {
      // Show auth links, hide app links
      appLinks.forEach(link => link.style.display = "none");
      accountLinks.forEach(link => link.style.display = "");
    }
  }
}

// Initialize theme on load
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
  }
});