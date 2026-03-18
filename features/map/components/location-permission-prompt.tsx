import { Linking, StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInUp } from 'react-native-reanimated'

import { ThemedText } from '@/components/themed-text'

type Props = {
  onRequest: () => void
  isDenied?: boolean
}

export function LocationPermissionPrompt({ onRequest, isDenied = false }: Props) {
  async function openSettings() {
    await Linking.openSettings()
  }

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInUp.duration(400).springify()} style={styles.card}>
        <View style={styles.iconWrapper}>
          <ThemedText style={styles.icon}>📍</ThemedText>
        </View>

        <ThemedText type="title" style={styles.title}>
          {isDenied ? 'Location access needed' : 'Enable location'}
        </ThemedText>

        <ThemedText style={styles.body}>
          {isDenied
            ? 'Path Finder needs location access to show your position on the map. Please enable it in your device settings.'
            : 'Allow Path Finder to access your location so we can show you on the map and help you navigate.'}
        </ThemedText>

        {isDenied ? (
          <TouchableOpacity style={styles.button} onPress={openSettings} activeOpacity={0.8}>
            <ThemedText style={styles.buttonText}>Open Settings</ThemedText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={onRequest} activeOpacity={0.8}>
            <ThemedText style={styles.buttonText}>Allow Location Access</ThemedText>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#F8FAFC',
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
  },
  body: {
    textAlign: 'center',
    opacity: 0.65,
    lineHeight: 22,
    marginBottom: 28,
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
})
