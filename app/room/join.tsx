import { Keyboard, Pressable, StyleSheet, TextInput } from "react-native";

import { Button } from "@/components/Button";
import { Link } from "expo-router";
import { useState } from "react";

export default function Join() {
  const [pin, setPin] = useState("");
  return (
    <Pressable style={styles.container} onPress={() => Keyboard.dismiss()}>
      <TextInput
        style={styles.textInput}
        value={pin}
        maxLength={4}
        onChangeText={setPin}
        placeholder="Code pin..."
        placeholderTextColor="rgba(255,255,255,0.3)"
        keyboardType="numeric"
      />
      <Link href="/room/id/" asChild>
        <Button text="Join a room" />
      </Link>
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
});
