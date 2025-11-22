import React from "react";

export default function Navbar() {
  return (
    <header className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-sky-400">
            Smart Journey Planner
          </h1>
          <p className="text-[11px] text-slate-400">
            Traffic-aware · Fuel-optimised · Smart routing
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-sky-500/10 text-[11px] text-sky-300 border border-sky-500/40 shadow-sky-500/30 shadow">
          React · Node · Google Maps
        </span>
      </div>
    </header>
  );
}
