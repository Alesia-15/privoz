const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const DESIGN_W = 900;
const DESIGN_H = 883;

let W = 0;
let H = 0;
let dpr = 1;

// ======================================================
// RESIZE
// ======================================================

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);

  W = window.innerWidth;
  H = window.innerHeight;

  canvas.width = W * dpr;
  canvas.height = H * dpr;

  canvas.style.width = W + "px";
  canvas.style.height = H + "px";
}

resize();

window.addEventListener("resize", resize);

// ======================================================
// DESIGN SPACE
// ======================================================

function beginDesignSpace() {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  ctx.clearRect(0, 0, W, H);

  const scale = Math.min(W / DESIGN_W, H / DESIGN_H);

  const offsetX = (W - DESIGN_W * scale) / 2;

  const offsetY = (H - DESIGN_H * scale) / 2;

  ctx.translate(offsetX, offsetY);

  ctx.scale(scale, scale);
}

// ======================================================
// BACKGROUND
// ======================================================

function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, DESIGN_W, DESIGN_H);

  gradient.addColorStop(0, "#ff7900");

  gradient.addColorStop(0.35, "#ff5008");

  gradient.addColorStop(0.72, "#f33b0c");

  gradient.addColorStop(1, "#dd1b11");

  ctx.fillStyle = gradient;

  ctx.fillRect(0, 0, DESIGN_W, DESIGN_H);

  const glow = ctx.createRadialGradient(
    450,
    390,
    30,

    450,
    390,
    500,
  );

  glow.addColorStop(0, "rgba(255,150,30,.12)");

  glow.addColorStop(1, "rgba(255,0,0,0)");

  ctx.fillStyle = glow;

  ctx.fillRect(0, 0, DESIGN_W, DESIGN_H);
}

// ======================================================
// HELPERS
// ======================================================

