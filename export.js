document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* ======================================================
     REVEAL
  ====================================================== */

  const revealGroups = [
    {
      selector: ".export-description-heading",
      className: "export-reveal-left",
    },
    {
      selector: ".export-description-content",
      className: "export-reveal-right",
    },
    {
      selector: ".export-included-card",
      className: "export-reveal",
    },
    {
      selector: ".export-process-head",
      className: "export-reveal",
    },
    {
      selector: ".export-why-media",
      className: "export-reveal-left",
    },
    {
      selector: ".export-why-content-inner",
      className: "export-reveal-right",
    },
    {
      selector: ".export-request-copy",
      className: "export-reveal-left",
    },
    {
      selector: ".export-request-form",
      className: "export-reveal-right",
    },
    {
      selector: ".export-other-head",
      className: "export-reveal",
    },
    {
      selector: ".export-partners-head",
      className: "export-reveal",
    },
    {
      selector: ".export-partner-logo",
      className: "export-reveal",
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
    const observer = new IntersectionObserver(
      (entries, revealObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");

          revealObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });
  }

  /* ======================================================
     PROCESS
  ====================================================== */

  const processSection = document.querySelector(".export-process");

  const progress = document.querySelector(".export-process-line-progress");

  const marker = document.querySelector(".export-process-marker");

  const steps = document.querySelectorAll(".export-process-step");

  function updateProcess() {
    if (!processSection || !progress || !marker) {
      return;
    }

    const rect = processSection.getBoundingClientRect();

    const start = window.innerHeight * 0.85;

    const finish = -rect.height * 0.15;

    const rawProgress = (start - rect.top) / (start - finish);

    const value = Math.max(0, Math.min(rawProgress, 1));

    progress.style.width = `${value * 100}%`;

    marker.style.left = `${value * 100}%`;

    steps.forEach((step, index) => {
      const stepPosition = index / Math.max(steps.length - 1, 1);

      step.classList.toggle("is-active", value >= stepPosition);
    });
  }

  /* ======================================================
     HORIZONTAL PROCESS SCROLL
  ====================================================== */

  const processScroll = document.querySelector(".export-process-scroll");

  if (processScroll && window.innerWidth > 768) {
    processScroll.addEventListener(
      "wheel",
      (event) => {
        const maxScroll = processScroll.scrollWidth - processScroll.clientWidth;

        if (maxScroll <= 0) {
          return;
        }

        const canRight =
          event.deltaY > 0 && processScroll.scrollLeft < maxScroll;

        const canLeft = event.deltaY < 0 && processScroll.scrollLeft > 0;

        if (!canRight && !canLeft) {
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
     ORBIT
  ====================================================== */

  const orbit = document.querySelector(".export-services-orbit");

  const orbitCards = document.querySelectorAll(".export-orbit-card");

  if (orbit && orbitCards.length) {
    orbitCards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        orbit.classList.add("is-slowed");

        orbitCards.forEach((other) => {
          other.classList.remove("is-active");
        });

        card.classList.add("is-active");
      });

      card.addEventListener("mouseleave", () => {
        orbit.classList.remove("is-slowed");

        card.classList.remove("is-active");
      });
    });
  }

  /* ======================================================
     FORM
  ====================================================== */

  const form = document.querySelector(".export-request-form");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();

        return;
      }

      form.classList.add("is-success");
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
      updateProcess();

      ticking = false;
    });
  }

  updateProcess();

  window.addEventListener("scroll", handleScroll, {
    passive: true,
  });

  window.addEventListener("resize", updateProcess);
});
