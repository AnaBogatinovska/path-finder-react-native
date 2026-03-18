import { ActivityIndicator, StyleSheet, View } from 'react-native'

import { ThemedText } from '@/components/themed-text'

export function MapLoadingView() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2563EB" />
      <ThemedText style={styles.label}>Locating you…</ThemedText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#F8FAFC',
  },
  label: {
    opacity: 0.55,
    fontSize: 14,
  },
})
