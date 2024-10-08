import Container from "@/components/Container";
import { Pick, Room } from "@/types/room";
import { apiUrl, fetcher } from "@/utils/swr";
import { useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";
import useSWR from "swr";

export default function Vote() {
  const { pin, id } = useLocalSearchParams();
  const { data: room = { users: [] } } = useSWR<Room>(
    `${apiUrl}/room/${pin}`,
    fetcher
  );

  const { data } = useSWR<Pick>(`${apiUrl}/game/${pin}/pick`, fetcher);

  return (
    <Container title="Listen and Vote !">
      <Text className="text-white text-9xl">{data?.song.title}</Text>
      {room.users.map((player, index) => (
        <View
          key={index}
          className="flex-row items-center w-full gap-5 py-5 justify-evenly"
        >
          <Text className="text-lg text-white">{index}</Text>
          <Text className="text-lg text-white" key={index}>
            {player.name}
          </Text>
          <Pressable className="p-5 bg-white rounded-lg">
            <Text>Vote</Text>
          </Pressable>
        </View>
      ))}
    </Container>
  );
}
