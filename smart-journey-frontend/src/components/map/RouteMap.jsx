import React from "react";
import { GoogleMap, Polyline, LoadScript } from "@react-google-maps/api";
import { decodePolyline } from "../../utils/polylineDecoder";

function RouteMap({ data }) {
  const decodedPath = data?.bestRoute?.polyline
    ? decodePolyline(data.bestRoute.polyline)
    : [];

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "400px" }}
        center={{ lat: 24.8607, lng: 67.0011 }}
        zoom={10}
      >
        {decodedPath.length > 0 && (
          <Polyline path={decodedPath} options={{ strokeColor: "#FF0000" }} />
        )}
      </GoogleMap>
    </LoadScript>
  );
}

export default RouteMap;
