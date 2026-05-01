import { useSessionSocket } from "@/hooks/useSessionSocket";
import { useUserSession } from "@/hooks/useUserSession";
import { useUserStore } from "@/stores/user-store";
import { sessionToRoute } from "@/utils/navigation";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as Sentry from "@sentry/react-native";
import {
  focusManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Href, router, Stack, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { HeroUINativeProvider } from "heroui-native";
import { useEffect } from "react";
import type { AppStateStatus } from "react-native";
import { AppState, Platform, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";
import "../global.css";

const StyledSafeAreaView = withUniwind(SafeAreaView);

Sentry.init({
  dsn: "https://4333ae524482c6f6864321c3471f7a32@o4510985865396224.ingest.de.sentry.io/4511059969638480",

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

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

export default Sentry.wrap(function RootLayout() {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);
    return () => subscription.remove();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider>
        <QueryClientProvider client={queryClient}>
          <RootLayoutNav />
        </QueryClientProvider>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
});

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const init = useUserStore((state) => state.init);
  const isReady = useUserStore((state) => state.isReady);
  const userId = useUserStore((state) => state.user.id);
  const pathname = usePathname();
  const { userSession, isUserSessionLoading } = useUserSession(
    isReady ? userId : undefined,
  );
  const pin =
    userSession && userSession.phase !== "home" ? userSession.pin : undefined;
  useSessionSocket(userId, pin);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (!isReady || isUserSessionLoading) return;

    if (userSession) {
      const route = sessionToRoute(userSession);
      const onSiblingRanking =
        userSession.phase === "reveal" &&
        pathname ===
          `/room/${userSession.pin}/${userSession.gameId}/${userSession.roundId}/ranking`;
      if (route !== pathname && !onSiblingRanking) {
        router.replace(route as Href);
      }
    }
    SplashScreen.hideAsync();
  }, [isReady, isUserSessionLoading, userSession]);

  return (
    <StyledSafeAreaView className="flex-1 bg-background">
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
    </StyledSafeAreaView>
  );
}
