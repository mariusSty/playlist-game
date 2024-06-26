import { StatusBar } from "expo-status-bar";
import { Platform, Text, View } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";

export default function ModalScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-white text-xl font-bold">Modal</Text>
      <EditScreenInfo path="app/modal.tsx" />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}
