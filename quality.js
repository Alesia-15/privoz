document.addEventListener("DOMContentLoaded", () => {
  /* ======================================================
     REVEAL
  ====================================================== */

  const revealGroups = [
    {
      selector: ".quality-hero-content",
      className: "quality-reveal-left",
    },
    {
      selector: ".quality-hero-visual",
      className: "quality-reveal-right",
    },
    {
      selector: ".quality-description-title",
      className: "quality-reveal-left",
    },
    {
      selector: ".quality-description-text",
      className: "quality-reveal-right",
    },
    {
      selector: ".quality-section-head",
      className: "quality-reveal",
    },
    {
      selector: ".quality-card",
      className: "quality-reveal",
    },
    {
      selector: ".quality-risks-copy",
      className: "quality-reveal-left",
    },
    {
      selector: ".quality-risk-item",
      className: "quality-reveal-right",
    },
    {
      selector: ".quality-result-visual",
      className: "quality-reveal-left",
    },
    {
      selector: ".quality-result-content-inner",
      className: "quality-reveal-right",
    },
    {
      selector: ".quality-request-copy",
      className: "quality-reveal-left",
    },
    {
      selector: ".quality-request-form",
      className: "quality-reveal-right",
    },
    {
      selector: ".quality-final-panel",
      className: "quality-reveal",
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
     FORM
  ====================================================== */

  const qualityForm = document.querySelector(".quality-request-form");

  if (qualityForm) {
    qualityForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!qualityForm.checkValidity()) {
        qualityForm.reportValidity();

        return;
      }

      qualityForm.classList.add("is-success");
    });
  }
});
