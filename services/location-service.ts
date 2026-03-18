import * as Location from 'expo-location'

import { AppError } from '@/types/errors'
import { logger } from '@/utils/logger'

export type Coordinates = {
  latitude: number
  longitude: number
  accuracy: number | null
  heading: number | null
}

// ─── Permissions ───────────────────────────────────────────────────────────────

export async function getLocationPermissionStatus(): Promise<Location.PermissionStatus> {
  const { status } = await Location.getForegroundPermissionsAsync()
  return status
}

export async function requestLocationPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync()
  return status === Location.PermissionStatus.GRANTED
}

// ─── One-shot position ────────────────────────────────────────────────────────

export async function getCurrentLocation(): Promise<Coordinates> {
  const { status } = await Location.getForegroundPermissionsAsync()

  if (status !== Location.PermissionStatus.GRANTED) {
    throw new AppError('LOCATION_PERMISSION_DENIED', 'Location permission not granted.')
  }

  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    })
    return toCoordinates(location)
  } catch (error) {
    logger.error('getCurrentLocation failed', error)
    throw new AppError('LOCATION_UNAVAILABLE', 'Unable to retrieve current location.')
  }
}

// ─── Continuous watching ──────────────────────────────────────────────────────

export function watchLocation(
  onUpdate: (coords: Coordinates) => void,
  onError: (error: AppError) => void,
): () => void {
  let subscription: Location.LocationSubscription | null = null

  Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 2000,
      distanceInterval: 5,
    },
    (location) => {
      onUpdate(toCoordinates(location))
    },
  )
    .then((sub) => {
      subscription = sub
    })
    .catch((error) => {
      logger.error('watchLocation failed', error)
      onError(new AppError('LOCATION_UNAVAILABLE', 'Location tracking failed.'))
    })

  return () => {
    subscription?.remove()
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toCoordinates(location: Location.LocationObject): Coordinates {
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    accuracy: location.coords.accuracy,
    heading: location.coords.heading,
  }
}
