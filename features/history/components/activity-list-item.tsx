import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { router } from 'expo-router'
import Animated, { FadeInUp } from 'react-native-reanimated'

import { ThemedText } from '@/components/themed-text'
import type { Activity } from '@/types/activity'
import { formatDistance, formatDuration } from '@/utils/distance'
import { formatActivityDate } from '@/utils/date'

type Props = {
  activity: Activity
  index: number
}

export function ActivityListItem({ activity, index }: Props) {
  function handlePress() {
    router.push(`/activity/${activity.id}`)
  }

  return (
    <Animated.View entering={FadeInUp.delay(index * 60).duration(300).springify()}>
      <TouchableOpacity style={styles.row} onPress={handlePress} activeOpacity={0.75}>
        <View style={styles.iconWrapper}>
          <ThemedText style={styles.icon}>🏃</ThemedText>
        </View>

        <View style={styles.content}>
          <ThemedText style={styles.date}>{formatActivityDate(activity.date)}</ThemedText>
          <View style={styles.stats}>
            <ThemedText style={styles.stat}>{formatDistance(activity.distance)}</ThemedText>
            <View style={styles.dot} />
            <ThemedText style={styles.stat}>{formatDuration(activity.duration)}</ThemedText>
          </View>
        </View>

        <ThemedText style={styles.chevron}>›</ThemedText>
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    gap: 14,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    gap: 3,
  },
  date: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stat: {
    fontSize: 13,
    color: '#6B7280',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#D1D5DB',
  },
  chevron: {
    fontSize: 22,
    color: '#9CA3AF',
    lineHeight: 26,
  },
})