function dot(x, y, r = 2, alpha = 1) {
  ctx.beginPath();

  ctx.arc(x, y, r, 0, Math.PI * 2);

  ctx.fillStyle = `rgba(255,255,255,${alpha})`;

  ctx.fill();
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function cubicBezierPoint(t, p0, p1, p2, p3) {
  const mt = 1 - t;

  return {
    x:
      mt * mt * mt * p0.x +
      3 * mt * mt * t * p1.x +
      3 * mt * t * t * p2.x +
      t * t * t * p3.x,

    y:
      mt * mt * mt * p0.y +
      3 * mt * mt * t * p1.y +
      3 * mt * t * t * p2.y +
      t * t * t * p3.y,
  };
}

// ======================================================
// GLOBE SETTINGS
// ======================================================

const globeDots = [];
const globeLinks = [];

const GLOBE_X = 450;
const GLOBE_Y = 400;
const GLOBE_R = 238;

const GLOBE_CENTER_LON = 14;

// Европа опущена вниз
const GLOBE_MAP_OFFSET_Y = 50;

// ======================================================
// EUROPE TARGET
// ======================================================

const EUROPE_TARGET = {
  x: 470,
  y: 300,
};

// ======================================================
// RANDOM
// ======================================================

let globeSeed = 918273;

function globeRandom() {
  globeSeed = (globeSeed * 16807) % 2147483647;

  return (globeSeed - 1) / 2147483646;
}

// ======================================================
// LAND
// ======================================================

const LAND = [
  // AFRICA
  [
    [-17, 36],
    [-8, 36],
    [0, 37],
    [10, 37],
    [20, 33],
    [28, 31],
    [34, 30],
    [40, 20],
    [44, 12],
    [51, 11],
    [50, 2],
    [45, -5],
    [42, -12],
    [39, -20],
    [34, -27],
    [28, -34],
    [20, -35],
    [16, -29],
    [12, -22],
    [8, -15],
    [4, -7],
    [0, 4],
    [-5, 5],
    [-10, 9],
    [-15, 15],
    [-17, 22],
    [-17, 29],
    [-17, 36],
  ],

  // EUROPE
  [
    [-10, 36],
    [-8, 43],
    [-5, 48],
    [-10, 52],
    [-5, 55],

    [0, 51],
    [3, 55],
    [8, 55],
    [10, 59],
    [5, 62],

    [10, 65],
    [15, 70],
    [22, 71],
    [28, 69],

    [32, 66],
    [38, 60],
    [40, 55],
    [45, 52],

    [40, 48],
    [36, 45],
    [30, 46],

    [28, 42],
    [24, 40],
    [20, 42],

    [16, 41],
    [13, 38],
    [9, 38],

    [5, 43],
    [1, 43],
    [-5, 43],

    [-10, 36],
  ],

  // SCANDINAVIA
  [
    [5, 55],
    [7, 61],
    [12, 67],
    [18, 71],
    [25, 71],
    [31, 69],

    [28, 64],
    [24, 60],
    [20, 57],
    [15, 56],

    [10, 58],
    [5, 55],
  ],

  // GREAT BRITAIN
  [
    [-7, 50],
    [-5, 55],
    [-4, 59],

    [0, 58],
    [2, 54],
    [1, 51],

    [-2, 50],
    [-7, 50],
  ],

  // ASIA
  [
    [28, 42],
    [35, 46],
    [42, 50],
    [48, 55],
    [55, 60],
    [65, 64],

    [78, 70],
    [95, 72],
    [110, 70],
    [125, 66],
    [140, 60],

    [155, 57],
    [165, 52],
    [165, 46],
    [155, 44],

    [145, 43],
    [140, 38],
    [135, 35],
    [130, 30],

    [124, 25],
    [119, 22],
    [115, 18],

    [110, 20],
    [105, 22],
    [102, 16],

    [100, 9],
    [97, 7],
    [95, 14],
    [92, 20],

    [88, 22],
    [85, 20],
    [82, 16],

    [80, 10],
    [77, 8],
    [74, 15],

    [70, 22],
    [66, 24],
    [61, 25],

    [56, 28],
    [50, 29],
    [45, 32],

    [40, 37],
    [35, 39],
    [28, 42],
  ],

  // ARABIA
  [
    [35, 31],
    [42, 30],
    [48, 29],
    [55, 25],

    [57, 20],
    [53, 16],
    [50, 12],

    [44, 13],
    [42, 17],
    [39, 21],

    [35, 25],
    [35, 31],
  ],

  // INDIA
  [
    [68, 24],
    [72, 29],
    [78, 31],
    [85, 27],

    [88, 22],
    [84, 18],
    [81, 13],

    [78, 8],
    [75, 10],
    [72, 16],

    [68, 24],
  ],

  // SRI LANKA
  [
    [79, 10],
    [81, 9],
    [82, 7],
    [81, 5],
    [79, 6],
    [79, 10],
  ],

  // JAPAN
  [
    [130, 31],
    [133, 34],
    [136, 36],
    [139, 39],
    [142, 43],

    [145, 44],
    [144, 40],
    [141, 36],
    [137, 33],

    [133, 31],
    [130, 31],
  ],

  // MADAGASCAR
  [
    [47, -13],
    [50, -16],
    [50, -22],

    [47, -26],
    [44, -24],
    [44, -18],

    [47, -13],
  ],
];

// ======================================================
// POINT IN POLYGON
// ======================================================

function pointInPolygon(lon, lat, polygon) {
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0];
    const yi = polygon[i][1];

    const xj = polygon[j][0];
    const yj = polygon[j][1];

    const intersect =
      yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;

    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
}

function isLand(lon, lat) {
  for (let i = 0; i < LAND.length; i++) {
    if (pointInPolygon(lon, lat, LAND[i])) {
      return true;
    }
  }

  return false;
}

// ======================================================
// GEO -> SPHERE
// ======================================================

function geoToSphere(lon, lat) {
  const lonRad = (lon * Math.PI) / 180;

  const latRad = (lat * Math.PI) / 180;

  const cosLat = Math.cos(latRad);

  return {
    x: cosLat * Math.sin(lonRad),

    y: -Math.sin(latRad),

    z: cosLat * Math.cos(lonRad),
  };
}

