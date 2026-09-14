document.addEventListener("DOMContentLoaded", () => {
  /* ======================================================
     REVEAL
  ====================================================== */

  const revealGroups = [
    {
      selector: ".purchases-hero-content",
      className: "purchases-reveal-left",
    },
    {
      selector: ".purchases-hero-visual",
      className: "purchases-reveal-right",
    },
    {
      selector: ".purchases-description-title",
      className: "purchases-reveal-left",
    },
    {
      selector: ".purchases-description-text",
      className: "purchases-reveal-right",
    },
    {
      selector: ".purchases-section-head",
      className: "purchases-reveal",
    },
    {
      selector: ".purchases-card",
      className: "purchases-reveal",
    },
    {
      selector: ".purchases-flow-head",
      className: "purchases-reveal",
    },
    {
      selector: ".purchases-flow-step",
      className: "purchases-reveal",
    },
    {
      selector: ".purchases-expertise-copy",
      className: "purchases-reveal-left",
    },
    {
      selector: ".purchases-expertise-grid article",
      className: "purchases-reveal",
    },
    {
      selector: ".purchases-category",
      className: "purchases-reveal",
    },
    {
      selector: ".purchases-why-media",
      className: "purchases-reveal-left",
    },
    {
      selector: ".purchases-why-inner",
      className: "purchases-reveal-right",
    },
    {
      selector: ".purchases-request-copy",
      className: "purchases-reveal-left",
    },
    {
      selector: ".purchases-request-form",
      className: "purchases-reveal-right",
    },
    {
      selector: ".purchases-final-panel",
      className: "purchases-reveal",
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
     FLOW
  ====================================================== */

  const flowSection = document.querySelector(".purchases-flow");

  const flowProgress = document.querySelector(".purchases-flow-progress");

  const flowMarker = document.querySelector(".purchases-flow-marker");

  function updatePurchasesFlow() {
    if (!flowSection || !flowProgress || !flowMarker) {
      return;
    }

    const rect = flowSection.getBoundingClientRect();

    const start = window.innerHeight * 0.85;

    const finish = -rect.height * 0.15;

    const raw = (start - rect.top) / (start - finish);

    const progress = Math.max(0, Math.min(raw, 1));

    flowProgress.style.width = `${progress * 100}%`;

    flowMarker.style.left = `${progress * 100}%`;
  }

  /* ======================================================
     FORM
  ====================================================== */

  const purchasesForm = document.querySelector(".purchases-request-form");

  if (purchasesForm) {
    purchasesForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!purchasesForm.checkValidity()) {
        purchasesForm.reportValidity();

        return;
      }

      purchasesForm.classList.add("is-success");
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
      updatePurchasesFlow();

      ticking = false;
    });
  }

  updatePurchasesFlow();

  window.addEventListener("scroll", handleScroll, {
    passive: true,
  });

  window.addEventListener("resize", updatePurchasesFlow);
});
