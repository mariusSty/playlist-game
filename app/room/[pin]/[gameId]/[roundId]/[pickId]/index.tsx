import { Avatar } from "@/components/Avatar";
import { LoadingButton } from "@/components/LoadingButton";
import { PlayersStatus } from "@/components/PlayersStatus";
import { TrackCard } from "@/components/TrackCard";
import { usePick } from "@/hooks/usePick";
import { useCancelVote, useVote } from "@/hooks/usePickMutations";
import { useRoom } from "@/hooks/useRoom";
import { useUserStore } from "@/stores/user-store";
import i18n from "@/utils/translation";
import { Stack, useLocalSearchParams } from "expo-router";
import { Button } from "heroui-native";
import { ScrollView, Text, View } from "react-native";

export default function Vote() {
  const { pin, roundId, pickId } = useLocalSearchParams<{
    pin: string;
    roundId: string;
    pickId: string;
  }>();
  const user = useUserStore((state) => state.user);
  const { room } = useRoom(pin);
  const { pick } = usePick(pickId);
  const voteMutation = useVote();
  const cancelVoteMutation = useCancelVote();

  const usersValidated = pick?.votes?.map((v) => v.guessUser.id) ?? [];
  const hasVoted = usersValidated.includes(user.id);
  const userGuessedId = pick?.votes?.find((v) => v.guessUser.id === user.id)
    ?.guessedUser.id;
  const isMutating = voteMutation.isPending || cancelVoteMutation.isPending;

  function handleVote(guessId: string) {
    voteMutation.mutate({
      pin,
      roundId,
      pickId,
      guessId,
      userId: user.id,
      userName: user.name,
    });
  }

  function handleCancelVote() {
    cancelVoteMutation.mutate({
      pin,
      roundId,
      pickId,
      userId: user.id,
      userName: user.name,
    });
  }

  return (
    <View className="flex-1 p-8 justify-around">
      <Stack.Screen options={{ title: i18n.t("votePage.title") }} />
      {pick && <TrackCard track={pick.track} />}
      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {room?.users?.map((player) => (
          <View
            key={player.id}
            className="flex-row items-center w-full gap-3 py-2"
          >
            <Avatar name={player.name} />
            <Text className="flex-1 text-lg text-foreground">
              {player.name}
            </Text>
            {hasVoted ? (
              <>
                {userGuessedId === player.id && (
                  <LoadingButton
                    onPress={handleCancelVote}
                    isLoading={cancelVoteMutation.isPending}
                  >
                    <Button.Label>
                      {i18n.t("votePage.cancelButton")}
                    </Button.Label>
                  </LoadingButton>
                )}
              </>
            ) : (
              <LoadingButton
                onPress={() => handleVote(player.id)}
                isLoading={
                  voteMutation.isPending &&
                  voteMutation.variables?.guessId === player.id
                }
                isDisabled={
                  isMutating && voteMutation.variables?.guessId !== player.id
                }
              >
                <Button.Label>{i18n.t("votePage.voteButton")}</Button.Label>
              </LoadingButton>
            )}
          </View>
        ))}
      </ScrollView>
      <PlayersStatus
        users={room?.users ?? []}
        validatedUserIds={usersValidated}
        notValidatedLabel={i18n.t("votePage.notVoted")}
        validatedLabel={i18n.t("votePage.alreadyVoted")}
      />
    </View>
  );
}
