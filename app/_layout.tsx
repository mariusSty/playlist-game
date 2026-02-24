import { useColorScheme } from "@/components/useColorScheme";
import { useUserStore } from "@/stores/user-store";
import { FontAwesome6 } from "@expo/vector-icons";
import { faker } from "@faker-js/faker";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-get-random-values";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { v4 as uuidv4 } from "uuid";
import "../global.css";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome6.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const setUser = useUserStore((state) => state.setUser);
  const backgroundColor =
    colorScheme === "dark"
      ? DarkTheme.colors.background
      : DefaultTheme.colors.background;

  async function getUserInfos() {
    let uuidStored = await SecureStore.getItemAsync("uuid");
    let nameStored = await SecureStore.getItemAsync("name");
    if (!uuidStored) {
      uuidStored = uuidv4();
      await SecureStore.setItemAsync("uuid", uuidStored);
    }
    if (!nameStored) {
      nameStored = faker.animal.cat();
      await SecureStore.setItemAsync("name", nameStored);
    }
    setUser({ id: uuidStored, name: nameStored });
  }

  useEffect(() => {
    getUserInfos();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor,
      }}
    >
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        </Stack>
      </ThemeProvider>
      <Toast />
    </SafeAreaView>
  );
}