// ======================================================
// GENERATE GLOBE
// ======================================================

function generateGlobe() {
  globeDots.length = 0;
  globeLinks.length = 0;

  globeSeed = 918273;

  const STEP = 1.15;

  for (let lat = -38; lat <= 73; lat += STEP) {
    for (let lon = -18; lon <= 166; lon += STEP) {
      const jitterLon = lon + (globeRandom() - 0.5) * 0.7;

      const jitterLat = lat + (globeRandom() - 0.5) * 0.7;

      if (!isLand(jitterLon, jitterLat)) {
        continue;
      }

      if (globeRandom() < 0.065) {
        continue;
      }

      const p = geoToSphere(jitterLon, jitterLat);

      globeDots.push({
        x: p.x,
        y: p.y,
        z: p.z,

        size: 0.7 + globeRandom() * 0.55,
      });
    }
  }

  globeSeed = 437821;

  for (let i = 0; i < 50; i++) {
    const a = Math.floor(globeRandom() * globeDots.length);

    let b = Math.floor(globeRandom() * globeDots.length);

    if (a === b) {
      b = (b + 20) % globeDots.length;
    }

    globeLinks.push([a, b]);
  }
}

generateGlobe();

// ======================================================
// SPHERE GRID
// ======================================================

function drawSphereGrid() {
  ctx.save();

  ctx.strokeStyle = "rgba(255,255,255,.025)";

  ctx.lineWidth = 0.7;

  for (let i = -4; i <= 4; i++) {
    const t = i / 5;

    const yy = GLOBE_Y + t * GLOBE_R;

    const rx = GLOBE_R * Math.sqrt(1 - t * t);

    ctx.beginPath();

    ctx.ellipse(GLOBE_X, yy, rx, 17, 0, 0, Math.PI * 2);

    ctx.stroke();
  }

  const widths = [34, 72, 118, 165];

  widths.forEach((rx) => {
    ctx.beginPath();

    ctx.ellipse(GLOBE_X, GLOBE_Y, rx, GLOBE_R, 0, 0, Math.PI * 2);

    ctx.stroke();
  });

  ctx.restore();
}

// ======================================================
// CENTER GLOW
// ======================================================

function drawCenterGlow() {
  const g = ctx.createRadialGradient(
    GLOBE_X,
    GLOBE_Y,
    0,

    GLOBE_X,
    GLOBE_Y,
    44,
  );

  g.addColorStop(0, "rgba(255,255,255,1)");

  g.addColorStop(0.08, "rgba(255,255,120,1)");

  g.addColorStop(0.2, "rgba(255,235,0,.95)");

  g.addColorStop(0.42, "rgba(255,170,0,.5)");

  g.addColorStop(0.72, "rgba(255,110,0,.1)");

  g.addColorStop(1, "rgba(255,100,0,0)");

  ctx.fillStyle = g;

  ctx.beginPath();

  ctx.arc(GLOBE_X, GLOBE_Y, 44, 0, Math.PI * 2);

  ctx.fill();

  dot(GLOBE_X, GLOBE_Y, 5, 1);
}

// ======================================================
// GLOBE CONNECTIONS
// ======================================================

function drawGlobeConnections(points) {
  globeLinks.forEach((pair) => {
    const a = points[pair[0]];

    const b = points[pair[1]];

    if (!a || !b) {
      return;
    }

    if (a.z < -0.05 || b.z < -0.05) {
      return;
    }

    const dx = b.x - a.x;

    const dy = b.y - a.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 145 || distance < 20) {
      return;
    }

    const mx = (a.x + b.x) / 2;

    const my = (a.y + b.y) / 2;

    const nx = -dy / distance;

    const ny = dx / distance;

    const curve = distance * 0.07;

    ctx.beginPath();

    ctx.moveTo(a.x, a.y);

    ctx.quadraticCurveTo(
      mx + nx * curve,

      my + ny * curve,

      b.x,
      b.y,
    );

    ctx.strokeStyle = "rgba(255,255,255,.12)";

    ctx.lineWidth = 0.7;

    ctx.stroke();

    dot(a.x, a.y, 2, 0.68);

    dot(b.x, b.y, 2, 0.68);
  });
}

