import { Polyline } from 'react-native-maps'

import { useActivityStore } from '@/store/use-activity-store'

/**
 * Rendered inside <MapView>. Draws the live tracked path as a polyline.
 */
export function ActivityPolyline() {
  const coordinates = useActivityStore((s) => s.trackedCoordinates)

  if (coordinates.length < 2) return null

  return (
    <Polyline
      coordinates={coordinates}
      strokeColor="#2563EB"
      strokeWidth={4}
      lineCap="round"
      lineJoin="round"
    />
  )
}
