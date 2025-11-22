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

  return (
    <div className="space-y-4">
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
