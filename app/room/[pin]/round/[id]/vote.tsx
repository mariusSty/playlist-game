import Container from "@/components/Container";
import { UserContext } from "@/contexts/user-context";
import { Pick, Room } from "@/types/room";
import { apiUrl, fetcher, socket } from "@/utils/server";
import { useLocalSearchParams } from "expo-router";
import { useContext } from "react";
import { Pressable, Text, View } from "react-native";
import useSWR from "swr";

export default function Vote() {
  const { pin, id } = useLocalSearchParams();
  const { user } = useContext(UserContext);
  const { data: room = { users: [] } } = useSWR<Room>(
    `${apiUrl}/room/${pin}`,
    fetcher
  );

  const { data } = useSWR<Pick>(`${apiUrl}/game/${pin}/pick`, fetcher);

  function handleVote(pickId: string) {
    socket.emit("vote", { pickId, userId: user.id, roundId: id });
  }

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
          <Pressable
            className="p-5 bg-white rounded-lg"
            onPress={() => handleVote(player.id)}
          >
            <Text>Vote</Text>
          </Pressable>
        </View>
      ))}
    </Container>
  );
}
