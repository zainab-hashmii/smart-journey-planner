import React from "react";
import {
  GoogleMap,
  Polyline,
  LoadScript
} from "@react-google-maps/api";

const DEFAULT_CENTER = { lat: 24.8607, lng: 67.0011 }; // Karachi

export default function RouteMap({ data, loading }) {
  const decodedPath = data?.bestRoute?.points || [];
  const mapCenter = decodedPath[0] || DEFAULT_CENTER;

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg bg-slate-800">
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={mapCenter}
          zoom={decodedPath.length ? 10 : 7}
        >
          {decodedPath.length > 0 && (
            <Polyline
              path={decodedPath}
              options={{
                strokeColor: "#4F46E5",
                strokeWeight: 5,
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
