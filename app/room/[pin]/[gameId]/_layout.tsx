import { LeaveRoomButton } from "@/components/LeaveRoomButton";
import { Stack } from "expo-router";
import { useThemeColor } from "heroui-native";

export default function GameLayout() {
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
    />
  );
}
