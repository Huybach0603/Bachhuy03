/* ============================================================
   SCRIPT.JS — Bạch Huỳnh Anh Huy | Civil Engineer Portfolio
   Full Interactive JavaScript — Vanilla JS Only
   ============================================================ */

'use strict';

/* ===== DOM CONTENT LOADED ===== */
document.addEventListener('DOMContentLoaded', function () {

  /* ===================================================
     1. LOADING SCREEN
  =================================================== */
  const loader = document.getElementById('loader');

  if (loader) {
    document.body.classList.add('loading');
    // Remove loader after 2.2 seconds (after progress animation)
    setTimeout(function () {
      loader.classList.add('hide');
      document.body.classList.remove('loading');
      // Remove from DOM after fade out
      setTimeout(function () {
        loader.remove();
        // Initialize AOS after loader is done
        initAOS();
        // Trigger visible animations
        triggerInitialAnimations();
      }, 500);
    }, 2200);
  } else {
    initAOS();
    triggerInitialAnimations();
  }

  /* ===================================================
     2. AOS ANIMATION INITIALIZATION
  =================================================== */
  function initAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 80,
        delay: 0,
      });
    }
  }

  /* ===================================================
     3. TYPED.JS TYPING ANIMATION
  =================================================== */
  function initTypedJS() {
    const typingEl = document.getElementById('typingText');
    if (!typingEl) return;

    // Check if Typed.js library loaded
    if (typeof Typed !== 'undefined') {
      new Typed('#typingText', {
        strings: [
          'Civil Engineer',
          'Site Supervisor',
          'Project Manager',
          'Construction Engineer',
          'QC/QA Engineer',
          'Field Engineer',
        ],
        typeSpeed: 70,
        backSpeed: 40,
        backDelay: 1800,
        startDelay: 300,
        loop: true,
        showCursor: false,
      });
    } else {
      // Fallback: manual typing without library
      const texts = [
        'Civil Engineer',
        'Site Supervisor',
        'Project Manager',
        'Construction Engineer',
      ];
      let textIndex = 0;
      let charIndex = 0;
      let isDeleting = false;

      function typeManual() {
        const currentText = texts[textIndex];
        if (!isDeleting) {
          typingEl.textContent = currentText.substring(0, charIndex + 1);
          charIndex++;
          if (charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(typeManual, 1800);
            return;
          }
        } else {
          typingEl.textContent = currentText.substring(0, charIndex - 1);
          charIndex--;
          if (charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
          }
        }
        setTimeout(typeManual, isDeleting ? 50 : 80);
      }
      typeManual();
    }
  }

  // Initialize typing after loader
  setTimeout(initTypedJS, 2400);

  /* ===================================================
     4. NAVBAR — Scroll behavior + Active link
  =================================================== */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Sticky Navbar on scroll
  function handleNavbarScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Active nav link highlight based on scroll position
  function updateActiveNavLink() {
    const scrollPos = window.scrollY + var_navHeight() + 50;

    sections.forEach(function (section) {
      const sectionTop    = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId     = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(function (link) { link.classList.remove('active'); });
        const activeLink = document.querySelector('.nav-link[href="#' + sectionId + '"]');
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }

  function var_navHeight() {
    return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
  }

  window.addEventListener('scroll', function () {
    handleNavbarScroll();
    updateActiveNavLink();
    handleBackToTop();
  });

  // Smooth scroll for nav links
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const top = target.offsetTop - var_navHeight();
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
        // Close mobile menu
        closeMobileMenu();
      }
    });
  });

  /* ===================================================
     5. HAMBURGER MOBILE MENU
  =================================================== */
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navMenu');

  function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMobileMenu);
  }

  // Close menu on click outside
  document.addEventListener('click', function (e) {
    if (navMenu && navMenu.classList.contains('open')) {
      if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        closeMobileMenu();
      }
    }
  });

  /* ===================================================
     6. CANVAS PARTICLE ANIMATION (Hero Background)
  =================================================== */
  function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particleCanvas';
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';

    const particleContainer = document.getElementById('particles');
    if (!particleContainer) return;
    particleContainer.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrame;

    function resize() {
      canvas.width  = particleContainer.offsetWidth;
      canvas.height = particleContainer.offsetHeight;
    }

    resize();
    window.addEventListener('resize', debounce(resize, 200));

    // Particle class
    function Particle() {
      this.x      = Math.random() * canvas.width;
      this.y      = Math.random() * canvas.height;
      this.vx     = (Math.random() - 0.5) * 0.4;
      this.vy     = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.5 + 0.5;
      this.alpha  = Math.random() * 0.5 + 0.1;
      this.color  = Math.random() > 0.5 ? '14, 165, 164' : '30, 58, 138';
    }

    Particle.prototype.update = function () {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;
    };

    Particle.prototype.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + this.color + ', ' + this.alpha + ')';
      ctx.fill();
    };

    // Create particles
    const PARTICLE_COUNT = Math.min(80, Math.floor(canvas.width * canvas.height / 12000));
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    // Draw lines between nearby particles
    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x;
          const dy   = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(14, 165, 164, ' + (0.06 * (1 - dist / 120)) + ')';
            ctx.lineWidth   = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(function (p) {
        p.update();
        p.draw();
      });
      drawConnections();
      animationFrame = requestAnimationFrame(animate);
    }

    animate();
  }

  initParticles();

  /* ===================================================
     7. SKILL BARS ANIMATION (Intersection Observer)
  =================================================== */
  function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    const gpaBar    = document.querySelector('.gpa-bar-fill');
    const progFills = document.querySelectorAll('.progress-fill');

    // Animate GPA bar
    if (gpaBar) {
      const gpaObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const targetWidth = entry.target.closest('.gpa-bar').dataset.gpa || '85';
            entry.target.style.width = targetWidth + '%';
            gpaObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      gpaObs.observe(gpaBar);
    }

    // Animate skill bars
    if (skillBars.length) {
      const skillObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const targetWidth = entry.target.dataset.width || '0';
            entry.target.style.width = targetWidth + '%';
            skillObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      skillBars.forEach(function (bar) { skillObs.observe(bar); });
    }

    // Animate project progress fills
    if (progFills.length) {
      const progObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const targetProg = entry.target.dataset.progress || '0';
            entry.target.style.width = targetProg + '%';
            progObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      progFills.forEach(function (fill) { progObs.observe(fill); });
    }
  }

  initSkillBars();

  /* ===================================================
     8. PROJECT FILTER FUNCTIONALITY
  =================================================== */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const filter = btn.getAttribute('data-filter');

      // Update active button
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      // Filter cards with animation
      projectCards.forEach(function (card) {
        const category = card.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ===================================================
     9. PROJECT MODAL
  =================================================== */
  // Project data
  const projectsData = [
    {
      title:    '4-Story Residential Townhouse',
      img:      'https://images.pexels.com/photos/5505131/pexels-photo-5505131.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      role:     'Construction Site Supervisor',
      year:     '2025',
      duration: '6 Months',
      status:   'Completed',
      desc:     'Supervised the complete construction of a 4-story reinforced concrete residential townhouse in Cần Thơ. Responsibilities included overseeing structural works (foundation, columns, beams, slabs), MEP rough-in systems, interior finishing works, and final acceptance. Ensured full compliance with approved architectural and structural drawings throughout all construction phases.',
      details: [
        'Supervised excavation and deep foundation works',
        'Oversaw reinforced concrete structural works for 4 floors',
        'Coordinated MEP (Mechanical, Electrical, Plumbing) systems',
        'Managed interior plastering, tiling, and painting works',
        'Prepared acceptance records at each construction phase',
        'Conducted daily quality control inspections',
      ],
      tags: ['AutoCAD 2D', 'MS Excel', 'QC/QA', 'Quantity Take-Off', 'Structural Engineering', 'Site Supervision'],
    },
    {
      title:    'Urban Road Expansion & Drainage System',
      img:      'https://images.pexels.com/photos/28842903/pexels-photo-28842903.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      role:     'Project Engineer',
      year:     '2025',
      duration: '8 Months',
      status:   'In Progress (85%)',
      desc:     'Led coordination and supervision of an urban road expansion project covering 1.2 km of road widening, asphalt concrete pavement installation, underground stormwater drainage system, concrete curb and gutter installation, traffic signage and road markings. Prepared complete payment documentation and final settlement records for client submission.',
      details: [
        'Supervised road subgrade preparation and compaction',
        'Oversaw asphalt concrete base course and wearing course paving',
        'Managed installation of precast concrete drainage pipes (D600–D1000)',
        'Coordinated concrete curb, gutter and sidewalk construction',
        'Prepared BOQ, payment certificates and settlement documentation',
        'Monitored construction schedule and reported weekly progress',
      ],
      tags: ['AutoCAD 2D', 'MS Project', 'F1 Software', 'Payment Documentation', 'Road Engineering', 'Settlement Docs'],
    },
    {
      title:    'Steel Structure Industrial Warehouse',
      img:      'https://images.pexels.com/photos/8961073/pexels-photo-8961073.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      role:     'Site Assistant Engineer',
      year:     '2024',
      duration: '4 Months',
      status:   'Completed',
      desc:     'Assisted senior engineers in supervising and documenting the construction of a large-span steel structure industrial warehouse (60m × 120m × 9m clear height). Involved in structural steel inspection, bolt torque testing, roof and wall cladding installation, and preparation of complete acceptance records and handover documentation.',
      details: [
        'Assisted in structural steel erection supervision and inspection',
        'Conducted high-strength bolt torque verification testing',
        'Supervised roof and wall panel cladding installation',
        'Checked structural weld quality and anti-corrosion coating',
        'Prepared material inspection records and test certificates',
        'Participated in final acceptance documentation and handover',
      ],
      tags: ['SAP2000', 'ETABS', 'AutoCAD 2D', 'ETA Software', 'Steel Structure', 'Acceptance Records'],
    },
  ];

  const modal      = document.getElementById('projectModal');
  const modalClose = document.getElementById('modalClose');
  const modalContent = document.getElementById('modalContent');

  // Open modal
  window.openProjectModal = function (index) {
    const p = projectsData[index];
    if (!p || !modal) return;

    const detailsHTML = p.details.map(function (d) {
      return '<li><i class="fas fa-check-circle" style="color:var(--color-accent);margin-right:8px;"></i>' + d + '</li>';
    }).join('');

    const tagsHTML = p.tags.map(function (t) {
      return '<span class="tech-tag">' + t + '</span>';
    }).join('');

    modalContent.innerHTML = `
      <img src="${p.img}" alt="${p.title}" class="modal-project-img" />
      <h2 class="modal-project-title">${p.title}</h2>
      <p class="modal-project-role"><i class="fas fa-user-hard-hat"></i> ${p.role}</p>

      <div class="modal-meta-row">
        <div class="modal-meta-item">
          <span class="modal-meta-label">Year</span>
          <span class="modal-meta-value">${p.year}</span>
        </div>
        <div class="modal-meta-item">
          <span class="modal-meta-label">Duration</span>
          <span class="modal-meta-value">${p.duration}</span>
        </div>
        <div class="modal-meta-item">
          <span class="modal-meta-label">Status</span>
          <span class="modal-meta-value" style="color:var(--color-green);">${p.status}</span>
        </div>
      </div>

      <p class="modal-project-desc">${p.desc}</p>

      <h4 style="font-family:var(--font-accent);font-size:0.82rem;font-weight:700;color:var(--color-text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">
        <i class="fas fa-list-ul" style="color:var(--color-accent);margin-right:6px;"></i>
        Key Activities
      </h4>
      <ul style="display:flex;flex-direction:column;gap:8px;margin-bottom:20px;">
        ${detailsHTML}
      </ul>

      <h4 style="font-family:var(--font-accent);font-size:0.82rem;font-weight:700;color:var(--color-text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">
        <i class="fas fa-tools" style="color:var(--color-accent);margin-right:6px;"></i>
        Tools & Technologies
      </h4>
      <div class="modal-tags">${tagsHTML}</div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // Close modal
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
  }

  // Escape key closes modal
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  /* ===================================================
     10. CONTACT FORM — Local Handling (no backend)
  =================================================== */
  const contactForm    = document.getElementById('contactForm');
  const formSuccessMsg = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      handleFormSubmit(e);
    });
  }

  window.handleFormSubmit = function (e) {
    if (e) e.preventDefault();

    const form       = document.getElementById('contactForm');
    const successMsg = document.getElementById('formSuccess');
    const submitBtn  = form.querySelector('.form-submit-btn');

    if (!form || !submitBtn) return;

    // Disable button during "sending"
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    // Simulate sending (since no backend)
    setTimeout(function () {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';

      // Show success
      if (successMsg) {
        successMsg.classList.add('show');
        setTimeout(function () { successMsg.classList.remove('show'); }, 5000);
      }

      // Reset form
      form.reset();
    }, 1800);
  };

  /* ===================================================
     11. BACK TO TOP BUTTON
  =================================================== */
  const backToTopBtn = document.getElementById('backToTop');

  function handleBackToTop() {
    if (!backToTopBtn) return;
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  }

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ===================================================
     12. TRIGGER INITIAL ANIMATIONS (after loader)
  =================================================== */
  function triggerInitialAnimations() {
    // Hero badge
    const heroElements = document.querySelectorAll(
      '.hero-badge, .hero-name, .hero-typing-wrapper, .hero-slogan, .hero-stats, .hero-buttons, .hero-socials, .hero-avatar-wrapper'
    );
    heroElements.forEach(function (el) {
      el.style.opacity = '1';
    });
  }

  /* ===================================================
     13. SMOOTH SCROLL FOR ALL ANCHOR LINKS
  =================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const top = target.offsetTop - var_navHeight();
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ===================================================
     14. HOVER GLOW EFFECT ON CARDS (mousemove)
  =================================================== */
  function initCardGlowEffect() {
    const glowCards = document.querySelectorAll(
      '.project-card, .cert-card, .do-card, .pro-skill-card, .edu-mini-card, .contact-card, .timeline-content'
    );

    glowCards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        const rect   = card.getBoundingClientRect();
        const x      = e.clientX - rect.left;
        const y      = e.clientY - rect.top;
        const xPct   = (x / rect.width  - 0.5) * 20;
        const yPct   = (y / rect.height - 0.5) * 20;

        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');
      });
    });
  }

  initCardGlowEffect();

  /* ===================================================
     15. NAVBAR LOGO ANIMATED HOVER
  =================================================== */
  const navLogo = document.querySelector('.nav-logo');
  if (navLogo) {
    navLogo.addEventListener('mouseenter', function () {
      this.style.filter = 'drop-shadow(0 0 10px rgba(14,165,164,0.5))';
    });
    navLogo.addEventListener('mouseleave', function () {
      this.style.filter = '';
    });
  }

  /* ===================================================
     16. SCROLL REVEAL — Custom fallback if AOS not available
  =================================================== */
  function initScrollReveal() {
    const revealEls = document.querySelectorAll('[data-aos]');
    if (typeof AOS !== 'undefined') return; // AOS handles this

    const revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity    = '1';
          entry.target.style.transform  = 'translateY(0)';
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealEls.forEach(function (el) {
      el.style.opacity   = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      revealObs.observe(el);
    });
  }

  initScrollReveal();

  /* ===================================================
     17. ANIMATED COUNTER FOR HERO STATS
  =================================================== */
  function animateCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');

    statNumbers.forEach(function (el) {
      const text = el.textContent.replace(/[^0-9.]/g, '');
      const target = parseFloat(text);
      const suffix = el.textContent.replace(/[0-9.]/g, '').trim();
      const isDecimal = text.includes('.');

      if (isNaN(target)) return;

      let start = 0;
      const duration = 2000;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed  = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3); // ease out cubic
        const current  = start + (target - start) * eased;

        el.textContent = (isDecimal ? current.toFixed(2) : Math.floor(current)) + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = text + suffix;
        }
      }

      // Start only when visible
      const obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            requestAnimationFrame(update);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      obs.observe(el);
    });
  }

  animateCounters();

  /* ===================================================
     18. ACTIVE SECTION HIGHLIGHT — Enhanced
  =================================================== */
  function initSectionObserver() {
    const sectionObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, {
      rootMargin: '-' + var_navHeight() + 'px 0px -40% 0px',
      threshold: 0,
    });

    sections.forEach(function (section) { sectionObs.observe(section); });
  }

  initSectionObserver();

  /* ===================================================
     19. WINDOW RESIZE HANDLER
  =================================================== */
  window.addEventListener('resize', debounce(function () {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  }, 200));

  /* ===================================================
     20. UTILITY: DEBOUNCE FUNCTION
  =================================================== */
  function debounce(fn, delay) {
    let timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(fn, delay);
    };
  }

  /* ===================================================
     21. CURSOR EFFECT (subtle glow trail)
  =================================================== */
  function initCursorEffect() {
    // Only on desktop
    if (window.innerWidth < 768) return;

    const hero = document.querySelector('.hero');
    if (!hero) return;

    hero.addEventListener('mousemove', function (e) {
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Move gradient towards cursor
      hero.style.background =
        'radial-gradient(800px circle at ' + x + 'px ' + y + 'px, rgba(14,165,164,0.06) 0%, transparent 50%), ' +
        'var(--grad-hero)';
    });

    hero.addEventListener('mouseleave', function () {
      hero.style.background = 'var(--grad-hero)';
    });
  }

  initCursorEffect();

  /* ===================================================
     22. CERTIFICATE CARD TILT EFFECT
  =================================================== */
  function initCardTilt() {
    if (window.innerWidth < 768) return;

    const tiltCards = document.querySelectorAll('.cert-card, .edu-mini-card');

    tiltCards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        const rect   = card.getBoundingClientRect();
        const x      = e.clientX - rect.left - rect.width  / 2;
        const y      = e.clientY - rect.top  - rect.height / 2;
        const tiltX  = -(y / rect.height) * 8;
        const tiltY  =  (x / rect.width)  * 8;

        card.style.transform = 'translateY(-6px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg)';
        card.style.transition = 'transform 0.1s ease';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
        card.style.transition = 'transform 0.4s ease';
      });
    });
  }

  initCardTilt();

  /* ===================================================
     23. HERO FLOATING SHAPES — MOUSE PARALLAX
  =================================================== */
  function initParallaxShapes() {
    if (window.innerWidth < 768) return;

    const shapes = document.querySelectorAll('.shape');
    if (!shapes.length) return;

    document.addEventListener('mousemove', function (e) {
      const xPct = (e.clientX / window.innerWidth  - 0.5) * 2;
      const yPct = (e.clientY / window.innerHeight - 0.5) * 2;

      shapes.forEach(function (shape, i) {
        const depth = (i + 1) * 4;
        const tx = xPct * depth;
        const ty = yPct * depth;
        shape.style.transform = 'translate(' + tx + 'px, ' + ty + 'px)';
      });
    });
  }

  initParallaxShapes();

  /* ===================================================
     24. COPY EMAIL ON CLICK
  =================================================== */
  const emailEls = document.querySelectorAll('a[href^="mailto:"]');
  emailEls.forEach(function (el) {
    el.addEventListener('click', function (e) {
      // Allow default mailto behavior
      // Optionally show a toast message
      showToast('Opening email client...');
    });
  });

  /* ===================================================
     25. TOAST NOTIFICATION
  =================================================== */
  function showToast(message) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = '<i class="fas fa-info-circle"></i> ' + message;
    toast.style.cssText = `
      position: fixed;
      bottom: 80px;
      right: 28px;
      background: rgba(15,23,42,0.95);
      border: 1px solid rgba(14,165,164,0.4);
      color: #0EA5A4;
      padding: 12px 20px;
      border-radius: 10px;
      font-family: 'Poppins', sans-serif;
      font-size: 0.82rem;
      font-weight: 600;
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 8px;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
      animation: toastIn 0.3s ease forwards;
    `;

    document.body.appendChild(toast);

    setTimeout(function () {
      toast.style.animation = 'toastOut 0.3s ease forwards';
      setTimeout(function () { toast.remove(); }, 300);
    }, 3000);
  }

  // Toast keyframes injection
  const toastStyle = document.createElement('style');
  toastStyle.textContent = `
    @keyframes toastIn {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes toastOut {
      from { opacity: 1; transform: translateY(0); }
      to   { opacity: 0; transform: translateY(20px); }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(toastStyle);

  /* ===================================================
     INITIALIZE INITIAL SCROLL STATE
  =================================================== */
  handleNavbarScroll();
  handleBackToTop();

  console.log('%c[BAH] Portfolio Loaded Successfully ✓', 'color: #0EA5A4; font-family: Poppins; font-size: 14px; font-weight: bold;');
  console.log('%cBạch Huỳnh Anh Huy | Civil Engineer Portfolio', 'color: #22C55E; font-family: Inter; font-size: 12px;');

}); /* END DOMContentLoaded */
