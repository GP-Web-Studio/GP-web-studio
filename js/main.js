// ==========================================
// GP Web Studio - Main JavaScript
// ==========================================

"use strict";

// ===== Navigation Toggle =====
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    navToggle.classList.toggle("active");
  });

  // Close menu when clicking on links
  const navLinks = document.querySelectorAll(".nav__link");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
    }
  });
}

// ===== Header Scroll Effect =====
const header = document.getElementById("header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// ===== Active Navigation Link =====
const sections = document.querySelectorAll("section[id]");

function scrollActive() {
  const scrollY = window.pageYOffset;

  sections.forEach((section) => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute("id");
    const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

    if (navLink) {
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLink.classList.add("active");
      } else {
        navLink.classList.remove("active");
      }
    }
  });
}

window.addEventListener("scroll", scrollActive);

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));

    if (target) {
      const offsetTop = target.offsetTop - 70;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// ===== Back to Top Button =====
const backToTop = document.getElementById("back-to-top");

if (backToTop) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// ===== Form Validation and Submission =====
const contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    // Let Formspree handle the submission
    // You can add custom validation or actions here if needed

    // Optional: Show loading state
    const submitButton = this.querySelector('button[type="submit"]');
    if (submitButton) {
      const originalText = submitButton.textContent;
      submitButton.textContent = "Sending...";
      submitButton.disabled = true;

      // Re-enable after submission (Formspree will redirect or show message)
      setTimeout(() => {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }, 3000);
    }
  });

  // Basic client-side validation
  const requiredFields = contactForm.querySelectorAll("[required]");
  requiredFields.forEach((field) => {
    field.addEventListener("invalid", function (e) {
      e.preventDefault();
      this.classList.add("error");
    });

    field.addEventListener("input", function () {
      if (this.validity.valid) {
        this.classList.remove("error");
      }
    });
  });
}

// ===== Scroll Reveal Animation =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-fadeInUp");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe elements for animation
const animateElements = document.querySelectorAll(
  ".service-card, .process-step, .portfolio-card, .pricing-card",
);

animateElements.forEach((el) => {
  el.style.opacity = "0";
  observer.observe(el);
});

// Add opacity transition
const style = document.createElement("style");
style.textContent = `
    .service-card,
    .process-step,
    .portfolio-card,
    .pricing-card {
        transition: opacity 0.6s ease-out;
    }
    
    .animate-fadeInUp {
        opacity: 1 !important;
    }
    
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: var(--color-error);
        animation: shake 0.5s;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// ===== Log to Console (Remove in production) =====
console.log(
  "%c🌐 GP Web Studio",
  "color: #4A90E2; font-size: 24px; font-weight: bold;",
);
console.log(
  "%cSite developed with ❤️ by GP Web Studio",
  "color: #666; font-size: 12px;",
);
console.log(
  "%cHTML5 • CSS3 • JavaScript • Formspree • Netlify",
  "color: #999; font-size: 10px;",
);