// ======================================================
// DRAW GLOBE
// ======================================================

function drawGlobe() {
  const rotation = (GLOBE_CENTER_LON * Math.PI) / 180;

  const cos = Math.cos(rotation);

  const sin = Math.sin(rotation);

  const sphereGlow = ctx.createRadialGradient(
    GLOBE_X - 25,
    GLOBE_Y - 25,
    40,

    GLOBE_X,
    GLOBE_Y,
    GLOBE_R + 24,
  );

  sphereGlow.addColorStop(0, "rgba(255,150,30,.045)");

  sphereGlow.addColorStop(0.72, "rgba(255,255,255,.014)");

  sphereGlow.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = sphereGlow;

  ctx.beginPath();

  ctx.arc(GLOBE_X, GLOBE_Y, GLOBE_R + 24, 0, Math.PI * 2);

  ctx.fill();

  drawSphereGrid();

  const projected = [];

  globeDots.forEach((p) => {
    const xr = p.x * cos - p.z * sin;

    const zr = p.x * sin + p.z * cos;

    const perspective = 1 + zr * 0.035;

    const px = GLOBE_X + xr * GLOBE_R * perspective;

    const py = GLOBE_Y + p.y * GLOBE_R * perspective + GLOBE_MAP_OFFSET_Y;

    projected.push({
      x: px,
      y: py,
      z: zr,
    });

    let alpha;

    if (zr > 0) {
      alpha = 0.58 + zr * 0.38;
    } else {
      alpha = 0.04 + (zr + 1) * 0.055;
    }

    let size = p.size;

    if (zr > 0.55) {
      size *= 1.12;
    }

    dot(px, py, size, alpha);
  });

  drawGlobeConnections(projected);

  const hubs = [
    [2, 48],
    [12, 42],
    [30, 31],
    [32, 5],
    [44, 24],
    [77, 22],
    [103, 32],
    [120, 30],
  ];

  hubs.forEach(([lon, lat]) => {
    const hp = geoToSphere(lon, lat);

    const xr = hp.x * cos - hp.z * sin;

    const zr = hp.x * sin + hp.z * cos;

    if (zr < 0) {
      return;
    }

    const px = GLOBE_X + xr * GLOBE_R;

    const py = GLOBE_Y + hp.y * GLOBE_R + GLOBE_MAP_OFFSET_Y;

    dot(px, py, 2.2, 0.95);

    const glow = ctx.createRadialGradient(
      px,
      py,
      0,

      px,
      py,
      10,
    );

    glow.addColorStop(0, "rgba(255,255,255,.25)");

    glow.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = glow;

    ctx.beginPath();

    ctx.arc(px, py, 10, 0, Math.PI * 2);

    ctx.fill();
  });

  ctx.beginPath();

  ctx.arc(GLOBE_X, GLOBE_Y, GLOBE_R, 0, Math.PI * 2);

  ctx.strokeStyle = "rgba(255,255,255,.15)";

  ctx.lineWidth = 1;

  ctx.stroke();

  ctx.beginPath();

  ctx.arc(GLOBE_X, GLOBE_Y, GLOBE_R + 2, 0, Math.PI * 2);

  ctx.strokeStyle = "rgba(255,255,255,.035)";

  ctx.lineWidth = 5;

  ctx.stroke();

  drawCenterGlow();
}

// ======================================================
// CARD
// ======================================================

