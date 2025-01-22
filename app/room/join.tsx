import { Button } from "@/components/Button";
import { ThemedTextInput } from "@/components/TextInput";
import { UserContext } from "@/contexts/user-context";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { useContext, useLayoutEffect, useState } from "react";
import { Keyboard, Pressable, Text, View } from "react-native";
import "react-native-get-random-values";

export default function Join() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const { user } = useContext(UserContext);

  async function handlePress() {
    const res = await fetch(`${apiUrl}/room/${pin}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pin, id: user.id, name: user.name }),
    });
    const room = await res.json();

    if (room.message) return setError(room.message);
    router.navigate(`/room/${pin}`);
  }

  useLayoutEffect(() => {
    if (error) setError("");
  }, []);

  return (
    <Pressable
      className="items-center justify-between flex-1 m-10"
      onPress={() => Keyboard.dismiss()}
    >
      <Pressable className="self-start" onPress={() => router.navigate("/")}>
        <Text className="dark:text-white">
          <FontAwesome name="arrow-left" size={24} />
        </Text>
      </Pressable>
      <View className="w-full gap-2">
        <Text className="text-xl font-bold dark:text-white">Game PIN</Text>
        <ThemedTextInput
          value={pin}
          maxLength={4}
          onChangeText={setPin}
          keyboardType="numeric"
        />
      </View>
      <Button text="Join game" onPress={handlePress} classNames="w-full" />
    </Pressable>
  );
}
