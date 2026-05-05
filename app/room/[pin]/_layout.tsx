import { LeaveRoomButton } from "@/components/LeaveRoomButton";
import { Stack } from "expo-router";
import { useThemeColor } from "heroui-native";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function RoomLayout() {
  const backgroundColor = useThemeColor("background");
  const foregroundColor = useThemeColor("foreground");
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor },
        headerTintColor: foregroundColor,
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerLeft: () => <LeaveRoomButton />,
      }}
    >
      <Stack.Screen name="[gameId]" options={{ headerShown: false }} />
    </Stack>
  );
}
