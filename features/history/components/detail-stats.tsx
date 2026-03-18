import { StyleSheet, View } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import type { Activity } from '@/types/activity'
import { formatDistance, formatDuration } from '@/utils/distance'
import { formatFullDate } from '@/utils/date'

type Props = { activity: Activity }

export function DetailStats({ activity }: Props) {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.date}>{formatFullDate(activity.date)}</ThemedText>

      <View style={styles.statsRow}>
        <StatCard label="Distance" value={formatDistance(activity.distance)} />
        <View style={styles.divider} />
        <StatCard label="Duration" value={formatDuration(activity.duration)} />
        <View style={styles.divider} />
        <StatCard label="Points" value={String(activity.coordinates.length)} />
      </View>
    </View>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <ThemedText style={styles.statValue}>{value}</ThemedText>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    gap: 16,
  },
  date: {
    fontSize: 15,
    color: '#6B7280',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
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
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: '#E5E7EB',
  },
})
