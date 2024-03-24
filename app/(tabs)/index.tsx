import { Keyboard, Pressable, StyleSheet, TextInput } from "react-native";

import { Button } from "@/components/Button";
import { Text, View } from "@/components/Themed";
import { UserContext } from "@/contexts/user-context";
import { Room } from "@/types/room";
import { Image } from "expo-image";
import { Link, router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useContext, useEffect, useState } from "react";
import "react-native-get-random-values";

export default function Main() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { user, setUser } = useContext(UserContext);
  const [nameInput, setNameInput] = useState(user.name || "");

  async function handlePress() {
    const res = await fetch(`${apiUrl}/room`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: user.name, id: user.uuid }),
    });
    const room: Room = await res.json();
    router.navigate(`/room/${room.pin}`);
  }

  async function handleChangeName(name: string) {
    setNameInput(name);
    setUser({ ...user, name });
    await SecureStore.setItemAsync("name", name);
  }

  useEffect(() => {
    setNameInput(user.name || "");
  }, [user.name]);

  return (
    <Pressable style={styles.container} onPress={() => Keyboard.dismiss()}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Playlist Game</Text>
        <View style={styles.nameContainer}>
          <Image
            style={styles.image}
            source={`https://api.dicebear.com/8.x/fun-emoji/svg?seed=${user.name}`}
            contentFit="cover"
            transition={1000}
          />
          <TextInput
            style={styles.textInput}
            value={nameInput}
            onChangeText={handleChangeName}
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
        <Button text="Create a room" onPress={handlePress} />
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
    alignItems: "stretch",
    justifyContent: "center",
    gap: 20,
    padding: 40,
  },
  titleContainer: {
    gap: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  nameText: {
    fontSize: 20,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    fontSize: 20,
    color: "white",
    borderColor: "white",
    textAlign: "center",
    flex: 1,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  separator: {
    marginVertical: 30,
    height: 1,
  },
  buttonsContainer: {
    gap: 20,
  },
});
