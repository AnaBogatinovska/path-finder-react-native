import { View, StyleSheet } from 'react-native'

import { ActivityFeature } from '@/features/activity'
import { useCurrentLocation } from './hooks/use-current-location'
import { LocationPermissionPrompt } from './components/location-permission-prompt'
import { MapErrorView } from './components/map-error-view'
import { MapLoadingView } from './components/map-loading-view'
import { PathMap } from './components/path-map'

/**
 * MapFeature — top-level entry point for the map tab.
 * Owns the permission gate and composes the map + activity overlays.
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

  return (
    <View style={styles.container}>
      <PathMap />
      <ActivityFeature />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
