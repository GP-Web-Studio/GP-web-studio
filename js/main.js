/* ========================================
   Gryp – Main JS
   ======================================== */

(function () {
  'use strict';

  /* ── Header scroll class ───────────────── */
  const header = document.getElementById('header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile nav toggle ─────────────────── */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu   = document.getElementById('nav-menu');
  const bar1 = document.getElementById('bar-1');
  const bar2 = document.getElementById('bar-2');
  const bar3 = document.getElementById('bar-3');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      // Animate hamburger -> X
      if (isOpen) {
        bar1.style.transform = 'translateY(6.5px) rotate(45deg)';
        bar2.style.opacity   = '0';
        bar3.style.transform = 'translateY(-6.5px) rotate(-45deg)';
      } else {
        bar1.style.transform = '';
        bar2.style.opacity   = '';
        bar3.style.transform = '';
      }
    });

    // Close nav on link click
    navMenu.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        bar1.style.transform = '';
        bar2.style.opacity   = '';
        bar3.style.transform = '';
      });
    });
  }

  /* ── Active nav link on scroll ─────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav__link');
  const headerH   = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72;

  const highlightNav = () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - headerH - 40) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

  /* ── Scroll-reveal ─────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el, i) => {
      el.style.transitionDelay = (i % 5) * 0.06 + 's';
      observer.observe(el);
    });
  } else {
    // Fallback: show all
    revealEls.forEach(el => el.classList.add('revealed'));
  }

  /* ── Back to top ───────────────────────── */
  const btt = document.getElementById('back-to-top');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btt.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── WhatsApp floating button ───────────── */
  const waBtn = document.getElementById('wa-btn');

  if (waBtn) {
    // Muestra el boton despues de 3s o al bajar 200px
    let waShown = false;

    const showWa = () => {
      if (!waShown) {
        waShown = true;
        waBtn.classList.add('visible');
      }
    };

    // Timer de 3 segundos
    setTimeout(showWa, 3000);

    // O al scrollear 200px
    const waScrollTrigger = () => {
      if (window.scrollY > 200) showWa();
    };
    window.addEventListener('scroll', waScrollTrigger, { passive: true });

    // ── Efecto parallax con scroll ──
    // El boton se mueve suavemente hacia arriba / abajo
    // segun la velocidad de scroll (maximo ±18px)
    let lastScrollY   = window.scrollY;
    let currentOffset = 0;
    let targetOffset  = 0;
    let rafId         = null;
    let isHovered     = false;

    waBtn.addEventListener('mouseenter', () => { isHovered = true; });
    waBtn.addEventListener('mouseleave', () => { isHovered = false; });

    const updateWaPosition = () => {
      const scrollY   = window.scrollY;
      const delta     = scrollY - lastScrollY;
      lastScrollY     = scrollY;

      // Genera desplazamiento proporcional al delta del scroll
      targetOffset = Math.max(-18, Math.min(18, targetOffset + delta * 0.25));

      // Suaviza hacia 0 cuando no hay scroll
      targetOffset *= 0.88;

      // Interpola suavemente
      currentOffset += (targetOffset - currentOffset) * 0.14;

      // Solo aplica si no esta en hover (para no romper el tooltip expandido)
      if (!isHovered) {
        waBtn.classList.add('scroll-moved');
        waBtn.style.setProperty('--wa-y', currentOffset.toFixed(2) + 'px');
      } else {
        waBtn.classList.remove('scroll-moved');
        waBtn.style.removeProperty('--wa-y');
      }

      rafId = requestAnimationFrame(updateWaPosition);
    };

    // Inicia el loop de animacion
    rafId = requestAnimationFrame(updateWaPosition);
  }

  /* ── Contact form handling ─────────────── */
  const form   = document.getElementById('contact-form');
  const submit = document.getElementById('contact-submit');

  if (form && submit) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Basic validation
      const name    = document.getElementById('contact-name');
      const email   = document.getElementById('contact-email');
      const service = document.getElementById('contact-service');
      let valid = true;

      [name, email, service].forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = 'rgba(239,68,68,0.6)';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      if (!valid) return;

      // Loading state
      const originalText = submit.innerHTML;
      submit.innerHTML   = 'Enviando...';
      submit.disabled    = true;

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          submit.innerHTML = 'Mensaje enviado!';
          submit.style.background = 'linear-gradient(135deg,#10b981,#059669)';
          submit.style.color      = '#fff';
          submit.style.border     = 'none';
          form.reset();
          setTimeout(() => {
            submit.innerHTML   = originalText;
            submit.style.background = '';
            submit.style.color      = '';
            submit.style.border     = '';
            submit.disabled    = false;
          }, 4000);
        } else {
          throw new Error();
        }
      } catch {
        submit.innerHTML = 'Error - intentalo de nuevo';
        submit.style.background = 'rgba(239,68,68,0.15)';
        submit.style.borderColor = 'rgba(239,68,68,0.5)';
        submit.style.color = '#fca5a5';
        setTimeout(() => {
          submit.innerHTML = originalText;
          submit.style.background = '';
          submit.style.borderColor = '';
          submit.style.color = '';
          submit.disabled = false;
        }, 3500);
      }
    });

    // Real-time validation reset
    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => { field.style.borderColor = ''; });
    });
  }

})();
