import { Keyboard, Pressable, StyleSheet, TextInput } from "react-native";

import { Button } from "@/components/Button";
import { Text } from "@/components/Themed";
import { router } from "expo-router";
import { useLayoutEffect, useState } from "react";

export default function Join() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  async function handlePress() {
    const res = await fetch(`${apiUrl}/room/${pin}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pin }),
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
      <TextInput
        style={[styles.textInput, error ? styles.errorTextInput : {}]}
        value={pin}
        maxLength={4}
        onChangeText={setPin}
        placeholder="Code pin..."
        placeholderTextColor="rgba(255,255,255,0.3)"
        keyboardType="numeric"
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button text="Join a room" onPress={handlePress} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    paddingHorizontal: 40,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 20,
    color: "white",
    width: "100%",
    borderColor: "white",
    textAlign: "center",
  },
  errorTextInput: {
    borderColor: "red",
  },
  error: {
    color: "red",
  },
});
