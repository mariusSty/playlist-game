import { Keyboard, Pressable, StyleSheet, TextInput } from "react-native";

import { Button } from "@/components/Button";
import { Text } from "@/components/Themed";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useLayoutEffect, useState } from "react";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

export default function Join() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  async function handlePress() {
    let uuid = await SecureStore.getItemAsync("uuid");
    if (!uuid) {
      uuid = uuidv4();
      await SecureStore.setItemAsync("uuid", uuid);
    }
    const res = await fetch(`${apiUrl}/room/${pin}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pin, id: uuid }),
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
