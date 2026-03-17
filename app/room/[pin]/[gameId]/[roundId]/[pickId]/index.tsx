import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { PlayersStatus } from "@/components/PlayersStatus";
import { TrackCard } from "@/components/TrackCard";
import { usePick } from "@/hooks/usePick";
import { useCancelVote, useVote } from "@/hooks/usePickMutations";
import { useRoom } from "@/hooks/useRoom";
import { roundQueryKey } from "@/hooks/useRound";
import { useUserStore } from "@/stores/user-store";
import { socket } from "@/utils/server";
import i18n from "@/utils/translation";
import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function Vote() {
  const { pin, gameId, roundId, pickId } = useLocalSearchParams();
  const user = useUserStore((state) => state.user);
  const { room } = useRoom(pin.toString());
  const { pick, isPickLoading } = usePick(pickId.toString());
  const voteMutation = useVote();
  const cancelVoteMutation = useCancelVote();
  const queryClient = useQueryClient();
  const [usersValidated, setUsersValidated] = useState<string[]>([]);
  const [selectedVoteId, setSelectedVoteId] = useState<string | null>(null);

  const hasVoted = usersValidated.includes(user.id);
  const isMutating = voteMutation.isPending || cancelVoteMutation.isPending;

  function handleVote(guessId: string) {
    setSelectedVoteId(guessId);
    voteMutation.mutate({
      pin: pin.toString(),
      pickId: pickId.toString(),
      guessId,
      userId: user.id,
    });
  }

  function handleCancelVote() {
    cancelVoteMutation.mutate({
      pin: pin.toString(),
      pickId: pickId.toString(),
      userId: user.id,
    });
  }

  useEffect(() => {
    async function onVoteUpdated({
      users,
      nextPickId,
    }: {
      users: string[];
      nextPickId: string | null;
    }) {
      setUsersValidated(users);

      // All users have voted → navigate to next pick or reveal
      if (nextPickId === null) {
        await queryClient.invalidateQueries({
          queryKey: roundQueryKey(roundId.toString()),
        });
        router.replace(`/room/${pin}/${gameId}/${roundId}/reveal`);
      }
      if (nextPickId) {
        router.replace(`/room/${pin}/${gameId}/${roundId}/${nextPickId}`);
      }
    }

    socket.on("vote:updated", onVoteUpdated);

    return () => {
      socket.off("vote:updated", onVoteUpdated);
    };
  }, [pin, gameId, roundId]);

  if (isPickLoading || !pick) {
    return <Text>Loading...</Text>;
  }

  return (
    <Container title={i18n.t("votePage.title")}>
      <TrackCard track={pick.track} />
      <View className="justify-center flex-1">
        {hasVoted ? (
          <Button
            text={i18n.t("votePage.cancelButton")}
            activeText={i18n.t("votePage.cancellingButton")}
            onPress={handleCancelVote}
            isPending={cancelVoteMutation.isPending}
            disabled={voteMutation.isPending}
          />
        ) : (
          <>
            {room?.users.map((player) => (
              <View
                key={player.id}
                className="flex-row items-center justify-between w-full py-2"
              >
                <Avatar name={player.name} />
                <Text className="text-lg dark:text-white">{player.name}</Text>
                <Button
                  text="Vote"
                  onPress={() => handleVote(player.id)}
                  isPending={
                    voteMutation.isPending && selectedVoteId === player.id
                  }
                  disabled={isMutating && selectedVoteId !== player.id}
                />
              </View>
            ))}
          </>
        )}
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
