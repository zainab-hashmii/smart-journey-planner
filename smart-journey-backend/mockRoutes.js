// Mock route data generator for demo/fallback mode
// Creates realistic route data between Larkana and Karachi

export function generateMockRoutes(origin, destination, fuelPrice, mileage) {
  // Approximate coordinates for Larkana → Karachi route
  const larkana = { lat: 27.5590, lng: 68.2120 };
  const karachi = { lat: 24.8607, lng: 67.0011 };
  
  // Generate polyline points (simplified path)
  const generatePolyline = (start, end, waypoints = []) => {
    const points = [start];
    if (waypoints.length > 0) {
      points.push(...waypoints);
    }
    points.push(end);
    return points;
  };

  // Helper to create smooth curved paths (more realistic road-like routes)
  const createCurvedPath = (start, end, waypoints, curvePoints = 3) => {
    const points = [start];
    
    // Add intermediate curve points between waypoints for smoother roads
    for (let i = 0; i < waypoints.length; i++) {
      const prev = i === 0 ? start : waypoints[i - 1];
      const current = waypoints[i];
      
      // Add curve points between previous and current waypoint
      for (let j = 1; j <= curvePoints; j++) {
        const t = j / (curvePoints + 1);
        const lat = prev.lat + (current.lat - prev.lat) * t + Math.sin(t * Math.PI) * 0.1;
        const lng = prev.lng + (current.lng - prev.lng) * t + Math.cos(t * Math.PI) * 0.05;
        points.push({ lat, lng });
      }
      points.push(current);
    }
    
    // Add curve points before final destination
    const lastWaypoint = waypoints.length > 0 ? waypoints[waypoints.length - 1] : start;
    for (let j = 1; j <= curvePoints; j++) {
      const t = j / (curvePoints + 1);
      const lat = lastWaypoint.lat + (end.lat - lastWaypoint.lat) * t + Math.sin(t * Math.PI) * 0.08;
      const lng = lastWaypoint.lng + (end.lng - lastWaypoint.lng) * t + Math.cos(t * Math.PI) * 0.04;
      points.push({ lat, lng });
    }
    
    points.push(end);
    return points;
  };

  // Route 1: Direct route via N-55 highway (fastest, shorter distance) - more waypoints for realistic road
  const route1Points = createCurvedPath(
    larkana,
    karachi,
    [
      { lat: 27.2, lng: 68.15 }, // Near Larkana
      { lat: 26.8, lng: 68.05 }, // Intermediate point
      { lat: 26.3, lng: 67.95 }, // Near Dadu
      { lat: 25.9, lng: 67.7 },  // Intermediate
      { lat: 25.5, lng: 67.4 }, // Near Thatta
      { lat: 25.1, lng: 67.2 },  // Approaching Karachi
    ],
    2
  );
  const route1Distance = 450; // km
  const route1Duration = 360; // minutes (6 hours)
  const route1FuelCost = (route1Distance / mileage) * fuelPrice;

  // Route 2: Via Hyderabad and N-5 highway (longer but less traffic) - realistic highway path
  const route2Points = createCurvedPath(
    larkana,
    karachi,
    [
      { lat: 27.1, lng: 68.2 },  // Start curve
      { lat: 26.5, lng: 68.3 },  // Heading towards Hyderabad
      { lat: 25.8, lng: 68.35 }, // Approaching Hyderabad
      { lat: 25.3960, lng: 68.3737 }, // Hyderabad city
      { lat: 25.2, lng: 68.2 },  // Leaving Hyderabad
      { lat: 25.0, lng: 67.9 },  // Intermediate
      { lat: 24.95, lng: 67.6 }, // Approaching Karachi
    ],
    2
  );
  const route2Distance = 480;
  const route2Duration = 390;
  const route2FuelCost = (route2Distance / mileage) * fuelPrice;

  // Route 3: Scenic route via multiple cities (longest) - winding road path
  const route3Points = createCurvedPath(
    larkana,
    karachi,
    [
      { lat: 27.3, lng: 68.3 },  // North detour
      { lat: 27.0, lng: 68.4 },  // Scenic point
      { lat: 26.6, lng: 68.35 }, // Intermediate
      { lat: 26.2, lng: 68.25 }, // Another waypoint
      { lat: 25.8, lng: 68.1 },  // Intermediate
      { lat: 25.4, lng: 67.95 }, // Intermediate
      { lat: 25.0, lng: 67.8 },  // Intermediate
      { lat: 24.9, lng: 67.5 },  // Final approach
    ],
    2
  );
  const route3Distance = 520;
  const route3Duration = 420;
  const route3FuelCost = (route3Distance / mileage) * fuelPrice;

  const routes = [
    {
      summary: `${origin} → ${destination}`,
      distanceKm: route1Distance,
      durationTrafficMinutes: route1Duration,
      fuelCost: route1FuelCost,
      polyline: encodePolyline(route1Points),
      points: route1Points,
    },
    {
      summary: `${origin} → Hyderabad → ${destination}`,
      distanceKm: route2Distance,
      durationTrafficMinutes: route2Duration,
      fuelCost: route2FuelCost,
      polyline: encodePolyline(route2Points),
      points: route2Points,
    },
    {
      summary: `${origin} → Scenic Route → ${destination}`,
      distanceKm: route3Distance,
      durationTrafficMinutes: route3Duration,
      fuelCost: route3FuelCost,
      polyline: encodePolyline(route3Points),
      points: route3Points,
    },
  ];

  // Calculate costs and scores using the same DSA logic
  const computeCost = ({ durationMinutes, fuelCost }, weights) => {
    const timeCost = durationMinutes * (weights?.timeWeight ?? 1);
    const fuelComponent = (fuelCost || 0) * (weights?.fuelWeight ?? 0.2);
    return timeCost + fuelComponent;
  };

  const toSmartScore = (cost, maxCost) => {
    if (!maxCost || maxCost === 0) return 10;
    const normalized = Math.max(0, Math.min(1, 1 - cost / maxCost));
    return 5 + normalized * 5;
  };

  const enrichedRoutes = routes.map((route) => {
    const cost = computeCost(
      {
        durationMinutes: route.durationTrafficMinutes,
        fuelCost: route.fuelCost,
      },
      { timeWeight: 1, fuelWeight: 0.2 }
    );
    return { ...route, cost };
  });

  const maxCost = enrichedRoutes.reduce(
    (max, r) => (r.cost > max ? r.cost : max),
    0
  );

  enrichedRoutes.forEach((route, idx) => {
    enrichedRoutes[idx] = {
      ...route,
      smartScore: toSmartScore(route.cost, maxCost),
    };
  });

  // Find best route (lowest cost)
  const bestRoute = enrichedRoutes.reduce((best, route) =>
    route.cost < best.cost ? route : best
  );

  return {
    bestRoute,
    routes: enrichedRoutes,
  };
}

// Simple polyline encoder (for mock data)
function encodePolyline(points) {
  let encoded = "";
  let prevLat = 0;
  let prevLng = 0;

  for (const point of points) {
    const lat = Math.round(point.lat * 1e5);
    const lng = Math.round(point.lng * 1e5);
    const dLat = lat - prevLat;
    const dLng = lng - prevLng;

    encoded += encodeValue(dLat);
    encoded += encodeValue(dLng);

    prevLat = lat;
    prevLng = lng;
  }

  return encoded;
}

function encodeValue(value) {
  value = value < 0 ? ~(value << 1) : value << 1;
  let encoded = "";
  while (value >= 0x20) {
    encoded += String.fromCharCode((0x20 | (value & 0x1f)) + 63);
    value >>= 5;
  }
  encoded += String.fromCharCode(value + 63);
  return encoded;
}

