import { useColorScheme } from "@/components/useColorScheme";
import { User, UserContext } from "@/contexts/user-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
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
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import "react-native-get-random-values";
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
    ...FontAwesome.font,
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
  const [user, setUser] = useState<User>({ id: null, name: null });

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
    <SafeAreaView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <UserContext.Provider value={{ user, setUser }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="modal" options={{ presentation: "modal" }} />
          </Stack>
        </UserContext.Provider>
      </ThemeProvider>
    </SafeAreaView>
  );
}
