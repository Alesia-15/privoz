document.addEventListener("DOMContentLoaded", () => {
  /* ======================================================
     SETTINGS
  ====================================================== */

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* ======================================================
     UNIVERSAL REVEAL
  ====================================================== */

  function prepareReveal(
    element,
    animationClass = "about-reveal-up",
    delay = 0,
  ) {
    if (!element) return;

    element.classList.add(animationClass);

    if (delay) {
      element.style.transitionDelay = `${delay}s`;
    }
  }

  const revealElements = [];

  /* ======================================================
     ABOUT INTRO
  ====================================================== */

  const aboutIntroSection = document.querySelector(".about-intro");

  if (aboutIntroSection) {
    const aboutImage = aboutIntroSection.querySelector(".about-intro-image");

    const aboutYear = aboutIntroSection.querySelector(".about-intro-year");

    const aboutMediaCaption = aboutIntroSection.querySelector(
      ".about-intro-media-caption",
    );

    const aboutHead = aboutIntroSection.querySelector(".about-intro-head");

    const aboutTitle = aboutIntroSection.querySelector(".about-intro-title");

    const aboutParagraphs = aboutIntroSection.querySelectorAll(
      ".about-intro-text p",
    );

    const aboutAccent = aboutIntroSection.querySelector(".about-intro-accent");

    prepareReveal(aboutImage, "about-reveal-left");

    prepareReveal(aboutYear, "about-reveal-scale", 0.15);

    prepareReveal(aboutMediaCaption, "about-reveal-up", 0.22);

    prepareReveal(aboutHead, "about-reveal-right");

    prepareReveal(aboutTitle, "about-reveal-right", 0.1);

    aboutParagraphs.forEach((paragraph, index) => {
      prepareReveal(paragraph, "about-reveal-up", 0.12 + index * 0.08);
    });

    prepareReveal(aboutAccent, "about-reveal-up", 0.34);
  }

  /* ======================================================
     NUMBERS
  ====================================================== */

  const numbersSection = document.querySelector(".about-numbers");

  if (numbersSection) {
    prepareReveal(
      numbersSection.querySelector(".about-section-label"),
      "about-reveal-up",
    );

    prepareReveal(
      numbersSection.querySelector(".about-numbers-title"),
      "about-reveal-up",
      0.1,
    );

    numbersSection
      .querySelectorAll(".about-number-item")
      .forEach((item, index) => {
        prepareReveal(item, "about-reveal-up", (index % 4) * 0.08);
      });
  }

  /* ======================================================
     TRUST
  ====================================================== */

  const trustSection = document.querySelector(".about-trust");

  if (trustSection) {
    prepareReveal(
      trustSection.querySelector(".about-section-label"),
      "about-reveal-up",
    );

    prepareReveal(
      trustSection.querySelector(".about-trust-title"),
      "about-reveal-up",
      0.1,
    );

    trustSection
      .querySelectorAll(".about-trust-card")
      .forEach((card, index) => {
        prepareReveal(card, "about-reveal-up", index * 0.06);
      });
  }

  /* ======================================================
     CAREERS
  ====================================================== */

  const careersSection = document.querySelector(".about-careers");

  if (careersSection) {
    prepareReveal(
      careersSection.querySelector(".about-section-label"),
      "about-reveal-up",
    );

    prepareReveal(
      careersSection.querySelector(".about-careers-title"),
      "about-reveal-up",
      0.1,
    );

    prepareReveal(
      careersSection.querySelector(".about-careers-subhead"),
      "about-reveal-up",
      0.16,
    );

    careersSection
      .querySelectorAll(".about-career-card")
      .forEach((card, index) => {
        prepareReveal(card, "about-reveal-up", index * 0.08);
      });
  }

  /* ======================================================
     ADDRESSES
  ====================================================== */

  const addressesSection = document.querySelector(".about-addresses");

  if (addressesSection) {
    prepareReveal(
      addressesSection.querySelector(".about-section-label"),
      "about-reveal-up",
    );

    prepareReveal(
      addressesSection.querySelector(".about-addresses-title"),
      "about-reveal-up",
      0.1,
    );

    prepareReveal(
      addressesSection.querySelector(".about-addresses-description"),
      "about-reveal-up",
      0.16,
    );

    addressesSection
      .querySelectorAll(".about-address-card")
      .forEach((card, index) => {
        prepareReveal(card, "about-reveal-up", index * 0.08);
      });
  }

  /* ======================================================
     CONTACTS
  ====================================================== */

  const contactsSection = document.querySelector(".about-contacts");

  if (contactsSection) {
    prepareReveal(
      contactsSection.querySelector(".about-section-label"),
      "about-reveal-up",
    );

    prepareReveal(
      contactsSection.querySelector(".about-contacts-title"),
      "about-reveal-up",
      0.1,
    );

    contactsSection
      .querySelectorAll(".about-contact-section")
      .forEach((section) => {
        const copy = section.querySelector(".about-contact-copy");

        const info = section.querySelector(".about-contact-info");

        const management = section.querySelector(".about-management-action");

        const reverse = section.querySelector(
          ".about-contact-container-reverse",
        );

        prepareReveal(
          copy,
          reverse ? "about-reveal-right" : "about-reveal-left",
        );

        prepareReveal(
          info || management,
          reverse ? "about-reveal-left" : "about-reveal-right",
          0.12,
        );
      });
  }

  /* ======================================================
     FOOTER
  ====================================================== */

  const aboutFooter = document.querySelector(".about-footer");

  if (aboutFooter) {
    const footerItems = [
      aboutFooter.querySelector(".about-footer-brand"),
      ...aboutFooter.querySelectorAll(".about-footer-column"),
      aboutFooter.querySelector(".about-footer-bottom"),
    ];

    footerItems.forEach((item, index) => {
      prepareReveal(item, "about-reveal-up", index * 0.07);
    });
  }

  /* ======================================================
     COLLECT REVEAL ELEMENTS
  ====================================================== */

  document
    .querySelectorAll(
      ".about-reveal-up, " +
        ".about-reveal-left, " +
        ".about-reveal-right, " +
        ".about-reveal-scale",
    )
    .forEach((element) => {
      revealElements.push(element);
    });

  /* ======================================================
     REVEAL OBSERVER
  ====================================================== */

  if (prefersReducedMotion) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  /* ======================================================
     HERO PARALLAX
  ====================================================== */

  const aboutHero = document.querySelector(".about-hero");

  if (aboutHero) {
    const heroGlowOne = aboutHero.querySelector(".about-hero-glow-1");

    const heroGlowTwo = aboutHero.querySelector(".about-hero-glow-2");

    function updateHeroParallax() {
      if (prefersReducedMotion || window.innerWidth <= 768) {
        return;
      }

      const rect = aboutHero.getBoundingClientRect();

      if (rect.bottom <= 0 || rect.top >= window.innerHeight) {
        return;
      }

      const scrollY = window.scrollY;

      if (heroGlowOne) {
        heroGlowOne.style.transform = `translateY(${scrollY * 0.1}px)`;
      }

      if (heroGlowTwo) {
        heroGlowTwo.style.transform = `translateY(${scrollY * 0.16}px)`;
      }
    }

    window.addEventListener("scroll", updateHeroParallax, {
      passive: true,
    });

    updateHeroParallax();
  }

  /* ======================================================
     NUMBER COUNTERS
  ====================================================== */

  const counters = document.querySelectorAll(
    ".about-number-counter[data-number]",
  );

  if (counters.length) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const counter = entry.target;

          const target = Number(counter.dataset.number);

          if (!target || prefersReducedMotion) {
            if (target) {
              counter.textContent = target.toLocaleString("ru-RU");
            }

            observer.unobserve(counter);

            return;
          }

          const duration = 1400;

          const startTime = performance.now();

          function animate(currentTime) {
            const progress = Math.min((currentTime - startTime) / duration, 1);

            const eased = 1 - Math.pow(1 - progress, 3);

            const current = Math.round(target * eased);

            counter.textContent = current.toLocaleString("ru-RU");

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          }

          requestAnimationFrame(animate);

          observer.unobserve(counter);
        });
      },
      {
        threshold: 0.45,
      },
    );

    counters.forEach((counter) => {
      counterObserver.observe(counter);
    });
  }

  /* ======================================================
     TRUST SLIDER
  ====================================================== */

  const trustSlider = document.querySelector(".about-trust-slider");

  if (trustSlider) {
    const track = trustSlider.querySelector(".about-trust-track");

    const cards = Array.from(trustSlider.querySelectorAll(".about-trust-card"));

    const prev = trustSlider.querySelector(".about-trust-arrow-prev");

    const next = trustSlider.querySelector(".about-trust-arrow-next");

    const progress = trustSlider.querySelector(".about-trust-progress span");

    let currentIndex = 0;

    function getVisibleCount() {
      if (window.innerWidth <= 768) {
        return 2;
      }

      if (window.innerWidth <= 1120) {
        return 3;
      }

      return 5;
    }

    function updateTrustSlider() {
      if (!track || !cards.length) {
        return;
      }

      const visible = getVisibleCount();

      const maxIndex = Math.max(cards.length - visible, 0);

      currentIndex = Math.min(currentIndex, maxIndex);

      /*
        Если карточек ровно столько,
        сколько помещается —
        движения не будет.
      */

      if (!maxIndex) {
        track.style.transform = "translateX(0)";

        if (progress) {
          progress.style.width = "100%";
        }

        return;
      }

      const firstCard = cards[0];

      const styles = window.getComputedStyle(track);

      const gap = parseFloat(styles.columnGap || styles.gap || 0);

      const cardWidth = firstCard.getBoundingClientRect().width;

      const offset = (cardWidth + gap) * currentIndex;

      track.style.transform = `translateX(-${offset}px)`;

      if (progress) {
        const progressPercent = ((currentIndex + 1) / (maxIndex + 1)) * 100;

        progress.style.width = `${progressPercent}%`;
      }

      if (prev) {
        prev.disabled = currentIndex === 0;
      }

      if (next) {
        next.disabled = currentIndex === maxIndex;
      }
    }

    if (prev) {
      prev.addEventListener("click", () => {
        currentIndex = Math.max(currentIndex - 1, 0);

        updateTrustSlider();
      });
    }

    if (next) {
      next.addEventListener("click", () => {
        const maxIndex = Math.max(cards.length - getVisibleCount(), 0);

        currentIndex = Math.min(currentIndex + 1, maxIndex);

        updateTrustSlider();
      });
    }

    updateTrustSlider();

    window.addEventListener("resize", updateTrustSlider);
  }

  /* ======================================================
     CAREER MODAL
  ====================================================== */

  const careerModal = document.querySelector(".career-modal");

  const careerButtons = document.querySelectorAll(".about-career-button");

  if (careerModal && careerButtons.length) {
    const closeButton = careerModal.querySelector(".career-modal-close");

    const backdrop = careerModal.querySelector(".career-modal-backdrop");

    const vacancySelect = careerModal.querySelector("#career-vacancy");

    const form = careerModal.querySelector(".career-form");

    const success = careerModal.querySelector(".career-form-success");

    const fileInput = careerModal.querySelector("#career-file");

    const fileTitle = careerModal.querySelector(".career-file-text strong");

    function openCareerModal(vacancy = "") {
      careerModal.classList.add("is-open");

      careerModal.setAttribute("aria-hidden", "false");

      document.body.style.overflow = "hidden";

      if (vacancySelect && vacancy) {
        vacancySelect.value = vacancy;
      }
    }

    function closeCareerModal() {
      careerModal.classList.remove("is-open");

      careerModal.setAttribute("aria-hidden", "true");

      document.body.style.overflow = "";
    }

    careerButtons.forEach((button) => {
      button.addEventListener("click", () => {
        openCareerModal(button.dataset.vacancy || "");
      });
    });

    if (closeButton) {
      closeButton.addEventListener("click", closeCareerModal);
    }

    if (backdrop) {
      backdrop.addEventListener("click", closeCareerModal);
    }

    /* FILE NAME */

    if (fileInput && fileTitle) {
      fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];

        fileTitle.textContent = file ? file.name : "Выбрать файл";
      });
    }

    /* FORM */

    if (form) {
      form.addEventListener("submit", (event) => {
        /*
            Backend пока не подключён.
          */

        event.preventDefault();

        if (!form.checkValidity()) {
          form.reportValidity();

          return;
        }

        if (success) {
          success.style.display = "block";
        }
      });
    }
  }

  /* ======================================================
     MANAGEMENT MODAL
  ====================================================== */

  const managementModal = document.querySelector(".management-modal");

  const managementOpen = document.querySelector(".about-management-button");

  if (managementModal && managementOpen) {
    const closeButton = managementModal.querySelector(
      ".management-modal-close",
    );

    const backdrop = managementModal.querySelector(
      ".management-modal-backdrop",
    );

    const form = managementModal.querySelector(".management-form");

    const success = managementModal.querySelector(".management-form-success");

    const fileInput = managementModal.querySelector("#management-file");

    const fileTitle = managementModal.querySelector(
      ".management-file-text strong",
    );

    function openManagementModal() {
      managementModal.classList.add("is-open");

      managementModal.setAttribute("aria-hidden", "false");

      document.body.style.overflow = "hidden";
    }

    function closeManagementModal() {
      managementModal.classList.remove("is-open");

      managementModal.setAttribute("aria-hidden", "true");

      document.body.style.overflow = "";
    }

    managementOpen.addEventListener("click", openManagementModal);

    if (closeButton) {
      closeButton.addEventListener("click", closeManagementModal);
    }

    if (backdrop) {
      backdrop.addEventListener("click", closeManagementModal);
    }

    /* FILE NAME */

    if (fileInput && fileTitle) {
      fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];

        fileTitle.textContent = file ? file.name : "Выбрать файл";
      });
    }

    /* FORM */

    if (form) {
      form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!form.checkValidity()) {
          form.reportValidity();

          return;
        }

        if (success) {
          success.style.display = "block";
        }
      });
    }
  }

  /* ======================================================
     ESC CLOSE MODALS
  ====================================================== */

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    if (careerModal && careerModal.classList.contains("is-open")) {
      careerModal.classList.remove("is-open");

      careerModal.setAttribute("aria-hidden", "true");

      document.body.style.overflow = "";
    }

    if (managementModal && managementModal.classList.contains("is-open")) {
      managementModal.classList.remove("is-open");

      managementModal.setAttribute("aria-hidden", "true");

      document.body.style.overflow = "";
    }
  });
});
