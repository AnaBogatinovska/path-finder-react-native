import { StyleSheet, View } from 'react-native'
import Animated, { FadeInUp } from 'react-native-reanimated'

import { ThemedText } from '@/components/themed-text'

export function EmptyHistory() {
  return (
    <Animated.View entering={FadeInUp.duration(400).springify()} style={styles.container}>
      <View style={styles.iconWrapper}>
        <ThemedText style={styles.icon}>🗺️</ThemedText>
      </View>
      <ThemedText type="defaultSemiBold" style={styles.title}>
        No activities yet
      </ThemedText>
      <ThemedText style={styles.body}>
        Start tracking a path on the Map tab.{'\n'}Your recorded activities will appear here.
      </ThemedText>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    fontSize: 17,
    textAlign: 'center',
  },
  body: {
    textAlign: 'center',
    opacity: 0.55,
    lineHeight: 22,
    fontSize: 14,
  },
})
