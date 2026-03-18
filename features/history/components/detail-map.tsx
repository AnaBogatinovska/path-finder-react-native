import { useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import MapView, { Marker, Polyline, UrlTile } from 'react-native-maps'

import { DEFAULT_REGION, MAPTILER_TILE_URL, MAX_TILE_ZOOM } from '@/constants/map'
import type { Activity } from '@/types/activity'

type Props = { activity: Activity }

export function DetailMap({ activity }: Props) {
  const mapRef = useRef<MapView>(null)
  const { coordinates } = activity

  const start = coordinates.at(0)
  const end = coordinates.at(-1)
  const hasRoute = coordinates.length >= 2

  function handleMapReady() {
    if (!hasRoute) return
    mapRef.current?.fitToCoordinates(coordinates, {
      edgePadding: { top: 48, right: 48, bottom: 48, left: 48 },
      animated: false,
    })
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={DEFAULT_REGION}
        mapType="none"
        scrollEnabled
        zoomEnabled
        rotateEnabled={false}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        onMapReady={handleMapReady}
      >
        <UrlTile
          urlTemplate={MAPTILER_TILE_URL}
          maximumZ={MAX_TILE_ZOOM}
          flipY={false}
          zIndex={-1}
        />

        {hasRoute && (
          <Polyline
            coordinates={coordinates}
            strokeColor="#2563EB"
            strokeWidth={4}
            lineCap="round"
            lineJoin="round"
          />
        )}

        {start && (
          <Marker coordinate={start} anchor={{ x: 0.5, y: 0.5 }} title="Start">
            <View style={[styles.dot, styles.dotStart]} />
          </Marker>
        )}

        {end && start !== end && (
          <Marker coordinate={end} anchor={{ x: 0.5, y: 0.5 }} title="Finish">
            <View style={[styles.dot, styles.dotEnd]} />
          </Marker>
        )}
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 320,
    marginHorizontal: 0,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },
  dotStart: {
    backgroundColor: '#16A34A',
  },
  dotEnd: {
    backgroundColor: '#DC2626',
  },
})
