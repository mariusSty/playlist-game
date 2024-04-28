import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View className="flex-1 items-center justify-center gap-5">
        <Text className="text-white text-xl">This screen doesn't exist.</Text>

        <Link href="/" className="mt-4 py-4">
          <Text className="text-sm text-blue-400">Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
