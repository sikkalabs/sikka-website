// Three.js animations for the Live Network section

// Utility to create a basic Three.js setup
function createMiniScene(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return null;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const resize = () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };
  window.addEventListener('resize', resize);

  return { scene, camera, renderer, resize };
}

function initDagSize3D() {
  const setup = createMiniScene('canvas-dag-size');
  if (!setup) return;
  const { scene, camera, renderer } = setup;

  // Icosahedron to represent the DAG
  const geometry = new THREE.IcosahedronGeometry(2, 1);
  const material = new THREE.MeshBasicMaterial({ 
    color: 0x3b82f6, 
    wireframe: true, 
    transparent: true, 
    opacity: 0.4 
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Add glowing points
  const pointsMat = new THREE.PointsMaterial({
    color: 0x60a5fa,
    size: 0.1,
    transparent: true,
    opacity: 0.8
  });
  const points = new THREE.Points(geometry, pointsMat);
  scene.add(points);

  mesh.position.x = 1.5; // shift right
  points.position.x = 1.5;

  function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.y += 0.005;
    mesh.rotation.x += 0.002;
    points.rotation.y += 0.005;
    points.rotation.x += 0.002;
    renderer.render(scene, camera);
  }
  animate();
}

function initTips3D() {
  const setup = createMiniScene('canvas-tips');
  if (!setup) return;
  const { scene, camera, renderer } = setup;

  // Floating particles
  const geometry = new THREE.BufferGeometry();
  const particlesCount = 50;
  const posArray = new Float32Array(particlesCount * 3);
  
  for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 6;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

  const material = new THREE.PointsMaterial({
    size: 0.08,
    color: 0xa855f7,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });

  const particlesMesh = new THREE.Points(geometry, material);
  particlesMesh.position.x = 1.5;
  scene.add(particlesMesh);

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();
    particlesMesh.rotation.y = elapsedTime * 0.1;
    particlesMesh.position.y = Math.sin(elapsedTime * 0.5) * 0.2;
    
    // Animate individual particles slightly
    const positions = particlesMesh.geometry.attributes.position.array;
    for(let i = 1; i < particlesCount * 3; i+=3) {
      positions[i] += 0.01;
      if (positions[i] > 3) positions[i] = -3;
    }
    particlesMesh.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }
  animate();
}

function initHealth3D() {
  const setup = createMiniScene('canvas-health');
  if (!setup) return;
  const { scene, camera, renderer } = setup;

  // Pulsating Torus
  const geometry = new THREE.TorusGeometry(1.5, 0.4, 16, 100);
  const material = new THREE.MeshBasicMaterial({ 
    color: 0x22d3ee, 
    wireframe: true,
    transparent: true,
    opacity: 0.5
  });
  const torus = new THREE.Mesh(geometry, material);
  torus.position.x = 1.5;
  scene.add(torus);

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();
    
    torus.rotation.x = Math.PI / 2 + Math.sin(elapsedTime * 0.5) * 0.2;
    torus.rotation.z += 0.01;
    
    // Pulse effect
    const scale = 1 + Math.sin(elapsedTime * 2) * 0.05;
    torus.scale.set(scale, scale, scale);
    material.opacity = 0.3 + Math.sin(elapsedTime * 2) * 0.2;

    renderer.render(scene, camera);
  }
  animate();
}

function initTopology3D() {
  const container = document.getElementById('canvas-topology');
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 25;
  camera.position.y = 10;
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Create a global node network on a sphere
  const globeGeometry = new THREE.IcosahedronGeometry(8, 2);
  const globeMaterial = new THREE.MeshBasicMaterial({
    color: 0x3b82f6,
    wireframe: true,
    transparent: true,
    opacity: 0.15
  });
  const globe = new THREE.Mesh(globeGeometry, globeMaterial);
  scene.add(globe);

  // Nodes
  const pointsMat = new THREE.PointsMaterial({
    color: 0x22d3ee,
    size: 0.25,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  });
  const points = new THREE.Points(globeGeometry, pointsMat);
  scene.add(points);

  // Transaction beams
  const beamGroup = new THREE.Group();
  scene.add(beamGroup);

  const vertices = globeGeometry.attributes.position;
  const numVertices = vertices.count;
  const beams = [];

  // Generate some random beams between nodes
  function spawnBeam() {
    if (beams.length > 20) return;
    
    const idx1 = Math.floor(Math.random() * numVertices);
    const idx2 = Math.floor(Math.random() * numVertices);
    
    if (idx1 === idx2) return;

    const p1 = new THREE.Vector3().fromBufferAttribute(vertices, idx1);
    const p2 = new THREE.Vector3().fromBufferAttribute(vertices, idx2);

    // Create a curved line (quadratic bezier)
    const mid = p1.clone().lerp(p2, 0.5).normalize().multiplyScalar(10);
    const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
    
    const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.05, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({ 
      color: 0xa855f7, 
      transparent: true, 
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    const beam = new THREE.Mesh(tubeGeo, tubeMat);
    beamGroup.add(beam);
    
    beams.push({
      mesh: beam,
      life: 1.0,
      decay: 0.01 + Math.random() * 0.02
    });
  }

  const resize = () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };
  window.addEventListener('resize', resize);

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const dt = clock.getDelta();

    globe.rotation.y += 0.002;
    points.rotation.y += 0.002;
    beamGroup.rotation.y += 0.002;

    if (Math.random() > 0.9) spawnBeam();

    for (let i = beams.length - 1; i >= 0; i--) {
      const b = beams[i];
      b.life -= b.decay;
      b.mesh.material.opacity = b.life;
      
      if (b.life <= 0) {
        beamGroup.remove(b.mesh);
        b.mesh.geometry.dispose();
        b.mesh.material.dispose();
        beams.splice(i, 1);
      }
    }

    renderer.render(scene, camera);
  }
  animate();
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof THREE !== "undefined") {
    initDagSize3D();
    initTips3D();
    initHealth3D();
    initTopology3D();
  }
});
