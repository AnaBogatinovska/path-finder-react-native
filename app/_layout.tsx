import { useEffect } from 'react'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'

import { useColorScheme } from '@/hooks/use-color-scheme'
import { logger } from '@/utils/logger'

export const unstable_settings = {
  anchor: '(tabs)',
}

export default function RootLayout() {
  const colorScheme = useColorScheme()

  useEffect(() => {
    // Global handler for unhandled JS errors
    const previous = ErrorUtils.getGlobalHandler()

    ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
      logger.error(`Unhandled error (fatal: ${isFatal ?? false})`, error)
      // Delegate to the default handler so RN error overlay still shows in dev
      previous(error, isFatal)
    })

    return () => {
      ErrorUtils.setGlobalHandler(previous)
    }
  }, [])

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  )
}
