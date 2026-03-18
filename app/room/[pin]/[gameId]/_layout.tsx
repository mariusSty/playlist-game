import { gamePhaseQueryKey, useGamePhase } from "@/hooks/useGamePhase";
import { gamePhaseToRoute } from "@/utils/navigation";
import { socket } from "@/utils/server";
import { useQueryClient } from "@tanstack/react-query";
import {
  Href,
  router,
  Stack,
  useLocalSearchParams,
  usePathname,
} from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function GameLayout() {
  const { pin, gameId } = useLocalSearchParams<{
    pin: string;
    gameId: string;
  }>();
  const queryClient = useQueryClient();
  const { gamePhase, isGamePhaseLoading } = useGamePhase(gameId);
  const pathname = usePathname();

  // WebSocket signals → refetch game phase
  useEffect(() => {
    function onGameStateChanged() {
      queryClient.invalidateQueries({ queryKey: gamePhaseQueryKey(gameId) });
      // Also invalidate data queries so screens show fresh data
      queryClient.invalidateQueries({ queryKey: ["round"] });
      queryClient.invalidateQueries({ queryKey: ["pick"] });
    }

    socket.on("game:stateChanged", onGameStateChanged);

    return () => {
      socket.off("game:stateChanged", onGameStateChanged);
    };
  }, [gameId, queryClient]);

  // Navigate based on game phase
  useEffect(() => {
    if (!gamePhase) return;

    const targetRoute = gamePhaseToRoute(pin, gameId, gamePhase);

    // Only navigate if we're not already on the target route
    if (pathname !== targetRoute) {
      router.replace(targetRoute as Href);
    }
  }, [gamePhase, pin, gameId, pathname]);

  if (isGamePhaseLoading && !gamePhase) {
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
