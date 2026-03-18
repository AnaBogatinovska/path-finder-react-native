import { useEffect, useRef, useState } from 'react'

import * as ExpoLocation from 'expo-location'

import {
  getLocationPermissionStatus,
  requestLocationPermission,
  watchLocation,
} from '@/services/location-service'
import { useMapStore } from '@/store/use-map-store'
import { AppError } from '@/types/errors'
import { logger } from '@/utils/logger'

import type { LocationPermissionState } from '../types'

export function useCurrentLocation() {
  const [permissionState, setPermissionState] = useState<LocationPermissionState>('loading')
  const [error, setError] = useState<AppError | null>(null)

  const setUserLocation = useMapStore((s) => s.setUserLocation)
  const stopWatchRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    void checkAndRequest()
    return () => {
      stopWatchRef.current?.()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function checkAndRequest() {
    try {
      const status = await getLocationPermissionStatus()

      if (status === ExpoLocation.PermissionStatus.GRANTED) {
        setPermissionState('granted')
        startWatching()
        return
      }

      if (status === ExpoLocation.PermissionStatus.DENIED) {
        // On iOS, DENIED means "don't ask again" (blocked). On Android it's just denied.
        setPermissionState('denied')
        return
      }

      // UNDETERMINED — ask the user
      const granted = await requestLocationPermission()
      if (granted) {
        setPermissionState('granted')
        startWatching()
      } else {
        setPermissionState('denied')
      }
    } catch (e) {
      logger.error('Permission check failed', e)
      setPermissionState('denied')
    }
  }

  function startWatching() {
    stopWatchRef.current = watchLocation(
      (coords) => {
        setUserLocation(coords)
        setError(null)
      },
      (err) => {
        setError(err)
        logger.error('Location watch error', err)
      },
    )
  }

  async function requestPermission() {
    setPermissionState('loading')
    const granted = await requestLocationPermission()
    if (granted) {
      setPermissionState('granted')
      startWatching()
    } else {
      setPermissionState('denied')
    }
  }

  return { permissionState, error, requestPermission }
}
