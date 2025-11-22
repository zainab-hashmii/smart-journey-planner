import axios from "axios";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const GH_KEY = process.env.GRAPHHOPPER_API_KEY;
const PORT = process.env.PORT || 5000;

if (!GH_KEY) {
  console.error("❌ GRAPHHOPPER_API_KEY is missing in backend .env");
}

// Helper: geocode a place name → { lat, lng, name }
async function geocodePlace(name) {
  const url = "https://graphhopper.com/api/1/geocode";

  const resp = await axios.get(url, {
    params: {
      q: name,
      limit: 1,
      key: GH_KEY,
    },
  });

  const hit = resp.data.hits?.[0];
  if (!hit) {
    throw new Error(`No geocoding result for "${name}"`);
  }

  return {
    name,
    lat: hit.point.lat,
    lng: hit.point.lng,
  };
}

app.get("/", (req, res) => {
  res.send("Smart Journey Backend (GraphHopper) is running");
});

app.post("/api/route", async (req, res) => {
  try {
    const { origin, destination, fuelPrice, mileage } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({ error: "Origin and destination are required" });
    }

    // 1) Geocode origin & destination (from text → lat/lng)
    const originPoint = await geocodePlace(origin);
    const destPoint = await geocodePlace(destination);

    // 2) Call GraphHopper routing
    const routeUrl = "https://graphhopper.com/api/1/route";

    const routeResp = await axios.get(routeUrl, {
      params: {
        point: [
          `${originPoint.lat},${originPoint.lng}`,
          `${destPoint.lat},${destPoint.lng}`,
        ],
        vehicle: "car",
        locale: "en",
        instructions: true,
        calc_points: true,
        points_encoded: false, // so we get GeoJSON LineString
        key: GH_KEY,
      },
    });

    const path = routeResp.data.paths[0];
    if (!path) {
      throw new Error("No route found");
    }

    const distanceKm = path.distance / 1000; // meters → km
    const durationMinutes = path.time / 60000; // ms → minutes
    const polyline = path.points; // GeoJSON LineString

    // 3) Fuel cost
    const fuelCost =
      mileage && fuelPrice ? (distanceKm / mileage) * fuelPrice : null;

    const bestRoute = {
      summary: `${originPoint.name} → ${destPoint.name}`,
      distanceKm,
      durationTrafficMinutes: durationMinutes,
      fuelCost,
      smartScore: 9.1,
      polyline,
    };

    return res.json({
      bestRoute,
      routes: [bestRoute],
    });
  } catch (err) {
    console.error(
      "GraphHopper error:",
      err.response?.data || err.message || err
    );
    res.status(500).json({
      error: "Routing failed. Check GraphHopper key and request.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
