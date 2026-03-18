export type ActivityCoordinate = {
  latitude: number
  longitude: number
}

export type Activity = {
  id: number
  date: string        // ISO-8601
  distance: number    // metres
  duration: number    // seconds
  coordinates: ActivityCoordinate[]
}

export type NewActivity = Omit<Activity, 'id'>
