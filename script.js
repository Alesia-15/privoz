document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================
     HEADER
  ========================================================== */

  const header = document.querySelector("#siteHeader");
  const burger = document.querySelector(".burger");
  const mobileMenu = document.querySelector("#mobileMenu");
  const mobileMenuClose = document.querySelector(".mobile-menu-close");
  const mobileMenuBackdrop = document.querySelector(".mobile-menu-backdrop");
  const mobileMenuLinks = document.querySelectorAll(".mobile-menu a");

  function handleHeaderScroll() {
    if (!header) return;

    header.classList.toggle("is-scrolled", window.scrollY > 20);
  }

  handleHeaderScroll();

  window.addEventListener("scroll", handleHeaderScroll, {
    passive: true,
  });

  /* ==========================================================
     MOBILE MENU
  ========================================================== */

  function openMobileMenu() {
    if (!burger || !mobileMenu) return;

    burger.classList.add("is-active");
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Закрыть меню");

    mobileMenu.classList.add("is-open");
    mobileMenu.setAttribute("aria-hidden", "false");
  }

  function closeMobileMenu() {
    if (!burger || !mobileMenu) return;

    burger.classList.remove("is-active");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Открыть меню");

    mobileMenu.classList.remove("is-open");
    mobileMenu.setAttribute("aria-hidden", "true");
  }

  function toggleMobileMenu() {
    if (!mobileMenu) return;

    if (mobileMenu.classList.contains("is-open")) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  burger?.addEventListener("click", toggleMobileMenu);

  mobileMenuClose?.addEventListener("click", closeMobileMenu);

  mobileMenuBackdrop?.addEventListener("click", closeMobileMenu);

  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1130) {
      closeMobileMenu();
    }
  });

  /* ==========================================================
     PRIVOZ NETWORK
  ========================================================== */

  const network = document.querySelector("#privozNetwork");

  if (network) {
    const nodes = [...network.querySelectorAll(".network-node")];
    const lines = [...network.querySelectorAll(".network-lines line")];
    const minorNodes = [...network.querySelectorAll(".minor-node")];

    const movingObjectsContainer = network.querySelector(".moving-objects");

    if (movingObjectsContainer) {
      /* ======================================================
         NODE DATA
      ====================================================== */

      const nodeData = new Map();

      nodes.forEach((node) => {
        const transform = node.getAttribute("transform");

        if (!transform) return;

        const match = transform.match(
          /translate\(\s*([\d.-]+)[,\s]+([\d.-]+)\s*\)/,
        );

        if (!match) return;

        const baseX = Number(match[1]);
        const baseY = Number(match[2]);

        const isMain = node.id === "privoz";

        nodeData.set(node.id, {
          node,

          baseX,
          baseY,

          x: baseX,
          y: baseY,

          ampX: isMain ? 2.2 : 4 + Math.random() * 6,
          ampY: isMain ? 2.2 : 4 + Math.random() * 6,

          speedX: isMain ? 0.00014 : 0.00012 + Math.random() * 0.0001,

          speedY: isMain ? 0.00013 : 0.00012 + Math.random() * 0.0001,

          phaseX: Math.random() * Math.PI * 2,
          phaseY: Math.random() * Math.PI * 2,
        });
      });

      const minorNodeData = minorNodes.map((node) => ({
        node,

        baseX: Number(node.dataset.baseX),
        baseY: Number(node.dataset.baseY),

        ampX: 2 + Math.random() * 5,
        ampY: 2 + Math.random() * 5,

        speedX: 0.00013 + Math.random() * 0.00014,
        speedY: 0.00013 + Math.random() * 0.00014,

        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
      }));

      /* ======================================================
         NETWORK LINES
      ====================================================== */

      function updateLines() {
        lines.forEach((line) => {
          const from = nodeData.get(line.dataset.from);
          const to = nodeData.get(line.dataset.to);

          if (!from || !to) return;

          line.setAttribute("x1", from.x);
          line.setAttribute("y1", from.y);

          line.setAttribute("x2", to.x);
          line.setAttribute("y2", to.y);
        });
      }

      /* ======================================================
         PARALLAX
      ====================================================== */

      let mouseX = 0;
      let mouseY = 0;

      let targetMouseX = 0;
      let targetMouseY = 0;

      network.addEventListener("pointermove", (event) => {
        const rect = network.getBoundingClientRect();

        targetMouseX = (event.clientX - rect.left) / rect.width - 0.5;

        targetMouseY = (event.clientY - rect.top) / rect.height - 0.5;
      });

      network.addEventListener("pointerleave", () => {
        targetMouseX = 0;
        targetMouseY = 0;
      });

      /* ======================================================
         SVG HELPERS
      ====================================================== */

      const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

      function createSvgElement(tag, attributes = {}) {
        const element = document.createElementNS(SVG_NAMESPACE, tag);

        Object.entries(attributes).forEach(([key, value]) => {
          element.setAttribute(key, value);
        });

        return element;
      }

      function createObjectBase(type) {
        const group = createSvgElement("g", {
          class: `moving-object moving-object--${type}`,
        });

        const background = createSvgElement("circle", {
          class: "moving-object__background",

          cx: 0,
          cy: 0,
          r: 13,
        });

        const icon = createSvgElement("g", {
          class: "moving-object__icon",
        });

        group.append(background, icon);

        return {
          group,
          icon,
        };
      }

      /* ======================================================
         MOVING ICONS
      ====================================================== */

      function createMoneyIcon() {
        const { group, icon } = createObjectBase("money");

        icon.append(
          createSvgElement("circle", {
            cx: 0,
            cy: 0,
            r: 7,
          }),

          createSvgElement("path", {
            d: "M2 -4 C-5 -6 -7 -1 -2 1 C3 3 5 6 -2 6 M0 -8 V8",
          }),
        );

        return group;
      }

      function createProductIcon() {
        const { group, icon } = createObjectBase("product");

        icon.append(
          createSvgElement("rect", {
            x: -7,
            y: -7,
            width: 14,
            height: 14,
            rx: 1.5,
          }),

          createSvgElement("path", {
            d: "M-7 -2 L0 2 L7 -2",
          }),

          createSvgElement("line", {
            x1: 0,
            y1: 2,
            x2: 0,
            y2: 7,
          }),
        );

        return group;
      }

      function createPlaneIcon() {
        const { group, icon } = createObjectBase("plane");

        icon.appendChild(
          createSvgElement("path", {
            d: `
              M-9 1
              L9 -6
              L5 1
              L10 4
              L8 7
              L2 4
              L-2 9
              L-4 8
              L-3 3
              L-9 2
              Z
            `,
          }),
        );

        return group;
      }

      function createTruckIcon() {
        const { group, icon } = createObjectBase("truck");

        icon.append(
          createSvgElement("rect", {
            x: -9,
            y: -5,
            width: 11,
            height: 8,
          }),

          createSvgElement("path", {
            d: "M2 -2 H6 L9 1 V4 H2 Z",
          }),

          createSvgElement("circle", {
            cx: -5,
            cy: 6,
            r: 2,
          }),

          createSvgElement("circle", {
            cx: 6,
            cy: 6,
            r: 2,
          }),
        );

        return group;
      }

      function createShipIcon() {
        const { group, icon } = createObjectBase("ship");

        icon.append(
          createSvgElement("path", {
            d: "M-10 2 H10 L6 8 H-5 Z",
          }),

          createSvgElement("rect", {
            x: -5,
            y: -4,
            width: 8,
            height: 6,
          }),

          createSvgElement("line", {
            x1: 0,
            y1: -9,
            x2: 0,
            y2: -4,
          }),
        );

        return group;
      }

      /* ======================================================
         MOVING OBJECT
      ====================================================== */

      function createMovingObject(type, route, options = {}) {
        const creators = {
          money: createMoneyIcon,
          product: createProductIcon,
          plane: createPlaneIcon,
          truck: createTruckIcon,
          ship: createShipIcon,
        };

        const creator = creators[type];

        if (!creator) return null;

        const element = creator();

        movingObjectsContainer.appendChild(element);

        return {
          type,
          element,
          route,

          progress: options.progress ?? 0,
          speed: options.speed ?? 0.00004,
          direction: options.direction ?? 1,
          scale: options.scale ?? 1,
        };
      }

      /* ======================================================
         ROUTES
      ====================================================== */

      const routes = {
        product1: ["manufacturer", "privoz", "purchase"],

        product2: ["search", "privoz", "manufacturer"],

        money1: ["client", "privoz", "manufacturer"],

        money2: ["purchase", "privoz", "client"],

        plane: ["manufacturer", "inspection", "logistics"],

        truck: ["logistics", "customs", "warehouse"],

        ship: ["manufacturer", "privoz", "logistics"],
      };

      const movingObjects = [
        createMovingObject("product", routes.product1, {
          progress: 0.08,
          speed: 0.000045,
          scale: 0.92,
        }),

        createMovingObject("product", routes.product2, {
          progress: 0.58,
          speed: 0.000039,
          scale: 0.82,
        }),

        createMovingObject("money", routes.money1, {
          progress: 0.24,
          speed: 0.000055,
          scale: 0.82,
        }),

        createMovingObject("money", routes.money2, {
          progress: 0.72,
          speed: 0.00005,
          scale: 0.72,
        }),

        createMovingObject("plane", routes.plane, {
          progress: 0.15,
          speed: 0.000036,
          scale: 0.95,
        }),

        createMovingObject("truck", routes.truck, {
          progress: 0.46,
          speed: 0.000032,
          scale: 0.9,
        }),

        createMovingObject("ship", routes.ship, {
          progress: 0.75,
          speed: 0.000022,
          scale: 0.94,
        }),
      ].filter(Boolean);

      /* ======================================================
         ROUTE POSITION
      ====================================================== */

      function getRoutePosition(route, progress) {
        const numberOfSegments = route.length - 1;

        if (numberOfSegments <= 0) return null;

        const normalizedProgress = Math.min(Math.max(progress, 0), 0.999999);

        const totalPosition = normalizedProgress * numberOfSegments;

        const segmentIndex = Math.floor(totalPosition);

        const localProgress = totalPosition - segmentIndex;

        const from = nodeData.get(route[segmentIndex]);

        const to = nodeData.get(route[segmentIndex + 1]);

        if (!from || !to) return null;

        return {
          x: from.x + (to.x - from.x) * localProgress,

          y: from.y + (to.y - from.y) * localProgress,

          angle: (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI,
        };
      }

      /* ======================================================
         MOVING OBJECT UPDATE
      ====================================================== */

      function updateMovingObjects(delta) {
        movingObjects.forEach((object) => {
          object.progress += delta * object.speed * object.direction;

          if (object.progress >= 1) {
            object.progress = 0;
          } else if (object.progress < 0) {
            object.progress = 1;
          }

          const position = getRoutePosition(object.route, object.progress);

          if (!position) return;

          const shouldRotate =
            object.type === "plane" ||
            object.type === "truck" ||
            object.type === "ship";

          const rotation = shouldRotate ? position.angle : 0;

          object.element.setAttribute(
            "transform",
            `
              translate(
                ${position.x}
                ${position.y}
              )
              rotate(${rotation})
              scale(${object.scale})
            `,
          );
        });
      }

      /* ======================================================
         NETWORK ANIMATION
      ====================================================== */

      let previousNetworkTime = 0;

      function animateNetwork(time) {
        const delta = previousNetworkTime
          ? Math.min(time - previousNetworkTime, 32)
          : 16;

        previousNetworkTime = time;

        mouseX += (targetMouseX - mouseX) * 0.025;

        mouseY += (targetMouseY - mouseY) * 0.025;

        nodeData.forEach((item, id) => {
          const depth = id === "privoz" ? 2 : 7;

          const floatingX =
            Math.sin(time * item.speedX + item.phaseX) * item.ampX;

          const floatingY =
            Math.cos(time * item.speedY + item.phaseY) * item.ampY;

          item.x = item.baseX + floatingX + mouseX * depth;

          item.y = item.baseY + floatingY + mouseY * depth;

          item.node.setAttribute("transform", `translate(${item.x} ${item.y})`);
        });

        minorNodeData.forEach((item) => {
          const x =
            item.baseX + Math.sin(time * item.speedX + item.phaseX) * item.ampX;

          const y =
            item.baseY + Math.cos(time * item.speedY + item.phaseY) * item.ampY;

          item.node.setAttribute("transform", `translate(${x} ${y})`);
        });

        updateLines();
        updateMovingObjects(delta);

        requestAnimationFrame(animateNetwork);
      }

      updateLines();

      requestAnimationFrame(animateNetwork);
    }
  }

  /* ==========================================================
     PRODUCT SEARCH
  ========================================================== */

  const productSearchForm = document.querySelector("#productSearchForm");

  const productSearchInput = document.querySelector("#productSearchInput");

  productSearchForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const query = productSearchInput?.value.trim();

    if (!query) {
      productSearchInput?.focus();
      return;
    }

    console.log("Поиск товара:", query);
  });

  /* ==========================================================
     IMPORT GLOBE
  ========================================================== */

  const importGlobe = document.querySelector("#importGlobe");

  if (importGlobe) {
    const svg = importGlobe.querySelector(".import-globe__svg");

    const dotsContainer = importGlobe.querySelector(".import-globe-dots");

    const cardsContainer = importGlobe.querySelector(".import-moving-cards");

    if (svg && dotsContainer && cardsContainer) {
      const SVG_NS = "http://www.w3.org/2000/svg";

      /* ======================================================
         SVG HELPER
      ====================================================== */

      function createImportSVG(tag, attrs = {}) {
        const element = document.createElementNS(SVG_NS, tag);

        Object.entries(attrs).forEach(([key, value]) => {
          element.setAttribute(key, value);
        });

        return element;
      }

      /* ======================================================
         GLOBE DOTS
      ====================================================== */

      const globe = {
        x: 380,
        y: 380,
        radius: 294,
      };

      const dots = [];

      const step = 15;

      for (
        let y = globe.y - globe.radius;
        y <= globe.y + globe.radius;
        y += step
      ) {
        for (
          let x = globe.x - globe.radius;
          x <= globe.x + globe.radius;
          x += step
        ) {
          const dx = x - globe.x;
          const dy = y - globe.y;

          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance > globe.radius) {
            continue;
          }

          const randomX = x + (Math.random() - 0.5) * 5;

          const randomY = y + (Math.random() - 0.5) * 5;

          const europeDistance = Math.hypot(randomX - 391, randomY - 268);

          const isEurope = europeDistance < 48;

          const edgeFactor = 1 - distance / globe.radius;

          const radius = 0.7 + Math.random() * 0.7;

          const opacity = 0.15 + edgeFactor * 0.33;

          const dot = createImportSVG("circle", {
            cx: randomX,

            cy: randomY,

            r: isEurope ? radius + 0.35 : radius,

            class: isEurope
              ? "import-globe-dot import-globe-dot--accent"
              : "import-globe-dot",

            opacity: isEurope ? 0.72 : opacity,
          });

          dotsContainer.appendChild(dot);

          dots.push({
            element: dot,

            baseRadius: isEurope ? radius + 0.35 : radius,

            baseOpacity: isEurope ? 0.72 : opacity,

            phase: Math.random() * Math.PI * 2,

            accent: isEurope,
          });
        }
      }

      /* ======================================================
         IMPORT ICONS
      ====================================================== */

      function createImportPlane(parent) {
        parent.appendChild(
          createImportSVG("path", {
            d: `
              M-5 1
              L5 -3
              L2 1
              L6 3
              L5 5
              L1 3
              L-1 7
              L-2 6
              L-2 2
              L-5 1
              Z
            `,
          }),
        );
      }

      function createImportShip(parent) {
        parent.appendChild(
          createImportSVG("path", {
            d: `
              M-6 2
              H6
              L3 6
              H-3
              Z
            `,
          }),
        );

        parent.appendChild(
          createImportSVG("rect", {
            x: -3,
            y: -3,
            width: 6,
            height: 4,
          }),
        );

        parent.appendChild(
          createImportSVG("line", {
            x1: 0,
            y1: -7,
            x2: 0,
            y2: -3,
          }),
        );
      }

      function createImportTruck(parent) {
        parent.appendChild(
          createImportSVG("rect", {
            x: -6,
            y: -3,
            width: 8,
            height: 6,
          }),
        );

        parent.appendChild(
          createImportSVG("path", {
            d: `
              M2 -1
              H5
              L7 1
              V3
              H2
              Z
            `,
          }),
        );

        parent.appendChild(
          createImportSVG("circle", {
            cx: -3,
            cy: 5,
            r: 1.3,
          }),
        );

        parent.appendChild(
          createImportSVG("circle", {
            cx: 4.5,
            cy: 5,
            r: 1.3,
          }),
        );
      }

      function createImportTrain(parent) {
        parent.appendChild(
          createImportSVG("rect", {
            x: -5.5,
            y: -5,
            width: 11,
            height: 9,
            rx: 1.5,
          }),
        );

        parent.appendChild(
          createImportSVG("line", {
            x1: -3,
            y1: -1,
            x2: 3,
            y2: -1,
          }),
        );

        parent.appendChild(
          createImportSVG("circle", {
            cx: -2.6,
            cy: 5.5,
            r: 1.2,
          }),
        );

        parent.appendChild(
          createImportSVG("circle", {
            cx: 2.6,
            cy: 5.5,
            r: 1.2,
          }),
        );
      }

      /* ======================================================
         TRANSPORT CARD
      ====================================================== */

      function createImportTransport(type, label) {
        const group = createImportSVG("g", {
          class: `import-transport import-transport--${type}`,
        });

        const background = createImportSVG("rect", {
          class: "import-transport__bg",

          x: -25,
          y: -9,

          width: 50,
          height: 18,

          rx: 9,
        });

        const icon = createImportSVG("g", {
          class: "import-transport__icon",

          transform: "translate(-14 -1)",
        });

        if (type === "air") {
          createImportPlane(icon);
        }

        if (type === "sea") {
          createImportShip(icon);
        }

        if (type === "truck") {
          createImportTruck(icon);
        }

        if (type === "rail") {
          createImportTrain(icon);
        }

        const text = createImportSVG("text", {
          class: "import-transport__text",

          x: -2,
          y: 0,
        });

        text.textContent = label;

        const arrow = createImportSVG("path", {
          class: "import-transport__arrow",

          d: "M17 -3 L22 0 L17 3 Z",
        });

        group.appendChild(background);
        group.appendChild(icon);
        group.appendChild(text);
        group.appendChild(arrow);

        cardsContainer.appendChild(group);

        return group;
      }

      /* ======================================================
         IMPORT ROUTES
      ====================================================== */

      const configs = [
        {
          path: "#importRouteAmerica",

          type: "air",

          text: "AIR",

          speed: 43,

          progress: 0.15,
        },

        {
          path: "#importRouteSouthAmerica",

          type: "sea",

          text: "SEA",

          speed: 26,

          progress: 0.48,
        },

        {
          path: "#importRouteAfrica",

          type: "sea",

          text: "SEA",

          speed: 23,

          progress: 0.16,
        },

        {
          path: "#importRouteAsia",

          type: "air",

          text: "AIR",

          speed: 39,

          progress: 0.55,
        },

        {
          path: "#importRouteAustralia",

          type: "sea",

          text: "SEA",

          speed: 22,

          progress: 0.3,
        },

        {
          path: "#importRouteEast",

          type: "truck",

          text: "TRUCK",

          speed: 30,

          progress: 0.64,
        },
      ];

      const transports = configs
        .map((config) => {
          const path = svg.querySelector(config.path);

          if (!path) return null;

          const length = path.getTotalLength();

          return {
            path,

            length,

            position: length * config.progress,

            speed: config.speed,

            phase: Math.random() * Math.PI * 2,

            element: createImportTransport(config.type, config.text),
          };
        })
        .filter(Boolean);

      /* ======================================================
         IMPORT ANIMATION
      ====================================================== */

      let previousImportTime = 0;

      function animateImportGlobe(time) {
        const delta = previousImportTime
          ? Math.min(time - previousImportTime, 32)
          : 16;

        previousImportTime = time;

        dots.forEach((dot) => {
          const pulse = Math.sin(
            time * (dot.accent ? 0.0025 : 0.0014) + dot.phase,
          );

          dot.element.setAttribute(
            "opacity",
            Math.max(
              0.05,

              dot.baseOpacity + pulse * (dot.accent ? 0.16 : 0.05),
            ),
          );

          dot.element.setAttribute(
            "r",
            Math.max(
              0.35,

              dot.baseRadius + pulse * (dot.accent ? 0.18 : 0.04),
            ),
          );
        });

        transports.forEach((transport) => {
          transport.position += (delta * transport.speed) / 1000;

          if (transport.position > transport.length) {
            transport.position = 0;
          }

          const point = transport.path.getPointAtLength(transport.position);

          const floating = Math.sin(time * 0.002 + transport.phase) * 1.2;

          transport.element.setAttribute(
            "transform",
            `
                translate(
                  ${point.x}
                  ${point.y + floating}
                )
              `,
          );
        });

        requestAnimationFrame(animateImportGlobe);
      }

      requestAnimationFrame(animateImportGlobe);
    }
  }
});
