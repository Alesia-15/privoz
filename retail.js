document.addEventListener("DOMContentLoaded", () => {
  /* ======================================================
     REVEAL
  ====================================================== */

  const revealElements = document.querySelectorAll("[data-reveal]");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  /* ======================================================
     SEARCH REDIRECT
  ====================================================== */

  const retailSearchForm = document.getElementById("retailSearchForm");
  const retailSearchInput = document.getElementById("retailSearchInput");

  if (retailSearchForm) {
    retailSearchForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const value = retailSearchInput ? retailSearchInput.value.trim() : "";

      /*
        Если будет готова отдельная страница каталога:
        /catalog.html?q=...
      */

      const basePath =
        window.location.hostname === "alesia-15.github.io" ? "/privoz" : "";

      const targetUrl = value
        ? `${basePath}/catalog.html?q=${encodeURIComponent(value)}`
        : `${basePath}/catalog.html`;

      window.location.href = targetUrl;
    });
  }

  /* ======================================================
     VAT MODAL
  ====================================================== */

  const modalTriggers = document.querySelectorAll("[data-open-modal]");
  const modalCloseElements = document.querySelectorAll("[data-close-modal]");

  function openModal(modalId) {
    const modal = document.getElementById(modalId);

    if (!modal) return;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeModal(modal) {
    if (!modal) return;

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const modalId = trigger.dataset.openModal;

      if (!modalId) return;

      openModal(modalId);
    });
  });

  modalCloseElements.forEach((element) => {
    element.addEventListener("click", () => {
      const modal = element.closest(".retail-modal");
      closeModal(modal);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    document.querySelectorAll(".retail-modal.is-open").forEach((modal) => {
      closeModal(modal);
    });
  });

  /* ======================================================
     PAUSE LOGO MARQUEE ON HOVER
  ====================================================== */

  const logoMarquee = document.querySelector(".retail-logo-track");

  if (logoMarquee) {
    const marqueeWrapper = logoMarquee.closest(".retail-logo-marquee");

    if (marqueeWrapper) {
      marqueeWrapper.addEventListener("mouseenter", () => {
        logoMarquee.style.animationPlayState = "paused";
      });

      marqueeWrapper.addEventListener("mouseleave", () => {
        logoMarquee.style.animationPlayState = "running";
      });
    }
  }
});
