import { Keyboard, Pressable, StyleSheet, View } from "react-native";

import { Button } from "@/components/Button";
import { Text, TextInput } from "@/components/Themed";
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
      body: JSON.stringify({ pin, id: user.uuid, name: user.name }),
    });
    const room = await res.json();
    console.log("room", room);
    if (room.message) return setError(room.message);
    router.navigate(`/room/${pin}`);
  }

  useLayoutEffect(() => {
    if (error) setError("");
  }, []);

  return (
    <Pressable style={styles.container} onPress={() => Keyboard.dismiss()}>
      <View style={styles.textInputContainer}>
        <TextInput
          value={pin}
          maxLength={4}
          onChangeText={setPin}
          placeholder="Code pin..."
          keyboardType="numeric"
        />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      <Button text="Join a room" onPress={handlePress} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    paddingHorizontal: 40,
  },
  textInputContainer: {
    flexDirection: "row",
  },
  errorTextInput: {
    borderColor: "red",
  },
  error: {
    color: "red",
  },
});
