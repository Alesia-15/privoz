document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector(".marketplace-page");

  if (!main) return;

  /* =========================================================
     1. ПЛАВНЫЙ ПЕРЕХОД К ЗАЯВКЕ
  ========================================================= */

  main.querySelectorAll('a[href="#request"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector("#request");

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });

  /* =========================================================
     2. КАРТОЧКИ "ПОЛНЫЙ ЦИКЛ"
     На компьютере — hover через CSS
     На телефоне / планшете — клик
  ========================================================= */

  const cycleCards = main.querySelectorAll(".marketplace-cycle-card");

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

  /* =========================================================
     3. АНИМАЦИЯ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ
  ========================================================= */

  const revealTargets = [
    ...main.querySelectorAll(
      ".solution-about-grid, " +
        ".marketplace-category-card, " +
        ".marketplace-search-block, " +
        ".marketplace-cycle-card, " +
        ".solution-partner-copy, " +
        ".solution-partner-item, " +
        ".request-content, " +
        ".request-form, " +
        ".solution-service-card, " +
        ".solution-number-card, " +
        ".partner-logo",
    ),
  ];

  revealTargets.forEach((element) => {
    element.classList.add("solution-reveal");
  });

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach((element) => {
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

    revealTargets.forEach((element) => {
      observer.observe(element);
    });
  }

  /* =========================================================
     4. ПОИСК
     Не отправляем форму, если строка пустая
  ========================================================= */

  const searchForm = main.querySelector(".marketplace-search-form");

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

  /* =========================================================
     5. ЗАКРЫТИЕ КАРТОЧКИ "ПОЛНЫЙ ЦИКЛ"
     при клике вне неё
  ========================================================= */

  document.addEventListener("click", (event) => {
    if (event.target.closest(".marketplace-cycle-card")) {
      return;
    }

    cycleCards.forEach((card) => {
      card.classList.remove("is-active");
    });
  });
});
