import { Avatar } from "@/components/Avatar";
import { useStartGame } from "@/hooks/useGameMutations";
import { useRoom } from "@/hooks/useRoom";
import { useLeaveRoom } from "@/hooks/useRoomMutations";
import { userSessionQueryKey } from "@/hooks/useUserSession";
import { useUserStore } from "@/stores/user-store";
import i18n from "@/utils/translation";
import * as Sentry from "@sentry/react-native";
import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { Button, CloseButton, useThemeColor } from "heroui-native";
import { DoorOpen, Star } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";

export default function RoomScreen() {
  const { pin } = useLocalSearchParams<{ pin: string }>();
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const foregroundColor = useThemeColor("foreground");
  const { room } = useRoom(pin);
  const leaveRoom = useLeaveRoom();
  const startGame = useStartGame();

  async function handleStartGame() {
    await startGame.mutate(
      { pin },
      {
        onSuccess: () => {
          Sentry.logger.info("Game started", {
            pin,
            userId: user.id,
            userName: user.name,
          });
        },
      },
    );
  }

  async function handleLeaveRoom() {
    await leaveRoom.mutate(
      { pin, userId: user.id },
      {
        onSuccess: () => {
          Sentry.logger.info("Room left", {
            pin,
            userId: user.id,
            userName: user.name,
          });
          queryClient.invalidateQueries({
            queryKey: userSessionQueryKey(user.id),
          });
          router.navigate("/");
        },
      },
    );
  }

  const users = room?.users ?? [];
  const hostId = room?.host?.id;
  const anyPending = startGame.isPending || leaveRoom.isPending;

  return (
    <View className="items-center flex-1 gap-8 m-10">
      <CloseButton onPress={handleLeaveRoom} isDisabled={anyPending}>
        <DoorOpen size={20} color={foregroundColor} />
      </CloseButton>
      <Text className="text-5xl font-bold text-foreground">PIN : {pin}</Text>
      <ScrollView
        className="flex-1 w-full"
        showsVerticalScrollIndicator={false}
      >
        {users.map((user, index) => (
          <View key={index} className="flex-row items-center w-full gap-5 my-4">
            <Avatar name={user.name} />
            <Text className="flex-1 text-3xl text-foreground text-ellipsis">
              {user.name}
            </Text>
            {user.id === hostId && <Star size={24} color="gold" fill="gold" />}
          </View>
        ))}
      </ScrollView>
      {user.id === hostId && (
        <View className="w-full">
          <Button onPress={handleStartGame} isDisabled={anyPending}>
            <Button.Label>
              {startGame.isPending
                ? i18n.t("startPage.startButtonPending")
                : i18n.t("startPage.startButton")}
            </Button.Label>
          </Button>
        </View>
      )}
    </View>
  );
}
