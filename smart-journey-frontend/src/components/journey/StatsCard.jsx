import React from "react";

export default function StatsCard({ bestRoute, routes }) {
  if (!bestRoute) {
    return (
      <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-5 text-sm text-slate-400">
        No route calculated yet. Enter origin and destination, then press{" "}
        <span className="text-sky-300 font-semibold">
          “Find Smartest Route”
        </span>{" "}
        to analyse options.
      </div>
    );
  }

  // Generate explanation for why this route is best
  const generateExplanation = (bestRoute, allRoutes) => {
    const reasons = [];
    
    // Compare with other routes
    const otherRoutes = allRoutes.filter(r => r.summary !== bestRoute.summary);
    
    if (otherRoutes.length > 0) {
      const shortestDistance = Math.min(...allRoutes.map(r => r.distanceKm));
      const fastestTime = Math.min(...allRoutes.map(r => r.durationTrafficMinutes));
      const cheapestFuel = Math.min(...allRoutes.map(r => r.fuelCost || Infinity));
      
      if (bestRoute.distanceKm === shortestDistance) {
        reasons.push("shortest distance");
      }
      if (bestRoute.durationTrafficMinutes === fastestTime) {
        reasons.push("fastest travel time");
      }
      if (bestRoute.fuelCost === cheapestFuel) {
        reasons.push("lowest fuel cost");
      }
      
      // Calculate savings
      const avgDistance = allRoutes.reduce((sum, r) => sum + r.distanceKm, 0) / allRoutes.length;
      const avgTime = allRoutes.reduce((sum, r) => sum + r.durationTrafficMinutes, 0) / allRoutes.length;
      const avgFuel = allRoutes.reduce((sum, r) => sum + (r.fuelCost || 0), 0) / allRoutes.length;
      
      const distanceSavings = avgDistance - bestRoute.distanceKm;
      const timeSavings = avgTime - bestRoute.durationTrafficMinutes;
      const fuelSavings = avgFuel - (bestRoute.fuelCost || 0);
      
      if (distanceSavings > 0) {
        reasons.push(`saves ${distanceSavings.toFixed(1)} km compared to average`);
      }
      if (timeSavings > 0) {
        reasons.push(`saves ${Math.round(timeSavings)} minutes`);
      }
      if (fuelSavings > 0) {
        reasons.push(`saves Rs ${fuelSavings.toFixed(0)} on fuel`);
      }
    }
    
    if (reasons.length === 0) {
      return "This route offers the best balance of distance, time, and fuel cost using our DSA-based optimization algorithm (min-heap priority queue).";
    }
    
    return `This route is the most efficient because it has the ${reasons.slice(0, 2).join(" and ")}. Our algorithm analyzed all ${allRoutes.length} route options using a min-heap data structure to find the optimal path that minimizes combined travel time and fuel expenses.`;
  };

  return (
    <div className="space-y-4">
      {/* Route Explanation Card */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-900/80 to-purple-900/80 border-2 border-indigo-500/50 p-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-500/30 flex items-center justify-center">
            <span className="text-2xl">🎯</span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-50 mb-2">
              Why This Route is Most Efficient
            </h2>
            <p className="text-slate-200 leading-relaxed mb-4">
              {generateExplanation(bestRoute, routes || [])}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold">
                Smart Score: {bestRoute.smartScore.toFixed(1)}/10
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-500/30 text-purple-200 text-xs font-semibold">
                Algorithm: Min-Heap Priority Queue
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Route Statistics */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-5">
        <h2 className="text-lg font-semibold text-slate-50 mb-3">
          Best Route Summary
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <Stat label="Summary" value={bestRoute.summary || "N/A"} />
          <Stat
            label="Distance"
            value={`${bestRoute.distanceKm.toFixed(1)} km`}
          />
          <Stat
            label="Time (with traffic)"
            value={`${bestRoute.durationTrafficMinutes.toFixed(1)} min`}
          />
          <Stat
            label="Fuel cost"
            value={
              bestRoute.fuelCost ? `Rs ${bestRoute.fuelCost.toFixed(0)}` : "N/A"
            }
          />
          <Stat
            label="Smart score"
            value={bestRoute.smartScore.toFixed(1)}
          />
        </div>
      </div>

      {routes && routes.length > 1 && (
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-4">
          <h3 className="text-sm font-semibold text-slate-100 mb-2">
            Other Route Options
          </h3>
          <ul className="space-y-2 text-xs md:text-sm">
            {routes.map((route, idx) => {
              const isBest =
                route.smartScore === bestRoute.smartScore &&
                route.distanceKm === bestRoute.distanceKm;

              return (
                <li
                  key={idx}
                  className={`flex items-center justify-between rounded-2xl px-3 py-2 border ${
                    isBest
                      ? "border-emerald-500/60 bg-emerald-900/30"
                      : "border-slate-700 bg-slate-900/80"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-50">
                      {route.summary || `Route ${idx + 1}`}
                    </span>
                    {isBest && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-semibold">
                        Best
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3 text-slate-300">
                    <span>{route.distanceKm.toFixed(1)} km</span>
                    <span>{route.durationTrafficMinutes.toFixed(1)} min</span>
                    {route.fuelCost && (
                      <span>Rs {route.fuelCost.toFixed(0)}</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-700 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">
        {label}
      </div>
      <div className="text-sm text-slate-50 mt-0.5">{value}</div>
    </div>
  );
}
