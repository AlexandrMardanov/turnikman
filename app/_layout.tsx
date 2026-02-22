import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { AppInitialization } from '@/components/shared/AppInitialization';
import { AuthProvider } from '@/contexts/AuthContext';
import { TabBarProvider } from '@/contexts/TabBarContext';
import { WeightReminderProvider } from '@/contexts/WeightReminderContext';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <AuthProvider>
        <WeightReminderProvider>
          <TabBarProvider>
            <StatusBar style='dark' />
            <AppInitialization />
            <Slot />
          </TabBarProvider>
        </WeightReminderProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
