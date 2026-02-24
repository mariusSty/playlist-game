import { Button } from "@/components/Button";
import { ThemedTextInput } from "@/components/TextInput";
import { useJoinRoom } from "@/hooks/useRoomMutations";
import { useUserStore } from "@/stores/user-store";
import i18n from "@/utils/translation";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useState } from "react";
import { Keyboard, Pressable, Text, View } from "react-native";
import "react-native-get-random-values";
import Toast from "react-native-toast-message";

export default function Join() {
  const [pin, setPin] = useState("");
  const user = useUserStore((state) => state.user);
  const joinRoom = useJoinRoom();

  async function handlePress() {
    try {
      await joinRoom.mutateAsync({ pin, id: user.id, name: user.name });
      router.navigate(`/room/${pin}`);
    } catch {
      Toast.show({
        type: "error",
        text1: i18n.t("toast.gameNotFound.title"),
        text2: i18n.t("toast.gameNotFound.description"),
      });
    }
  }

  return (
    <Pressable
      className="items-center justify-between flex-1 m-10"
      onPress={() => Keyboard.dismiss()}
    >
      <Pressable className="self-start" onPress={() => router.navigate("/")}>
        <ArrowLeft size={24} className="text-black dark:text-white" />
      </Pressable>
      <View className="w-full gap-2">
        <Text className="text-xl font-bold dark:text-white">
          {i18n.t("joinPage.pinInputPlaceholder")}
        </Text>
        <ThemedTextInput
          value={pin}
          maxLength={6}
          onChangeText={setPin}
          keyboardType="numeric"
        />
      </View>
      <Button
        text={i18n.t("joinPage.joinButton")}
        onPress={handlePress}
        classNames="w-full"
      />
    </Pressable>
  );
}
