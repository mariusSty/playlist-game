import { roomQueryKey } from "@/hooks/useRoom";
import { roomPhaseQueryKey, useRoomPhase } from "@/hooks/useRoomPhase";
import { useUserStore } from "@/stores/user-store";
import { socket } from "@/utils/server";
import { useQueryClient } from "@tanstack/react-query";
import { router, Stack, useLocalSearchParams, useSegments } from "expo-router";
import { useEffect, useRef } from "react";
import { AppState } from "react-native";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function RoomLayout() {
  const { pin } = useLocalSearchParams<{ pin: string }>();
  const userId = useUserStore((state) => state.user.id);
  const queryClient = useQueryClient();
  const { roomPhase } = useRoomPhase(pin);
  const segments = useSegments();
  const hasNavigated = useRef(false);

  // Socket lifecycle: connect, subscribe, reconnect
  useEffect(() => {
    function subscribe() {
      socket.emit("room:subscribe", { pin, userId });
      // On reconnect, refetch everything to resync
      queryClient.invalidateQueries();
    }

    function onAppStateChange(state: string) {
      if (state === "active") {
        if (!socket.connected) {
          socket.connect();
        } else {
          subscribe();
        }
      }
    }

    function onRoomStateChanged() {
      queryClient.invalidateQueries({ queryKey: roomPhaseQueryKey(pin) });
      queryClient.invalidateQueries({ queryKey: roomQueryKey(pin) });
    }

    socket.on("connect", subscribe);
    socket.on("room:stateChanged", onRoomStateChanged);
    socket.connect();

    const subscription = AppState.addEventListener("change", onAppStateChange);

    return () => {
      subscription.remove();
      socket.off("connect", subscribe);
      socket.off("room:stateChanged", onRoomStateChanged);
      socket.emit("room:unsubscribe", { pin });
      socket.disconnect();
    };
  }, [pin, userId, queryClient]);

  // Navigate based on room phase
  useEffect(() => {
    if (!roomPhase) return;

    const isOnLobby = segments.length <= 3; // ["room", "[pin]"] or ["room", "[pin]", "index"]

    if (roomPhase.phase === "playing" && isOnLobby) {
      // Room is playing but we're on the lobby → enter the game
      // The [gameId] layout will handle navigating to the correct game screen
      hasNavigated.current = true;
      router.replace(`/room/${pin}/${roomPhase.gameId}`);
    } else if (roomPhase.phase === "lobby" && !isOnLobby) {
      // Room is back to lobby but we're on a game screen → return to lobby
      hasNavigated.current = true;
      router.replace(`/room/${pin}`);
    }
  }, [roomPhase, segments, pin]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
