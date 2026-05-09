import { GameHeader } from "@/components/GameHeader";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function GameLayout() {
  return (
    <View className="flex-1 bg-background">
      <GameHeader />
      <View className="flex-1">
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </View>
  );
}
