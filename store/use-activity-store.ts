import { create } from 'zustand'

import { haversineDistance } from '@/utils/distance'
import type { ActivityCoordinate } from '@/types/activity'

type ActivityStore = {
  isTracking: boolean
  startTime: number | null          // Date.now() snapshot when tracking began
  trackedCoordinates: ActivityCoordinate[]
  currentDistance: number           // running total in metres

  startTracking: () => void
  addCoordinate: (coord: ActivityCoordinate) => void
  stopTracking: () => void
  reset: () => void
}

export const useActivityStore = create<ActivityStore>((set, get) => ({
  isTracking: false,
  startTime: null,
  trackedCoordinates: [],
  currentDistance: 0,

  startTracking: () =>
    set({
      isTracking: true,
      startTime: Date.now(),
      trackedCoordinates: [],
      currentDistance: 0,
    }),

  addCoordinate: (coord) => {
    const { trackedCoordinates, currentDistance } = get()
    const last = trackedCoordinates.at(-1) ?? null
    const delta = last ? haversineDistance(last, coord) : 0

    set({
      trackedCoordinates: [...trackedCoordinates, coord],
      currentDistance: currentDistance + delta,
    })
  },

  stopTracking: () => set({ isTracking: false }),

  reset: () =>
    set({
      isTracking: false,
      startTime: null,
      trackedCoordinates: [],
      currentDistance: 0,
    }),
}))
