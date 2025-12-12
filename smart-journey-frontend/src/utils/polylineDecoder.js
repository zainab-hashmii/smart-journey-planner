// Supports both Google encoded polylines (string) and GeoJSON LineString
export function decodePolyline(polyline) {
  if (!polyline) return [];

  // Google encoded polyline string
  if (typeof polyline === "string") {
    let index = 0;
    let lat = 0;
    let lng = 0;
    const coordinates = [];

    while (index < polyline.length) {
      let result = 0;
      let shift = 0;
      let b;

      do {
        b = polyline.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      const deltaLat = (result & 1) ? ~(result >> 1) : result >> 1;
      lat += deltaLat;

      result = 0;
      shift = 0;

      do {
        b = polyline.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      const deltaLng = (result & 1) ? ~(result >> 1) : result >> 1;
      lng += deltaLng;

      coordinates.push({ lat: lat / 1e5, lng: lng / 1e5 });
    }

    return coordinates;
  }

  // GeoJSON LineString (GraphHopper points_encoded=false)
  if (polyline.type === "LineString" && Array.isArray(polyline.coordinates)) {
    return polyline.coordinates.map(([lng, lat]) => ({ lat, lng }));
  }

  return [];
}
