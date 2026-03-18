import { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ThemedText } from '@/components/themed-text'
import { useActivityStore } from '@/store/use-activity-store'
import { formatDistance, formatDuration } from '@/utils/distance'

export function StatsOverlay() {
  const isTracking = useActivityStore((s) => s.isTracking)
  const startTime = useActivityStore((s) => s.startTime)
  const currentDistance = useActivityStore((s) => s.currentDistance)
  const insets = useSafeAreaInsets()

  // Tick every second to update duration display
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    if (!isTracking) return
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [isTracking])

  if (!isTracking) return null

  const elapsedSeconds = startTime ? Math.floor((now - startTime) / 1000) : 0

  return (
    <Animated.View
      entering={FadeInDown.duration(300).springify()}
      exiting={FadeOutDown.duration(200)}
      style={[styles.container, { bottom: 120 + insets.bottom }]}
    >
      <StatItem label="Duration" value={formatDuration(elapsedSeconds)} />
      <View style={styles.divider} />
      <StatItem label="Distance" value={formatDistance(currentDistance)} />
    </Animated.View>
  )
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statItem}>
      <ThemedText style={styles.statValue}>{value}</ThemedText>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 28,
    gap: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  statItem: {
    alignItems: 'center',
    minWidth: 80,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  divider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
  },
})
