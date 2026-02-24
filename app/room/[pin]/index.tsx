import { Button } from "@/components/Button";
import { useUserStore } from "@/stores/user-store";
import { User } from "@/types/room";
import { socket } from "@/utils/server";
import i18n from "@/utils/translation";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { DoorOpen, Star } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Toast from "react-native-toast-message";

export default function CreateRoom() {
  const [users, setUsers] = useState<User[]>([]);
  const [hostId, setHostId] = useState<string | null>(null);
  const user = useUserStore((state) => state.user);
  const { pin } = useLocalSearchParams();

  useEffect(() => {
    socket.emit("joinRoom", { pin });

    function onUserList({ users, hostId }: { users: User[]; hostId: string }) {
      setUsers(users);
      setHostId(hostId);
    }

    function onGameStarted({
      roundId,
      gameId,
    }: {
      roundId: string;
      gameId: string;
    }) {
      router.navigate(`/room/${pin}/${gameId}/${roundId}/theme`);
    }

    socket.on("userList", onUserList);
    socket.on("gameStarted", onGameStarted);

    return () => {
      socket.off("userList", onUserList);
      socket.off("gameStarted", onGameStarted);
    };
  }, [pin]);

  async function handleStartGame() {
    socket.emit("startGame", { pin });
  }

  function handleLeaveRoom() {
    socket.emit("leaveRoom", { pin, userId: user.id });
    Toast.show({
      type: "info",
      text1: i18n.t("toast.gameLeft.title"),
      text2: i18n.t("toast.gameLeft.description"),
    });
    router.navigate("/");
  }

  return (
    <View className="items-center justify-between flex-1 m-10">
      <Pressable className="self-start" onPress={handleLeaveRoom}>
        <DoorOpen size={24} className="text-black dark:text-white" />
      </Pressable>
      <Text className="text-5xl font-bold dark:text-white">PIN : {pin}</Text>
      <ScrollView className="max-h-[50%]">
        <View className="gap-7">
          {users.map((user, index) => (
            <View key={index} className="flex-row items-center w-full gap-5">
              <Image
                style={{ width: 50, height: 50, borderRadius: 5 }}
                source={`https://api.dicebear.com/8.x/fun-emoji/svg?seed=${user.name}`}
                contentFit="cover"
                transition={1000}
              />
              <Text className="text-3xl dark:text-white">{user.name}</Text>
              {user.id === hostId && (
                <Star size={24} color="gold" fill="gold" />
              )}
            </View>
          ))}
        </View>
      </ScrollView>
      {user.id === hostId && (
        <View className="w-full">
          <Button
            onPress={handleStartGame}
            text={i18n.t("startPage.startButton")}
          />
        </View>
      )}
    </View>
  );
}
