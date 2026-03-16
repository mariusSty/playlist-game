import { useUserStore } from "@/stores/user-store";
import { socket } from "@/utils/server";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { AppState } from "react-native";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function RoomLayout() {
  const { pin } = useLocalSearchParams<{ pin: string }>();
  const userId = useUserStore((state) => state.user.id);

  useEffect(() => {
    function subscribe() {
      socket.emit("room:subscribe", { pin, userId });
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

    socket.on("connect", subscribe);
    socket.connect();

    const subscription = AppState.addEventListener("change", onAppStateChange);

    return () => {
      subscription.remove();
      socket.off("connect", subscribe);
      socket.emit("room:unsubscribe", { pin });
      socket.disconnect();
    };
  }, [pin, userId]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
