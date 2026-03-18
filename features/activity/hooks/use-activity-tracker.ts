import { useCallback, useEffect, useRef, useState } from 'react'
import { Alert } from 'react-native'

import { saveActivity } from '@/services/activity-service'
import { useActivityStore } from '@/store/use-activity-store'
import { useMapStore } from '@/store/use-map-store'
import { logger } from '@/utils/logger'
import { formatDistance, formatDuration } from '@/utils/distance'

import type { TrackingStatus } from '../types'

export function useActivityTracker() {
  const [status, setStatus] = useState<TrackingStatus>('idle')

  const startTracking = useActivityStore((s) => s.startTracking)
  const stopTracking = useActivityStore((s) => s.stopTracking)
  const addCoordinate = useActivityStore((s) => s.addCoordinate)
  const reset = useActivityStore((s) => s.reset)
  const startTime = useActivityStore((s) => s.startTime)
  const trackedCoordinates = useActivityStore((s) => s.trackedCoordinates)
  const currentDistance = useActivityStore((s) => s.currentDistance)

  // Subscribe to live location updates via the map store (no second GPS watcher)
  const prevLocationRef = useRef<{ latitude: number; longitude: number } | null>(null)

  useEffect(() => {
    if (status !== 'tracking') return

    const unsubscribe = useMapStore.subscribe(
      (state) => state.userLocation,
      (location) => {
        if (!location) return

        // Avoid duplicate first point
        const prev = prevLocationRef.current
        if (prev && prev.latitude === location.latitude && prev.longitude === location.longitude) {
          return
        }

        prevLocationRef.current = location
        addCoordinate({ latitude: location.latitude, longitude: location.longitude })
      },
    )

    return unsubscribe
  }, [status, addCoordinate])

  const handleStart = useCallback(() => {
    prevLocationRef.current = null
    startTracking()
    setStatus('tracking')
  }, [startTracking])

  const handleStop = useCallback(async () => {
    if (status !== 'tracking') return

    stopTracking()
    setStatus('saving')

    const duration = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0

    try {
      await saveActivity({
        date: new Date().toISOString(),
        distance: currentDistance,
        duration,
        coordinates: trackedCoordinates,
      })

      Alert.alert(
        'Activity Saved',
        `Distance: ${formatDistance(currentDistance)}\nDuration: ${formatDuration(duration)}`,
        [{ text: 'OK', onPress: reset }],
      )
    } catch (error) {
      logger.error('Failed to save activity', error)
      Alert.alert(
        'Save Failed',
        'Could not save your activity. Your data is still in memory.',
        [
          { text: 'Discard', style: 'destructive', onPress: reset },
          { text: 'Try Again', onPress: () => void retrySave(duration) },
        ],
      )
    } finally {
      setStatus('idle')
    }
  }, [status, stopTracking, startTime, currentDistance, trackedCoordinates, reset])

  async function retrySave(duration: number) {
    setStatus('saving')
    try {
      await saveActivity({
        date: new Date().toISOString(),
        distance: currentDistance,
        duration,
        coordinates: trackedCoordinates,
      })
      Alert.alert('Saved', 'Activity saved successfully.', [{ text: 'OK', onPress: reset }])
    } catch {
      Alert.alert('Error', 'Save failed again. Please try later.')
    } finally {
      setStatus('idle')
    }
  }

  return { status, handleStart, handleStop }
}
