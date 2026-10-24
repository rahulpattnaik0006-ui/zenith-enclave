// js/threeScene.js - Realistic Architectural 3D Township Engine + Self-Contained UI Master Patch

let sceneMeshes = {};

window.addEventListener('DOMContentLoaded', () => {
  // Attach Self-Contained Fixes for Modals, Directory, and RSVP immediately
  installMasterUIPatch();

  const container = document.getElementById('canvas-container');
  if (!container) return;

  // 1. Scene, Sky & Camera Setup
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xE2E8F0);
  scene.fog = new THREE.FogExp2(0xE2E8F0, 0.0012);

  const camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 1, 2500);
  camera.position.set(0, 155, 240);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2.12;
  controls.target.set(0, 15, -5);

  // 2. Realistic Sunlight & Hemisphere Lighting
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x94A3B8, 0.65);
  hemiLight.position.set(0, 200, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xFFFBEB, 0.85);
  dirLight.position.set(130, 240, 150);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.camera.near = 10;
  dirLight.shadow.camera.far = 600;
  const d = 180;
  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;
  scene.add(dirLight);

  // 3. Base Township Terrain & Lush Green Lawns
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(600, 500),
    new THREE.MeshStandardMaterial({ color: 0xCBD5E1, roughness: 0.95 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const lawnMat = new THREE.MeshStandardMaterial({ color: 0x86EFAC, roughness: 0.85 });
  const createLawn = (w, d, x, z) => {
    const lawn = new THREE.Mesh(new THREE.BoxGeometry(w, 0.3, d), lawnMat);
    lawn.position.set(x, 0.15, z);
    lawn.receiveShadow = true;
    scene.add(lawn);
  };

  createLawn(85, 65, -81, -41);
  createLawn(85, 65, 79, -41);
  createLawn(105, 58, 5, -38);
  createLawn(245, 22, -2, 35);
  createLawn(245, 22, -2, 61);
  createLawn(260, 24, 0, 95); // South Botanical Garden Belt

  // 4. Asphalt Road Network, Lane Markings & Walkways
  const roadMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
  const stripeMat = new THREE.MeshBasicMaterial({ color: 0xF8FAFC });
  const walkwayMat = new THREE.MeshStandardMaterial({ color: 0x94A3B8, roughness: 0.6 });

  const mainRoad = new THREE.Mesh(new THREE.BoxGeometry(340, 0.35, 16), roadMat);
  mainRoad.position.set(0, 0.18, 12);
  mainRoad.receiveShadow = true;
  scene.add(mainRoad);

  const entryRoad = new THREE.Mesh(new THREE.BoxGeometry(16, 0.36, 45), roadMat);
  entryRoad.position.set(0, 0.18, 95);
  entryRoad.receiveShadow = true;
  scene.add(entryRoad);

  for (let rx = -155; rx <= 155; rx += 14) {
    const dash = new THREE.Mesh(new THREE.PlaneGeometry(7, 0.5), stripeMat);
    dash.rotation.x = -Math.PI / 2;
    dash.position.set(rx, 0.38, 12);
    scene.add(dash);
  }

  [-38, 48].forEach(xPos => {
    const crossRoad = new THREE.Mesh(new THREE.BoxGeometry(12, 0.34, 155), roadMat);
    crossRoad.position.set(xPos, 0.17, -2);
    crossRoad.receiveShadow = true;
    scene.add(crossRoad);
  });

  [23, 48, 74].forEach(zPos => {
    const vRoad = new THREE.Mesh(new THREE.BoxGeometry(255, 0.32, 6), walkwayMat);
    vRoad.position.set(-2, 0.16, zPos);
    vRoad.receiveShadow = true;
    scene.add(vRoad);
  });

  // 4B. Perimeter Boundary Walls & Grand Security Gate
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x64748B, roughness: 0.7 });
  const wallCapMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
  const gateArchMat = new THREE.MeshStandardMaterial({ color: 0x0F766E, roughness: 0.3 });

  const buildBoundarySegment = (w, h, d, x, z) => {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wallMat);
    wall.position.set(x, h / 2, z);
    wall.castShadow = true;
    wall.receiveShadow = true;
    scene.add(wall);

    const cap = new THREE.Mesh(new THREE.BoxGeometry(w + 0.4, 0.5, d + 0.4), wallCapMat);
    cap.position.set(x, h + 0.25, z);
    scene.add(cap);
  };

  buildBoundarySegment(360, 4.5, 2.2, 0, -90);
  buildBoundarySegment(2.2, 4.5, 205, -179, 12.5);
  buildBoundarySegment(2.2, 4.5, 205, 179, 12.5);
  buildBoundarySegment(166, 4.5, 2.2, -96, 115);
  buildBoundarySegment(166, 4.5, 2.2, 96, 115);

  for (let px = -175; px <= 175; px += 25) {
    if (Math.abs(px) > 15) {
      const pSouth = new THREE.Mesh(new THREE.BoxGeometry(3.2, 5.8, 3.2), wallCapMat);
      pSouth.position.set(px, 2.9, 115);
      pSouth.castShadow = true;
      scene.add(pSouth);
    }
    const pNorth = new THREE.Mesh(new THREE.BoxGeometry(3.2, 5.8, 3.2), wallCapMat);
    pNorth.position.set(px, 2.9, -90);
    pNorth.castShadow = true;
    scene.add(pNorth);
  }

  [-12, 12].forEach(gx => {
    const gatePillar = new THREE.Mesh(new THREE.BoxGeometry(4.5, 11, 4.5), wallCapMat);
    gatePillar.position.set(gx, 5.5, 115);
    gatePillar.castShadow = true;
    scene.add(gatePillar);
  });
  const gateCanopy = new THREE.Mesh(new THREE.BoxGeometry(30, 2.2, 6), gateArchMat);
  gateCanopy.position.set(0, 11.5, 115);
  gateCanopy.castShadow = true;
  scene.add(gateCanopy);

  // 4C. Landscaped Gardens, Fountain & Park Benches
  const createGardenPark = (cx, cz) => {
    const plaza = new THREE.Mesh(
      new THREE.CylinderGeometry(9, 9, 0.4, 24),
      new THREE.MeshStandardMaterial({ color: 0xE2E8F0, roughness: 0.7 })
    );
    plaza.position.set(cx, 0.35, cz);
    plaza.receiveShadow = true;
    scene.add(plaza);

    const basin = new THREE.Mesh(
      new THREE.CylinderGeometry(5, 5.5, 1.2, 20),
      new THREE.MeshStandardMaterial({ color: 0x0284C7, roughness: 0.1 })
    );
    basin.position.set(cx, 0.8, cz);
    scene.add(basin);

    const spout = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 1.4, 3.2, 12),
      new THREE.MeshStandardMaterial({ color: 0xF8FAFC })
    );
    spout.position.set(cx, 1.8, cz);
    scene.add(spout);

    const benchMat = new THREE.MeshStandardMaterial({ color: 0x92400E, roughness: 0.8 });
    [[-6.5, 0, Math.PI / 2], [6.5, 0, -Math.PI / 2], [0, -6.5, 0], [0, 6.5, Math.PI]].forEach(([bx, bz, rot]) => {
      const bench = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.8, 1.1), benchMat);
      bench.position.set(cx + bx, 0.7, cz + bz);
      bench.rotation.y = rot;
      bench.castShadow = true;
      scene.add(bench);
    });
  };

  createGardenPark(-65, 95);
  createGardenPark(65, 95);
  createGardenPark(-12, -12);

  // 4D. Streetlights Along Boulevards & Avenues
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, metalness: 0.6, roughness: 0.3 });
  const bulbMat = new THREE.MeshBasicMaterial({ color: 0xFEF08A });

  const createStreetLight = (x, z, armDirX = 0, armDirZ = 1) => {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 8.5, 8), poleMat);
    pole.position.set(x, 4.25, z);
    pole.castShadow = true;
    scene.add(pole);

    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, 2.2), poleMat);
    arm.position.set(x + armDirX * 0.9, 8.4, z + armDirZ * 0.9);
    if (armDirX !== 0) arm.rotation.y = Math.PI / 2;
    scene.add(arm);

    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.4, 0.35, 10), bulbMat);
    lamp.position.set(x + armDirX * 1.7, 8.2, z + armDirZ * 1.7);
    scene.add(lamp);
  };

  for (let lx = -150; lx <= 150; lx += 25) {
    createStreetLight(lx, 3.2, 0, 1);
    createStreetLight(lx, 20.8, 0, -1);
  }
  for (let lz = -70; lz <= 65; lz += 28) {
    createStreetLight(-44.5, lz, 1, 0);
    createStreetLight(54.5, lz, -1, 0);
  }

  // 5. Tower Structural Cores, Lobbies, Pillars & Rooftops
  const coreMat = new THREE.MeshStandardMaterial({ color: 0xE2E8F0, roughness: 0.5 });
  const pillarMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.4 });
  const glassLobbyMat = new THREE.MeshStandardMaterial({ color: 0x38BDF8, roughness: 0.15, transparent: true, opacity: 0.65 });

  for (let tIndex = 0; tIndex < 12; tIndex++) {
    const isEastWing = tIndex >= 6;
    const wingIndex = tIndex % 6;
    const col = wingIndex % 3;
    const row = Math.floor(wingIndex / 3);
    const baseX = isEastWing ? 55 + (col * 24) : -105 + (col * 24);
    const baseZ = -55 + (row * 28);

    const podium = new THREE.Mesh(new THREE.BoxGeometry(14.5, 1.4, 14.5), pillarMat);
    podium.position.set(baseX, 0.7, baseZ);
    podium.castShadow = true;
    podium.receiveShadow = true;
    scene.add(podium);

    const lobby = new THREE.Mesh(new THREE.BoxGeometry(11.5, 2.2, 11.5), glassLobbyMat);
    lobby.position.set(baseX, 1.4, baseZ);
    scene.add(lobby);

    const core = new THREE.Mesh(new THREE.BoxGeometry(9.6, 53, 9.6), coreMat);
    core.position.set(baseX, 27, baseZ);
    core.castShadow = true;
    core.receiveShadow = true;
    scene.add(core);

    [[-5.8, -5.8], [5.8, -5.8], [-5.8, 5.8], [5.8, 5.8]].forEach(([dx, dz]) => {
      const colMesh = new THREE.Mesh(new THREE.BoxGeometry(1.1, 53.5, 1.1), pillarMat);
      colMesh.position.set(baseX + dx, 27.2, baseZ + dz);
      colMesh.castShadow = true;
      scene.add(colMesh);
    });

    const roofCap = new THREE.Mesh(new THREE.BoxGeometry(13.2, 1.2, 13.2), pillarMat);
    roofCap.position.set(baseX, 54.0, baseZ);
    roofCap.castShadow = true;
    scene.add(roofCap);

    const penthouse = new THREE.Mesh(new THREE.BoxGeometry(7, 2.8, 7), coreMat);
    penthouse.position.set(baseX, 56.0, baseZ);
    penthouse.castShadow = true;
    scene.add(penthouse);
  }

  // 6. Central Nexus Mall & Olympic Aquatic Complex
  const mallBody = new THREE.Mesh(
    new THREE.BoxGeometry(44, 12, 34),
    new THREE.MeshStandardMaterial({ color: 0x0F766E, roughness: 0.3 })
  );
  mallBody.position.set(-12, 6, -38);
  mallBody.castShadow = true;
  mallBody.receiveShadow = true;

  const mallData = {
    id: 'MALL',
    title: 'The Central Nexus Mall & VR Gaming Zone',
    type: 'Amenity',
    tower: 'Central Plaza',
    rent: 0,
    status: 'Open 24/7',
    image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=900&q=80',
    gallery: [
      { label: 'Grand Atrium & Retail Plaza', url: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=600&q=80' },
      { label: 'VR Gaming & E-Sports Arena', url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80' },
      { label: 'Executive Co-Working Lounge', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80' }
    ],
    amenities: ['VR Gaming Pod Arena', 'Bowling Alley', '24/7 Co-Working Pods', 'Organic Supermarket', 'Rooftop Dining']
  };
  mallBody.userData = mallData;
  scene.add(mallBody);

  const atrium = new THREE.Mesh(new THREE.BoxGeometry(28, 3.5, 18), glassLobbyMat);
  atrium.position.set(-12, 13.7, -38);
  atrium.userData = mallData;
  scene.add(atrium);

  const deck = new THREE.Mesh(
    new THREE.BoxGeometry(34, 0.8, 38),
    new THREE.MeshStandardMaterial({ color: 0xD6D3D1, roughness: 0.7 })
  );
  deck.position.set(30, 0.4, -38);
  deck.receiveShadow = true;
  scene.add(deck);

  const pool = new THREE.Mesh(
    new THREE.BoxGeometry(24, 1.2, 30),
    new THREE.MeshStandardMaterial({ color: 0x0284C7, roughness: 0.1, metalness: 0.1 })
  );
  pool.position.set(30, 0.7, -38);
  const poolData = {
    id: 'POOL',
    title: 'Olympic Aquatic Club & Thermal Deck',
    type: 'Amenity',
    tower: 'Aquatic Wing',
    rent: 0,
    status: 'Open (6 AM - 10 PM)',
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=900&q=80',
    gallery: [
      { label: '8-Lane Heated Olympic Pool', url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=600&q=80' },
      { label: 'Poolside Cabanas & Sun Deck', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80' },
      { label: 'Indoor Wellness & Spa Suite', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80' }
    ],
    amenities: ['8 Heated Lanes', 'Certified Lifeguards', 'Poolside Juice Bar', 'Steam & Sauna Rooms']
  };
  pool.userData = poolData;
  scene.add(pool);

  // 7. Procedural 3D Trees & Park Landscaping
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350F, roughness: 0.9 });
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x15803D, roughness: 0.6 });
  const createTree = (x, z, scale = 1) => {
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.4 * scale, 0.6 * scale, 3 * scale, 7), trunkMat);
    trunk.position.set(x, 1.5 * scale, z);
    trunk.castShadow = true;
    scene.add(trunk);

    const crown = new THREE.Mesh(new THREE.ConeGeometry(2.6 * scale, 6.5 * scale, 8), leafMat);
    crown.position.set(x, 5.2 * scale, z);
    crown.castShadow = true;
    scene.add(crown);
  };

  for (let tx = -140; tx <= 140; tx += 18) {
    createTree(tx, 2.5, 0.95);
    createTree(tx, 20.5, 0.95);
    if (Math.abs(tx) > 20) createTree(tx, 104, 1.05);
  }
  [-32, -20, 0, 12, 48].forEach(tx => createTree(tx, -16, 1.1));
  [-58, -45, -30].forEach(tz => {
    createTree(-44, tz, 1.0);
    createTree(54, tz, 1.0);
  });

  // 8. Render All 240 Flats + 20 Luxury Mansions
  const interactiveObjects = [mallBody, atrium, pool];
  const flatGeo = new THREE.BoxGeometry(12.2, 2.1, 12.2);
  const villaGeo = new THREE.BoxGeometry(13.5, 5.2, 13.5);
  const villaRoofGeo = new THREE.ConeGeometry(11.2, 3.2, 4);
  const villaRoofMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });

  if (!window.appState) window.appState = {};
  if (!appState.properties || appState.properties.length === 0) {
    if (typeof INITIAL_PROPERTIES !== 'undefined') {
      appState.properties = JSON.parse(JSON.stringify(INITIAL_PROPERTIES));
    }
  }

  (appState.properties || []).forEach(prop => {
    const mat = new THREE.MeshStandardMaterial({
      color: getStatusHex(prop.status),
      roughness: 0.32,
      transparent: true,
      opacity: 1
    });

    const isVilla = prop.type === 'Mansion' || prop.type === 'Villa';
    const mesh = new THREE.Mesh(isVilla ? villaGeo : flatGeo, mat);
    mesh.position.set(prop.coordinates.x, prop.coordinates.y, prop.coordinates.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = prop;

    scene.add(mesh);
    interactiveObjects.push(mesh);
    sceneMeshes[prop.id] = mesh;

    if (isVilla) {
      const roof = new THREE.Mesh(villaRoofGeo, villaRoofMat);
      roof.position.set(prop.coordinates.x, prop.coordinates.y + 4.2, prop.coordinates.z);
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      scene.add(roof);
      createTree(prop.coordinates.x - 8, prop.coordinates.z + 5, 0.75);
    }
  });

  // 9. Raycasting for Hover Tooltips & Click Modals
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const tooltip = document.getElementById('unit-tooltip');
  let pointerDownPos = { x: 0, y: 0 };

  renderer.domElement.addEventListener('pointerdown', (e) => {
    pointerDownPos = { x: e.clientX, y: e.clientY };
  });

  renderer.domElement.addEventListener('pointerup', (e) => {
    const moveDist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
    if (moveDist > 5) return;

    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(interactiveObjects);
    if (hits.length > 0) {
      const data = hits[0].object.userData;
      if (data.id === 'MALL' || data.id === 'POOL') {
        openNexusShowcaseModal(data);
      } else if (data.id) {
        window.openPropertyModal(data.id);
      }
    }
  });

  renderer.domElement.addEventListener('mousemove', (e) => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(interactiveObjects);

    if (hits.length > 0) {
      const rawData = hits[0].object.userData;
      const liveData = (rawData.id && rawData.id !== 'MALL' && rawData.id !== 'POOL')
        ? (appState.properties.find(p => p.id === rawData.id) || rawData)
        : rawData;

      renderer.domElement.style.cursor = 'pointer';
      if (tooltip) {
        const tType = document.getElementById('tt-type');
        const tTitle = document.getElementById('tt-title');
        const tPrice = document.getElementById('tt-price');
        const tStatus = document.getElementById('tt-status');
        if (tType) tType.textContent = liveData.type === 'Amenity' ? 'Central Nexus Facility' : `${liveData.type === 'Mansion' ? 'Villa' : liveData.type} · ${liveData.tower}`;
        if (tTitle) tTitle.textContent = liveData.title || liveData.name || liveData.id;
        if (tPrice) tPrice.textContent = liveData.rent ? `₹${Number(liveData.rent).toLocaleString('en-IN')}/mo` : 'Click to Inspect Unit';
        if (tStatus) tStatus.textContent = `Status: ${liveData.status}`;
        tooltip.classList.remove('hidden');
      }
    } else {
      renderer.domElement.style.cursor = 'grab';
      if (tooltip) tooltip.classList.add('hidden');
    }
  });

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  window.reset3DCamera = () => {
    camera.position.set(0, 155, 240);
    controls.target.set(0, 15, -5);
  };

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
});

