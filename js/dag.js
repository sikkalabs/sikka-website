// Three.js Linear DAG Animation with Live Data
function initHeroThreeDag() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas || typeof THREE === "undefined") return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // optimize performance

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x080808, 0.0015);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 4000);
  camera.position.set(0, 0, 100);

  // Generate Linear DAG Background
  const numNodes = 1000;
  const nodes = [];
  const links = [];

  let zPos = 200;
  for (let i = 0; i < numNodes; i++) {
    zPos -= 8 + Math.random() * 5;
    
    // Create a flowing wave effect for the line
    const waveX = Math.sin(zPos * 0.002) * 40;
    const waveY = Math.cos(zPos * 0.0015) * 30;
    
    const radius = Math.random() * 25;
    const angle = Math.random() * Math.PI * 2;
    
    const xPos = waveX + Math.cos(angle) * radius;
    const yPos = waveY + Math.sin(angle) * radius;

    nodes.push(new THREE.Vector3(xPos, yPos, zPos));

    if (i > 0) {
      // Connect to 1 or 2 recent nodes
      const numParents = Math.random() > 0.4 ? 2 : 1;
      for (let p = 0; p < numParents; p++) {
        const back = 1 + Math.floor(Math.random() * 4);
        const parentIdx = Math.max(0, i - back);
        links.push(parentIdx, i);
      }
    }
  }

  // Create Geometry
  const ptsGeometry = new THREE.BufferGeometry().setFromPoints(nodes);
  
  // Base particles
  const ptsMaterial = new THREE.PointsMaterial({
    color: 0x60a5fa,
    size: 2.5,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });
  const pointCloud = new THREE.Points(ptsGeometry, ptsMaterial);
  scene.add(pointCloud);

  // Glowing larger particles
  const glowMaterial = new THREE.PointsMaterial({
    color: 0x8b5cf6,
    size: 12,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const glowCloud = new THREE.Points(ptsGeometry, glowMaterial);
  scene.add(glowCloud);

  // Lines
  const linePositions = new Float32Array(links.length * 3);
  for (let i = 0; i < links.length; i++) {
    const idx = links[i];
    linePositions[i * 3] = nodes[idx].x;
    linePositions[i * 3 + 1] = nodes[idx].y;
    linePositions[i * 3 + 2] = nodes[idx].z;
  }
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x3b82f6,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending
  });
  const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lineSegments);

  // Resize handler
  function resize() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const w = window.innerWidth;
    const h = hero.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  // GSAP Scroll Animation
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.to(camera.position, {
      z: -2000,
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1
      }
    });

    gsap.to(camera.rotation, {
      z: Math.PI / 6,
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1
      }
    });
  }

  // Live TX Effects
  const txContainer = document.createElement('div');
  txContainer.style.position = 'absolute';
  txContainer.style.inset = '0';
  txContainer.style.pointerEvents = 'none';
  txContainer.style.overflow = 'hidden';
  txContainer.style.zIndex = '10';
  const heroEl = document.querySelector('.hero');
  if (heroEl) heroEl.appendChild(txContainer);

  const liveTxs = [];

  function spawnLiveTx(txid) {
    const zOffset = camera.position.z - 30 - Math.random() * 60;
    const xOffset = (Math.random() - 0.5) * 40;
    const yOffset = (Math.random() - 0.5) * 40;

    const ringGeo = new THREE.RingGeometry(1.5, 2.0, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 1, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(xOffset, yOffset, zOffset);
    ring.lookAt(camera.position);
    scene.add(ring);

    const label = document.createElement('div');
    label.textContent = "TX: " + txid.slice(0, 6) + "..";
    label.style.position = 'absolute';
    label.style.color = '#22d3ee';
    label.style.fontFamily = 'ui-monospace, monospace';
    label.style.fontSize = '11px';
    label.style.background = 'rgba(34, 211, 238, 0.1)';
    label.style.border = '1px solid rgba(34, 211, 238, 0.3)';
    label.style.padding = '4px 6px';
    label.style.borderRadius = '4px';
    label.style.textShadow = '0 0 10px rgba(34, 211, 238, 0.5)';
    label.style.pointerEvents = 'none';
    txContainer.appendChild(label);

    liveTxs.push({ mesh: ring, label: label, life: 1.0 });
  }

  // Render loop
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Subtle idle animation
    pointCloud.position.y = Math.sin(t * 0.5) * 2;
    glowCloud.position.y = Math.sin(t * 0.5) * 2;
    lineSegments.position.y = Math.sin(t * 0.5) * 2;
    
    // Rotate slightly
    scene.rotation.z = Math.sin(t * 0.2) * 0.05;

    // Update live TX effects
    const heroH = heroEl ? heroEl.clientHeight : window.innerHeight;
    for (let i = liveTxs.length - 1; i >= 0; i--) {
      const tx = liveTxs[i];
      tx.life -= 0.01; // Fade out over ~100 frames
      tx.mesh.scale.addScalar(0.06);
      tx.mesh.material.opacity = tx.life;
      
      if (tx.life > 0) {
        const pos = tx.mesh.position.clone();
        pos.project(camera);
        // Only show if in front of camera
        if (pos.z < 1) {
          const x = (pos.x * 0.5 + 0.5) * window.innerWidth;
          const y = (pos.y * -0.5 + 0.5) * heroH;
          tx.label.style.left = x + 'px';
          tx.label.style.top = y + 'px';
          tx.label.style.opacity = tx.life;
          tx.label.style.transform = `translate(-50%, -50%) translateY(-${(1 - tx.life) * 40}px)`;
        } else {
          tx.label.style.opacity = '0';
        }
      } else {
        scene.remove(tx.mesh);
        tx.mesh.geometry.dispose();
        tx.mesh.material.dispose();
        if (tx.label.parentNode) tx.label.parentNode.removeChild(tx.label);
        liveTxs.splice(i, 1);
      }
    }

    renderer.render(scene, camera);
  }
  animate();

  // Polling Live Data
  let lastTips = new Set();
  
  // Dummy fallback in case network fails
  function spawnDummyTx() {
    const dummyId = Math.random().toString(36).substring(2, 10);
    spawnLiveTx(dummyId);
  }
  
  async function fetchLiveStatus() {
    try {
      const res = await fetch("https://1.sikkalabs.com/v1/status", { cache: "no-store" });
      if (!res.ok) return;
      const status = await res.json();
      
      if (typeof updateStats === 'function') {
        updateStats(status);
      }
      
      const currentTips = status.tips || [];
      const newTips = currentTips.filter(t => !lastTips.has(t));
      
      newTips.forEach(tx => {
        spawnLiveTx(tx);
      });
      
      // If we got tips, update lastTips
      if (currentTips.length > 0) {
        lastTips = new Set(currentTips);
      }
    } catch (e) {
      // On fetch error (e.g. no network), optionally spawn dummy TXs for visual interest
      if (Math.random() > 0.5) spawnDummyTx();
    }
  }

  // Initial fetch and loop
  fetchLiveStatus();
  setInterval(fetchLiveStatus, 5000);
}

// Stats Updater
function updateStats(status) {
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  const dagSize = status.dag_size ?? "?";
  const tipCount = status.tip_count ?? "?";
  const pow = status.submit_pow_base_bits ?? "?";
  const work = status.submit_pow_bucket_work_factor ?? "?";

  const dagStr = typeof dagSize === "number" ? dagSize.toLocaleString() : dagSize;
  const tipStr = typeof tipCount === "number" ? tipCount.toLocaleString() : tipCount;

  set("stat-dag-size", dagStr);
  set("stat-tip-count", tipStr);
  set("stat-pow", pow);
  set("stat-work", work);
  set("dash-dag-size", dagStr);
  set("dash-tip-count", tipStr);

  const label = document.getElementById("dash-dag-label");
  if (label && typeof dagSize === "number") {
    label.textContent = `DAG Block ${dagSize.toLocaleString()}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initHeroThreeDag();
});