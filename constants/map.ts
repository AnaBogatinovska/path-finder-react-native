import type { Region } from 'react-native-maps'

// ─── MapTiler ──────────────────────────────────────────────────────────────────
export const MAPTILER_API_KEY = process.env.EXPO_PUBLIC_MAPTILER_API_KEY ?? ''

// Available styles: streets-v2 | outdoor-v2 | satellite | topo-v2 | basic-v2
export const MAPTILER_STYLE = 'streets-v2'

export const MAPTILER_TILE_URL =
  `https://api.maptiler.com/maps/${MAPTILER_STYLE}/{z}/{x}/{y}.png?key=${MAPTILER_API_KEY}`

// ─── Map defaults ──────────────────────────────────────────────────────────────
export const DEFAULT_REGION: Region = {
  latitude: 48.8566,
  longitude: 2.3522,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
}

// Zoom used when animating to user location
export const USER_LOCATION_REGION_DELTA = {
  latitudeDelta: 0.008,
  longitudeDelta: 0.008,
}

export const MAX_TILE_ZOOM = 19

// Distance threshold (metres) below which we consider the user "on screen"
// and don't force-animate the camera
export const RECENTER_THRESHOLD_METRES = 200
