import { useEffect, useState } from 'react'

import { getActivityById } from '@/services/activity-service'
import { AppError } from '@/types/errors'
import { logger } from '@/utils/logger'
import type { Activity } from '@/types/activity'

export function useActivityDetail(id: number) {
  const [activity, setActivity] = useState<Activity | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<AppError | null>(null)

  useEffect(() => {
    void load()
  }, [id])

  async function load() {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getActivityById(id)
      if (!data) {
        setError(new AppError('UNKNOWN', 'Activity not found.'))
      } else {
        setActivity(data)
      }
    } catch (e) {
      logger.error('useActivityDetail load failed', e)
      setError(new AppError('UNKNOWN', 'Could not load activity.'))
    } finally {
      setIsLoading(false)
    }
  }

  return { activity, isLoading, error }
}
