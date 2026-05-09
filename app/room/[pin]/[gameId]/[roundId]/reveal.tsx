import { PickVotersList } from "@/components/PickVotersList";
import { TrackCard } from "@/components/TrackCard";
import { VoteFeedback } from "@/components/VoteFeedback";
import { useRound } from "@/hooks/useRound";
import { useUserStore } from "@/stores/user-store";
import { pointsLabel } from "@/utils/result";
import { computeReveal } from "@/utils/reveal";
import i18n from "@/utils/translation";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Button } from "heroui-native";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function Reveal() {
  const { roundId, pin, gameId } = useLocalSearchParams<{
    roundId: string;
    pin: string;
    gameId: string;
  }>();
  const { round, isRoundLoading } = useRound(roundId);
  const user = useUserStore((state) => state.user);

  function handleSeeRanking() {
    router.push(`/room/${pin}/${gameId}/${roundId}/ranking`);
  }

  const { myPick, otherPicks, score } = round
    ? computeReveal(round, user.id)
    : { myPick: undefined, otherPicks: [], score: 0 };

  return (
    <View className="flex-1 p-8 justify-around">
      <Stack.Screen options={{ title: i18n.t("revealPage.title") }} />
      {isRoundLoading || !round ? (
        <View className="justify-center flex-1">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <>
          <View className="items-center py-6">
            <Text className="text-5xl font-bold text-foreground">{score}</Text>
            <Text className="text-base text-foreground mt-1">
              {pointsLabel(score)} ce tour
            </Text>
          </View>

          <ScrollView contentContainerClassName="gap-6 pb-4">
            {myPick && (
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground uppercase tracking-wide px-1">
                  {i18n.t("revealPage.yourSong")}
                </Text>
                <TrackCard
                  track={myPick.track}
                  footer={<PickVotersList pick={myPick} />}
                />
              </View>
            )}

            {otherPicks.length > 0 && (
              <View className="gap-3">
                <Text className="text-sm font-semibold text-foreground uppercase tracking-wide px-1">
                  {i18n.t("revealPage.yourVotes")}
                </Text>
                {otherPicks.map(({ pick, myVote, isCorrect }) => (
                  <TrackCard
                    key={pick.id}
                    track={pick.track}
                    pickedBy={pick.user}
                    footer={
                      myVote ? (
                        <VoteFeedback vote={myVote} isCorrect={isCorrect} />
                      ) : undefined
                    }
                  />
                ))}
              </View>
            )}
          </ScrollView>

          <Button onPress={handleSeeRanking}>
            <Button.Label>{i18n.t("revealPage.seeRankingButton")}</Button.Label>
          </Button>
        </>
      )}
    </View>
  );
}
