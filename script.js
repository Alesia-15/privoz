document.addEventListener("DOMContentLoaded", () => {
  /*
  ========================================
  ELEMENTS
  ========================================
  */

  const siteHeader = document.querySelector(".site-header");

  const desktopDropdowns = document.querySelectorAll(".nav-dropdown");

  const language = document.querySelector(".language");

  const languageButton = document.querySelector(".language-btn");

  const languageCurrent = document.querySelector(".current-language");

  const languageOptions = document.querySelectorAll(".language-menu button");

  const burger = document.querySelector(".burger");

  const mobileMenu = document.querySelector(".mobile-menu");

  const mobileDropdowns = document.querySelectorAll(".mobile-dropdown");

  /*
  ========================================
  HEADER SCROLL
  ========================================
  */

  function updateHeader() {
    if (!siteHeader) {
      return;
    }

    if (window.scrollY > 20) {
      siteHeader.classList.add("scrolled");
    } else {
      siteHeader.classList.remove("scrolled");
    }
  }

  updateHeader();

  window.addEventListener("scroll", updateHeader, {
    passive: true,
  });

  /*
  ========================================
  DESKTOP DROPDOWNS
  ========================================
  */

  function closeDesktopDropdowns(exception = null) {
    desktopDropdowns.forEach((dropdown) => {
      if (dropdown !== exception) {
        dropdown.classList.remove("active");
      }
    });
  }

  desktopDropdowns.forEach((dropdown) => {
    const button = dropdown.querySelector(".dropdown-toggle");

    if (!button) {
      return;
    }

    button.addEventListener("click", (event) => {
      event.stopPropagation();

      const isOpen = dropdown.classList.contains("active");

      closeDesktopDropdowns(dropdown);

      closeLanguage();

      dropdown.classList.toggle("active", !isOpen);
    });
  });

  /*
  ========================================
  LANGUAGE
  ========================================
  */

  function closeLanguage() {
    if (!language) {
      return;
    }

    language.classList.remove("active");
  }

  if (language && languageButton) {
    languageButton.addEventListener("click", (event) => {
      event.stopPropagation();

      const isOpen = language.classList.contains("active");

      closeDesktopDropdowns();

      language.classList.toggle("active", !isOpen);
    });
  }

  languageOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const selectedLanguage = option.dataset.language;

      if (selectedLanguage && languageCurrent) {
        languageCurrent.textContent = selectedLanguage;
      }

      closeLanguage();
    });
  });

  /*
  ========================================
  MOBILE MENU
  ========================================
  */

  function closeMobileMenu() {
    if (burger) {
      burger.classList.remove("active");

      burger.setAttribute("aria-expanded", "false");
    }

    if (mobileMenu) {
      mobileMenu.classList.remove("active");
    }

    document.body.classList.remove("menu-open");
  }

  if (burger && mobileMenu) {
    burger.setAttribute("aria-expanded", "false");

    burger.addEventListener("click", (event) => {
      event.stopPropagation();

      const shouldOpen = !mobileMenu.classList.contains("active");

      burger.classList.toggle("active", shouldOpen);

      mobileMenu.classList.toggle("active", shouldOpen);

      document.body.classList.toggle("menu-open", shouldOpen);

      burger.setAttribute("aria-expanded", String(shouldOpen));
    });
  }

  /*
  ========================================
  MOBILE DROPDOWNS
  ========================================
  */

  mobileDropdowns.forEach((dropdown) => {
    const button = dropdown.querySelector(".mobile-dropdown-toggle");

    if (!button) {
      return;
    }

    button.addEventListener("click", () => {
      const isOpen = dropdown.classList.contains("active");

      mobileDropdowns.forEach((item) => {
        if (item !== dropdown) {
          item.classList.remove("active");
        }
      });

      dropdown.classList.toggle("active", !isOpen);
    });
  });

  /*
  ========================================
  MOBILE LINKS
  ========================================
  */

  document.querySelectorAll(".mobile-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu();
    });
  });

  /*
  ========================================
  CLICK OUTSIDE
  ========================================
  */

  document.addEventListener("click", (event) => {
    const insideDropdown = event.target.closest(".nav-dropdown");

    const insideLanguage = event.target.closest(".language");

    const insideMobileMenu = event.target.closest(".mobile-menu");

    const insideBurger = event.target.closest(".burger");

    if (!insideDropdown) {
      closeDesktopDropdowns();
    }

    if (!insideLanguage) {
      closeLanguage();
    }

    if (
      window.innerWidth <= 1150 &&
      mobileMenu &&
      mobileMenu.classList.contains("active") &&
      !insideMobileMenu &&
      !insideBurger
    ) {
      closeMobileMenu();
    }
  });

  /*
  ========================================
  ESC
  ========================================
  */

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    closeDesktopDropdowns();

    closeLanguage();

    closeMobileMenu();
  });

  /*
  ========================================
  RESIZE
  ========================================
  */

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1150) {
      closeMobileMenu();

      mobileDropdowns.forEach((dropdown) => {
        dropdown.classList.remove("active");
      });
    }
  });

  /*
  ========================================
  PRODUCT SEARCH
  ========================================
  */

  const productSearchForm = document.querySelector("#productSearchForm");

  const productSearchInput = document.querySelector("#productSearchInput");

  const productSearchClear = document.querySelector("#productSearchClear");

  const searchExampleButtons = document.querySelectorAll("[data-search]");

  /*
  Показываем кнопку очистки,
  если в input что-то введено.
  */

  function updateClearButton() {
    if (!productSearchInput || !productSearchClear) {
      return;
    }

    const hasText = productSearchInput.value.trim().length > 0;

    productSearchClear.classList.toggle("visible", hasText);
  }

  if (productSearchInput) {
    productSearchInput.addEventListener("input", updateClearButton);
  }

  /*
  Очистка строки
  */

  if (productSearchClear && productSearchInput) {
    productSearchClear.addEventListener("click", () => {
      productSearchInput.value = "";

      updateClearButton();

      productSearchInput.focus();
    });
  }

  /*
  Популярные поисковые запросы
  */

  searchExampleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!productSearchInput) {
        return;
      }

      const query = button.dataset.search || "";

      productSearchInput.value = query;

      updateClearButton();

      productSearchInput.focus();
    });
  });

  /*
  ========================================
  SEARCH SUBMIT
  ========================================

  Пока backend / AI-поиск не подключён,
  форма просто имитирует отправку.

  Потом здесь можно сделать fetch()
  к API.
  */

  if (productSearchForm && productSearchInput) {
    productSearchForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const query = productSearchInput.value.trim();

      /*
        Пустой запрос
        */

      if (!query) {
        productSearchInput.focus();

        const wrapper = productSearchInput.closest(
          ".product-search-input-wrap",
        );

        if (wrapper) {
          wrapper.animate(
            [
              {
                transform: "translateX(0)",
              },

              {
                transform: "translateX(-5px)",
              },

              {
                transform: "translateX(5px)",
              },

              {
                transform: "translateX(0)",
              },
            ],
            {
              duration: 260,
              easing: "ease",
            },
          );
        }

        return;
      }

      /*
        Временная имитация поиска
        */

      productSearchForm.classList.add("loading");

      const submitButton = productSearchForm.querySelector(
        ".product-search-button span",
      );

      const originalText = submitButton ? submitButton.textContent : "";

      if (submitButton) {
        submitButton.textContent = "Ищем...";
      }

      /*
        Здесь позже можно заменить
        setTimeout на реальный API:

        fetch("/api/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            query
          })
        });
        */

      setTimeout(() => {
        productSearchForm.classList.remove("loading");

        if (submitButton) {
          submitButton.textContent = originalText;
        }

        console.log("Поиск товара:", query);
      }, 900);
    });
  }

  /*
  Инициализация
  */

  updateClearButton();
});
