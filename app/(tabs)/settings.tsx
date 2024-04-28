import { Text, View } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";

export default function TabTwoScreen() {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-white text-xl font-bold">Tab Two</Text>
      <EditScreenInfo path="app/(tabs)/two.tsx" />
    </View>
  );
}
