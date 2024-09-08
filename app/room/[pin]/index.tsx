import { Button } from "@/components/Button";
import { UserContext } from "@/contexts/user-context";
import { User } from "@/types/room";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { io } from "socket.io-client";

const socket = io(`${process.env.EXPO_PUBLIC_API_URL}/rooms`);

export default function CreateRoom() {
  const [users, setUsers] = useState<User[]>([]);
  const [hostId, setHostId] = useState<string | null>(null);
  const { user } = useContext(UserContext);
  const { pin } = useLocalSearchParams();

  useEffect(() => {
    socket.emit("joinRoom", { roomCode: pin });
    socket.on("userList", ({ users, hostId }) => {
      setUsers(users);
      setHostId(hostId);
    });

    return () => {
      socket.off("userList");
    };
  }, []);

  async function handleStartGame() {
    await fetch(`${process.env.EXPO_PUBLIC_API_URL}/game`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pin,
      }),
    });
    router.navigate(`/room/${pin}/round/id/theme`);
  }

  function handleLeaveRoom() {
    if (user.uuid) {
      socket.emit("leaveRoom", { roomCode: pin, userId: user.uuid });
    }
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
      {user.uuid === hostId && (
        <View className="w-full p-6">
          <Button onPress={handleStartGame} text="Start Game" />
        </View>
      )}
    </View>
  );
}
