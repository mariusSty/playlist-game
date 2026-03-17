import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { useColorScheme } from "@/components/useColorScheme";
import { useStartGame } from "@/hooks/useGameMutations";
import { roomQueryKey, useRoom } from "@/hooks/useRoom";
import { useLeaveRoom } from "@/hooks/useRoomMutations";
import { useUserStore } from "@/stores/user-store";
import { socket } from "@/utils/server";
import i18n from "@/utils/translation";
import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { DoorOpen, Star } from "lucide-react-native";
import { useEffect } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function RoomScreen() {
  const { pin } = useLocalSearchParams<{ pin: string }>();
  const user = useUserStore((state) => state.user);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const { room } = useRoom(pin);
  const leaveRoom = useLeaveRoom();
  const startGame = useStartGame();
  const queryClient = useQueryClient();

  useEffect(() => {
    function onRoomUpdated() {
      queryClient.invalidateQueries({ queryKey: roomQueryKey(pin) });
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

    socket.on("room:updated", onRoomUpdated);
    socket.on("game:started", onGameStarted);

    return () => {
      socket.off("room:updated", onRoomUpdated);
      socket.off("game:started", onGameStarted);
    };
  }, [pin, queryClient]);

  async function handleStartGame() {
    try {
      const { gameId, roundId } = await startGame.mutateAsync({ pin });
      router.navigate(`/room/${pin}/${gameId}/${roundId}/theme`);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleLeaveRoom() {
    try {
      await leaveRoom.mutateAsync({ pin, userId: user.id });
      router.navigate("/");
    } catch (error) {
      console.error(error);
    }
  }

  const users = room?.users ?? [];
  const hostId = room?.host?.id;
  const anyPending = startGame.isPending || leaveRoom.isPending;

  return (
    <View className="items-center justify-between flex-1 m-10">
      <Pressable
        className="self-start"
        onPress={handleLeaveRoom}
        disabled={anyPending}
      >
        <DoorOpen size={24} color={isDarkMode ? "white" : "black"} />
      </Pressable>
      <Text className="text-5xl font-bold dark:text-white">PIN : {pin}</Text>
      <ScrollView className="max-h-[50%]">
        <View className="gap-7">
          {users.map((user, index) => (
            <View key={index} className="flex-row items-center w-full gap-5">
              <Avatar name={user.name} />
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
            activeText={i18n.t("startPage.startingButton")}
            isPending={startGame.isPending}
            disabled={leaveRoom.isPending}
          />
        </View>
      )}
    </View>
  );
}
