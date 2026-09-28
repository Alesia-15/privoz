document.addEventListener("DOMContentLoaded", () => {
  const network = document.querySelector("#privozNetwork");

  if (!network) {
    return;
  }

  /* ==========================================================
     DOM
  ========================================================== */

  const nodes = [...network.querySelectorAll(".network-node")];

  const lines = [...network.querySelectorAll(".network-lines line")];

  const minorNodes = [...network.querySelectorAll(".minor-node")];

  const movingObjectsContainer = network.querySelector(".moving-objects");

  /* ==========================================================
     NODE DATA
  ========================================================== */

  const nodeData = new Map();

  nodes.forEach((node) => {
    const transform = node.getAttribute("transform");

    const match = transform.match(
      /translate\(\s*([\d.-]+)[,\s]+([\d.-]+)\s*\)/,
    );

    if (!match) {
      return;
    }

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

  /* ==========================================================
     MINOR NODE DATA
  ========================================================== */

  const minorNodeData = minorNodes.map((node) => {
    return {
      node,

      baseX: Number(node.dataset.baseX),

      baseY: Number(node.dataset.baseY),

      ampX: 2 + Math.random() * 5,

      ampY: 2 + Math.random() * 5,

      speedX: 0.00013 + Math.random() * 0.00014,

      speedY: 0.00013 + Math.random() * 0.00014,

      phaseX: Math.random() * Math.PI * 2,

      phaseY: Math.random() * Math.PI * 2,
    };
  });

  /* ==========================================================
     UPDATE NETWORK LINES
  ========================================================== */

  function updateLines() {
    lines.forEach((line) => {
      const from = nodeData.get(line.dataset.from);

      const to = nodeData.get(line.dataset.to);

      if (!from || !to) {
        return;
      }

      line.setAttribute("x1", from.x);

      line.setAttribute("y1", from.y);

      line.setAttribute("x2", to.x);

      line.setAttribute("y2", to.y);
    });
  }

  /* ==========================================================
     POINTER PARALLAX
  ========================================================== */

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

  /* ==========================================================
     ICON BUILDERS
  ========================================================== */

  const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

  function createSvgElement(tag, attributes = {}) {
    const element = document.createElementNS(SVG_NAMESPACE, tag);

    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });

    return element;
  }

  /* ==========================================================
     BASE MOVING OBJECT
  ========================================================== */

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

    group.appendChild(background);

    group.appendChild(icon);

    return {
      group,
      icon,
    };
  }

  /* ==========================================================
     MONEY ICON
  ========================================================== */

  function createMoneyIcon() {
    const { group, icon } = createObjectBase("money");

    const circle = createSvgElement("circle", {
      cx: 0,
      cy: 0,
      r: 7,
    });

    const currency = createSvgElement("path", {
      d: "M2 -4 C-5 -6 -7 -1 -2 1 C3 3 5 6 -2 6 M0 -8 V8",
    });

    icon.appendChild(circle);

    icon.appendChild(currency);

    return group;
  }

  /* ==========================================================
     PRODUCT / CARD ICON
  ========================================================== */

  function createProductIcon() {
    const { group, icon } = createObjectBase("product");

    const box = createSvgElement("rect", {
      x: -7,
      y: -7,
      width: 14,
      height: 14,
      rx: 1.5,
    });

    const topLine = createSvgElement("path", {
      d: "M-7 -2 L0 2 L7 -2",
    });

    const middle = createSvgElement("line", {
      x1: 0,
      y1: 2,
      x2: 0,
      y2: 7,
    });

    icon.appendChild(box);

    icon.appendChild(topLine);

    icon.appendChild(middle);

    return group;
  }

  /* ==========================================================
     PLANE ICON
  ========================================================== */

  function createPlaneIcon() {
    const { group, icon } = createObjectBase("plane");

    const plane = createSvgElement("path", {
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
    });

    icon.appendChild(plane);

    return group;
  }

  /* ==========================================================
     TRUCK ICON
  ========================================================== */

  function createTruckIcon() {
    const { group, icon } = createObjectBase("truck");

    const body = createSvgElement("rect", {
      x: -9,
      y: -5,
      width: 11,
      height: 8,
    });

    const cab = createSvgElement("path", {
      d: "M2 -2 H6 L9 1 V4 H2 Z",
    });

    const wheel1 = createSvgElement("circle", {
      cx: -5,
      cy: 6,
      r: 2,
    });

    const wheel2 = createSvgElement("circle", {
      cx: 6,
      cy: 6,
      r: 2,
    });

    icon.appendChild(body);

    icon.appendChild(cab);

    icon.appendChild(wheel1);

    icon.appendChild(wheel2);

    return group;
  }

  /* ==========================================================
     SHIP ICON
  ========================================================== */

  function createShipIcon() {
    const { group, icon } = createObjectBase("ship");

    const hull = createSvgElement("path", {
      d: "M-10 2 H10 L6 8 H-5 Z",
    });

    const cabin = createSvgElement("rect", {
      x: -5,
      y: -4,
      width: 8,
      height: 6,
    });

    const mast = createSvgElement("line", {
      x1: 0,
      y1: -9,
      x2: 0,
      y2: -4,
    });

    icon.appendChild(hull);

    icon.appendChild(cabin);

    icon.appendChild(mast);

    return group;
  }

  /* ==========================================================
     FACTORY
  ========================================================== */

  function createMovingObject(type, route, options = {}) {
    let element;

    switch (type) {
      case "money":
        element = createMoneyIcon();
        break;

      case "product":
        element = createProductIcon();
        break;

      case "plane":
        element = createPlaneIcon();
        break;

      case "truck":
        element = createTruckIcon();
        break;

      case "ship":
        element = createShipIcon();
        break;

      default:
        return null;
    }

    movingObjectsContainer.appendChild(element);

    return {
      type,

      element,

      route,

      progress: options.progress ?? 0,

      speed: options.speed ?? 0.00004,

      direction: options.direction ?? 1,

      rotate: options.rotate ?? true,

      scale: options.scale ?? 1,

      wait: options.wait ?? 0,

      currentWait: options.wait ?? 0,
    };
  }

  /* ==========================================================
     ROUTES
  ========================================================== */

  /*
    Каждый маршрут состоит из последовательности узлов.
    Объект проходит один отрезок, затем следующий.
  */

  const routes = {
    product1: ["manufacturer", "privoz", "purchase"],

    product2: ["search", "privoz", "manufacturer"],

    money1: ["client", "privoz", "manufacturer"],

    money2: ["purchase", "privoz", "client"],

    plane: ["manufacturer", "inspection", "logistics"],

    truck: ["logistics", "customs", "warehouse"],

    ship: ["manufacturer", "privoz", "logistics"],
  };

  /* ==========================================================
     MOVING OBJECTS
  ========================================================== */

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

  /* ==========================================================
     GET POSITION ALONG MULTI-SEGMENT ROUTE
  ========================================================== */

  function getRoutePosition(route, progress) {
    const numberOfSegments = route.length - 1;

    if (numberOfSegments <= 0) {
      return null;
    }

    const normalizedProgress = Math.min(Math.max(progress, 0), 0.999999);

    const totalPosition = normalizedProgress * numberOfSegments;

    const segmentIndex = Math.floor(totalPosition);

    const localProgress = totalPosition - segmentIndex;

    const fromId = route[segmentIndex];

    const toId = route[segmentIndex + 1];

    const from = nodeData.get(fromId);

    const to = nodeData.get(toId);

    if (!from || !to) {
      return null;
    }

    const x = from.x + (to.x - from.x) * localProgress;

    const y = from.y + (to.y - from.y) * localProgress;

    const angle = (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI;

    return {
      x,
      y,
      angle,
    };
  }

  /* ==========================================================
     MOVING OBJECT UPDATE
  ========================================================== */

  function updateMovingObjects(delta) {
    movingObjects.forEach((object) => {
      object.progress += delta * object.speed * object.direction;

      /*
          Доходит до конца маршрута:
          появляется снова в начале.
        */

      if (object.progress >= 1) {
        object.progress = 0;
      }

      if (object.progress < 0) {
        object.progress = 1;
      }

      const position = getRoutePosition(object.route, object.progress);

      if (!position) {
        return;
      }

      /*
          Для машин / самолёта / корабля
          разворачиваем по направлению движения.
          Для денег и товара можно тоже оставить,
          но визуально лучше без сильного вращения.
        */

      let rotation = 0;

      if (
        object.type === "plane" ||
        object.type === "truck" ||
        object.type === "ship"
      ) {
        rotation = position.angle;
      }

      /*
          Немного уменьшаем поворот фуры/корабля,
          чтобы вертикальные маршруты не выглядели странно.
        */

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

  /* ==========================================================
     MAIN ANIMATION
  ========================================================== */

  let previousTime = 0;

  function animate(time) {
    const delta = previousTime ? Math.min(time - previousTime, 32) : 16;

    previousTime = time;

    /* плавный parallax */

    mouseX += (targetMouseX - mouseX) * 0.025;

    mouseY += (targetMouseY - mouseY) * 0.025;

    /* ----------------------------------------------
       крупные узлы
    ---------------------------------------------- */

    nodeData.forEach((item, id) => {
      const isMain = id === "privoz";

      const depth = isMain ? 2 : 7;

      const floatingX = Math.sin(time * item.speedX + item.phaseX) * item.ampX;

      const floatingY = Math.cos(time * item.speedY + item.phaseY) * item.ampY;

      const parallaxX = mouseX * depth;

      const parallaxY = mouseY * depth;

      item.x = item.baseX + floatingX + parallaxX;

      item.y = item.baseY + floatingY + parallaxY;

      item.node.setAttribute(
        "transform",
        `
              translate(
                ${item.x}
                ${item.y}
              )
            `,
      );
    });

    /* ----------------------------------------------
       мелкие ромбы
    ---------------------------------------------- */

    minorNodeData.forEach((item) => {
      const x =
        item.baseX + Math.sin(time * item.speedX + item.phaseX) * item.ampX;

      const y =
        item.baseY + Math.cos(time * item.speedY + item.phaseY) * item.ampY;

      item.node.setAttribute(
        "transform",
        `
              translate(
                ${x}
                ${y}
              )
            `,
      );
    });

    /*
      ВАЖНО:
      сначала обновляем позиции линий,
      потом позиции транспорта.
      Благодаря этому транспорт двигается
      именно по движущейся сети.
    */

    updateLines();

    updateMovingObjects(delta);

    requestAnimationFrame(animate);
  }

  /* ==========================================================
     START
  ========================================================== */

  updateLines();

  requestAnimationFrame(animate);
});
