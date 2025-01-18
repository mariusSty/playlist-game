import { Button } from "@/components/Button";
import { ThemedTextInput } from "@/components/TextInput";
import { UserContext } from "@/contexts/user-context";
import { router } from "expo-router";
import { useContext, useLayoutEffect, useState } from "react";
import { Keyboard, Pressable, View } from "react-native";
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
      className="items-center justify-center flex-1 gap-10 px-10"
      onPress={() => Keyboard.dismiss()}
    >
      <View className="flex-row">
        <ThemedTextInput
          value={pin}
          maxLength={4}
          onChangeText={setPin}
          placeholder="Code pin..."
          keyboardType="numeric"
        />
      </View>
      <Button text="Join a room" onPress={handlePress} classNames="w-full" />
    </Pressable>
  );
}
