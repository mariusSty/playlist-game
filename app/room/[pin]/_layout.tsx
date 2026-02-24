import { socket } from "@/utils/server";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function RoomLayout() {
  const { pin } = useLocalSearchParams();

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}
