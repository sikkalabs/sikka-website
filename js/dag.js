// Three.js Linear DAG Animation
function initHeroThreeDag() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas || typeof THREE === "undefined") return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // optimize performance

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x080808, 0.0015);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 4000);
  camera.position.set(0, 0, 100);

  // Generate Linear DAG
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
    // Animate camera moving forward through the DAG
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

    // Slight rotation for dynamic feel
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

    renderer.render(scene, camera);
  }
  animate();
}

document.addEventListener("DOMContentLoaded", () => {
  initHeroThreeDag();
});