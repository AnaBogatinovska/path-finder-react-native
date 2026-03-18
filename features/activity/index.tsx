import { useActivityTracker } from './hooks/use-activity-tracker'
import { StatsOverlay } from './components/stats-overlay'
import { TrackingControls } from './components/tracking-controls'

/**
 * ActivityFeature — overlays on top of the map.
 * ActivityPolyline is rendered separately inside <MapView> via PathMap.
 */
export function ActivityFeature() {
  const { status, handleStart, handleStop } = useActivityTracker()

  return (
    <>
      <StatsOverlay />
      <TrackingControls status={status} onStart={handleStart} onStop={handleStop} />
    </>
  )
}
