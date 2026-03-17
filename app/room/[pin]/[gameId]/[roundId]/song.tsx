import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { PlayersStatus } from "@/components/PlayersStatus";
import { ThemedTextInput } from "@/components/TextInput";
import { TrackCard } from "@/components/TrackCard";
import { useMusicApiSearch } from "@/hooks/usePick";
import { useCancelPick, useValidatePick } from "@/hooks/usePickMutations";
import { useRoom } from "@/hooks/useRoom";
import { useRound } from "@/hooks/useRound";
import { useUserStore } from "@/stores/user-store";
import { Track } from "@/types/room";
import { socket } from "@/utils/server";
import i18n from "@/utils/translation";
import * as Sentry from "@sentry/react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function Song() {
  const { pin, gameId, roundId } = useLocalSearchParams<{
    pin: string;
    gameId: string;
    roundId: string;
  }>();
  const [search, setSearch] = useState("");
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [usersValidated, setUsersValidated] = useState<string[]>([]);
  const { room } = useRoom(pin);
  const { round, isRoundLoading } = useRound(roundId);
  const validatePick = useValidatePick();
  const cancelPick = useCancelPick();

  const { tracks = [], isTracksLoading } = useMusicApiSearch(
    selectedTrack ? null : search,
  );

  const user = useUserStore((state) => state.user);

  useEffect(() => {
    function onPickUpdated({
      users,
      firstPickId,
    }: {
      users: string[];
      firstPickId?: string;
    }) {
      setUsersValidated((prev) => {
        const wasPreviouslyValidated = prev.includes(user.id);
        const isNowValidated = users.includes(user.id);

        // Only reset if the current user's own pick was cancelled
        if (wasPreviouslyValidated && !isNowValidated) {
          setSelectedTrack(null);
          setSearch("");
        }

        return users;
      });

      if (firstPickId) {
        Sentry.logger.info("All picks done, moving to vote", {
          pin,
          userId: user.id,
          userName: user.name,
          gameId,
          roundId,
          firstPickId,
        });
        router.replace(`/room/${pin}/${gameId}/${roundId}/${firstPickId}`);
      } else {
        Sentry.logger.info("Someone picked or cancelled a song", {
          pin,
          userId: user.id,
          userName: user.name,
          gameId,
          roundId,
          usersPickedCount: users.length,
        });
      }
    }

    socket.on("pick:updated", onPickUpdated);

    return () => {
      socket.off("pick:updated", onPickUpdated);
    };
  }, [pin, gameId, roundId, room, user.id]);

  async function handleSelectTrack(track: Track) {
    setSelectedTrack(track);
    setSearch(track.title + " - " + track.artist);
    Sentry.logger.info("Song picked", {
      pin,
      userId: user.id,
      userName: user.name,
      gameId,
      roundId,
      trackId: track.id,
      trackTitle: track.title,
      trackArtist: track.artist,
    });
    try {
      await validatePick.mutateAsync({
        pin,
        roundId,
        userId: user.id,
        track: {
          id: track.id,
          title: track.title,
          artist: track.artist,
          album: track.album,
          cover: track.cover,
          previewUrl: track.previewUrl,
        },
      });
    } catch (error) {
      Sentry.logger.error("Song pick failed", {
        pin,
        userId: user.id,
        userName: user.name,
        roundId,
        error: String(error),
      });
      setSelectedTrack(null);
      setSearch("");
    }
  }

  async function handleCancelSong() {
    Sentry.logger.info("Song pick cancelled", {
      pin,
      userId: user.id,
      userName: user.name,
      gameId,
      roundId,
    });
    try {
      await cancelPick.mutateAsync({
        pin,
        roundId,
        userId: user.id,
      });
    } catch (error) {
      Sentry.logger.error("Song cancel failed", {
        pin,
        userId: user.id,
        userName: user.name,
        roundId,
        error: String(error),
      });
    }
  }

  const translatedTheme = i18n.t(`themePage.themes.${round?.theme}`);

  if (isRoundLoading || !round) {
    return (
      <Container title={i18n.t("pickPage.title", { theme: "" })}>
        <View className="justify-center flex-1">
          <ActivityIndicator size="large" color="#000000" />
        </View>
      </Container>
    );
  }

  return (
    <Container title={translatedTheme}>
      <View className="justify-between flex-1 w-full">
        {selectedTrack ? (
          <View className="w-full gap-3">
            <Text className="text-xl font-bold dark:text-white">
              {i18n.t("pickPage.yourSong")}
            </Text>
            <TrackCard track={selectedTrack}>
              <Button
                text={i18n.t("pickPage.cancelButton")}
                activeText={i18n.t("pickPage.cancellingButton")}
                onPress={handleCancelSong}
                isPending={cancelPick.isPending}
              />
            </TrackCard>
          </View>
        ) : (
          <>
            <View className="w-full gap-2">
              <Text className="text-xl font-bold dark:text-white">
                {i18n.t("pickPage.chooseSong")}
              </Text>
              <ThemedTextInput value={search} onChangeText={setSearch} />
            </View>
            <View className="flex-1">
              {isTracksLoading ? (
                <ActivityIndicator
                  size="large"
                  className="my-auto text-black dark:text-white"
                />
              ) : (
                <ScrollView className="gap-4 py-2">
                  <View className="flex-1 gap-3">
                    {tracks?.map((track) => (
                      <TrackCard key={track.id} track={track}>
                        <Button
                          text={i18n.t("pickPage.chooseButton")}
                          activeText={i18n.t("pickPage.choosingButton")}
                          onPress={() => handleSelectTrack(track)}
                          isPending={
                            validatePick.isPending &&
                            search === track.title + " - " + track.artist
                          }
                          disabled={
                            validatePick.isPending || cancelPick.isPending
                          }
                        />
                      </TrackCard>
                    ))}
                  </View>
                </ScrollView>
              )}
            </View>
          </>
        )}
        <PlayersStatus
          users={room?.users ?? []}
          validatedUserIds={usersValidated}
          notValidatedLabel={i18n.t("pickPage.notChosen")}
          validatedLabel={i18n.t("pickPage.alreadyChosen")}
        />
      </View>
    </Container>
  );
}
