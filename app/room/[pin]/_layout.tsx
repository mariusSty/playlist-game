import { useUserStore } from "@/stores/user-store";
import { socket } from "@/utils/server";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function RoomLayout() {
  const { pin } = useLocalSearchParams<{ pin: string }>();
  const userId = useUserStore((state) => state.user.id);

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.emit("room:subscribe", { pin, userId });

    return () => {
      socket.emit("room:unsubscribe", { pin });
    };
  }, [pin, userId]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
