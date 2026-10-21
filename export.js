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
    if (!processSection || !progress || !marker) return;

    const maxScroll = processScroll.scrollWidth - processScroll.clientWidth;

    const value = maxScroll > 0 ? processScroll.scrollLeft / maxScroll : 1;

    progress.style.width = `${value * 100}%`;
    marker.style.left = `${value * 100}%`;

    steps.forEach((step, index) => {
      const stepPosition = index / Math.max(steps.length - 1, 1);

      step.classList.toggle("is-active", value >= stepPosition);
    });
  }

  /* ======================================================
   PINNED HORIZONTAL PROCESS SCROLL — FIX
====================================================== */

  const processScroll = document.querySelector(".export-process-scroll");

  const processContainer = processSection?.querySelector(
    ".export-page-container",
  );

  let processStartY = 0;
  let processDistance = 0;
  let processPinned = false;

  function setupProcessScroll() {
    if (!processSection || !processScroll || !processContainer) return;

    processPinned = window.innerWidth > 768;

    processSection.style.height = "";

    if (!processPinned) {
      updateProcess();
      return;
    }

    const headerHeight =
      document.querySelector(".site-header")?.getBoundingClientRect().height ||
      80;

    const availableHeight = window.innerHeight - headerHeight;

    processDistance = Math.max(
      0,
      processScroll.scrollWidth - processScroll.clientWidth,
    );

    // Высота экрана + путь горизонтального движения
    processSection.style.height = `${availableHeight + processDistance}px`;

    // Точка начала горизонтальной прокрутки
    processStartY =
      processSection.getBoundingClientRect().top +
      window.scrollY -
      headerHeight;

    syncProcessScroll();
  }

  function syncProcessScroll() {
    if (!processPinned || !processScroll) return;

    const traveled = Math.max(
      0,
      Math.min(window.scrollY - processStartY, processDistance),
    );

    processScroll.scrollLeft = traveled;

    updateProcess();
  }

  setupProcessScroll();

  window.addEventListener("resize", setupProcessScroll);
  window.addEventListener("load", setupProcessScroll);

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
      if (processPinned) {
        syncProcessScroll();
      } else {
        updateProcess();
      }

      ticking = false;
    });
  }

  updateProcess();

  window.addEventListener("scroll", handleScroll, {
    passive: true,
  });

  window.addEventListener("resize", updateProcess);
});

/* ==========================================
   EXPORT REQUEST MODAL
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("exportModal");
  const modalContainer = document.getElementById("exportModalFormContainer");
  const originalForm = document.querySelector(
    "#export-request .export-request-form",
  );

  if (!modal || !modalContainer || !originalForm) return;

  const dialog = modal.querySelector(".export-modal-dialog");
  let previousFocus = null;

  // Копируем существующую форму
  const clonedForm = originalForm.cloneNode(true);

  // Убираем дублирование ID полей и обновляем label
  clonedForm.querySelectorAll("[id]").forEach((element) => {
    const oldId = element.id;
    const newId = `${oldId}-modal`;

    element.id = newId;

    clonedForm.querySelectorAll("label[for]").forEach((label) => {
      if (label.getAttribute("for") === oldId) {
        label.setAttribute("for", newId);
      }
    });
  });

  clonedForm.classList.remove(
    "export-reveal-right",
    "is-visible",
    "is-success",
  );
  clonedForm.style.removeProperty("transition-delay");

  modalContainer.appendChild(clonedForm);

  // Открытие
  function openModal() {
    previousFocus = document.activeElement;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
    dialog.focus();
  }

  // Закрытие
  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

    if (previousFocus && previousFocus.isConnected) {
      previousFocus.focus();
    }
  }

  // Кнопки открытия
  document.querySelectorAll(".export-modal-open").forEach((button) => {
    button.addEventListener("click", openModal);
  });

  // Закрытие по кнопке и фону
  modal.querySelectorAll("[data-export-close]").forEach((element) => {
    element.addEventListener("click", closeModal);
  });

  // Escape
  document.addEventListener("keydown", (event) => {
    if (!modal.classList.contains("is-open")) return;

    if (event.key === "Escape") {
      closeModal();
    }

    if (event.key === "Tab") {
      const focusable = Array.from(
        dialog.querySelectorAll(
          "button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href]",
        ),
      ).filter((el) => el.getClientRects().length > 0);

      if (!focusable.length) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  // Отправка формы в модальном окне
  clonedForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!clonedForm.reportValidity()) return;

    // Только демонстрация успешного заполнения.
    // Реальную отправку нужно подключить отдельно.
    clonedForm.classList.add("is-success");
  });
});
