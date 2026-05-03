import { Avatar } from "@/components/Avatar";
import Container from "@/components/Container";
import { TrackCard } from "@/components/TrackCard";
import { useRound } from "@/hooks/useRound";
import { useUserStore } from "@/stores/user-store";
import i18n from "@/utils/translation";
import { router, useLocalSearchParams } from "expo-router";
import { Button } from "heroui-native";
import { CircleCheck, CircleX } from "lucide-react-native";
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

  if (isRoundLoading || !round) {
    return (
      <Container title={i18n.t("revealPage.title")}>
        <View className="justify-center flex-1">
          <ActivityIndicator size="large" />
        </View>
      </Container>
    );
  }

  const myPick = round.picks.find((p) => p.user.id === user.id);
  const otherPicks = round.picks.filter((p) => p.user.id !== user.id);

  const score = round.picks.reduce((acc, pick) => {
    const myVote = pick.votes.find((v) => v.guessUser.id === user.id);
    return myVote?.guessedUser.id === pick.user.id ? acc + 1 : acc;
  }, 0);

  return (
    <Container title={i18n.t("revealPage.title")}>
      <View className="items-center py-6">
        <Text className="text-5xl font-bold text-foreground">{score}</Text>
        <Text className="text-base text-foreground mt-1">
          {score <= 1 ? "point" : "points"} ce tour
        </Text>
      </View>

      <ScrollView contentContainerClassName="gap-6 pb-4">
        {myPick && (
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground uppercase tracking-wide px-1">
              {i18n.t("revealPage.yourSong")}
            </Text>
            <TrackCard track={myPick.track} />
          </View>
        )}

        {otherPicks.length > 0 && (
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground uppercase tracking-wide px-1">
              {i18n.t("revealPage.yourVotes")}
            </Text>
            {otherPicks.map((pick) => {
              const myVote = pick.votes.find((v) => v.guessUser.id === user.id);
              const isCorrect = myVote?.guessedUser.id === pick.user.id;

              return (
                <View key={pick.id} className="gap-2">
                  <TrackCard track={pick.track} pickedBy={pick.user} />
                  {myVote && (
                    <View className="flex-row items-center gap-2 px-2">
                      {isCorrect ? (
                        <>
                          <CircleCheck color="green" size={20} />
                          <Text className="text-sm text-foreground">
                            {i18n.t("revealPage.correctVote")}
                          </Text>
                        </>
                      ) : (
                        <>
                          <CircleX color="red" size={20} />
                          <Text className="text-sm text-foreground">
                            {i18n.t("revealPage.yourVote", {
                              name: myVote.guessedUser.name,
                            })}
                          </Text>
                          <Avatar name={myVote.guessedUser.name} size="small" />
                        </>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      <Button onPress={handleSeeRanking}>
        <Button.Label>{i18n.t("revealPage.seeRankingButton")}</Button.Label>
      </Button>
    </Container>
  );
}
