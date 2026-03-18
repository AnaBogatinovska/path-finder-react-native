import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { ThemedText } from '@/components/themed-text'
import { useActivities } from './hooks/use-activities'
import { ActivityListItem } from './components/activity-list-item'
import { EmptyHistory } from './components/empty-history'

export function HistoryFeature() {
  const { activities, isLoading, error, refresh } = useActivities()

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <ThemedText style={styles.errorText}>{error.message}</ThemedText>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>History</ThemedText>
        <ThemedText style={styles.count}>
          {activities.length} {activities.length === 1 ? 'activity' : 'activities'}
        </ThemedText>
      </View>

      <FlatList
        data={activities}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item, index }) => (
          <ActivityListItem activity={item} index={index} />
        )}
        ListEmptyComponent={<EmptyHistory />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={activities.length === 0 ? styles.emptyContent : undefined}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refresh} tintColor="#2563EB" />
        }
      />
    </SafeAreaView>
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
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  count: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 78,
  },
  emptyContent: {
    flex: 1,
  },
  errorText: {
    color: '#DC2626',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
})
