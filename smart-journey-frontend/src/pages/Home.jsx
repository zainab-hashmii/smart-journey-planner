import React from "react";
import JourneyForm from "../components/journey/JourneyForm";
import RouteMap from "../components/map/RouteMap";
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

      {/* Error message */}
      {error && (
        <div className="text-red-400 text-center font-semibold">
          {error}
        </div>
      )}

      {/* Map Section */}
      <div>
        <RouteMap data={data} loading={loading} />
      </div>
    </main>
  );
}
