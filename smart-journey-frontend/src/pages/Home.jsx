import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import JourneyForm from "../components/journey/JourneyForm";
import StatsCard from "../components/journey/StatsCard";
import RouteMap from "../components/map/RouteMap";
import { useJourneyPlanner } from "../hooks/useJourneyPlanner";

export default function Home() {
  const { data, loading, error, planJourney } = useJourneyPlanner();

  const bestRoute = data?.bestRoute || null;
  const routes = data?.routes || [];
  const bestRoutePath = data?.bestRoutePath || [];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 w-full">
        <div className="max-w-6xl mx-auto px-4 py-6 md:py-10 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,1.3fr] gap-6">
            <div className="space-y-4">
              <JourneyForm onSubmit={planJourney} loading={loading} />
              {error && (
                <div className="bg-red-900/40 border border-red-500/60 text-xs text-red-200 rounded-2xl px-3 py-2">
                  {error}
                </div>
              )}
              <StatsCard bestRoute={bestRoute} routes={routes} />
            </div>
            <div className="space-y-4">
              <RouteMap path={bestRoutePath} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