function card(x, y, size, icon, alpha = 1) {
  ctx.save();

  ctx.globalAlpha = alpha;

  ctx.translate(x, y);

  ctx.rotate(Math.PI / 4);

  const g = ctx.createLinearGradient(
    -size / 2,
    -size / 2,

    size / 2,
    size / 2,
  );

  g.addColorStop(0, "rgba(255,190,120,.52)");

  g.addColorStop(1, "rgba(255,130,90,.34)");

  ctx.fillStyle = g;

  ctx.strokeStyle = "rgba(255,255,255,.12)";

  ctx.lineWidth = 2;

  ctx.beginPath();

  ctx.roundRect(-size / 2, -size / 2, size, size, 18);

  ctx.fill();
  ctx.stroke();

  ctx.restore();

  ctx.save();

  ctx.globalAlpha = alpha;

  ctx.translate(x, y);

  ctx.strokeStyle = "rgba(255,255,255,.8)";

  ctx.fillStyle = "rgba(255,255,255,.8)";

  ctx.lineWidth = 2.3;

  ctx.lineCap = "round";

  ctx.lineJoin = "round";

  icon();

  ctx.restore();
}

// ======================================================
// ICONS
// ======================================================

function planeIcon() {
  ctx.beginPath();

  ctx.moveTo(-40, 8);
  ctx.lineTo(-11, 2);
  ctx.lineTo(-30, -21);
  ctx.lineTo(-22, -25);
  ctx.lineTo(7, -5);
  ctx.lineTo(35, -9);
  ctx.lineTo(41, -2);
  ctx.lineTo(13, 10);
  ctx.lineTo(-4, 31);
  ctx.lineTo(-14, 29);
  ctx.lineTo(-8, 12);
  ctx.lineTo(-36, 17);

  ctx.closePath();

  ctx.stroke();
}

function boxesIcon() {
  const boxes = [
    [-22, -2],
    [3, -2],
    [-10, -29],
  ];

  boxes.forEach(([x, y]) => {
    ctx.strokeRect(x, y, 23, 23);

    ctx.beginPath();

    ctx.moveTo(x + 11.5, y);

    ctx.lineTo(x + 11.5, y + 8);

    ctx.stroke();
  });
}

function truckIcon() {
  ctx.strokeRect(-40, -15, 48, 30);

  ctx.beginPath();

  ctx.moveTo(8, -5);
  ctx.lineTo(27, -5);
  ctx.lineTo(39, 7);
  ctx.lineTo(39, 15);
  ctx.lineTo(8, 15);

  ctx.closePath();

  ctx.stroke();

  ctx.beginPath();

  ctx.arc(-24, 20, 7, 0, Math.PI * 2);

  ctx.arc(26, 20, 7, 0, Math.PI * 2);

  ctx.stroke();
}

function shipIcon() {
  ctx.beginPath();

  ctx.moveTo(-42, 8);
  ctx.lineTo(42, 8);
  ctx.lineTo(31, 27);
  ctx.lineTo(-29, 27);

  ctx.closePath();

  ctx.stroke();

  for (let i = 0; i < 3; i++) {
    ctx.strokeRect(
      -6 + i * 16,

      -12,
      14,
      19,
    );
  }

  ctx.strokeRect(-24, -4, 18, 11);

  ctx.strokeRect(-19, -26, 7, 22);

  ctx.beginPath();

  ctx.moveTo(-37, 34);

  for (let i = 0; i < 5; i++) {
    ctx.quadraticCurveTo(
      -28 + i * 16,

      29,

      -20 + i * 16,

      34,
    );
  }

  ctx.stroke();
}

function currencyIcon() {
  ctx.beginPath();

  ctx.arc(-14, 0, 26, 0, Math.PI * 2);

  ctx.stroke();

  ctx.font = "27px Arial";

  ctx.textAlign = "center";

  ctx.textBaseline = "middle";

  ctx.fillText("€", -14, 1);

  ctx.beginPath();

  ctx.arc(20, 12, 19, 0, Math.PI * 2);

  ctx.stroke();

  ctx.font = "20px Arial";

  ctx.fillText("$", 20, 13);
}

function moneyIcon() {
  ctx.strokeRect(-29, -13, 57, 29);

  ctx.strokeRect(-22, -20, 57, 29);

  ctx.beginPath();

  ctx.arc(6, -1, 9, 0, Math.PI * 2);

  ctx.stroke();

  ctx.font = "15px Arial";

  ctx.textAlign = "center";

  ctx.textBaseline = "middle";

  ctx.fillText("$", 6, 0);
}

