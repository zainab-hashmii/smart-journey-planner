// GraphHopper points_encoded=false → GeoJSON LineString
export function decodePolyline(geojson) {
  if (!geojson || geojson.type !== "LineString" || !geojson.coordinates) {
    return [];
  }
  return geojson.coordinates.map(([lng, lat]) => ({ lat, lng }));
}
