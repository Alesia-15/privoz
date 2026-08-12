document.addEventListener("DOMContentLoaded", () => {
  /* ======================================================
     ELEMENTS
  ====================================================== */

  const header = document.querySelector(".site-header");

  const megaItems = document.querySelectorAll(".header-nav-item.has-mega-menu");

  const accountItem = document.querySelector(
    ".header-nav-item.has-account-menu",
  );

  const languageSwitcher = document.querySelector(".language-switcher");

  const languageButton = document.querySelector(".language-button");

  const burger = document.querySelector(".burger");

  const mobileMenu = document.querySelector(".mobile-menu");

  const mobileDropdowns = document.querySelectorAll(".mobile-nav-dropdown");

  /* ======================================================
     HEADER ON SCROLL
  ====================================================== */

  function handleHeaderScroll() {
    if (!header) return;

    if (window.scrollY > 20) {
      header.classList.add("is-fixed");
    } else {
      header.classList.remove("is-fixed");
    }
  }

  handleHeaderScroll();

  window.addEventListener("scroll", handleHeaderScroll, {
    passive: true,
  });

  /* ======================================================
     CLOSE DESKTOP MENUS
  ====================================================== */

  function closeDesktopMenus(except = null) {
    megaItems.forEach((item) => {
      if (item === except) return;

      item.classList.remove("is-open");

      const button = item.querySelector(".mega-menu-toggle");

      if (button) {
        button.setAttribute("aria-expanded", "false");
      }
    });

    if (accountItem && accountItem !== except) {
      accountItem.classList.remove("is-open");

      const button = accountItem.querySelector(".account-toggle");

      if (button) {
        button.setAttribute("aria-expanded", "false");
      }
    }
  }

  /* ======================================================
     MEGA MENU
  ====================================================== */

  megaItems.forEach((item) => {
    const button = item.querySelector(".mega-menu-toggle");

    if (!button) return;

    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const isOpen = item.classList.contains("is-open");

      closeDesktopMenus(item);

      item.classList.toggle("is-open", !isOpen);

      button.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  /* ======================================================
     ACCOUNT
  ====================================================== */

  if (accountItem) {
    const accountButton = accountItem.querySelector(".account-toggle");

    if (accountButton) {
      accountButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        const isOpen = accountItem.classList.contains("is-open");

        closeDesktopMenus(accountItem);

        accountItem.classList.toggle("is-open", !isOpen);

        accountButton.setAttribute("aria-expanded", String(!isOpen));
      });
    }
  }

  /* ======================================================
     LANGUAGE
  ====================================================== */

  if (languageButton && languageSwitcher) {
    languageButton.addEventListener("click", (event) => {
      event.stopPropagation();

      const isOpen = languageSwitcher.classList.contains("is-open");

      languageSwitcher.classList.toggle("is-open", !isOpen);

      languageButton.setAttribute("aria-expanded", String(!isOpen));
    });
  }

  /* ======================================================
     MOBILE MENU
  ====================================================== */

  function openMobileMenu() {
    if (!burger || !mobileMenu) {
      return;
    }

    burger.classList.add("is-active");

    burger.setAttribute("aria-expanded", "true");

    burger.setAttribute("aria-label", "Закрыть меню");

    mobileMenu.classList.add("is-open");

    mobileMenu.setAttribute("aria-hidden", "false");

    document.body.classList.add("menu-open");
  }

  function closeMobileMenu() {
    if (!burger || !mobileMenu) {
      return;
    }

    burger.classList.remove("is-active");

    burger.setAttribute("aria-expanded", "false");

    burger.setAttribute("aria-label", "Открыть меню");

    mobileMenu.classList.remove("is-open");

    mobileMenu.setAttribute("aria-hidden", "true");

    document.body.classList.remove("menu-open");

    mobileDropdowns.forEach((dropdown) => {
      dropdown.classList.remove("is-open");

      const submenu = dropdown.querySelector(".mobile-submenu");

      if (submenu) {
        submenu.style.maxHeight = null;
      }
    });
  }

  if (burger && mobileMenu) {
    burger.addEventListener("click", () => {
      if (mobileMenu.classList.contains("is-open")) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  /* ======================================================
     MOBILE ACCORDION
  ====================================================== */

  mobileDropdowns.forEach((dropdown) => {
    const button = dropdown.querySelector(".mobile-nav-toggle");

    const submenu = dropdown.querySelector(".mobile-submenu");

    if (!button || !submenu) {
      return;
    }

    button.addEventListener("click", () => {
      const isOpen = dropdown.classList.contains("is-open");

      mobileDropdowns.forEach((otherDropdown) => {
        if (otherDropdown === dropdown) {
          return;
        }

        otherDropdown.classList.remove("is-open");

        const otherSubmenu = otherDropdown.querySelector(".mobile-submenu");

        if (otherSubmenu) {
          otherSubmenu.style.maxHeight = null;
        }
      });

      dropdown.classList.toggle("is-open", !isOpen);

      if (!isOpen) {
        submenu.style.maxHeight = submenu.scrollHeight + "px";
      } else {
        submenu.style.maxHeight = null;
      }
    });
  });

  /* ======================================================
     CLICK OUTSIDE
  ====================================================== */

  document.addEventListener("click", (event) => {
    const insideNav = event.target.closest(".header-nav");

    if (!insideNav) {
      closeDesktopMenus();
    }

    if (languageSwitcher && !languageSwitcher.contains(event.target)) {
      languageSwitcher.classList.remove("is-open");

      if (languageButton) {
        languageButton.setAttribute("aria-expanded", "false");
      }
    }
  });

  /* ======================================================
     ESC
  ====================================================== */

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    closeDesktopMenus();

    if (languageSwitcher) {
      languageSwitcher.classList.remove("is-open");
    }

    if (languageButton) {
      languageButton.setAttribute("aria-expanded", "false");
    }

    closeMobileMenu();
  });

  /* ======================================================
     CLOSE MOBILE AFTER LINK CLICK
  ====================================================== */

  if (mobileMenu) {
    const mobileLinks = mobileMenu.querySelectorAll("a");

    mobileLinks.forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });
  }

  /* ======================================================
     RESIZE
  ====================================================== */

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1120) {
      closeMobileMenu();
    }

    mobileDropdowns.forEach((dropdown) => {
      if (!dropdown.classList.contains("is-open")) {
        return;
      }

      const submenu = dropdown.querySelector(".mobile-submenu");

      if (submenu) {
        submenu.style.maxHeight = submenu.scrollHeight + "px";
      }
    });
  });

  /* ======================================================
     SCROLL REVEAL
  ====================================================== */

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /*
    Добавляет класс анимации
    и delay.
  */

  function prepareReveal(element, animationClass, delayClass = "") {
    if (!element) return;

    element.classList.add(animationClass);

    if (delayClass) {
      element.classList.add(delayClass);
    }
  }

  /* ======================================================
     SEARCH REVEAL
  ====================================================== */

  const searchSection = document.querySelector(".ai-search-section");

  if (searchSection) {
    prepareReveal(searchSection.querySelector(".ai-search-label"), "reveal-up");

    prepareReveal(
      searchSection.querySelector(".ai-search-line"),
      "reveal-up",
      "reveal-delay-1",
    );

    prepareReveal(
      searchSection.querySelector(".ai-search-title"),
      "reveal-up",
      "reveal-delay-2",
    );

    prepareReveal(
      searchSection.querySelector(".ai-search-description"),
      "reveal-up",
      "reveal-delay-3",
    );

    prepareReveal(
      searchSection.querySelector(".ai-search-form"),
      "reveal-scale",
      "reveal-delay-3",
    );

    prepareReveal(
      searchSection.querySelector(".ai-search-tags"),
      "reveal-up",
      "reveal-delay-4",
    );
  }

  /* ======================================================
     SERVICE SECTIONS
  ====================================================== */

  const serviceSections = document.querySelectorAll(".import-section");

  serviceSections.forEach((section) => {
    const content = section.querySelector(".import-content");

    const label = section.querySelector(".import-label");

    const title = section.querySelector(".import-title");

    const description = section.querySelector(".import-description");

    const button = section.querySelector(".import-button");

    const media = section.querySelector(".import-media-placeholder");

    const shapes = section.querySelectorAll(".import-shape");

    /*
        EXPORT зеркальный:
        visual слева, text справа.
      */

    const isExport = section.classList.contains("export-section");

    /*
        Сам контейнер content не двигаем,
        чтобы дочерние элементы могли
        всплывать по очереди.
      */

    prepareReveal(label, isExport ? "reveal-right" : "reveal-left");

    prepareReveal(
      title,
      isExport ? "reveal-right" : "reveal-left",
      "reveal-delay-1",
    );

    prepareReveal(
      description,
      isExport ? "reveal-right" : "reveal-left",
      "reveal-delay-2",
    );

    prepareReveal(button, "reveal-up", "reveal-delay-3");

    prepareReveal(
      media,
      isExport ? "reveal-left" : "reveal-right",
      "reveal-delay-1",
    );

    shapes.forEach((shape, index) => {
      prepareReveal(
        shape,
        "reveal-shape",
        `reveal-delay-${Math.min(index + 1, 4)}`,
      );
    });
  });

  /* ======================================================
     OBSERVER
  ====================================================== */

  const revealElements = document.querySelectorAll(
    ".reveal-up, " +
      ".reveal-left, " +
      ".reveal-right, " +
      ".reveal-scale, " +
      ".reveal-shape",
  );

  /*
    Если пользователь отключил анимацию —
    сразу показываем всё.
  */

  if (prefersReducedMotion) {
    revealElements.forEach((element) => {
      element.classList.add("reveal-visible");
    });

    return;
  }

  /*
    Каждый элемент отслеживается
    независимо.
  */

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("reveal-visible");

        observer.unobserve(entry.target);
      });
    },
    {
      /*
          10% элемента должно
          попасть на экран.
        */

      threshold: 0.1,

      /*
          Анимация стартует немного
          раньше, чем элемент дойдёт
          далеко вверх.
        */

      rootMargin: "0px 0px -8% 0px",
    },
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
});
