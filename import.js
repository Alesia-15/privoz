document.addEventListener("DOMContentLoaded", () => {
  /* ======================================================
     REDUCED MOTION
  ====================================================== */

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* ======================================================
     REVEAL
  ====================================================== */

  const revealGroups = [
    {
      selector: ".import-description-heading",
      className: "import-reveal-left",
    },
    {
      selector: ".import-description-content",
      className: "import-reveal-right",
    },
    {
      selector: ".import-included-card",
      className: "import-reveal",
    },
    {
      selector: ".import-process-head",
      className: "import-reveal",
    },
    {
      selector: ".import-why-media",
      className: "import-reveal-left",
    },
    {
      selector: ".import-why-content-inner",
      className: "import-reveal-right",
    },
    {
      selector: ".import-request-copy",
      className: "import-reveal-left",
    },
    {
      selector: ".import-request-form",
      className: "import-reveal-right",
    },
    {
      selector: ".import-other-head",
      className: "import-reveal",
    },
    {
      selector: ".import-partners-head",
      className: "import-reveal",
    },
    {
      selector: ".import-partner-logo",
      className: "import-reveal",
    },
  ];

  const revealElements = [];

  revealGroups.forEach((group) => {
    document.querySelectorAll(group.selector).forEach((element, index) => {
      element.classList.add(group.className);

      if (index) {
        element.style.transitionDelay = `${Math.min(index * 0.06, 0.3)}s`;
      }

      revealElements.push(element);
    });
  });

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

  const hero = document.querySelector(".import-hero");

  const heroVisual = document.querySelector(".import-hero-visual");

  const heroGlow = document.querySelector(".import-hero-glow-right");

  function updateHeroParallax() {
    if (!hero || prefersReducedMotion || window.innerWidth <= 768) {
      return;
    }

    const rect = hero.getBoundingClientRect();

    if (rect.bottom <= 0 || rect.top >= window.innerHeight) {
      return;
    }

    const scroll = window.scrollY;

    if (heroVisual) {
      heroVisual.style.transform = `translateY(${scroll * 0.05}px)`;
    }

    if (heroGlow) {
      heroGlow.style.transform = `translateY(${scroll * 0.1}px)`;
    }
  }

  /* ======================================================
     PROCESS LINE
  ====================================================== */

  const processSection = document.querySelector(".import-process");

  const processTrack = document.querySelector(".import-process-track");

  const processProgress = document.querySelector(
    ".import-process-line-progress",
  );

  const processMarker = document.querySelector(".import-process-marker");

  const processSteps = document.querySelectorAll(".import-process-step");

  function updateProcessLine() {
    if (
      !processSection ||
      !processTrack ||
      !processProgress ||
      !processMarker
    ) {
      return;
    }

    const rect = processSection.getBoundingClientRect();

    /*
      Начинаем прорисовывать линию,
      когда блок входит снизу.

      Завершаем примерно к моменту,
      когда середина блока проходит экран.
    */

    const start = window.innerHeight * 0.85;

    const finish = -rect.height * 0.15;

    const progress = (start - rect.top) / (start - finish);

    const normalized = Math.max(0, Math.min(progress, 1));

    processProgress.style.width = `${normalized * 100}%`;

    processMarker.style.left = `${normalized * 100}%`;

    processSteps.forEach((step, index) => {
      const stepProgress = index / Math.max(processSteps.length - 1, 1);

      step.classList.toggle("is-active", normalized >= stepProgress);
    });
  }

  /* ======================================================
     PROCESS HORIZONTAL SCROLL
     колесо мыши превращаем в горизонтальный
     скролл только когда курсор над блоком
  ====================================================== */

  const processScroll = document.querySelector(".import-process-scroll");

  if (processScroll && window.matchMedia("(min-width: 769px)").matches) {
    processScroll.addEventListener(
      "wheel",
      (event) => {
        const maxScroll = processScroll.scrollWidth - processScroll.clientWidth;

        if (maxScroll <= 0) {
          return;
        }

        const movingRight =
          event.deltaY > 0 && processScroll.scrollLeft < maxScroll;

        const movingLeft = event.deltaY < 0 && processScroll.scrollLeft > 0;

        if (!movingRight && !movingLeft) {
          return;
        }

        event.preventDefault();

        processScroll.scrollLeft += event.deltaY * 0.8;
      },
      {
        passive: false,
      },
    );
  }

  /* ======================================================
     OTHER SERVICES ORBIT
  ====================================================== */

  const servicesOrbit = document.querySelector(".import-services-orbit");

  const orbitCards = document.querySelectorAll(".import-orbit-card");

  if (servicesOrbit && orbitCards.length) {
    orbitCards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        servicesOrbit.classList.add("is-slowed");

        orbitCards.forEach((otherCard) => {
          otherCard.classList.remove("is-active");
        });

        card.classList.add("is-active");
      });

      card.addEventListener("mouseleave", () => {
        servicesOrbit.classList.remove("is-slowed");

        card.classList.remove("is-active");
      });

      card.addEventListener("focusin", () => {
        servicesOrbit.classList.add("is-slowed");

        card.classList.add("is-active");
      });

      card.addEventListener("focusout", () => {
        servicesOrbit.classList.remove("is-slowed");

        card.classList.remove("is-active");
      });
    });
  }

  /* ======================================================
     REQUEST FORM
  ====================================================== */

  const requestForm = document.querySelector(".import-request-form");

  if (requestForm) {
    requestForm.addEventListener("submit", (event) => {
      /*
          Пока backend не подключен —
          не отправляем форму реально.

          Потом этот preventDefault
          можно будет убрать.
        */

      event.preventDefault();

      if (!requestForm.checkValidity()) {
        requestForm.reportValidity();

        return;
      }

      requestForm.classList.add("is-success");
    });
  }

  /* ======================================================
     SCROLL
  ====================================================== */

  let ticking = false;

  function handleScroll() {
    if (ticking) {
      return;
    }

    ticking = true;

    requestAnimationFrame(() => {
      updateHeroParallax();

      updateProcessLine();

      ticking = false;
    });
  }

  updateHeroParallax();
  updateProcessLine();

  window.addEventListener("scroll", handleScroll, {
    passive: true,
  });

  /* ======================================================
     RESIZE
  ====================================================== */

  window.addEventListener("resize", () => {
    updateProcessLine();
  });
});
