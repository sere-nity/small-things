import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import HomeScreen from './index';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar 
        style="dark"           // Force light text (visible on dark backgrounds)
        // backgroundColor="purple" // Android only - try bright color
        // hidden={false}           // This should definitely be visible - hides entire status bar
        // animated={true}         
        // translucent={false}     // Android - make status bar opaque
      />
      <HomeScreen />
    </ThemeProvider>
  );
}
