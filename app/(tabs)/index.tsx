import { Keyboard, Pressable, Text, TextInput, View } from "react-native";

import { Button } from "@/components/Button";
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
    <View className="flex-1">
      <Pressable
        className="flex-1 items-stretch justify-center p-10 gap-20"
        onPress={() => Keyboard.dismiss()}
      >
        <View className="gap-5">
          <Text className="text-5xl font-bold">Playlist Game</Text>
          <View className="flex-row items-center gap-5">
            <Image
              style={{ width: 50, height: 50, borderRadius: 5 }}
              source={`https://api.dicebear.com/8.x/fun-emoji/svg?seed=${user.name}`}
              contentFit="cover"
              transition={1000}
            />
            <TextInput
              value={nameInput}
              onChangeText={handleChangeName}
              placeholder="Your name..."
              className="border border-white flex-1 rounded-lg py-3 text-xl text-white text-center"
            />
          </View>
        </View>
        <View className="gap-5">
          <Button text="Create a room" onPress={handlePress} />
          <Link href="/room/join" asChild>
            <Button text="Join a room" />
          </Link>
        </View>
      </Pressable>
    </View>
  );
}
