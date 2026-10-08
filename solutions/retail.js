document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector(".retail-customer-page");

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

  const cycleCards = main.querySelectorAll(".rc-cycle-card");

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
      ".rc-about-grid, " +
        ".rc-cat-card, " +
        ".rc-search, " +
        ".rc-cycle-card, " +
        ".rc-vat-grid, " +
        ".rc-pickup-head, " +
        ".rc-pickup-grid article, " +
        ".rc-account-grid, " +
        ".request-content, " +
        ".request-form, " +
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
     Не отправляем форму, если поле пустое
  ========================================================= */

  const searchForm = main.querySelector(".rc-search-form");

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
     5. ЗАКРЫТИЕ КАРТОЧЕК "ПОЛНЫЙ ЦИКЛ"
     ПРИ КЛИКЕ ВНЕ НИХ
  ========================================================= */

  document.addEventListener("click", (event) => {
    if (event.target.closest(".rc-cycle-card")) {
      return;
    }

    cycleCards.forEach((card) => {
      card.classList.remove("is-active");
    });
  });
});
