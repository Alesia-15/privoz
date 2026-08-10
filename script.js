document.addEventListener("DOMContentLoaded", () => {
  const visual = document.querySelector("#importGlobe");

  if (!visual) {
    return;
  }

  const svg = visual.querySelector(".import-globe__svg");

  const dotsContainer = visual.querySelector(".import-globe-dots");

  const cardsContainer = visual.querySelector(".import-moving-cards");

  const SVG_NS = "http://www.w3.org/2000/svg";

  /* ========================================================
       SVG HELPER
    ======================================================== */

  function createSVG(tag, attrs = {}) {
    const element = document.createElementNS(SVG_NS, tag);

    Object.entries(attrs).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });

    return element;
  }

  /* ========================================================
       GLOBE DOTS

       Делаем точки ТОЛЬКО внутри круга.
    ======================================================== */

  const globe = {
    x: 380,
    y: 380,
    radius: 294,
  };

  const dots = [];

  /*
      Шаг 15 = достаточно
      плотная сетка.

      Если захочешь ещё больше точек:
      поменяй 15 на 12.
    */

  const step = 15;

  for (let y = globe.y - globe.radius; y <= globe.y + globe.radius; y += step) {
    for (
      let x = globe.x - globe.radius;
      x <= globe.x + globe.radius;
      x += step
    ) {
      const dx = x - globe.x;

      const dy = y - globe.y;

      const distance = Math.sqrt(dx * dx + dy * dy);

      /*
          Только точки внутри шара
        */

      if (distance > globe.radius) {
        continue;
      }

      /*
          Делаем точки чуть менее
          регулярными.
        */

      const randomX = x + (Math.random() - 0.5) * 5;

      const randomY = y + (Math.random() - 0.5) * 5;

      /*
          Европа примерно здесь.
          Часть точек окрашиваем
          оранжевым.
        */

      const europeDistance = Math.hypot(randomX - 391, randomY - 268);

      const isEurope = europeDistance < 48;

      /*
          Чем ближе к краю шара,
          тем точка слабее.
        */

      const edgeFactor = 1 - distance / globe.radius;

      const radius = 0.7 + Math.random() * 0.7;

      const opacity = 0.15 + edgeFactor * 0.33;

      const dot = createSVG("circle", {
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

  /* ========================================================
       ICONS
    ======================================================== */

  function createPlane(parent) {
    parent.appendChild(
      createSVG("path", {
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

  function createShip(parent) {
    parent.appendChild(
      createSVG("path", {
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
      createSVG("rect", {
        x: -3,
        y: -3,
        width: 6,
        height: 4,
      }),
    );

    parent.appendChild(
      createSVG("line", {
        x1: 0,
        y1: -7,
        x2: 0,
        y2: -3,
      }),
    );
  }

  function createTruck(parent) {
    parent.appendChild(
      createSVG("rect", {
        x: -6,
        y: -3,
        width: 8,
        height: 6,
      }),
    );

    parent.appendChild(
      createSVG("path", {
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
      createSVG("circle", {
        cx: -3,
        cy: 5,
        r: 1.3,
      }),
    );

    parent.appendChild(
      createSVG("circle", {
        cx: 4.5,
        cy: 5,
        r: 1.3,
      }),
    );
  }

  function createTrain(parent) {
    parent.appendChild(
      createSVG("rect", {
        x: -5.5,
        y: -5,
        width: 11,
        height: 9,
        rx: 1.5,
      }),
    );

    parent.appendChild(
      createSVG("line", {
        x1: -3,
        y1: -1,
        x2: 3,
        y2: -1,
      }),
    );

    parent.appendChild(
      createSVG("circle", {
        cx: -2.6,
        cy: 5.5,
        r: 1.2,
      }),
    );

    parent.appendChild(
      createSVG("circle", {
        cx: 2.6,
        cy: 5.5,
        r: 1.2,
      }),
    );
  }

  /* ========================================================
       CREATE TRANSPORT CARD
    ======================================================== */

  function createTransport(type, label) {
    const group = createSVG("g", {
      class: `import-transport import-transport--${type}`,
    });

    /*
        Делаем карточки небольшими,
        чтобы точно помещались
        внутри шара.
      */

    const background = createSVG("rect", {
      class: "import-transport__bg",

      x: -25,
      y: -9,

      width: 50,
      height: 18,

      rx: 9,
    });

    const icon = createSVG("g", {
      class: "import-transport__icon",

      transform: "translate(-14 -1)",
    });

    if (type === "air") {
      createPlane(icon);
    }

    if (type === "sea") {
      createShip(icon);
    }

    if (type === "truck") {
      createTruck(icon);
    }

    if (type === "rail") {
      createTrain(icon);
    }

    const text = createSVG("text", {
      class: "import-transport__text",

      x: -2,
      y: 0,
    });

    text.textContent = label;

    const arrow = createSVG("path", {
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

  /* ========================================================
       TRANSPORT SETTINGS
    ======================================================== */

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

  /* ========================================================
       PREPARE OBJECTS
    ======================================================== */

  const transports = configs.map((config) => {
    const path = svg.querySelector(config.path);

    const length = path.getTotalLength();

    return {
      path,

      length,

      position: length * config.progress,

      speed: config.speed,

      phase: Math.random() * Math.PI * 2,

      element: createTransport(config.type, config.text),
    };
  });

  /* ========================================================
       ANIMATION
    ======================================================== */

  let previousTime = 0;

  function animate(time) {
    const delta = previousTime ? Math.min(time - previousTime, 32) : 16;

    previousTime = time;

    /* ----------------------------------------------
         DOTS
      ---------------------------------------------- */

    dots.forEach((dot) => {
      const pulse = Math.sin(time * (dot.accent ? 0.0025 : 0.0014) + dot.phase);

      dot.element.setAttribute(
        "opacity",
        Math.max(0.05, dot.baseOpacity + pulse * (dot.accent ? 0.16 : 0.05)),
      );

      dot.element.setAttribute(
        "r",
        Math.max(
          0.35,

          dot.baseRadius + pulse * (dot.accent ? 0.18 : 0.04),
        ),
      );
    });

    /* ----------------------------------------------
         TRANSPORT
      ---------------------------------------------- */

    transports.forEach((transport) => {
      transport.position += (delta * transport.speed) / 1000;

      /*
            Когда карточка дошла
            до точки назначения —
            начинаем снова из Европы.
          */

      if (transport.position > transport.length) {
        transport.position = 0;
      }

      const point = transport.path.getPointAtLength(transport.position);

      /*
            Маленькое "дыхание"
            вверх-вниз.
          */

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

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
});
