document.addEventListener("DOMContentLoaded", () => {
  /* ======================================================
     REVEAL
  ====================================================== */

  const revealGroups = [
    {
      selector: ".expert-hero-content",
      className: "expert-reveal-left",
    },
    {
      selector: ".expert-hero-visual",
      className: "expert-reveal-right",
    },
    {
      selector: ".expert-description-title",
      className: "expert-reveal-left",
    },
    {
      selector: ".expert-description-text",
      className: "expert-reveal-right",
    },
    {
      selector: ".expert-section-head",
      className: "expert-reveal",
    },
    {
      selector: ".expert-card",
      className: "expert-reveal",
    },
    {
      selector: ".expert-flow-head",
      className: "expert-reveal",
    },
    {
      selector: ".expert-flow-step",
      className: "expert-reveal",
    },
    {
      selector: ".expert-risks-copy",
      className: "expert-reveal-left",
    },
    {
      selector: ".expert-risks-grid article",
      className: "expert-reveal",
    },
    {
      selector: ".expert-why-media",
      className: "expert-reveal-left",
    },
    {
      selector: ".expert-why-inner",
      className: "expert-reveal-right",
    },
    {
      selector: ".expert-request-copy",
      className: "expert-reveal-left",
    },
    {
      selector: ".expert-request-form",
      className: "expert-reveal-right",
    },
    {
      selector: ".expert-final-panel",
      className: "expert-reveal",
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
     EXPERT FLOW
  ====================================================== */

  const flowSection = document.querySelector(".expert-flow");

  const flowProgress = document.querySelector(".expert-flow-progress");

  const flowMarker = document.querySelector(".expert-flow-marker");

  function updateExpertFlow() {
    if (!flowSection || !flowProgress || !flowMarker) {
      return;
    }

    const rect = flowSection.getBoundingClientRect();

    const start = window.innerHeight * 0.85;

    const end = -rect.height * 0.15;

    const raw = (start - rect.top) / (start - end);

    const progress = Math.max(0, Math.min(raw, 1));

    flowProgress.style.width = `${progress * 100}%`;

    flowMarker.style.left = `${progress * 100}%`;
  }

  /* ======================================================
     FORM
  ====================================================== */

  const expertForm = document.querySelector(".expert-request-form");

  if (expertForm) {
    expertForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!expertForm.checkValidity()) {
        expertForm.reportValidity();

        return;
      }

      expertForm.classList.add("is-success");
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
      updateExpertFlow();

      ticking = false;
    });
  }

  updateExpertFlow();

  window.addEventListener("scroll", handleScroll, {
    passive: true,
  });

  window.addEventListener("resize", updateExpertFlow);
});
