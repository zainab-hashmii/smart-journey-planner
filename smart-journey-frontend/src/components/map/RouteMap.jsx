import React from "react";
import {
  GoogleMap,
  Polyline,
  LoadScript
} from "@react-google-maps/api";

const DEFAULT_CENTER = { lat: 24.8607, lng: 67.0011 }; // Karachi

const ALT_COLORS = ["#22c55e", "#f59e0b", "#06b6d4", "#ec4899"];

export default function RouteMap({ data, loading }) {
  const bestPath = data?.bestRoute?.points || [];
  const bestRouteSummary = data?.bestRoute?.summary;
  // Filter out best route from alternatives
  const altRoutes = (data?.routes?.filter((r) => 
    r?.points?.length && r?.summary !== bestRouteSummary
  ) || []);
  const mapCenter = bestPath[0] || altRoutes[0]?.points?.[0] || DEFAULT_CENTER;
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  // Fallback SVG map when API key is missing but we have route data
  if ((!apiKey || apiKey === "your_google_maps_api_key_here") && bestPath.length > 0) {
    return (
      <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg bg-slate-800 relative">
        <svg viewBox="0 0 1000 400" className="w-full h-full">
          {/* Background */}
          <rect width="1000" height="400" fill="#1e293b" />
          
          {/* Route visualization with smooth curves */}
          {altRoutes.map((route, idx) => {
            if (!route.points || route.points.length === 0) return null;
            // Create smooth curved path using quadratic bezier curves
            const points = route.points.map(p => ({
              x: ((p.lng + 68) / 2) * 1000,
              y: ((28 - p.lat) / 4) * 400
            }));
            
            let pathData = `M ${points[0].x} ${points[0].y}`;
            for (let i = 1; i < points.length; i++) {
              if (i === points.length - 1) {
                pathData += ` L ${points[i].x} ${points[i].y}`;
              } else {
                const cp1x = (points[i - 1].x + points[i].x) / 2;
                const cp1y = (points[i - 1].y + points[i].y) / 2;
                pathData += ` Q ${points[i - 1].x} ${points[i - 1].y} ${cp1x} ${cp1y}`;
                pathData += ` T ${points[i].x} ${points[i].y}`;
              }
            }
            
            return (
              <path
                key={`alt-${idx}`}
                d={pathData}
                fill="none"
                stroke={ALT_COLORS[idx % ALT_COLORS.length]}
                strokeWidth="3"
                strokeDasharray="8,4"
                opacity="0.6"
              />
            );
          })}
          
          {bestPath.length > 0 && (() => {
            const points = bestPath.map(p => ({
              x: ((p.lng + 68) / 2) * 1000,
              y: ((28 - p.lat) / 4) * 400
            }));
            
            let pathData = `M ${points[0].x} ${points[0].y}`;
            for (let i = 1; i < points.length; i++) {
              if (i === points.length - 1) {
                pathData += ` L ${points[i].x} ${points[i].y}`;
              } else {
                const cp1x = (points[i - 1].x + points[i].x) / 2;
                const cp1y = (points[i - 1].y + points[i].y) / 2;
                pathData += ` Q ${points[i - 1].x} ${points[i - 1].y} ${cp1x} ${cp1y}`;
                pathData += ` T ${points[i].x} ${points[i].y}`;
              }
            }
            
            return (
              <path
                d={pathData}
                fill="none"
                stroke="#4F46E5"
                strokeWidth="5"
              />
            );
          })()}
          
          {/* Markers */}
          {bestPath.length > 0 && (
            <>
              <circle cx={((bestPath[0].lng + 68) / 2) * 1000} cy={((28 - bestPath[0].lat) / 4) * 400} r="8" fill="#22c55e" />
              <circle cx={((bestPath[bestPath.length - 1].lng + 68) / 2) * 1000} cy={((28 - bestPath[bestPath.length - 1].lat) / 4) * 400} r="8" fill="#ef4444" />
            </>
          )}
        </svg>
        <div className="absolute top-4 left-4 bg-yellow-900/80 border border-yellow-700 rounded p-2 text-xs text-yellow-300">
          <p className="font-semibold">Demo Map (API Key Missing)</p>
          <p className="text-yellow-400">Routes visualized using SVG</p>
        </div>
      </div>
    );
  }

  if (!apiKey || apiKey === "your_google_maps_api_key_here") {
    return (
      <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg bg-slate-800 flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <p className="text-red-400 font-semibold mb-2">Google Maps API Key Missing</p>
          <p className="text-slate-400 text-sm mb-4">
            Please set REACT_APP_GOOGLE_MAPS_API_KEY in your .env file
          </p>
          <div className="text-xs text-slate-500 bg-slate-900 p-3 rounded text-left">
            <p className="mb-2">Steps to fix:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Create/Edit <code className="text-sky-400">smart-journey-frontend/.env</code></li>
              <li>Add: <code className="text-sky-400">REACT_APP_GOOGLE_MAPS_API_KEY=your_key</code></li>
              <li>Restart frontend server (npm start)</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg bg-slate-800">
      <LoadScript 
        googleMapsApiKey={apiKey}
        onError={(error) => {
          console.error("Google Maps LoadScript error:", error);
        }}
      >
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={mapCenter}
          zoom={bestPath.length ? 10 : 7}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
          }}
        >
          {/* Alternative routes (dashed, lighter) */}
          {altRoutes.map((route, idx) => (
            <Polyline
              key={`alt-${idx}`}
              path={route.points}
              options={{
                strokeColor: ALT_COLORS[idx % ALT_COLORS.length],
                strokeWeight: 3,
                strokeOpacity: 0.6,
                geodesic: true, // Follow Earth's curvature for realistic paths
                icons: [
                  {
                    icon: { path: "M 0,-1 0,1", strokeOpacity: 1, scale: 3 },
                    offset: "0",
                    repeat: "25px",
                  },
                ],
              }}
            />
          ))}

          {/* Best route (solid, primary) */}
          {bestPath.length > 0 && (
            <Polyline
              path={bestPath}
              options={{
                strokeColor: "#4F46E5",
                strokeWeight: 6,
                geodesic: true, // Follow Earth's curvature for realistic road paths
                zIndex: 10, // Ensure best route is on top
              }}
            />
          )}
          
          {/* Start and End Markers */}
          {bestPath.length > 0 && (
            <>
              {/* Start marker */}
              <div
                style={{
                  position: "absolute",
                  transform: "translate(-50%, -50%)",
                  left: "50%",
                  top: "50%",
                }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "#22c55e",
                    border: "3px solid white",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  }}
                />
              </div>
            </>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
