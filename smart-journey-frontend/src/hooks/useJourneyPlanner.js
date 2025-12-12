import { useState } from "react";
import { planJourney } from "../services/api";
import { decodePolyline } from "../utils/polylineDecoder";

export function useJourneyPlanner() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const handlePlanJourney = async (params) => {
    setLoading(true);
    setError("");
    try {
      const result = await planJourney(params);
      const points = decodePolyline(result?.bestRoute?.polyline);

      setData({
        ...result,
        bestRoute: {
          ...result?.bestRoute,
          points,
        },
      });
    } catch (e) {
      console.error("Journey error:", e.response?.data || e.message || e);
      setError("Failed to fetch route. Check backend & API keys.");
    } finally {
      setLoading(false);
    }
  };

  return { loading, data, error, handlePlanJourney };
}
