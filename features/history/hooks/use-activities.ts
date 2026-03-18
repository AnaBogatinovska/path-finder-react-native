import { useCallback, useState } from 'react'
import { useFocusEffect } from 'expo-router'

import { getActivities } from '@/services/activity-service'
import { AppError } from '@/types/errors'
import { logger } from '@/utils/logger'
import type { Activity } from '@/types/activity'

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<AppError | null>(null)

  // Reload every time the History tab gains focus (catches newly saved activities)
  useFocusEffect(
    useCallback(() => {
      void load()
    }, []),
  )

  async function load() {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getActivities()
      setActivities(data)
    } catch (e) {
      logger.error('useActivities load failed', e)
      setError(new AppError('UNKNOWN', 'Could not load activity history.'))
    } finally {
      setIsLoading(false)
    }
  }

  return { activities, isLoading, error, refresh: load }
}
