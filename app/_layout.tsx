import { useColorScheme } from "@/components/useColorScheme";
import { useUserStore } from "@/stores/user-store";
import { faker } from "@faker-js/faker";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import {
  focusManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import type { AppStateStatus } from "react-native";
import { AppState, Platform } from "react-native";
import "react-native-get-random-values";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { v4 as uuidv4 } from "uuid";
import "../global.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
    },
  },
});

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);
    return () => subscription.remove();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RootLayoutNav />
    </QueryClientProvider>
  );
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
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
      <Toast />
    </SafeAreaView>
  );
}
