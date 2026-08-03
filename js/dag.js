// Modern Animated Gradient Mesh & Ambient Glows for SIKKA Hero Section
// Pure HTML5 2D Canvas — Self-contained, High performance, Zero network requests

function initHeroGradientMesh() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;

  // Track mouse position for smooth ambient parallax shift
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

  function handleMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouse.targetX = (x / rect.width - 0.5) * 2;
    mouse.targetY = (y / rect.height - 0.5) * 2;
  }

  window.addEventListener("mousemove", handleMouseMove);

  function resize() {
    const hero = document.querySelector(".hero") || canvas.parentElement;
    width = canvas.width = window.innerWidth;
    height = canvas.height = hero ? hero.clientHeight : window.innerHeight;
  }

  window.addEventListener("resize", resize);
  resize();

  // Color Orbs definition with smooth fluid motion
  const blobs = [
    {
      x: 0.35, y: 0.35, radius: 0.45,
      speedX: 0.0006, speedY: 0.0004,
      phaseX: 0, phaseY: 0,
      colorStops: [
        { offset: 0, color: "rgba(59, 130, 246, 0.45)" },  // Electric Blue
        { offset: 0.55, color: "rgba(37, 99, 235, 0.15)" },
        { offset: 1, color: "rgba(8, 8, 8, 0)" }
      ]
    },
    {
      x: 0.65, y: 0.45, radius: 0.5,
      speedX: -0.0005, speedY: 0.0007,
      phaseX: 1.5, phaseY: 0.8,
      colorStops: [
        { offset: 0, color: "rgba(139, 92, 246, 0.40)" }, // Violet / Purple
        { offset: 0.6, color: "rgba(124, 58, 237, 0.12)" },
        { offset: 1, color: "rgba(8, 8, 8, 0)" }
      ]
    },
    {
      x: 0.5, y: 0.65, radius: 0.42,
      speedX: 0.0007, speedY: -0.0005,
      phaseX: 3.1, phaseY: 2.2,
      colorStops: [
        { offset: 0, color: "rgba(34, 211, 238, 0.35)" }, // Cyan
        { offset: 0.55, color: "rgba(6, 182, 212, 0.10)" },
        { offset: 1, color: "rgba(8, 8, 8, 0)" }
      ]
    },
    {
      x: 0.25, y: 0.75, radius: 0.38,
      speedX: -0.0006, speedY: 0.0004,
      phaseX: 4.5, phaseY: 1.1,
      colorStops: [
        { offset: 0, color: "rgba(99, 102, 241, 0.30)" }, // Indigo
        { offset: 0.65, color: "rgba(79, 70, 229, 0.08)" },
        { offset: 1, color: "rgba(8, 8, 8, 0)" }
      ]
    }
  ];

  let time = 0;

  function render() {
    time += 1;

    // Smooth mouse interpolation
    mouse.x += (mouse.targetX - mouse.x) * 0.04;
    mouse.y += (mouse.targetY - mouse.y) * 0.04;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "screen";

    const baseRadius = Math.max(width, height);

    blobs.forEach((blob) => {
      // Fluid orbital motion
      const offsetX = Math.sin(time * blob.speedX + blob.phaseX) * 0.18 + mouse.x * 0.05;
      const offsetY = Math.cos(time * blob.speedY + blob.phaseY) * 0.18 + mouse.y * 0.05;

      const cx = (blob.x + offsetX) * width;
      const cy = (blob.y + offsetY) * height;
      const r = blob.radius * baseRadius;

      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      blob.colorStops.forEach((stop) => gradient.addColorStop(stop.offset, stop.color));

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Reset composite mode
    ctx.globalCompositeOperation = "source-over";

    requestAnimationFrame(render);
  }

  render();
}

// Static default stats update without any external network calls
function initStaticStats() {
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  set("dash-height", "1,996,090");
  const label = document.getElementById("dash-height-label");
  if (label) label.textContent = "Finalized checkpoints";

  set("dash-mempool", "0");
  const healthEl = document.getElementById("dash-health-value");
  if (healthEl) healthEl.textContent = "100%";
}

document.addEventListener("DOMContentLoaded", () => {
  initHeroGradientMesh();
  initStaticStats();
});