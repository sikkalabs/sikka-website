// Side-Anchored Animated Gradient Mesh & Ambient Glows for SIKKA Hero Section
// Pure HTML5 2D Canvas — Keeps center dark for maximum text readability & contrast

function initHeroGradientMesh() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;

  // Track mouse position for subtle side parallax
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

  // Color Orbs anchored strictly to Left & Right sides
  const blobs = [
    // Left Side Orbs
    {
      x: 0.12, y: 0.32, radius: 0.38,
      speedX: 0.0005, speedY: 0.0004,
      phaseX: 0, phaseY: 0,
      colorStops: [
        { offset: 0, color: "rgba(59, 130, 246, 0.42)" },  // Electric Blue (Left Top)
        { offset: 0.55, color: "rgba(37, 99, 235, 0.12)" },
        { offset: 1, color: "rgba(8, 8, 8, 0)" }
      ]
    },
    {
      x: 0.16, y: 0.72, radius: 0.34,
      speedX: 0.0006, speedY: -0.0004,
      phaseX: 3.1, phaseY: 2.2,
      colorStops: [
        { offset: 0, color: "rgba(34, 211, 238, 0.35)" }, // Cyan (Left Bottom)
        { offset: 0.55, color: "rgba(6, 182, 212, 0.09)" },
        { offset: 1, color: "rgba(8, 8, 8, 0)" }
      ]
    },
    // Right Side Orbs
    {
      x: 0.88, y: 0.35, radius: 0.42,
      speedX: -0.0005, speedY: 0.0006,
      phaseX: 1.5, phaseY: 0.8,
      colorStops: [
        { offset: 0, color: "rgba(139, 92, 246, 0.38)" }, // Violet / Purple (Right Top)
        { offset: 0.55, color: "rgba(124, 58, 237, 0.10)" },
        { offset: 1, color: "rgba(8, 8, 8, 0)" }
      ]
    },
    {
      x: 0.84, y: 0.75, radius: 0.35,
      speedX: -0.0005, speedY: 0.0004,
      phaseX: 4.5, phaseY: 1.1,
      colorStops: [
        { offset: 0, color: "rgba(99, 102, 241, 0.30)" }, // Indigo (Right Bottom)
        { offset: 0.6, color: "rgba(79, 70, 229, 0.07)" },
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
      // Fluid orbital motion constrained to side edges
      const offsetX = Math.sin(time * blob.speedX + blob.phaseX) * 0.07 + mouse.x * 0.03;
      const offsetY = Math.cos(time * blob.speedY + blob.phaseY) * 0.07 + mouse.y * 0.03;

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