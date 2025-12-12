import React from "react";
import JourneyForm from "../components/journey/JourneyForm";
import RouteMap from "../components/map/RouteMap";
import StatsCard from "../components/journey/StatsCard";
import { useJourneyPlanner } from "../hooks/useJourneyPlanner";

export default function Home() {
  const {
    loading,
    data,
    error,
    handlePlanJourney,
  } = useJourneyPlanner();

  return (
    <main className="max-w-5xl mx-auto py-8 space-y-10">

      {/* Journey Form */}
      <JourneyForm
        onSubmit={handlePlanJourney}   // ✅ THIS MUST BE PASSED
        loading={loading}
      />

      {/* Demo mode indicator */}
      {data?._demo && (
        <div className="bg-yellow-900/50 border border-yellow-700 rounded-lg p-4 text-center">
          <p className="text-yellow-300 font-semibold mb-1">📊 Demo Mode Active</p>
          <p className="text-yellow-400 text-sm">
            Using mock data to demonstrate DSA algorithms (min-heap priority queue, cost optimization).
            {data._apiError && <span className="block mt-1 text-xs">API Error: {data._apiError}</span>}
          </p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="text-red-400 text-center font-semibold">
          {error}
        </div>
      )}

      {/* Route Explanation and Stats */}
      {data?.bestRoute && (
        <StatsCard bestRoute={data.bestRoute} routes={data.routes} />
      )}

      {/* Map Section */}
      <div>
        <RouteMap data={data} loading={loading} />
      </div>
    </main>
  );
}
