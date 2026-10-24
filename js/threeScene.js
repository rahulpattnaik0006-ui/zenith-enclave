// js/threeScene.js - Realistic Architectural 3D Township Engine for Zenith Enclave

let sceneMeshes = {};

window.addEventListener('DOMContentLoaded', () => {
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

  // West Wing Park, East Wing Park, Central Plaza Lawn, Villa Green Belts
  createLawn(85, 65, -81, -41);
  createLawn(85, 65, 79, -41);
  createLawn(105, 58, 5, -38);
  createLawn(245, 22, -2, 35);
  createLawn(245, 22, -2, 61);

  // 4. Asphalt Road Network, Lane Markings & Walkways
  const roadMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
  const stripeMat = new THREE.MeshBasicMaterial({ color: 0xF8FAFC });
  const walkwayMat = new THREE.MeshStandardMaterial({ color: 0x94A3B8, roughness: 0.6 });

  // Main East-West Boulevard
  const mainRoad = new THREE.Mesh(new THREE.BoxGeometry(340, 0.35, 16), roadMat);
  mainRoad.position.set(0, 0.18, 12);
  mainRoad.receiveShadow = true;
  scene.add(mainRoad);

  // Dashed Center Road Markings
  for (let rx = -155; rx <= 155; rx += 14) {
    const dash = new THREE.Mesh(new THREE.PlaneGeometry(7, 0.5), stripeMat);
    dash.rotation.x = -Math.PI / 2;
    dash.position.set(rx, 0.38, 12);
    scene.add(dash);
  }

  // Cross Avenues (West, Center Plaza, East)
  [-38, 48].forEach(xPos => {
    const crossRoad = new THREE.Mesh(new THREE.BoxGeometry(12, 0.34, 150), roadMat);
    crossRoad.position.set(xPos, 0.17, -5);
    crossRoad.receiveShadow = true;
    scene.add(crossRoad);
  });

  // Villa Front & Back Service Roads
  [23, 48, 74].forEach(zPos => {
    const vRoad = new THREE.Mesh(new THREE.BoxGeometry(255, 0.32, 6), walkwayMat);
    vRoad.position.set(-2, 0.16, zPos);
    vRoad.receiveShadow = true;
    scene.add(vRoad);
  });

  // 5. Realistic Tower Structural Cores, Lobbies, Pillars & Rooftops
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

    // Concrete Podium Base
    const podium = new THREE.Mesh(new THREE.BoxGeometry(14.5, 1.4, 14.5), pillarMat);
    podium.position.set(baseX, 0.7, baseZ);
    podium.castShadow = true;
    podium.receiveShadow = true;
    scene.add(podium);

    // Ground Floor Glass Lobby
    const lobby = new THREE.Mesh(new THREE.BoxGeometry(11.5, 2.2, 11.5), glassLobbyMat);
    lobby.position.set(baseX, 1.4, baseZ);
    scene.add(lobby);

    // Inner Elevator & Structural Spine (Eliminates floating skeleton gap!)
    const core = new THREE.Mesh(new THREE.BoxGeometry(9.6, 53, 9.6), coreMat);
    core.position.set(baseX, 27, baseZ);
    core.castShadow = true;
    core.receiveShadow = true;
    scene.add(core);

    // 4 Corner Architectural Support Columns
    [[-5.8, -5.8], [5.8, -5.8], [-5.8, 5.8], [5.8, 5.8]].forEach(([dx, dz]) => {
      const colMesh = new THREE.Mesh(new THREE.BoxGeometry(1.1, 53.5, 1.1), pillarMat);
      colMesh.position.set(baseX + dx, 27.2, baseZ + dz);
      colMesh.castShadow = true;
      scene.add(colMesh);
    });

    // Rooftop Crown & Mechanical Penthouse
    const roofCap = new THREE.Mesh(new THREE.BoxGeometry(13.2, 1.2, 13.2), pillarMat);
    roofCap.position.set(baseX, 54.0, baseZ);
    roofCap.castShadow = true;
    scene.add(roofCap);

    const penthouse = new THREE.Mesh(new THREE.BoxGeometry(7, 2.8, 7), coreMat);
    penthouse.position.set(baseX, 56.0, baseZ);
    penthouse.castShadow = true;
    scene.add(penthouse);
  }

  // 6. Central Nexus Mall, Glass Skylight Atrium & Olympic Aquatic Complex
  const mallGroup = new THREE.Group();
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

  // Mall Glass Atrium Dome
  const atrium = new THREE.Mesh(new THREE.BoxGeometry(28, 3.5, 18), glassLobbyMat);
  atrium.position.set(-12, 13.7, -38);
  atrium.userData = mallData;
  scene.add(atrium);

  // Pool Deck & Glowing Olympic Water
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

  // 7. Procedural 3D Trees & Landscaping
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

  // Boulevard Trees along Main Road & Parks
  for (let tx = -125; tx <= 125; tx += 18) {
    createTree(tx, 2.5, 0.95);
    createTree(tx, 20.5, 0.95);
  }
  // Trees around Central Mall & Pool
  [-32, -20, 0, 12, 48].forEach(tx => createTree(tx, -16, 1.1));
  [-58, -45, -30].forEach(tz => {
    createTree(-44, tz, 1.0);
    createTree(54, tz, 1.0);
  });

  // 8. Render All 240 Flats + 20 Luxury Mansions (Preserving Exact Status Colors!)
  const interactiveObjects = [mallBody, atrium, pool];
  const flatGeo = new THREE.BoxGeometry(12.2, 2.1, 12.2);
  const villaGeo = new THREE.BoxGeometry(13.5, 5.2, 13.5);
  const villaRoofGeo = new THREE.ConeGeometry(11.2, 3.2, 4);
  const villaRoofMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });

  appState.properties.forEach(prop => {
    const mat = new THREE.MeshStandardMaterial({
      color: getStatusHex(prop.status),
      roughness: 0.32,
      transparent: true,
      opacity: 1
    });

    const mesh = new THREE.Mesh(prop.type === 'Flat' ? flatGeo : villaGeo, mat);
    mesh.position.set(prop.coordinates.x, prop.coordinates.y, prop.coordinates.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = prop;

    scene.add(mesh);
    interactiveObjects.push(mesh);
    sceneMeshes[prop.id] = mesh;

    // Add Pitched Architectural Roofs & Private Lawns to Mansions
    if (prop.type === 'Mansion') {
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
        openPropertyModal(data.id);
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
      const data = hits[0].object.userData;
      renderer.domElement.style.cursor = 'pointer';
      document.getElementById('tt-type').textContent = data.type === 'Amenity' ? 'Central Nexus Facility' : `${data.type} · ${data.tower}`;
      document.getElementById('tt-title').textContent = data.title;
      document.getElementById('tt-price').textContent = data.rent ? `₹${data.rent.toLocaleString('en-IN')}/mo` : 'Click to View Real Photos & Book';
      document.getElementById('tt-status').textContent = `Status: ${data.status}`;
      tooltip.classList.remove('hidden');
    } else {
      renderer.domElement.style.cursor = 'grab';
      tooltip.classList.add('hidden');
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

// Self-Contained Photo Gallery Modal for Central Nexus Mall & Pool (Requires ZERO changes to index.html)
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
          <button onclick="document.getElementById('nexus-gallery-modal').classList.add('hidden'); switchTab('portal');" class="px-4 py-2 text-xs font-semibold bg-teal-700 text-white rounded-lg hover:bg-teal-900">Book Facility Slot →</button>
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
  appState.properties.forEach(prop => {
    const mesh = sceneMeshes[prop.id];
    if (!mesh) return;
    mesh.material.color.setHex(getStatusHex(prop.status));

    const matchType = filterType === 'All' || prop.type === filterType;
    const matchStatus = filterStatus === 'All' || prop.status === filterStatus;
    mesh.material.opacity = (matchType && matchStatus) ? 1.0 : 0.15;
  });
};