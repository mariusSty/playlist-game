import { Keyboard, Pressable, StyleSheet, TextInput } from "react-native";

import { Button } from "@/components/Button";
import { Text, View } from "@/components/Themed";
import { Link } from "expo-router";
import { useState } from "react";

export default function Main() {
  const [name, setName] = useState("");

  return (
    <Pressable style={styles.container} onPress={() => Keyboard.dismiss()}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Playlist Game</Text>
        <View style={styles.nameContainer}>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder="Your name ..."
            placeholderTextColor="rgba(255,255,255,0.3)"
          />
        </View>
      </View>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View style={styles.buttonsContainer}>
        <Link href="/room/id/" asChild>
          <Button text="Create a room" />
        </Link>
        <Link href="/room/join" asChild>
          <Button text="Join a room" />
        </Link>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  titleContainer: {
    gap: 20,
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  nameText: {
    fontSize: 20,
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
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  buttonsContainer: {
    gap: 20,
    width: "100%",
    paddingHorizontal: 40,
  },
});
