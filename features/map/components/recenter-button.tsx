import { StyleSheet, TouchableOpacity } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

import { ThemedText } from '@/components/themed-text'

type Props = {
  visible: boolean
  onPress: () => void
}

export function RecenterButton({ visible, onPress }: Props) {
  if (!visible) return null

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(150)}
      style={styles.wrapper}
    >
      <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.85}>
        <ThemedText style={styles.icon}>⊙</ThemedText>
        <ThemedText style={styles.label}>Recenter</ThemedText>
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  icon: {
    fontSize: 18,
    color: '#2563EB',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
})
