import { Button } from "@/components/Button";
import { ThemedTextInput } from "@/components/TextInput";
import { useCreateRoom } from "@/hooks/useRoomMutations";
import { useUserStore } from "@/stores/user-store";
import i18n from "@/utils/translation";
import { Image } from "expo-image";
import { Link, router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { Keyboard, Pressable, Text, View } from "react-native";
import "react-native-get-random-values";

export default function Main() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { user, setUser } = useUserStore();
  const [nameInput, setNameInput] = useState(user.name || "");
  const createRoom = useCreateRoom();

  async function handleCreateRoom() {
    const room = await createRoom.mutateAsync({
      name: user.name,
      id: user.id,
    });
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
        className="items-stretch justify-center flex-1 gap-20 p-10"
        onPress={() => Keyboard.dismiss()}
      >
        <View className="gap-5">
          <Text className="text-5xl font-bold text-black dark:text-white">
            {i18n.t("homePage.title")}
          </Text>
          <Text>{apiUrl}</Text>
          <View className="flex-row items-center gap-5">
            <Image
              style={{ width: 50, height: 50, borderRadius: 5 }}
              source={`https://api.dicebear.com/8.x/fun-emoji/svg?seed=${user.name}`}
              contentFit="cover"
              transition={1000}
            />
            <View className="flex-1">
              <ThemedTextInput
                value={nameInput}
                onChangeText={handleChangeName}
              />
            </View>
          </View>
        </View>
        <View className="gap-5">
          <Button
            text={i18n.t("homePage.createButton")}
            onPress={handleCreateRoom}
          />
          <Link href="/room/join" asChild>
            <Button text={i18n.t("homePage.joinButton")} />
          </Link>
        </View>
      </Pressable>
    </View>
  );
}
