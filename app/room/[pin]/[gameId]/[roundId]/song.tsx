import Container from "@/components/Container";
import { LoadingButton } from "@/components/LoadingButton";
import { PlayersStatus } from "@/components/PlayersStatus";
import { TrackCard } from "@/components/TrackCard";
import { useMusicApiSearch } from "@/hooks/usePick";
import { useCancelPick, useValidatePick } from "@/hooks/usePickMutations";
import { useRoom } from "@/hooks/useRoom";
import { useRound } from "@/hooks/useRound";
import { useUserStore } from "@/stores/user-store";
import { Track } from "@/types/room";
import i18n from "@/utils/translation";
import { useLocalSearchParams } from "expo-router";
import { Button, SearchField } from "heroui-native";
import { useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function Song() {
  const { pin, gameId, roundId } = useLocalSearchParams<{
    pin: string;
    gameId: string;
    roundId: string;
  }>();
  const [search, setSearch] = useState("");
  const { room } = useRoom(pin);
  const { round, isRoundLoading } = useRound(roundId);
  const validatePick = useValidatePick();
  const cancelPick = useCancelPick();

  const user = useUserStore((state) => state.user);

  const userPick = round?.picks?.find((p) => p.user.id === user.id);
  const usersValidated = round?.picks?.map((p) => p.user.id) ?? [];

  const { tracks = [], isTracksLoading } = useMusicApiSearch(
    userPick ? null : search,
  );

  function handleSelectTrack(track: Track) {
    validatePick.mutate(
      {
        pin,
        roundId,
        userId: user.id,
        userName: user.name,
        track: {
          id: track.id,
          title: track.title,
          artist: track.artist,
          album: track.album,
          cover: track.cover,
          previewUrl: track.previewUrl,
        },
      },
      { onError: () => setSearch("") },
    );
  }

  function handleCancelSong() {
    cancelPick.mutate(
      { pin, roundId, userId: user.id, userName: user.name },
      { onSuccess: () => setSearch("") },
    );
  }

  if (isRoundLoading || !round) {
    return (
      <View className="justify-center flex-1">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const displayTheme =
    round.customTheme ?? i18n.t(`themePage.themes.${round.theme?.key}`);

  if (!displayTheme) {
    throw new Error("Theme is missing");
  }

  return (
    <Container title={displayTheme}>
      <View className="justify-between flex-1 w-full">
        {userPick ? (
          <View className="flex-1 justify-center w-full gap-4">
            <Text className="text-xl font-bold text-foreground">
              {i18n.t("pickPage.yourSong")}
            </Text>
            <TrackCard track={userPick.track} />
            <LoadingButton
              onPress={handleCancelSong}
              isLoading={cancelPick.isPending}
            >
              <Button.Label>{i18n.t("pickPage.cancelButton")}</Button.Label>
            </LoadingButton>
          </View>
        ) : (
          <>
            <View className="w-full gap-2">
              <Text className="text-xl font-bold text-foreground">
                {i18n.t("pickPage.chooseSong")}
              </Text>
              <SearchField value={search} onChange={setSearch}>
                <SearchField.Group>
                  <SearchField.SearchIcon />
                  <SearchField.Input
                    placeholder={i18n.t("pickPage.searchPlaceholder")}
                  />
                  <SearchField.ClearButton />
                </SearchField.Group>
              </SearchField>
            </View>
            <View className="flex-1">
              {isTracksLoading ? (
                <ActivityIndicator size="large" className="my-auto" />
              ) : (
                <ScrollView className="gap-4 py-2">
                  <View className="flex-1 gap-3">
                    {tracks?.map((track) => (
                      <TrackCard key={track.id} track={track}>
                        <LoadingButton
                          onPress={() => handleSelectTrack(track)}
                          isLoading={
                            validatePick.isPending &&
                            validatePick.variables?.track?.id === track.id
                          }
                          isDisabled={
                            (validatePick.isPending &&
                              validatePick.variables?.track?.id !== track.id) ||
                            cancelPick.isPending
                          }
                        >
                          <Button.Label>
                            {i18n.t("pickPage.chooseButton")}
                          </Button.Label>
                        </LoadingButton>
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
