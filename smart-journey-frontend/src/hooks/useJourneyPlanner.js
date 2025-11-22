import { useState } from "react";
import { planJourney } from "../services/api";

export function useJourneyPlanner() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const run = async (params) => {
    setLoading(true);
    setError("");
    try {
      const result = await planJourney(params);
      setData(result);
    } catch (e) {
      console.error("Journey error:", e.response?.data || e.message || e);
      setError("Failed to fetch route. Check backend & API keys.");
    } finally {
      setLoading(false);
    }
  };

  return { loading, data, error, run };
}
