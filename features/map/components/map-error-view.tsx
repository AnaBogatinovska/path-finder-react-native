import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'

import { ThemedText } from '@/components/themed-text'
import { AppError } from '@/types/errors'

type Props = {
  error: AppError
  onRetry?: () => void
}

export function MapErrorView({ error, onRetry }: Props) {
  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.container}>
      <View style={styles.iconWrapper}>
        <ThemedText style={styles.icon}>⚠️</ThemedText>
      </View>

      <ThemedText type="defaultSemiBold" style={styles.title}>
        Something went wrong
      </ThemedText>

      <ThemedText style={styles.message}>{error.message}</ThemedText>

      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.8}>
          <ThemedText style={styles.retryText}>Try Again</ThemedText>
        </TouchableOpacity>
      )}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 12,
    backgroundColor: '#F8FAFC',
  },
  iconWrapper: {
    marginBottom: 4,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 17,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    opacity: 0.6,
    lineHeight: 22,
    fontSize: 14,
  },
  retryButton: {
    marginTop: 8,
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
})
