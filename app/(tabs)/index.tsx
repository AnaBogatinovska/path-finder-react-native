import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { MapFeature } from '@/features/map'

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <MapFeature />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
