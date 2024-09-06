import { User } from "@/types/room";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { io } from "socket.io-client";

const socket = io(`${process.env.EXPO_PUBLIC_API_URL}/rooms`);

export default function CreateRoom() {
  const [users, setUsers] = useState<User[]>([]);
  const { pin } = useLocalSearchParams();

  useEffect(() => {
    socket.emit("joinRoom", { roomCode: pin });
    socket.on("userList", ({ users }) => {
      setUsers(users);
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

  return (
    <View className="items-center justify-around flex-1">
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
              {user.isHost && (
                <FontAwesome name="star" size={24} color="gold" />
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