// ======================================================
// SMALL ICONS
// ======================================================

function smallBox(x, y, alpha = 1) {
  ctx.save();

  ctx.globalAlpha = alpha;

  ctx.translate(x, y);

  ctx.strokeStyle = "rgba(255,255,255,.76)";

  ctx.lineWidth = 1.5;

  ctx.strokeRect(-10, -10, 20, 20);

  ctx.beginPath();

  ctx.moveTo(-10, -10);

  ctx.lineTo(0, -16);

  ctx.lineTo(10, -10);

  ctx.stroke();

  ctx.restore();
}

function smallMoney(x, y, alpha = 1) {
  ctx.save();

  ctx.globalAlpha = alpha;

  ctx.translate(x, y);

  ctx.strokeStyle = "rgba(255,255,255,.75)";

  ctx.lineWidth = 1.5;

  ctx.strokeRect(-14, -8, 28, 16);

  ctx.beginPath();

  ctx.arc(0, 0, 5, 0, Math.PI * 2);

  ctx.stroke();

  ctx.restore();
}

function smallEuro(x, y, alpha = 1) {
  ctx.save();

  ctx.globalAlpha = alpha;

  ctx.translate(x, y);

  ctx.strokeStyle = "rgba(255,255,255,.75)";

  ctx.fillStyle = "rgba(255,255,255,.75)";

  ctx.lineWidth = 1.5;

  ctx.beginPath();

  ctx.arc(0, 0, 15, 0, Math.PI * 2);

  ctx.stroke();

  ctx.font = "17px Arial";

  ctx.textAlign = "center";

  ctx.textBaseline = "middle";

  ctx.fillText("€", 0, 1);

  ctx.restore();
}

function smallContainer(x, y, alpha = 1) {
  ctx.save();

  ctx.globalAlpha = alpha;

  ctx.translate(x, y);

  ctx.strokeStyle = "rgba(255,255,255,.72)";

  ctx.lineWidth = 1.4;

  ctx.strokeRect(-15, -8, 30, 16);

  for (let px = -10; px <= 10; px += 5) {
    ctx.beginPath();

    ctx.moveTo(px, -7);

    ctx.lineTo(px, 7);

    ctx.stroke();
  }

  ctx.restore();
}

// ======================================================
// IMPORT ANIMATION SETTINGS
// ======================================================

const INITIAL_HOLD = 2200;

const END_HOLD = 1800;

// ======================================================
// IMPORT ITEMS
// ======================================================

