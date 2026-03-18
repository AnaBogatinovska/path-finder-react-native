const EARTH_RADIUS_METRES = 6_371_000

type LatLng = { latitude: number; longitude: number }

/**
 * Haversine formula — great-circle distance between two coordinates in metres.
 */
export function haversineDistance(a: LatLng, b: LatLng): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180

  const dLat = toRad(b.latitude - a.latitude)
  const dLon = toRad(b.longitude - a.longitude)
  const lat1 = toRad(a.latitude)
  const lat2 = toRad(b.latitude)

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2

  return EARTH_RADIUS_METRES * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
}

/** Format metres → "42 m" or "1.34 km" */
export function formatDistance(metres: number): string {
  if (metres < 1000) return `${Math.round(metres)} m`
  return `${(metres / 1000).toFixed(2)} km`
}

/** Format elapsed seconds → "MM:SS" or "H:MM:SS" */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60

  const mm = String(m).padStart(2, '0')
  const ss = String(s).padStart(2, '0')

  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}
