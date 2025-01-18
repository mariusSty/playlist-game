import { Button } from "@/components/Button";
import { UserContext } from "@/contexts/user-context";
import { User } from "@/types/room";
import { socket } from "@/utils/server";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

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
    router.navigate("/");
  }

  return (
    <View className="items-center justify-around flex-1">
      <Pressable className="self-start m-6" onPress={handleLeaveRoom}>
        <FontAwesome name="arrow-left" size={24} color="white" />
      </Pressable>
      <Text className="text-5xl font-bold text-white">PIN : {pin}</Text>
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
              <Text className="text-3xl text-white">{user.name}</Text>
              {user.id === hostId && (
                <FontAwesome name="star" size={24} color="gold" />
              )}
            </View>
          ))}
        </View>
      </ScrollView>
      {user.id === hostId && (
        <View className="w-full p-6">
          <Button onPress={handleStartGame} text="Start Game" />
        </View>
      )}
    </View>
  );
}
