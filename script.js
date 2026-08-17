document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Header on scroll ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Cursor glow (desktop only) ---------- */
  const glow = document.getElementById('cursorGlow');
  if (glow && window.matchMedia('(hover: hover)').matches) {
    window.addEventListener('mousemove', (e) => {
      glow.style.opacity = '1';
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
    });
    document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- Number count-up (soporta prefijo, ej: S/) ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 1300;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + Math.round(target * eased).toLocaleString('es-PE');
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach((el) => countObserver.observe(el));

  /* ---------- FAQ accordion ---------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach((other) => {
        other.classList.remove('open');
        other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-a').style.maxHeight = '0';
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 40 + 'px';
      }
    });
  });

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  /* ---------- Rastreo de interacciones (Google Analytics) ---------- */
  const trackEvent = (name, params = {}) => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, params);
    }
  };

  // Clics en cualquier botón/enlace de WhatsApp
  document.querySelectorAll('a[href*="wa.me"]').forEach((link) => {
    link.addEventListener('click', () => {
      trackEvent('click_whatsapp', { location: link.closest('section')?.className || 'header_or_float' });
    });
  });

  // Selección de plan (mensual / anual)
  document.querySelectorAll('.plan-half .btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const plan = btn.closest('.plan-half--featured') ? 'anual' : 'mensual';
      trackEvent('select_plan', { plan });
    });
  });

  // Clics en redes sociales del footer
  document.querySelectorAll('.social-icon').forEach((icon) => {
    icon.addEventListener('click', () => {
      trackEvent('click_social', { network: icon.getAttribute('aria-label') });
    });
  });

  // Apertura de preguntas frecuentes
  faqItems.forEach((item) => {
    item.querySelector('.faq-q').addEventListener('click', () => {
      if (item.classList.contains('open')) {
        const question = item.querySelector('.faq-q span')?.textContent;
        trackEvent('open_faq', { question });
      }
    });
  });

  // Clics en el menú de navegación
  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
      trackEvent('nav_click', { section: link.getAttribute('href') });
    });
  });

});
