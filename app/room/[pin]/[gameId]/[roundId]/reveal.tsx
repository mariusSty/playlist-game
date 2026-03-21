import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { TrackCard } from "@/components/TrackCard";
import { useRoom } from "@/hooks/useRoom";
import { useRound } from "@/hooks/useRound";
import { useNextRound } from "@/hooks/useRoundMutations";
import { useUserStore } from "@/stores/user-store";
import i18n from "@/utils/translation";
import * as Sentry from "@sentry/react-native";
import { useLocalSearchParams } from "expo-router";
import { CircleCheck, CircleX } from "lucide-react-native";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function Reveal() {
  const { roundId, pin, gameId } = useLocalSearchParams<{
    roundId: string;
    pin: string;
    gameId: string;
  }>();
  const { room } = useRoom(pin);
  const { round, isRoundLoading } = useRound(roundId);
  const user = useUserStore((state) => state.user);
  const nextRound = useNextRound();

  async function handleNextRound() {
    await nextRound.mutate(
      { pin, gameId, userId: user.id },
      {
        onSuccess: () => {
          Sentry.logger.info("Next round loaded", {
            pin,
            userId: user.id,
            userName: user.name,
            roundId,
          });
        },
      },
    );
  }

  if (isRoundLoading || !round) {
    return (
      <Container title={i18n.t("revealPage.title")}>
        <View className="justify-center flex-1">
          <ActivityIndicator size="large" color="#000000" />
        </View>
      </Container>
    );
  }

  return (
    <Container title={i18n.t("revealPage.title")}>
      <ScrollView contentContainerClassName="gap-8 py-4">
        {round.picks.map((pick, index) => (
          <View key={index} className="gap-2">
            {index > 0 && (
              <View className="mb-2 border-b border-black/10 dark:border-white/10" />
            )}
            <TrackCard
              track={pick.track}
              header={
                <View className="flex-row items-center gap-3">
                  <Avatar name={pick.user.name} size="small" />
                  <Text className="text-base font-bold dark:text-white">
                    {pick.user.name}
                  </Text>
                </View>
              }
            />
            <View className="gap-1 px-2">
              <View className="flex-row items-center gap-2">
                <CircleCheck color="green" size={20} />
                <View className="flex-row flex-wrap gap-2">
                  {pick.votes
                    .filter((vote) => vote.guessedUser.id === pick.user.id)
                    .map((vote) => (
                      <Avatar
                        key={vote.id}
                        name={vote.guessUser.name}
                        size="small"
                      />
                    ))}
                </View>
              </View>
              <View className="flex-row items-center gap-2">
                <CircleX color="red" size={20} />
                <View className="flex-row flex-wrap gap-2">
                  {pick.votes
                    .filter((vote) => vote.guessedUser.id !== pick.user.id)
                    .map((vote) => (
                      <Avatar
                        key={vote.id}
                        name={vote.guessUser.name}
                        size="small"
                      />
                    ))}
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      {room?.host.id === user.id && (
        <Button
          text={i18n.t("revealPage.nextRoundButton")}
          onPress={handleNextRound}
          isPending={nextRound.isPending}
        />
      )}
    </Container>
  );
}
