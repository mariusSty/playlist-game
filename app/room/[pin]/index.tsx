import { Button } from "@/components/Button";
import { UserContext } from "@/contexts/user-context";
import { User } from "@/types/room";
import { socket } from "@/utils/server";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Toast from "react-native-toast-message";

export default function CreateRoom() {
  const [users, setUsers] = useState<User[]>([]);
  const [hostId, setHostId] = useState<string | null>(null);
  const { user } = useContext(UserContext);
  const { pin } = useLocalSearchParams();

  useEffect(() => {
    socket.emit("joinRoom", { pin });
    socket.on("userList", ({ users, hostId, pin: pinFromSocket }) => {
      if (pinFromSocket === pin) {
        setUsers(users);
        setHostId(hostId);
      }
    });
    socket.on("gameStarted", ({ roundId, gameId, pin: pinFromSocket }) => {
      if (pinFromSocket === pin) {
        router.navigate(`/room/${pin}/${gameId}/${roundId}/theme`);
      }
    });

    return () => {
      socket.off("userList");
      socket.off("gameStarted");
    };
  }, []);

  async function handleStartGame() {
    socket.emit("startGame", { pin });
  }

  function handleLeaveRoom() {
    socket.emit("leaveRoom", { pin, userId: user.id });
    Toast.show({
      type: "info",
      text1: "Game left",
      text2: "You left the game",
    });
    router.navigate("/");
  }

  return (
    <View className="items-center justify-between flex-1 m-10">
      <Pressable className="self-start" onPress={handleLeaveRoom}>
        <Text className="dark:text-white">
          <FontAwesome6 name="door-open" size={24} />
        </Text>
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
                <FontAwesome name="star" size={24} color="gold" />
              )}
            </View>
          ))}
        </View>
      </ScrollView>
      {user.id === hostId && (
        <View className="w-full">
          <Button onPress={handleStartGame} text="Start Game" />
        </View>
      )}
    </View>
  );
}
