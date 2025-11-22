import React from "react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-3 text-[11px] md:text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-2">
        <span>
          © {new Date().getFullYear()} Smart Journey Planner · All rights reserved
        </span>
        <span className="text-slate-500">
          Built with <span className="text-sky-400 font-semibold">React</span>,{" "}
          <span className="text-emerald-400 font-semibold">Node.js</span> &{" "}
          <span className="text-amber-300 font-semibold">Google Maps Platform</span>
        </span>
      </div>
    </footer>
  );
}
