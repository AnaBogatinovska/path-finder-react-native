import * as SQLite from 'expo-sqlite'

import { AppError } from '@/types/errors'
import type { Activity, ActivityCoordinate, NewActivity } from '@/types/activity'
import { logger } from '@/utils/logger'

let db: SQLite.SQLiteDatabase | null = null

// ─── Init ─────────────────────────────────────────────────────────────────────

export async function initDatabase(): Promise<void> {
  try {
    db = await SQLite.openDatabaseAsync('path-finder.db')
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS activities (
        id        INTEGER PRIMARY KEY AUTOINCREMENT,
        date      TEXT    NOT NULL,
        distance  REAL    NOT NULL,
        duration  INTEGER NOT NULL,
        coordinates TEXT  NOT NULL
      );
    `)
    logger.info('Database initialised')
  } catch (error) {
    logger.error('Failed to initialise database', error)
    throw new AppError('UNKNOWN', 'Could not open local database.')
  }
}

// ─── Write ────────────────────────────────────────────────────────────────────

export async function saveActivity(activity: NewActivity): Promise<number> {
  if (!db) throw new AppError('UNKNOWN', 'Database not initialised.')

  try {
    const result = await db.runAsync(
      'INSERT INTO activities (date, distance, duration, coordinates) VALUES (?, ?, ?, ?)',
      [
        activity.date,
        activity.distance,
        activity.duration,
        JSON.stringify(activity.coordinates),
      ],
    )
    logger.info(`Activity saved — id: ${result.lastInsertRowId}`)
    return result.lastInsertRowId
  } catch (error) {
    logger.error('Failed to save activity', error)
    throw new AppError('UNKNOWN', 'Could not save activity.')
  }
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function getActivities(): Promise<Activity[]> {
  if (!db) return []

  type Row = {
    id: number
    date: string
    distance: number
    duration: number
    coordinates: string
  }

  try {
    const rows = await db.getAllAsync<Row>(
      'SELECT id, date, distance, duration, coordinates FROM activities ORDER BY date DESC',
    )
    return rows.map((row) => ({
      ...row,
      coordinates: JSON.parse(row.coordinates) as ActivityCoordinate[],
    }))
  } catch (error) {
    logger.error('Failed to fetch activities', error)
    return []
  }
}

export async function getActivityById(id: number): Promise<Activity | null> {
  if (!db) return null

  type Row = {
    id: number
    date: string
    distance: number
    duration: number
    coordinates: string
  }

  try {
    const row = await db.getFirstAsync<Row>(
      'SELECT id, date, distance, duration, coordinates FROM activities WHERE id = ?',
      [id],
    )
    if (!row) return null
    return { ...row, coordinates: JSON.parse(row.coordinates) as ActivityCoordinate[] }
  } catch (error) {
    logger.error('Failed to fetch activity by id', error)
    return null
  }
}

export async function deleteActivity(id: number): Promise<void> {
  if (!db) throw new AppError('UNKNOWN', 'Database not initialised.')
  await db.runAsync('DELETE FROM activities WHERE id = ?', [id])
}
