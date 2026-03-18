import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ThemedText } from '@/components/themed-text'

import type { TrackingStatus } from '../types'

type Props = {
  status: TrackingStatus
  onStart: () => void
  onStop: () => void
}

const CONFIG = {
  idle: { label: 'Start Tracking', color: '#16A34A', icon: '▶' },
  tracking: { label: 'Stop & Save', color: '#DC2626', icon: '■' },
  saving: { label: 'Saving…', color: '#6B7280', icon: null },
} as const

export function TrackingControls({ status, onStart, onStop }: Props) {
  const insets = useSafeAreaInsets()
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: withTiming(CONFIG[status].color, { duration: 250 }),
  }))

  function handlePress() {
    scale.value = withSpring(0.94, { damping: 10 }, () => {
      scale.value = withSpring(1)
    })
    if (status === 'idle') onStart()
    else if (status === 'tracking') onStop()
  }

  const isDisabled = status === 'saving'
  const { label, icon } = CONFIG[status]

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
      <TouchableOpacity
        onPress={handlePress}
        disabled={isDisabled}
        activeOpacity={0.85}
      >
        <Animated.View style={[styles.button, animatedStyle]}>
          {status === 'saving' ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <ThemedText style={styles.icon}>{icon}</ThemedText>
          )}
          <ThemedText style={styles.label}>{label}</ThemedText>
        </Animated.View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingTop: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 32,
    minWidth: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  icon: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
})
