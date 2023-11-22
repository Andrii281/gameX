import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import GyroScreen from './src';
import { MetricsProvider } from './contex/MetricsContext';

export default function App() {
  return (
    <MetricsProvider>
      <View style={styles.container}>
        <GyroScreen />
        <StatusBar style="auto" />
      </View>
    </MetricsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
