const canvas = document.getElementById("privozGlobe");
const ctx = canvas.getContext("2d");

const DOT_COLOR = "#FFFFFF";

let width = 0;
let height = 0;
let radius = 0;
let dpr = 1;

let projection;
let geoPath;
let land;

const CENTER = [15, 50];

/* =========================
   START
========================= */

async function init() {
  try {
    const world = await fetch(
      "https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json",
    ).then((response) => {
      if (!response.ok) {
        throw new Error("Ошибка загрузки карты");
      }
      return response.json();
    });

    land = topojson.feature(world, world.objects.land);

    resize();
    window.addEventListener("resize", resize);
  } catch (error) {
    console.error("PRIVOZ globe:", error);
  }
}

/* =========================
   RESIZE
========================= */

function resize() {
  const rect = canvas.getBoundingClientRect();

  dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  canvas.style.width = rect.width + "px";
  canvas.style.height = rect.height + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  width = rect.width;
  height = rect.height;
  radius = Math.min(width, height) * 0.46;

  projection = d3
    .geoOrthographic()
    .translate([width / 2, height / 2])
    .scale(radius)
    .rotate([-CENTER[0], -CENTER[1]])
    .clipAngle(90);

  geoPath = d3.geoPath(projection, ctx);

  draw();
}

/* =========================
   EUROPE AREA
========================= */

function isEurope(lon, lat) {
  return lon >= -12 && lon <= 42 && lat >= 35 && lat <= 72;
}

/* =========================
   VISIBLE SIDE
========================= */

function isVisible(lon, lat) {
  return d3.geoDistance([lon, lat], CENTER) < Math.PI / 2;
}

/* =========================
   DRAW SPHERE
========================= */

function drawSphere() {
  const cx = width / 2;
  const cy = height / 2;

  const gradient = ctx.createRadialGradient(
    cx - radius * 0.28,
    cy - radius * 0.28,
    radius * 0.06,
    cx,
    cy,
    radius,
  );

  gradient.addColorStop(0, "rgba(255,255,255,0.18)");
  gradient.addColorStop(0.65, "rgba(255,255,255,0.08)");
  gradient.addColorStop(1, "rgba(255,255,255,0.03)");

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.lineWidth = 1.2;
  ctx.stroke();
}

/* =========================
   DRAW DOT MAP
========================= */

function drawMapDots() {
  const step = width < 768 ? 3 : 2.3;

  for (let lat = -60; lat <= 84; lat += step) {
    const row = Math.round((lat + 90) / step);
    const offset = row % 2 ? step / 2 : 0;

    for (let lon = -180; lon < 180; lon += step) {
      const currentLon = lon + offset;

      if (!isVisible(currentLon, lat)) continue;

      if (!d3.geoContains(land, [currentLon, lat])) continue;

      const point = projection([currentLon, lat]);
      if (!point) continue;

      const [x, y] = point;
      const europe = isEurope(currentLon, lat);

      ctx.beginPath();
      ctx.arc(x, y, europe ? 1.8 : 1.45, 0, Math.PI * 2);

      ctx.fillStyle = DOT_COLOR;
      ctx.globalAlpha = europe ? 0.98 : 0.82;
      ctx.fill();
    }
  }

  ctx.globalAlpha = 1;
}

/* =========================
   EUROPE CENTER
========================= */

function drawEuropeCenter() {
  const point = projection([19, 52]);
  if (!point) return;

  const [x, y] = point;

  ctx.beginPath();
  ctx.arc(x, y, 12, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.14)";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x, y, 6, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.22)";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x, y, 3.2, 0, Math.PI * 2);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
}

/* =========================
   DRAW
========================= */

function draw() {
  ctx.clearRect(0, 0, width, height);

  drawSphere();
  drawMapDots();
  drawEuropeCenter();
}

/* =========================
   INIT
========================= */

init();
