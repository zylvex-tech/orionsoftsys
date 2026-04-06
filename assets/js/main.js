/* ========================================
   ORION SOFT SYSTEMS - Main JavaScript
   SaaS Platform v2.0
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
  
  // --- Page Loader ---
  const loader = document.querySelector('.page-loader');
  if (loader) {
    window.addEventListener('load', function() {
      setTimeout(function() {
        loader.classList.add('hidden');
      }, 400);
    });
    // Fallback: hide after 3s regardless
    setTimeout(function() {
      loader.classList.add('hidden');
    }, 3000);
  }

  // --- Mobile Navigation Toggle ---
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navbarMenu = document.querySelector('.navbar-menu');

  if (mobileToggle && navbarMenu) {
    mobileToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      navbarMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    navbarMenu.querySelectorAll('a:not(.lang-switcher *)').forEach(link => {
      link.addEventListener('click', function() {
        mobileToggle.classList.remove('active');
        navbarMenu.classList.remove('active');
      });
    });
  }

  // --- Sticky Navbar Scroll Effect ---
  const navbar = document.querySelector('.navbar');
  
  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll);

  // --- Sticky CTA Button ---
  const stickyCta = document.querySelector('.sticky-cta');
  if (stickyCta) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 600) {
        stickyCta.classList.add('visible');
      } else {
        stickyCta.classList.remove('visible');
      }
    });
  }

  // --- Scroll Animations (Intersection Observer) ---
  const fadeElements = document.querySelectorAll('.fade-in');

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => observer.observe(el));

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // --- Counter Animation for Trust Strip ---
  function animateCounter(el, target, suffix) {
    suffix = suffix || '';
    var current = 0;
    var increment = target / 60;
    var timer = setInterval(function() {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + suffix;
    }, 16);
  }

  var counters = document.querySelectorAll('.counter');
  if (counters.length > 0) {
    var counterObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var target = parseInt(entry.target.dataset.target);
          var suffix = entry.target.dataset.suffix || '';
          animateCounter(entry.target, target, suffix);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function(counter) { counterObserver.observe(counter); });
  }

  // --- Form Validation ---
  var contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      var name = this.querySelector('[name="name"]');
      var email = this.querySelector('[name="email"]');
      var message = this.querySelector('[name="message"]');
      var isValid = true;

      // Reset errors
      this.querySelectorAll('.error-message').forEach(function(el) { el.remove(); });
      this.querySelectorAll('.form-control').forEach(function(el) { el.style.borderColor = ''; });

      if (!name || !name.value.trim()) {
        showError(name, 'Please enter your name');
        isValid = false;
      }

      if (!email || !email.value.trim() || !isValidEmail(email.value)) {
        showError(email, 'Please enter a valid email');
        isValid = false;
      }

      if (!message || !message.value.trim()) {
        showError(message, 'Please enter your message');
        isValid = false;
      }

      if (isValid) {
        var btn = this.querySelector('button[type="submit"]');
        var originalText = btn.textContent;
        btn.textContent = '✓ Message Sent!';
        btn.disabled = true;
        btn.style.background = '#4caf50';
        btn.style.color = 'white';

        setTimeout(function() {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.style.background = '';
          btn.style.color = '';
          contactForm.reset();
        }, 3000);
      }
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(input, message) {
    if (!input) return;
    var formGroup = input.closest('.form-group');
    if (!formGroup) return;
    var errorEl = document.createElement('div');
    errorEl.className = 'error-message';
    errorEl.style.cssText = 'color: #e53935; font-size: 0.85rem; margin-top: 0.5rem;';
    errorEl.textContent = message;
    formGroup.appendChild(errorEl);
    input.style.borderColor = '#e53935';

    input.addEventListener('input', function() {
      input.style.borderColor = '';
      var err = formGroup.querySelector('.error-message');
      if (err) err.remove();
    }, { once: true });
  }

  // --- FAQ Accordion ---
  var faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var item = this.parentElement;
      var isOpen = item.classList.contains('open');
      
      // Close all
      document.querySelectorAll('.faq-item').forEach(function(el) {
        el.classList.remove('open');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  // --- Active Navigation Link Highlight ---
  var currentPath = window.location.pathname.split('/').pop() || 'index.html';
  var navLinks = document.querySelectorAll('.navbar-menu > a:not(.btn)');

  navLinks.forEach(function(link) {
    var href = link.getAttribute('href');
    if (!href) return;
    
    // Remove active from all
    link.classList.remove('active');
    
    // Check match
    var hrefBase = href.split('/').pop();
    if (hrefBase === currentPath) {
      link.classList.add('active');
    }
  });

});
