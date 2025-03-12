import { Button } from "@/components/Button";
import { ThemedTextInput } from "@/components/TextInput";
import { UserContext } from "@/contexts/user-context";
import i18n from "@/utils/translation";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import { useContext, useState } from "react";
import { Keyboard, Pressable, Text, View } from "react-native";
import "react-native-get-random-values";
import Toast from "react-native-toast-message";

export default function Join() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [pin, setPin] = useState("");
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

    if (room.message) {
      Toast.show({
        type: "error",
        text1: i18n.t("toast.gameNotFound.title"),
        text2: i18n.t("toast.gameNotFound.description"),
      });
    } else {
      router.navigate(`/room/${pin}`);
    }
  }

  return (
    <Pressable
      className="items-center justify-between flex-1 m-10"
      onPress={() => Keyboard.dismiss()}
    >
      <Pressable className="self-start" onPress={() => router.navigate("/")}>
        <Text className="dark:text-white">
          <FontAwesome6 name="arrow-left" size={24} />
        </Text>
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
