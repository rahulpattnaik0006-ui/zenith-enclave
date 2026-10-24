// js/mockData.js - Enterprise State & True Architectural Grid for Zenith Enclave

const generateTownship = () => {
  const properties = [];
  const towers = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  
  const sampleImages = [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"
  ];

  const villaImages = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
  ];

  // 1. Arrange 12 Towers in 2 Wings (West Wing: A-F, East Wing: G-L) behind/around the Mall
  towers.forEach((tower, tIndex) => {
    const isEastWing = tIndex >= 6;
    const wingIndex = tIndex % 6;
    const col = wingIndex % 3;
    const row = Math.floor(wingIndex / 3);

    // West Wing on left (-X), East Wing on right (+X)
    const baseX = isEastWing ? 55 + (col * 24) : -105 + (col * 24);
    const baseZ = -55 + (row * 28);

    for (let flat = 1; flat <= 20; flat++) {
      const rand = Math.random();
      const status = rand > 0.65 ? 'Available' : (rand > 0.15 ? 'Occupied' : 'Pending');

      properties.push({
        id: `TWR-${tower}-${flat}`,
        type: 'Flat',
        tower: `Tower ${tower}`,
        floor: flat,
        title: `Tower ${tower} · Unit ${flat < 10 ? '0' + flat : flat}`,
        rent: 16000 + (flat * 400) + ((tIndex % 3) * 1500),
        status: status,
        image: sampleImages[(tIndex + flat) % sampleImages.length],
        amenities: ['Smart Lock', 'High-Speed Fiber', 'Clubhouse Access', flat > 12 ? 'Skyline View' : 'Garden View'],
        coordinates: { x: baseX, y: (flat * 2.6), z: baseZ },
        roommate: status === 'Occupied' ? {
          name: ['Aarav Sharma', 'Priya Nair', 'Rohan Verma', 'Ananya Das', 'Kabir Mehta', 'Sneha Gupta'][(tIndex + flat) % 6],
          schedule: flat % 2 === 0 ? 'Early Bird' : 'Night Owl',
          work: flat % 3 === 0 ? 'Remote' : 'Office / Hybrid',
          cleanliness: (flat % 3) + 3,
          pets: flat % 4 === 0 ? 'Pet Friendly' : 'No Pets'
        } : null
      });
    }
  });

  // 2. Arrange 20 Mansions in 2 Residential Avenues in the Front (+Z)
  for (let m = 1; m <= 20; m++) {
    const col = (m - 1) % 10;
    const row = Math.floor((m - 1) / 10);
    const rand = Math.random();
    const status = rand > 0.6 ? 'Available' : 'Occupied';

    properties.push({
      id: `VLA-${m < 10 ? '0' + m : m}`,
      type: 'Mansion',
      tower: 'Villa District',
      floor: 1,
      title: `Estate Villa ${m < 10 ? '0' + m : m}`,
      rent: 65000 + ((m % 5) * 5000),
      status: status,
      image: villaImages[m % villaImages.length],
      amenities: ['Private Lawn', 'EV Charger', '2-Car Garage', 'Smart Security Gate'],
      coordinates: { x: -110 + (col * 24), y: 2.5, z: 35 + (row * 26) },
      roommate: status === 'Occupied' ? {
        name: ['Vikramaditya Sen', 'Meera Krishnan', 'Siddharth Roy', 'Neha Kapoor'][m % 4],
        schedule: 'Early Bird',
        work: 'Remote',
        cleanliness: 5,
        pets: 'Pet Friendly'
      } : null
    });
  }

  return properties;
};

const appState = {
  isAdmin: false,
  properties: generateTownship(),
  selectedPropertyId: null,
  tickets: [
    { id: 'TKT-101', unit: 'Tower B · Unit 14', category: 'Plumbing & Water', priority: 'High', desc: 'Low water pressure in kitchen utility line.', status: 'In Progress', time: '2 hours ago' },
    { id: 'TKT-102', unit: 'Estate Villa 04', category: 'Smart Lock / Gate', priority: 'Medium', desc: 'RFID tag reader on main driveway needs recalibration.', status: 'Pending', time: '5 hours ago' },
    { id: 'TKT-103', unit: 'Central Aquatic Club', category: 'Electrical / HVAC', priority: 'Low', desc: 'Routine filtration pump inspection completed.', status: 'Resolved', time: 'Yesterday' }
  ],
  bookings: [
    { id: 'BKG-1', facility: 'Olympic Swimming Pool (Lane 1-2)', slot: '07:00 AM - 08:00 AM', bookedBy: 'Tower A · Unit 08' },
    { id: 'BKG-2', facility: 'Nexus Gaming & VR Arena (Pod B)', slot: '06:00 PM - 08:00 PM', bookedBy: 'TowerF · Unit 19' },
    { id: 'BKG-3', facility: 'Co-Working Conference Room A', slot: '11:00 AM - 01:00 PM', bookedBy: 'Estate Villa 12' }
  ],
  bulletins: [
    { id: 'BLT-1', tag: 'Event', title: 'Grand Sharad Utsav & Cultural Night', author: 'Cultural Committee', location: 'Central Amphitheatre', rsvps: 84, userRsvped: false, desc: 'Join fellow residents for evening music, food stalls, and community get-together.' },
    { id: 'BLT-2', tag: 'Notice', title: 'High-Speed Fiber Upgrade in East Wing', author: 'Township Admin', location: 'Towers G to L', rsvps: 31, userRsvped: false, desc: 'Zero-downtime gigabit router upgrades scheduled this Sunday between 10 AM and 2 PM.' },
    { id: 'BLT-3', tag: 'Marketplace', title: 'Ergonomic Herman Miller Chair (Like New)', author: 'Rohan V. (Tower C-12)', location: 'Tower C Lobby', rsvps: 6, userRsvped: false, desc: 'Moving to a furnished villa. Selling for ₹14,000. Pickup available anytime.' }
  ]
};