const importItems = [
  // ==================================================
  // AIRPLANE
  // fastest
  // ==================================================

  {
    type: "card",

    icon: planeIcon,

    size: 96,

    start: {
      x: 286,
      y: 112,
    },

    c1: {
      x: 330,
      y: 70,
    },

    c2: {
      x: 410,
      y: 140,
    },

    end: EUROPE_TARGET,

    delay: 0,

    duration: 3200,
  },

  // ==================================================
  // BOXES
  // ==================================================

  {
    type: "card",

    icon: boxesIcon,

    size: 96,

    start: {
      x: 638,
      y: 131,
    },

    c1: {
      x: 740,
      y: 150,
    },

    c2: {
      x: 650,
      y: 260,
    },

    end: EUROPE_TARGET,

    delay: 600,

    duration: 4600,
  },

  // ==================================================
  // SHIP
  // slowest
  // ==================================================

  {
    type: "card",

    icon: shipIcon,

    size: 106,

    start: {
      x: 820,
      y: 386,
    },

    c1: {
      x: 850,
      y: 560,
    },

    c2: {
      x: 670,
      y: 570,
    },

    end: EUROPE_TARGET,

    delay: 1200,

    duration: 7600,
  },

  // ==================================================
  // MONEY
  // ==================================================

  {
    type: "card",

    icon: moneyIcon,

    size: 100,

    start: {
      x: 693,
      y: 710,
    },

    c1: {
      x: 590,
      y: 770,
    },

    c2: {
      x: 430,
      y: 600,
    },

    end: EUROPE_TARGET,

    delay: 1800,

    duration: 5600,
  },

  // ==================================================
  // TRUCK
  // ==================================================

  {
    type: "card",

    icon: truckIcon,

    size: 103,

    start: {
      x: 293,
      y: 706,
    },

    c1: {
      x: 170,
      y: 610,
    },

    c2: {
      x: 250,
      y: 400,
    },

    end: EUROPE_TARGET,

    delay: 2400,

    duration: 6200,
  },

  // ==================================================
  // CURRENCY
  // ==================================================

  {
    type: "card",

    icon: currencyIcon,

    size: 100,

    start: {
      x: 101,
      y: 389,
    },

    c1: {
      x: 60,
      y: 240,
    },

    c2: {
      x: 300,
      y: 190,
    },

    end: EUROPE_TARGET,

    delay: 3000,

    duration: 5000,
  },

  // ==================================================
  // SMALL BOX
  // ==================================================

  {
    type: "smallBox",

    start: {
      x: 730,
      y: 226,
    },

    c1: {
      x: 690,
      y: 180,
    },

    c2: {
      x: 570,
      y: 220,
    },

    end: EUROPE_TARGET,

    delay: 800,

    duration: 3500,
  },

  // ==================================================
  // SMALL MONEY
  // ==================================================

  {
    type: "smallMoney",

    start: {
      x: 738,
      y: 495,
    },

    c1: {
      x: 700,
      y: 430,
    },

    c2: {
      x: 600,
      y: 350,
    },

    end: EUROPE_TARGET,

    delay: 1500,

    duration: 3900,
  },

  // ==================================================
  // SMALL EURO
  // ==================================================

  {
    type: "smallEuro",

    start: {
      x: 676,
      y: 586,
    },

    c1: {
      x: 650,
      y: 490,
    },

    c2: {
      x: 560,
      y: 380,
    },

    end: EUROPE_TARGET,

    delay: 2200,

    duration: 4300,
  },

  // ==================================================
  // LOWER BOX
  // ==================================================

  {
    type: "smallBox",

    start: {
      x: 505,
      y: 729,
    },

    c1: {
      x: 460,
      y: 620,
    },

    c2: {
      x: 420,
      y: 430,
    },

    end: EUROPE_TARGET,

    delay: 2800,

    duration: 4800,
  },

  // ==================================================
  // CONTAINER
  // ==================================================

  {
    type: "smallContainer",

    start: {
      x: 177,
      y: 523,
    },

    c1: {
      x: 100,
      y: 400,
    },

    c2: {
      x: 270,
      y: 300,
    },

    end: EUROPE_TARGET,

    delay: 3400,

    duration: 5400,
  },
];

// ======================================================
// LOOP LENGTH
// ======================================================

const LAST_ITEM_END = Math.max(
  ...importItems.map((item) => INITIAL_HOLD + item.delay + item.duration),
);

const IMPORT_LOOP_MS = LAST_ITEM_END + END_HOLD;

// ======================================================
// REMAINING ROUTE
// ======================================================

function drawRemainingRoute(item, progress) {
  if (progress >= 1) {
    return;
  }

  const startT = Math.max(0, progress);

  const first = cubicBezierPoint(
    startT,
    item.start,
    item.c1,
    item.c2,
    item.end,
  );

  ctx.beginPath();

  ctx.moveTo(first.x, first.y);

  const STEPS = 55;

  for (let i = 1; i <= STEPS; i++) {
    const t = startT + (1 - startT) * (i / STEPS);

    const point = cubicBezierPoint(t, item.start, item.c1, item.c2, item.end);

    ctx.lineTo(point.x, point.y);
  }

  ctx.strokeStyle = "rgba(255,255,255,.28)";

  ctx.lineWidth = 1.2;

  ctx.setLineDash([4, 6]);

  ctx.stroke();

  ctx.setLineDash([]);
}

