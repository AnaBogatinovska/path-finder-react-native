import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native'
import { useLocalSearchParams, Stack } from 'expo-router'
import Animated, { FadeIn } from 'react-native-reanimated'

import { ThemedText } from '@/components/themed-text'
import { DetailMap } from '@/features/history/components/detail-map'
import { DetailStats } from '@/features/history/components/detail-stats'
import { useActivityDetail } from '@/features/history/hooks/use-activity-detail'

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { activity, isLoading, error } = useActivityDetail(Number(id))

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Stack.Screen options={{ title: 'Activity' }} />
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    )
  }

  if (error || !activity) {
    return (
      <View style={styles.centered}>
        <Stack.Screen options={{ title: 'Activity' }} />
        <ThemedText style={styles.errorText}>
          {error?.message ?? 'Activity not found.'}
        </ThemedText>
      </View>
    )
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Activity Detail',
          headerBackTitle: 'History',
        }}
      />
      <Animated.View entering={FadeIn.duration(250)} style={styles.container}>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <DetailMap activity={activity} />
          <DetailStats activity={activity} />
        </ScrollView>
      </Animated.View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    color: '#DC2626',
    textAlign: 'center',
  },
})
