import { LeaveRoomButton } from "@/components/LeaveRoomButton";
import { Stack } from "expo-router";
import { Text, View } from "react-native";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function RoomLayout() {
  return (
    <Stack
      screenOptions={{
        header: ({ options }) => (
          <View className="flex-row items-center bg-background px-4 py-2">
            <View className="w-10">
              <LeaveRoomButton />
            </View>
            <Text
              className="flex-1 text-center text-xl font-bold text-foreground"
              numberOfLines={1}
            >
              {options.title ?? ""}
            </Text>
            <View className="w-10" />
          </View>
        ),
      }}
    >
      <Stack.Screen name="[gameId]" options={{ headerShown: false }} />
    </Stack>
  );
}
