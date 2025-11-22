import React, { useState } from "react";

export default function JourneyForm({ onSubmit, loading }) {
  const [origin, setOrigin] = useState("Larkana, Sindh");
  const [destination, setDestination] = useState("Karachi, Sindh");
  const [fuelPrice, setFuelPrice] = useState(280);
  const [mileage, setMileage] = useState(14);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ origin, destination, fuelPrice, mileage });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl shadow-sky-900/40 p-6 md:p-7 space-y-5"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg md:text-xl font-semibold text-slate-50">
          Plan Your Journey
        </h2>
        <span className="px-2 py-1 rounded-full bg-slate-800 text-[10px] text-slate-300 border border-slate-700">
          Live traffic · Fuel cost
        </span>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-300">
            Origin
          </label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500/70 focus:border-sky-500 placeholder:text-slate-500"
            placeholder="e.g. Larkana, Sindh"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-300">
            Destination
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500/70 focus:border-sky-500 placeholder:text-slate-500"
            placeholder="e.g. Karachi, Sindh"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-300">
              Fuel Price (Rs / L)
            </label>
            <input
              type="number"
              value={fuelPrice}
              onChange={(e) => setFuelPrice(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500/70 focus:border-sky-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-300">
              Mileage (km / L)
            </label>
            <input
              type="number"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500/70 focus:border-sky-500"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full md:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 text-sm font-semibold text-white shadow-lg shadow-sky-900/60 hover:shadow-sky-600/80 hover:from-sky-400 hover:via-indigo-400 hover:to-fuchsia-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Calculating best route..." : "Find Smartest Route"}
      </button>
    </form>
  );
}
