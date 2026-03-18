import { useCallback, useEffect, useRef } from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import MapView, { type Region, UrlTile } from 'react-native-maps'

import {
  DEFAULT_REGION,
  MAPTILER_TILE_URL,
  MAX_TILE_ZOOM,
  USER_LOCATION_REGION_DELTA,
} from '@/constants/map'
import { useMapStore } from '@/store/use-map-store'

import { RecenterButton } from './recenter-button'

export function PathMap() {
  const mapRef = useRef<MapView>(null)

  // Guards onPanDrag from firing during our own programmatic animations
  const isProgrammaticAnimationRef = useRef(false)

  const userLocation = useMapStore((s) => s.userLocation)
  const isFollowingUser = useMapStore((s) => s.isFollowingUser)
  const setRegion = useMapStore((s) => s.setRegion)
  const setFollowingUser = useMapStore((s) => s.setFollowingUser)

  // Animate camera to user location whenever it updates and we're in follow mode
  useEffect(() => {
    if (!userLocation || !isFollowingUser) return

    const region: Region = {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      ...USER_LOCATION_REGION_DELTA,
    }

    isProgrammaticAnimationRef.current = true
    mapRef.current?.animateToRegion(region, 600)

    // Clear the lock slightly after animation completes
    const timer = setTimeout(() => {
      isProgrammaticAnimationRef.current = false
    }, 700)

    return () => clearTimeout(timer)
  }, [userLocation, isFollowingUser])

  const handleRecenter = useCallback(() => {
    if (!userLocation) return
    setFollowingUser(true)
    isProgrammaticAnimationRef.current = true
    mapRef.current?.animateToRegion(
      {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        ...USER_LOCATION_REGION_DELTA,
      },
      400,
    )
    setTimeout(() => {
      isProgrammaticAnimationRef.current = false
    }, 500)
  }, [userLocation, setFollowingUser])

  const handlePanDrag = useCallback(() => {
    // Ignore drags fired by our own programmatic animation (iOS MapKit quirk)
    if (isProgrammaticAnimationRef.current) return
    if (isFollowingUser) setFollowingUser(false)
  }, [isFollowingUser, setFollowingUser])

  const handleRegionChangeComplete = useCallback(
    (region: Region) => {
      setRegion(region)
    },
    [setRegion],
  )

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={DEFAULT_REGION}
        mapType="none"
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        // We drive camera manually via animateToRegion — no native following
        followsUserLocation={false}
        onPanDrag={handlePanDrag}
        onRegionChangeComplete={handleRegionChangeComplete}
        moveOnMarkerPress={false}
        rotateEnabled={false}
      >
        <UrlTile
          urlTemplate={MAPTILER_TILE_URL}
          maximumZ={MAX_TILE_ZOOM}
          flipY={false}
          zIndex={-1}
        />
      </MapView>

      <RecenterButton
        visible={!isFollowingUser && !!userLocation}
        onPress={handleRecenter}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
})
