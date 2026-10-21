document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector(".factory-page");

  if (!main) return;

  /* ==========================================
     1. FACTORY — REQUEST MODAL
  ========================================== */

  const factoryModal = document.getElementById("factoryRequestModal");

  const factoryModalWindow = factoryModal?.querySelector(
    ".factory-request-modal-window",
  );

  const factoryModalContent = document.getElementById("factoryModalContent");

  const originalRequest = main.querySelector("#request .request-container");

  let previousFocus = null;
  let previousBodyOverflow = "";

  if (
    factoryModal &&
    factoryModalWindow &&
    factoryModalContent &&
    originalRequest
  ) {
    // Копируем существующую форму
    const requestClone = originalRequest.cloneNode(true);

    // Полностью отключаем анимацию внутри копии
    const cloneElements = [requestClone, ...requestClone.querySelectorAll("*")];

    cloneElements.forEach((element) => {
      element.classList.remove("solution-reveal", "is-visible");
      element.removeAttribute("data-reveal");

      element.style.removeProperty("transform");
      element.style.removeProperty("opacity");
      element.style.removeProperty("visibility");
    });

    // Исключаем повторение ID
    requestClone.querySelectorAll("[id]").forEach((element) => {
      element.id = "modal-" + element.id;
    });

    // Исправляем привязку label к полям
    requestClone.querySelectorAll("label[for]").forEach((label) => {
      label.htmlFor = "modal-" + label.htmlFor;
    });

    // Добавляем копию в модальное окно
    factoryModalContent.appendChild(requestClone);

    // Гарантируем видимость левой части и формы
    const modalElements = requestClone.querySelectorAll(
      ".request-content, .request-form",
    );

    modalElements.forEach((element) => {
      element.classList.remove("solution-reveal", "is-visible");

      element.style.setProperty("opacity", "1", "important");

      element.style.setProperty("visibility", "visible", "important");

      element.style.setProperty("transform", "none", "important");
    });

    /* ==========================================
       OPEN MODAL
    ========================================== */

    const openFactoryModal = () => {
      previousFocus = document.activeElement;
      previousBodyOverflow = document.body.style.overflow;

      factoryModal.classList.add("is-open");
      factoryModal.setAttribute("aria-hidden", "false");

      document.body.style.overflow = "hidden";

      const modalBody = factoryModal.querySelector(
        ".factory-request-modal-body",
      );

      if (modalBody) {
        modalBody.scrollTop = 0;
      }

      factoryModalWindow.focus();
    };

    /* ==========================================
       CLOSE MODAL
    ========================================== */

    const closeFactoryModal = () => {
      factoryModal.classList.remove("is-open");
      factoryModal.setAttribute("aria-hidden", "true");

      document.body.style.overflow = previousBodyOverflow;

      if (previousFocus && typeof previousFocus.focus === "function") {
        previousFocus.focus();
      }
    };

    /* ==========================================
       BUTTONS — OPEN
    ========================================== */

    document.querySelectorAll(".factory-modal-trigger").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();

        openFactoryModal();
      });
    });

    /* ==========================================
       BUTTONS — CLOSE
    ========================================== */

    factoryModal
      .querySelectorAll("[data-factory-modal-close]")
      .forEach((button) => {
        button.addEventListener("click", closeFactoryModal);
      });

    /* ==========================================
       KEYBOARD
    ========================================== */

    document.addEventListener("keydown", (event) => {
      if (!factoryModal.classList.contains("is-open")) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();

        closeFactoryModal();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusable = [
        ...factoryModal.querySelectorAll(
          "button:not([disabled]), " +
            "input:not([disabled]), " +
            "textarea:not([disabled]), " +
            "select:not([disabled]), " +
            "a[href]",
        ),
      ].filter((element) => element.getClientRects().length > 0);

      if (!focusable.length) {
        event.preventDefault();
        factoryModalWindow.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (
        event.shiftKey &&
        (document.activeElement === first ||
          document.activeElement === factoryModalWindow)
      ) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  /* ==========================================
     2. КАРТОЧКИ ПОЛНОГО ЦИКЛА
  ========================================== */

  const cycleCards = main.querySelectorAll(".factory-cycle-card");

  cycleCards.forEach((card) => {
    card.setAttribute("tabindex", "0");

    const toggleCard = () => {
      const isActive = card.classList.contains("is-active");

      cycleCards.forEach((otherCard) => {
        if (otherCard !== card) {
          otherCard.classList.remove("is-active");
        }
      });

      card.classList.toggle("is-active", !isActive);
    };

    card.addEventListener("click", () => {
      if (
        window.matchMedia("(hover: none)").matches ||
        window.innerWidth <= 900
      ) {
        toggleCard();
      }
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();

        toggleCard();
      }
    });
  });

  /* ==========================================
     3. АНИМАЦИЯ ПРИ ПРОКРУТКЕ
  ========================================== */

  const revealTargets = [
    ...main.querySelectorAll(
      ".solution-about-grid, " +
        ".factory-category-card, " +
        ".factory-search-block, " +
        ".factory-cycle-card, " +
        ".solution-partner-copy, " +
        ".solution-partner-item, " +
        ".request-content, " +
        ".request-form, " +
        ".solution-service-card, " +
        ".solution-number-card, " +
        ".partner-logo",
    ),
  ];

  // ВАЖНО:
  // Полностью исключаем модальное окно из анимаций
  const pageRevealTargets = revealTargets.filter((element) => {
    return !element.closest(".factory-request-modal");
  });

  pageRevealTargets.forEach((element) => {
    element.classList.add("solution-reveal");
  });

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    pageRevealTargets.forEach((element) => {
      element.classList.add("is-visible");
    });
  } else {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");

          currentObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -7% 0px",
      },
    );

    pageRevealTargets.forEach((element) => {
      observer.observe(element);
    });
  }

  /* ==========================================
     4. ПОИСК ПО КАТАЛОГУ
  ========================================== */

  const searchForm = main.querySelector(".factory-search-form");

  if (searchForm) {
    const searchInput = searchForm.querySelector('input[name="q"]');

    searchForm.addEventListener("submit", (event) => {
      if (!searchInput || !searchInput.value.trim()) {
        event.preventDefault();

        if (searchInput) {
          searchInput.focus();
        }
      }
    });
  }

  /* ==========================================
     5. ЗАКРЫТИЕ КАРТОЧЕК ПОЛНОГО ЦИКЛА
  ========================================== */

  document.addEventListener("click", (event) => {
    if (event.target.closest(".factory-cycle-card")) {
      return;
    }

    cycleCards.forEach((card) => {
      card.classList.remove("is-active");
    });
  });
});
