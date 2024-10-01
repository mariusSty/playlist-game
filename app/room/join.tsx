import { Keyboard, Pressable, Text, TextInput, View } from "react-native";

import { Button } from "@/components/Button";
import { UserContext } from "@/contexts/user-context";
import { router } from "expo-router";
import { useContext, useLayoutEffect, useState } from "react";
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
      className="items-center justify-center flex-1 gap-5 px-10"
      onPress={() => Keyboard.dismiss()}
    >
      <View className="flex-row">
        <TextInput
          value={pin}
          maxLength={4}
          onChangeText={setPin}
          placeholder="Code pin..."
          keyboardType="numeric"
          className={`${
            error ? "border-red-500" : "border-white"
          } border flex-1 rounded-lg py-3 text-xl text-white text-center`}
        />
      </View>
      {error && <Text className="text-red-500">{error}</Text>}
      <Button text="Join a room" onPress={handlePress} />
    </Pressable>
  );
}
