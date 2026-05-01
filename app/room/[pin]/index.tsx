import { Avatar } from "@/components/Avatar";
import Container from "@/components/Container";
import { LoadingButton } from "@/components/LoadingButton";
import { useStartGame } from "@/hooks/useGameMutations";
import { useRoom } from "@/hooks/useRoom";
import { useLeaveRoom } from "@/hooks/useRoomMutations";
import { useUserStore } from "@/stores/user-store";
import i18n from "@/utils/translation";
import { useLocalSearchParams } from "expo-router";
import { Button } from "heroui-native";
import { Star } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";

export default function RoomScreen() {
  const { pin } = useLocalSearchParams<{ pin: string }>();
  const user = useUserStore((state) => state.user);
  const { room } = useRoom(pin);
  const leaveRoom = useLeaveRoom();
  const startGame = useStartGame();

  function handleStartGame() {
    startGame.mutate({ pin, userId: user.id, userName: user.name });
  }

  const users = room?.users ?? [];
  const hostId = room?.host?.id;

  return (
    <Container title={`PIN : ${pin}`}>
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
          <LoadingButton
            onPress={handleStartGame}
            isLoading={startGame.isPending}
            isDisabled={leaveRoom.isPending}
          >
            <Button.Label>{i18n.t("startPage.startButton")}</Button.Label>
          </LoadingButton>
        </View>
      )}
    </Container>
  );
}
