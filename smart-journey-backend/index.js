import axios from "axios";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const GOOGLE_KEY = process.env.GOOGLE_MAPS_API_KEY;
const PORT = process.env.PORT || 5000;

if (!GOOGLE_KEY) {
  console.error("❌ GOOGLE_MAPS_API_KEY missing in backend .env");
}

// Simple min-heap (priority queue) for picking the cheapest route
class MinHeap {
  constructor() {
    this.data = [];
  }

  push(item) {
    this.data.push(item);
    this.#bubbleUp(this.data.length - 1);
  }

  pop() {
    if (this.data.length === 0) return null;
    const root = this.data[0];
    const last = this.data.pop();
    if (this.data.length > 0) {
      this.data[0] = last;
      this.#bubbleDown(0);
    }
    return root;
  }

  #bubbleUp(idx) {
    while (idx > 0) {
      const parent = Math.floor((idx - 1) / 2);
      if (this.data[parent].cost <= this.data[idx].cost) break;
      [this.data[parent], this.data[idx]] = [this.data[idx], this.data[parent]];
      idx = parent;
    }
  }

  #bubbleDown(idx) {
    const n = this.data.length;
    while (true) {
      const left = idx * 2 + 1;
      const right = idx * 2 + 2;
      let smallest = idx;

      if (left < n && this.data[left].cost < this.data[smallest].cost) {
        smallest = left;
      }
      if (right < n && this.data[right].cost < this.data[smallest].cost) {
        smallest = right;
      }
      if (smallest === idx) break;
      [this.data[smallest], this.data[idx]] = [this.data[idx], this.data[smallest]];
      idx = smallest;
    }
  }
}

// Weighted cost function combining traffic time and fuel cost
function computeCost({ durationMinutes, fuelCost }, weights) {
  const timeCost = durationMinutes * (weights?.timeWeight ?? 1);
  const fuelComponent = (fuelCost || 0) * (weights?.fuelWeight ?? 0.1);
  return timeCost + fuelComponent;
}

// Normalize a score 0-10 for display
function toSmartScore(cost, maxCost) {
  if (!maxCost || maxCost === 0) return 10;
  const normalized = Math.max(0, Math.min(1, 1 - cost / maxCost));
  return 5 + normalized * 5; // 5–10 range
}

// /api/route endpoint using GOOGLE with DSA-inspired selection
app.post("/api/route", async (req, res) => {
  try {
    const { origin, destination, fuelPrice, mileage } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({ error: "Origin and destination required" });
    }

    // Call Google Directions with alternatives + traffic
    const url = "https://maps.googleapis.com/maps/api/directions/json";
    const response = await axios.get(url, {
      params: {
        origin,
        destination,
        key: GOOGLE_KEY,
        alternatives: true,
        departure_time: "now",
        traffic_model: "best_guess",
      },
    });

    if (response.data.status !== "OK") {
      return res.status(500).json({
        error: "Google routing failed",
        details: response.data,
      });
    }

    const routesRaw = response.data.routes || [];
    if (!routesRaw.length) {
      return res.status(404).json({ error: "No routes returned" });
    }

    // Build route metrics and push into a heap by combined cost
    const heap = new MinHeap();
    const enrichedRoutes = [];

    for (const route of routesRaw) {
      const leg = route.legs?.[0];
      if (!leg) continue;

      const distanceKm = leg.distance?.value ? leg.distance.value / 1000 : null;
      const durationTrafficMinutes = leg.duration_in_traffic
        ? leg.duration_in_traffic.value / 60
        : leg.duration
        ? leg.duration.value / 60
        : null;

      const fuelCost =
        distanceKm && mileage && fuelPrice
          ? (distanceKm / mileage) * fuelPrice
          : null;

      const routeMetrics = {
        summary: `${leg.start_address} → ${leg.end_address}`,
        distanceKm,
        durationTrafficMinutes,
        fuelCost,
        polyline: route.overview_polyline?.points,
      };

      const cost = computeCost(
        {
          durationMinutes: durationTrafficMinutes ?? Number.POSITIVE_INFINITY,
          fuelCost,
        },
        { timeWeight: 1, fuelWeight: 0.2 }
      );

      enrichedRoutes.push({ ...routeMetrics, cost });
    }

    if (!enrichedRoutes.length) {
      return res.status(404).json({ error: "No usable routes returned" });
    }

    // Determine max cost for scoring, and push to heap
    const maxCost = enrichedRoutes.reduce(
      (max, r) => (r.cost > max ? r.cost : max),
      0
    );

    enrichedRoutes.forEach((route, idx) => {
      const smartScore = toSmartScore(route.cost, maxCost);
      const withScore = { ...route, smartScore };
      enrichedRoutes[idx] = withScore;
      heap.push({ cost: route.cost, route: withScore });
    });

    const best = heap.pop()?.route || enrichedRoutes[0];

    return res.json({
      bestRoute: best,
      routes: enrichedRoutes,
    });
  } catch (err) {
    console.error("Google API error:", err.response?.data || err.message);
    res.status(500).json({ error: "Routing failed. Check Google API key." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
