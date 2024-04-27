import { Button } from "@/components/Button";
import { UserContext } from "@/contexts/user-context";
import { Room } from "@/types/room";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useContext } from "react";
import { ScrollView, Text, View } from "react-native";
import useSwr from "swr";

const fetcher = (...args: any[]) =>
  fetch(...(args as [RequestInfo, RequestInit])).then((res) => res.json());

export default function CreateRoom() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { user } = useContext(UserContext);

  const { pin } = useLocalSearchParams();
  const { data: room, isLoading } = useSwr<Room>(
    `${apiUrl}/room/${pin}`,
    fetcher
  );

  async function handleStartGame() {
    await fetch(`${apiUrl}/game`, {
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

  if (isLoading) {
    return (
      <View className="flex-1 justify-around items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!room) router.navigate("/room/join");

  const isHost = room?.users.find((user) => user.isHost)?.id === user.uuid;

  return (
    <View className="flex-1 justify-around items-center">
      <Text className="text-5xl font-bold text-white">PIN : {pin}</Text>
      <ScrollView className="max-h-[50%]">
        <View className="gap-7">
          {room?.users.map((user, index) => (
            <View key={index} className="flex-row items-center gap-5 w-full">
              <Image
                style={{ width: 50, height: 50, borderRadius: 5 }}
                source={`https://api.dicebear.com/8.x/fun-emoji/svg?seed=${user.name}`}
                contentFit="cover"
                transition={1000}
              />
              <Text className="text-white text-3xl">{user.name}</Text>
              {user.isHost && (
                <FontAwesome name="star" size={24} color="gold" />
              )}
            </View>
          ))}
        </View>
      </ScrollView>
      <View className="w-full px-10">
        {isHost && <Button text="Start game" onPress={handleStartGame} />}
      </View>
    </View>
  );
}