// Self-Contained Photo Gallery Modal for Central Nexus Mall & Pool
function openNexusShowcaseModal(data) {
  let modal = document.getElementById('nexus-gallery-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'nexus-gallery-modal';
    modal.className = 'fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 hidden';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden">
      <div class="relative h-52">
        <img src="${data.image}" class="w-full h-full object-cover" alt="${data.title}">
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-5">
          <div class="text-white">
            <span class="text-[10px] font-bold uppercase tracking-wider bg-teal-600 px-2.5 py-1 rounded">Township Central Nexus</span>
            <h3 class="text-xl font-bold mt-1">${data.title}</h3>
          </div>
        </div>
        <button onclick="document.getElementById('nexus-gallery-modal').classList.add('hidden')" class="absolute top-3 right-3 bg-white/90 text-slate-800 w-8 h-8 rounded-full font-bold text-sm shadow">✕</button>
      </div>
      <div class="p-5 space-y-4">
        <div>
          <p class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Live Facility Gallery</p>
          <div class="grid grid-cols-3 gap-3">
            ${data.gallery.map(g => `
              <div class="rounded-lg overflow-hidden border border-slate-200">
                <img src="${g.url}" class="w-full h-24 object-cover" alt="${g.label}">
                <p class="text-[11px] font-semibold text-slate-700 p-1.5 bg-slate-50 truncate">${g.label}</p>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="flex flex-wrap gap-1.5">
          ${data.amenities.map(a => `<span class="text-xs bg-teal-50 text-teal-800 px-2.5 py-1 rounded-md font-semibold">${a}</span>`).join('')}
        </div>
        <div class="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button onclick="document.getElementById('nexus-gallery-modal').classList.add('hidden')" class="px-4 py-2 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600">Close</button>
          <button onclick="document.getElementById('nexus-gallery-modal').classList.add('hidden'); if(typeof switchTab==='function') switchTab('portal');" class="px-4 py-2 text-xs font-semibold bg-teal-700 text-white rounded-lg hover:bg-teal-900">Book Facility Slot →</button>
        </div>
      </div>
    </div>
  `;
  modal.classList.remove('hidden');
}

function getStatusHex(status) {
  if (status === 'Available') return 0x059669; // Emerald-600
  if (status === 'Pending') return 0xD97706;   // Amber-600
  return 0x94A3B8;                             // Slate-400
}

window.sync3DSceneWithState = (filterType = 'All', filterStatus = 'All') => {
  if (!window.appState || !appState.properties) return;
  appState.properties.forEach(prop => {
    const mesh = sceneMeshes[prop.id];
    if (!mesh) return;
    mesh.userData = prop;
    mesh.material.color.setHex(getStatusHex(prop.status));

    const isVilla = prop.type === 'Mansion' || prop.type === 'Villa';
    const matchType = filterType === 'All'
      || prop.type === filterType
      || (filterType === 'Villa' && isVilla)
      || (filterType === 'Mansion' && isVilla);
    const matchStatus = filterStatus === 'All' || prop.status === filterStatus;
    mesh.material.opacity = (matchType && matchStatus) ? 1.0 : 0.15;
  });
};

// ============================================================================
// MASTER UI PATCH: RESOLVES PROBLEM 1 (MODAL), PROBLEM 2 (EXPLORER), PROBLEM 3 (RSVP)
// ============================================================================
function installMasterUIPatch() {
  // --- PROBLEM 1: SELF-CONTAINED PROPERTY DETAILS MODAL ---
  window.openPropertyModal = function(propId) {
    if (!window.appState || !appState.properties) return;
    const prop = appState.properties.find(p => p.id === propId);
    if (!prop) return;
    window.selectedPropertyId = propId;

    let modal = document.getElementById('property-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'property-modal';
      modal.className = 'fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 hidden';
      document.body.appendChild(modal);
    }

    const isVilla = prop.type === 'Mansion' || prop.type === 'Villa';
    const fallbackImg = isVilla
      ? 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80'
      : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80';
    const statusClass = prop.status === 'Available'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : prop.status === 'Pending'
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : 'bg-slate-100 text-slate-700 border-slate-300';
    const amens = prop.amenities || ['Covered Parking', 'Smart Doorbell', 'High-Speed Fiber', '24/7 Power Backup'];

    modal.innerHTML = `
      <div class="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
        <div class="relative h-56 bg-slate-100">
          <img src="${prop.image || fallbackImg}" class="w-full h-full object-cover" alt="${prop.title || prop.id}">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent flex items-end p-5">
            <div class="text-white">
              <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded ${isVilla ? 'bg-amber-600' : 'bg-teal-700'}">
                ${isVilla ? 'Signature Luxury Villa' : 'High-Rise Tower Flat'}
              </span>
              <h3 class="text-xl font-bold mt-1.5">${prop.title || prop.name || `Unit ${prop.id}`}</h3>
              <p class="text-xs text-slate-300">${prop.tower || 'Zenith Wing'} · Floor ${prop.floor || 1} · ID: ${prop.id}</p>
            </div>
          </div>
          <button onclick="closePropertyModal()" class="absolute top-3 right-3 bg-white/90 hover:bg-white text-slate-800 w-8 h-8 rounded-full font-bold text-sm shadow flex items-center justify-center">✕</button>
        </div>

        <div class="p-5 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <p class="text-[11px] font-semibold text-slate-400 uppercase">Monthly Lease / Maintenance</p>
              <p class="text-xl font-extrabold text-slate-900">₹${Number(prop.rent || 45000).toLocaleString('en-IN')}<span class="text-xs font-normal text-slate-500">/mo</span></p>
            </div>
            <span class="text-xs px-3 py-1 rounded-full font-bold border ${statusClass}">${prop.status}</span>
          </div>

          <div class="grid grid-cols-3 gap-2 text-center bg-slate-50 rounded-xl p-3 border border-slate-100">
            <div>
              <p class="text-[10px] text-slate-400 uppercase font-semibold">Configuration</p>
              <p class="text-xs font-bold text-slate-800 mt-0.5">${prop.bhk || (isVilla ? '5 BHK' : '3 BHK')}</p>
            </div>
            <div>
              <p class="text-[10px] text-slate-400 uppercase font-semibold">Carpet Area</p>
              <p class="text-xs font-bold text-slate-800 mt-0.5">${prop.sqft || prop.area || (isVilla ? 4200 : 1850)} sq.ft.</p>
            </div>
            <div>
              <p class="text-[10px] text-slate-400 uppercase font-semibold">Occupant</p>
              <p class="text-xs font-bold text-slate-800 mt-0.5 truncate">${prop.residentName || (prop.status === 'Occupied' ? 'Registered Resident' : 'Vacant')}</p>
            </div>
          </div>

          <div>
            <p class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Unit Highlights & Amenities</p>
            <div class="flex flex-wrap gap-1.5">
              ${amens.map(a => `<span class="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded font-medium border border-slate-200">${a}</span>`).join('')}
            </div>
          </div>

          <div class="pt-2 flex gap-2">
            <button onclick="closePropertyModal()" class="flex-1 py-2.5 text-xs font-semibold border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50">Close</button>
            <button onclick="closePropertyModal(); if(typeof switchTab==='function') switchTab('portal');" class="flex-1 py-2.5 text-xs font-semibold bg-teal-700 hover:bg-teal-900 text-white rounded-lg shadow-sm">
              ${prop.status === 'Available' ? 'Book / Reserve Unit →' : 'Resident Portal →'}
            </button>
          </div>
        </div>
      </div>
    `;
    modal.classList.remove('hidden');
  };

  window.closePropertyModal = function() {
    const modal = document.getElementById('property-modal');
    if (modal) modal.classList.add('hidden');
  };

  // --- PROBLEM 2: PROPERTY EXPLORER DIRECTORY FIX ---
  window.renderDirectory = function() {
    const container = document.getElementById('directory-grid')
      || document.getElementById('property-grid')
      || document.getElementById('prop-directory-list')
      || document.getElementById('directory-list')
      || document.getElementById('properties-grid');
    if (!container) return;

    if (!window.appState) window.appState = {};
    if (!appState.properties || appState.properties.length === 0) {
      if (typeof INITIAL_PROPERTIES !== 'undefined' && INITIAL_PROPERTIES.length > 0) {
        appState.properties = JSON.parse(JSON.stringify(INITIAL_PROPERTIES));
      }
    }

    const typeEl = document.getElementById('dir-type') || document.getElementById('filter-type') || document.getElementById('dir-filter-type');
    const statusEl = document.getElementById('dir-status') || document.getElementById('filter-status') || document.getElementById('dir-filter-status');
    const towerEl = document.getElementById('dir-tower') || document.getElementById('filter-tower');
    const searchEl = document.getElementById('dir-search') || document.getElementById('search-property') || document.getElementById('property-search');

    const fType = typeEl ? typeEl.value : 'All';
    const fStatus = statusEl ? statusEl.value : 'All';
    const fTower = towerEl ? towerEl.value : 'All';
    const query = searchEl ? searchEl.value.toLowerCase().trim() : '';

    const filtered = (appState.properties || []).filter(p => {
      const isVilla = p.type === 'Mansion' || p.type === 'Villa';
      const matchType = fType === 'All' || !fType
        || p.type === fType
        || (fType === 'Villa' && isVilla)
        || (fType === 'Mansion' && isVilla);
      const matchStatus = fStatus === 'All' || !fStatus || p.status === fStatus;
      const matchTower = fTower === 'All' || !fTower || p.tower === fTower;
      const matchQuery = !query
        || (p.id && p.id.toLowerCase().includes(query))
        || (p.title && p.title.toLowerCase().includes(query))
        || (p.tower && p.tower.toLowerCase().includes(query))
        || (p.residentName && p.residentName.toLowerCase().includes(query));

      return matchType && matchStatus && matchTower && matchQuery;
    });

    const countEl = document.getElementById('dir-count') || document.getElementById('directory-count');
    if (countEl) countEl.textContent = `${filtered.length} Units`;

    if (filtered.length === 0) {
      container.innerHTML = `<div class="col-span-full py-10 text-center text-xs text-slate-500">No properties match the current filters.</div>`;
      return;
    }

    container.innerHTML = filtered.map(p => {
      const isVilla = p.type === 'Mansion' || p.type === 'Villa';
      const badgeColor = p.status === 'Available'
        ? 'bg-emerald-100 text-emerald-800'
        : p.status === 'Pending'
        ? 'bg-amber-100 text-amber-800'
        : 'bg-slate-200 text-slate-700';

      return `
        <div onclick="openPropertyModal('${p.id}')" class="bg-white border border-slate-200 rounded-xl p-4 hover:border-teal-600 hover:shadow-md transition cursor-pointer flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded ${isVilla ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}">
                ${isVilla ? 'Villa' : 'Flat'} · ${p.id}
              </span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor}">${p.status}</span>
            </div>
            <h4 class="text-xs font-bold text-slate-900 truncate">${p.title || p.name || `Unit ${p.id}`}</h4>
            <p class="text-[11px] text-slate-500 mt-0.5">${p.tower} · Floor ${p.floor || 1}</p>
            <p class="text-[11px] text-slate-400 mt-1">${p.bhk || (isVilla ? '5 BHK' : '3 BHK')} · ${p.sqft || p.area || (isVilla ? 4200 : 1850)} sq.ft.</p>
          </div>
          <div class="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
            <span class="text-xs font-extrabold text-slate-900">₹${Number(p.rent || 45000).toLocaleString('en-IN')}/mo</span>
            <span class="text-[11px] font-semibold text-teal-700 hover:underline">Inspect →</span>
          </div>
        </div>
      `;
    }).join('');
  };

  // Auto-bind filter inputs if present
  ['dir-type', 'filter-type', 'dir-status', 'filter-status', 'dir-tower', 'filter-tower', 'dir-search', 'search-property'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', () => window.renderDirectory());
      el.addEventListener('input', () => window.renderDirectory());
    }
  });

  // --- PROBLEM 3: ACCURATE SINGLE-TOGGLE RSVP COUNTING ---
  const rsvpHandler = function(bulletinId) {
    if (!window.appState || !appState.bulletins) return;
    const b = appState.bulletins.find(item => String(item.id) === String(bulletinId));
    if (!b) return;

    let userKey = 'guest_resident';
    try {
      const saved = localStorage.getItem(typeof STORAGE_KEY_USER !== 'undefined' ? STORAGE_KEY_USER : 'zenith_active_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        userKey = parsed.phone || parsed.propertyId || parsed.name || 'guest_resident';
      }
    } catch (e) {}

    if (!Array.isArray(b.attendees)) {
      b.attendees = [];
      // Preserve base count cleanly if transitioning from numeric rsvp
      const initialCount = typeof b.rsvps === 'number' ? b.rsvps : (typeof b.rsvpCount === 'number' ? b.rsvpCount : 0);
      for (let i = 0; i < initialCount; i++) {
        b.attendees.push(`seed_resident_${i}`);
      }
    }

    const idx = b.attendees.indexOf(userKey);
    if (idx > -1) {
      b.attendees.splice(idx, 1);
    } else {
      b.attendees.push(userKey);
    }

    b.rsvps = b.attendees.length;
    b.rsvpCount = b.attendees.length;

    if (typeof saveStateToStorage === 'function') saveStateToStorage();
    window.renderBulletins();
  };

  window.handleRSVP = rsvpHandler;
  window.toggleRSVP = rsvpHandler;
  window.rsvpBulletin = rsvpHandler;
  window.rsvpEvent = rsvpHandler;

  window.renderBulletins = function() {
    const container = document.getElementById('bulletins-list')
      || document.getElementById('bulletin-board')
      || document.getElementById('events-container')
      || document.getElementById('bulletins-container');
    if (!container || !window.appState || !appState.bulletins) return;

    let userKey = 'guest_resident';
    try {
      const saved = localStorage.getItem(typeof STORAGE_KEY_USER !== 'undefined' ? STORAGE_KEY_USER : 'zenith_active_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        userKey = parsed.phone || parsed.propertyId || parsed.name || 'guest_resident';
      }
    } catch (e) {}

    container.innerHTML = appState.bulletins.map(b => {
      const attendees = Array.isArray(b.attendees) ? b.attendees : [];
      const count = Array.isArray(b.attendees)
        ? b.attendees.length
        : (typeof b.rsvps === 'number' ? b.rsvps : (b.rsvpCount || 0));
      const isAttending = attendees.includes(userKey);

      return `
        <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:shadow-sm transition flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between gap-2">
              <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-teal-800">
                ${b.category || b.tag || 'Notice'}
              </span>
              <span class="text-[11px] font-semibold text-slate-400">${b.date || 'Active'}</span>
            </div>
            <h4 class="text-sm font-bold text-slate-900 mt-2">${b.title}</h4>
            <p class="text-xs text-slate-600 mt-1">${b.description || b.content || b.body || ''}</p>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-600">👥 ${count} Resident${count === 1 ? '' : 's'} Attending</span>
            <button onclick="handleRSVP('${b.id}')" class="px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              isAttending
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }">
              ${isAttending ? '✓ Attending' : 'RSVP Now'}
            </button>
          </div>
        </div>
      `;
    }).join('');
  };

  // Run initial render & re-sync once Supabase finishes fetching
  setTimeout(() => {
    window.renderDirectory();
    window.renderBulletins();
    window.sync3DSceneWithState();
  }, 150);

  setTimeout(() => {
    window.renderDirectory();
    window.renderBulletins();
    window.sync3DSceneWithState();
  }, 1200);
}