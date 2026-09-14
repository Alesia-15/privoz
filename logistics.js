document.addEventListener("DOMContentLoaded", () => {
  /* ======================================================
     REVEAL
  ====================================================== */

  const revealGroups = [
    {
      selector: ".logistics-hero-content",
      className: "logistics-reveal-left",
    },
    {
      selector: ".logistics-hero-visual",
      className: "logistics-reveal-right",
    },
    {
      selector: ".logistics-description-title",
      className: "logistics-reveal-left",
    },
    {
      selector: ".logistics-description-text",
      className: "logistics-reveal-right",
    },
    {
      selector: ".logistics-section-head",
      className: "logistics-reveal",
    },
    {
      selector: ".logistics-card",
      className: "logistics-reveal",
    },
    {
      selector: ".logistics-route-head",
      className: "logistics-reveal",
    },
    {
      selector: ".logistics-route-step",
      className: "logistics-reveal",
    },
    {
      selector: ".logistics-transport-copy",
      className: "logistics-reveal-left",
    },
    {
      selector: ".logistics-transport-grid article",
      className: "logistics-reveal",
    },
    {
      selector: ".logistics-control-media",
      className: "logistics-reveal-left",
    },
    {
      selector: ".logistics-control-inner",
      className: "logistics-reveal-right",
    },
    {
      selector: ".logistics-request-copy",
      className: "logistics-reveal-left",
    },
    {
      selector: ".logistics-request-form",
      className: "logistics-reveal-right",
    },
    {
      selector: ".logistics-final-panel",
      className: "logistics-reveal",
    },
  ];

  const revealElements = [];

  revealGroups.forEach((group) => {
    document.querySelectorAll(group.selector).forEach((element, index) => {
      element.classList.add(group.className);

      if (index > 0) {
        element.style.transitionDelay = `${Math.min(index * 0.06, 0.3)}s`;
      }

      revealElements.push(element);
    });
  });

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

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
     ROUTE PROGRESS
  ====================================================== */

  const routeSection = document.querySelector(".logistics-route");

  const routeProgress = document.querySelector(".logistics-route-progress");

  const routeMarker = document.querySelector(".logistics-route-marker");

  function updateRouteProgress() {
    if (!routeSection || !routeProgress || !routeMarker) {
      return;
    }

    const rect = routeSection.getBoundingClientRect();

    const start = window.innerHeight * 0.85;

    const finish = -rect.height * 0.15;

    const raw = (start - rect.top) / (start - finish);

    const progress = Math.max(0, Math.min(raw, 1));

    routeProgress.style.width = `${progress * 100}%`;

    routeMarker.style.left = `${progress * 100}%`;
  }

  /* ======================================================
     FORM
  ====================================================== */

  const logisticsForm = document.querySelector(".logistics-request-form");

  if (logisticsForm) {
    logisticsForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!logisticsForm.checkValidity()) {
        logisticsForm.reportValidity();

        return;
      }

      logisticsForm.classList.add("is-success");
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
      updateRouteProgress();

      ticking = false;
    });
  }

  updateRouteProgress();

  window.addEventListener("scroll", handleScroll, {
    passive: true,
  });

  window.addEventListener("resize", updateRouteProgress);
});
