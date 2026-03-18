import { create } from 'zustand'

import type { Region } from 'react-native-maps'
import type { Coordinates } from '@/services/location-service'

type MapStore = {
  userLocation: Coordinates | null
  region: Region | null
  isFollowingUser: boolean

  setUserLocation: (coords: Coordinates) => void
  setRegion: (region: Region) => void
  setFollowingUser: (following: boolean) => void
}

export const useMapStore = create<MapStore>((set) => ({
  userLocation: null,
  region: null,
  isFollowingUser: true,

  setUserLocation: (userLocation) => set({ userLocation }),
  setRegion: (region) => set({ region }),
  setFollowingUser: (isFollowingUser) => set({ isFollowingUser }),
}))
