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

      // Decode polyline for best route (if not already decoded in mock data)
      const bestRoutePoints = result?.bestRoute?.points || decodePolyline(result?.bestRoute?.polyline);
      const bestRoute = {
        ...result?.bestRoute,
        points: bestRoutePoints,
      };

      // Decode all alternative routes (if any) - handle both mock data (has points) and API data (needs decoding)
      const routes =
        result?.routes?.map((route) => ({
          ...route,
          points: route.points || decodePolyline(route?.polyline),
        })) || [];

      setData({
        ...result,
        bestRoute,
        routes,
      });
      
      // Show info if using demo data
      if (result._demo) {
        console.log("📊 Using demo/mock data - DSA algorithms still working!");
        console.log("API Error:", result._apiError);
      }
    } catch (e) {
      console.error("Journey error:", e.response?.data || e.message || e);
      const errorMsg = e.response?.data?.error || e.response?.data?.details || e.message || "Unknown error";
      
      // Don't show error if we got demo data
      if (!e.response?.data?._demo) {
        setError(`Failed to fetch route: ${errorMsg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, data, error, handlePlanJourney };
}
