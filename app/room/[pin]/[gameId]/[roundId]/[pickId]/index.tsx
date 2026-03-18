import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { PlayersStatus } from "@/components/PlayersStatus";
import { TrackCard } from "@/components/TrackCard";
import { usePick } from "@/hooks/usePick";
import { useCancelVote, useVote } from "@/hooks/usePickMutations";
import { useRoom } from "@/hooks/useRoom";
import { useUserStore } from "@/stores/user-store";
import i18n from "@/utils/translation";
import * as Sentry from "@sentry/react-native";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function Vote() {
  const { pin, roundId, pickId } = useLocalSearchParams();
  const user = useUserStore((state) => state.user);
  const { room } = useRoom(pin.toString());
  const { pick, isPickLoading } = usePick(pickId.toString());
  const voteMutation = useVote();
  const cancelVoteMutation = useCancelVote();

  const usersValidated = pick?.votes?.map((v) => v.guessUser.id) ?? [];
  const hasVoted = usersValidated.includes(user.id);
  const userGuessedId = pick?.votes?.find((v) => v.guessUser.id === user.id)
    ?.guessedUser.id;
  const isMutating = voteMutation.isPending || cancelVoteMutation.isPending;

  function handleVote(guessId: string) {
    Sentry.logger.info("Vote cast", {
      pin: pin.toString(),
      userId: user.id,
      userName: user.name,
      roundId: roundId.toString(),
      pickId: pickId.toString(),
      guessId,
    });
    voteMutation.mutate({
      pin: pin.toString(),
      pickId: pickId.toString(),
      guessId,
      userId: user.id,
    });
  }

  function handleCancelVote() {
    Sentry.logger.info("Vote cancelled", {
      pin: pin.toString(),
      userId: user.id,
      userName: user.name,
      roundId: roundId.toString(),
      pickId: pickId.toString(),
    });
    cancelVoteMutation.mutate({
      pin: pin.toString(),
      pickId: pickId.toString(),
      userId: user.id,
    });
  }

  if (isPickLoading || !pick) {
    return <Text>Loading...</Text>;
  }

  return (
    <Container title={i18n.t("votePage.title")}>
      <TrackCard track={pick.track} />
      <View className="justify-center flex-1">
        {room?.users.map((player) => (
          <View
            key={player.id}
            className="flex-row items-center w-full gap-3 py-2"
          >
            <Avatar name={player.name} />
            <Text className="flex-1 text-lg dark:text-white">
              {player.name}
            </Text>
            {hasVoted ? (
              <>
                {userGuessedId === player.id && (
                  <Button
                    text={i18n.t("votePage.cancelButton")}
                    activeText={i18n.t("votePage.cancellingButton")}
                    onPress={handleCancelVote}
                    isPending={cancelVoteMutation.isPending}
                  />
                )}
              </>
            ) : (
              <Button
                text={i18n.t("votePage.voteButton")}
                onPress={() => handleVote(player.id)}
                isPending={
                  voteMutation.isPending &&
                  voteMutation.variables.guessId === player.id
                }
                disabled={
                  isMutating && voteMutation.variables?.guessId !== player.id
                }
              />
            )}
          </View>
        ))}
      </View>
      <PlayersStatus
        users={room?.users ?? []}
        validatedUserIds={usersValidated}
        notValidatedLabel={i18n.t("votePage.notVoted")}
        validatedLabel={i18n.t("votePage.alreadyVoted")}
      />
    </Container>
  );
}