// ======================================================
// DRAW IMPORT ICON
// ======================================================

function drawImportIcon(item, x, y, progress) {
  const scale = 1 - progress * 0.22;

  let alpha = 1;

  if (progress > 0.88) {
    alpha = 1 - (progress - 0.88) / 0.12;
  }

  alpha = clamp(alpha, 0, 1);

  ctx.save();

  ctx.translate(x, y);

  ctx.scale(scale, scale);

  ctx.translate(-x, -y);

  if (item.type === "card") {
    card(x, y, item.size, item.icon, alpha);
  } else if (item.type === "smallBox") {
    smallBox(x, y, alpha);
  } else if (item.type === "smallMoney") {
    smallMoney(x, y, alpha);
  } else if (item.type === "smallEuro") {
    smallEuro(x, y, alpha);
  } else if (item.type === "smallContainer") {
    smallContainer(x, y, alpha);
  }

  ctx.restore();
}

// ======================================================
// EUROPE GLOW
// ======================================================

function drawEuropeTargetGlow(time) {
  const pulse = 1 + Math.sin(time * 0.004) * 0.08;

  const radius = 17 * pulse;

  const glow = ctx.createRadialGradient(
    EUROPE_TARGET.x,
    EUROPE_TARGET.y,
    0,

    EUROPE_TARGET.x,
    EUROPE_TARGET.y,
    radius,
  );

  glow.addColorStop(0, "rgba(255,255,190,.48)");

  glow.addColorStop(0.35, "rgba(255,220,0,.22)");

  glow.addColorStop(1, "rgba(255,160,0,0)");

  ctx.fillStyle = glow;

  ctx.beginPath();

  ctx.arc(EUROPE_TARGET.x, EUROPE_TARGET.y, radius, 0, Math.PI * 2);

  ctx.fill();

  dot(EUROPE_TARGET.x, EUROPE_TARGET.y, 2.8, 0.9);
}

// ======================================================
// IMPORT ANIMATION
// ======================================================

function drawImportAnimation(time) {
  const cycleTime = time % IMPORT_LOOP_MS;

  const states = [];

  // ----------------------------------------------
  // calculate every object's progress
  // ----------------------------------------------

  importItems.forEach((item) => {
    const movementStart = INITIAL_HOLD + item.delay;

    const movementEnd = movementStart + item.duration;

    let progress = 0;

    let finished = false;

    if (cycleTime < movementStart) {
      progress = 0;
    } else if (cycleTime <= movementEnd) {
      const raw = (cycleTime - movementStart) / item.duration;

      progress = easeInOutCubic(clamp(raw, 0, 1));
    } else {
      progress = 1;

      finished = true;
    }

    states.push({
      item,
      progress,
      finished,
    });
  });

  // ----------------------------------------------
  // routes
  // ----------------------------------------------

  states.forEach((state) => {
    drawRemainingRoute(state.item, state.progress);
  });

  // ----------------------------------------------
  // icons
  // ----------------------------------------------

  states.forEach((state) => {
    if (state.finished) {
      return;
    }

    const position = cubicBezierPoint(
      state.progress,
      state.item.start,
      state.item.c1,
      state.item.c2,
      state.item.end,
    );

    drawImportIcon(state.item, position.x, position.y, state.progress);
  });

  drawEuropeTargetGlow(time);
}

// ======================================================
// FOREGROUND NODES
// ======================================================

function drawForegroundNodes() {
  const points = [
    [196, 274],
    [248, 584],
    [337, 430],
    [294, 372],
    [459, 618],
    [583, 519],
    [625, 726],
    [724, 298],
  ];

  points.forEach(([x, y]) => {
    dot(x, y, 3.2, 0.75);
  });
}

// ======================================================
// RENDER
// ======================================================

function render(time = 0) {
  beginDesignSpace();

  drawBackground();

  drawGlobe();

  drawForegroundNodes();

  drawImportAnimation(time);

  requestAnimationFrame(render);
}

// ======================================================
// START
// ======================================================

requestAnimationFrame(render);
