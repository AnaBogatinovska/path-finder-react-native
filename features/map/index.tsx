import { useCurrentLocation } from './hooks/use-current-location'
import { LocationPermissionPrompt } from './components/location-permission-prompt'
import { MapErrorView } from './components/map-error-view'
import { MapLoadingView } from './components/map-loading-view'
import { PathMap } from './components/path-map'

/**
 * MapFeature — top-level entry point for the map tab.
 * Owns the permission gate and delegates rendering to PathMap.
 */
export function MapFeature() {
  const { permissionState, error, requestPermission } = useCurrentLocation()

  if (permissionState === 'loading') {
    return <MapLoadingView />
  }

  if (permissionState === 'denied' || permissionState === 'blocked') {
    return (
      <LocationPermissionPrompt
        isDenied={permissionState === 'denied'}
        onRequest={requestPermission}
      />
    )
  }

  if (error) {
    return <MapErrorView error={error} onRetry={requestPermission} />
  }

  return <PathMap />
}
