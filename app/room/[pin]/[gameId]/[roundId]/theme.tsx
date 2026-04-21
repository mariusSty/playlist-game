import { Avatar } from "@/components/Avatar";
import Container from "@/components/Container";
import { useRound } from "@/hooks/useRound";
import { usePickTheme } from "@/hooks/useRoundMutations";
import { useThemes } from "@/hooks/useThemes";
import { useUserStore } from "@/stores/user-store";
import i18n from "@/utils/translation";
import { useLocalSearchParams } from "expo-router";
import { BottomSheet, Button, Input } from "heroui-native";
import { useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function RoundTheme() {
  const user = useUserStore((state) => state.user);
  const { pin, roundId } = useLocalSearchParams<{
    pin: string;
    gameId: string;
    roundId: string;
  }>();
  const { round, isRoundLoading } = useRound(roundId);
  const { themes, isThemesLoading } = useThemes();
  const pickTheme = usePickTheme();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [customValue, setCustomValue] = useState("");

  const shuffledThemes = useMemo(
    () => (themes ? [...themes].sort(() => Math.random() - 0.5) : []),
    [themes],
  );

  function handleChoose(themeId: number) {
    pickTheme.mutate({
      roundId,
      themeId,
      userId: user.id,
      userName: user.name,
      pin,
    });
  }

  function handleSubmitCustom() {
    const trimmed = customValue.trim();
    if (!trimmed) return;
    pickTheme.mutate(
      {
        roundId,
        customTheme: trimmed,
        userId: user.id,
        userName: user.name,
        pin,
      },
      {
        onSuccess: () => {
          setIsSheetOpen(false);
          setCustomValue("");
        },
      },
    );
  }

  if (isRoundLoading || !round || !round.themeMaster || isThemesLoading) {
    return (
      <Container title={i18n.t("themePage.title")}>
        <View>
          <ActivityIndicator size="large" />
        </View>
      </Container>
    );
  }

  const isThemeMaster = round.themeMaster.id === user.id;

  if (isThemeMaster) {
    return (
      <Container title={i18n.t("themePage.title")}>
        <View className="flex-1 w-full">
          <Text className="py-8 text-xl text-foreground">
            {i18n.t("themePage.themeMaster")}
          </Text>
          <ScrollView
            className="flex-1"
            contentContainerClassName="items-stretch gap-y-5"
          >
            {shuffledThemes.map((theme) => (
              <Button
                key={theme.id}
                onPress={() => handleChoose(theme.id)}
                isDisabled={
                  pickTheme.isPending &&
                  pickTheme.variables?.themeId !== theme.id
                }
              >
                <Button.Label>
                  {pickTheme.isPending &&
                  pickTheme.variables?.themeId === theme.id
                    ? i18n.t("themePage.choosingPending")
                    : i18n.t(`themePage.themes.${theme.key}`)}
                </Button.Label>
              </Button>
            ))}
          </ScrollView>
          <View className="pt-5">
            <BottomSheet isOpen={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <BottomSheet.Trigger asChild>
                <Button variant="tertiary" isDisabled={pickTheme.isPending}>
                  <Button.Label>
                    {i18n.t("themePage.addThemeButton")}
                  </Button.Label>
                </Button>
              </BottomSheet.Trigger>
              <BottomSheet.Portal>
                <BottomSheet.Overlay />
                <BottomSheet.Content>
                  <View className="gap-2 mb-6">
                    <BottomSheet.Title>
                      {i18n.t("themePage.customThemeTitle")}
                    </BottomSheet.Title>
                    <BottomSheet.Description>
                      {i18n.t("themePage.customThemeDescription")}
                    </BottomSheet.Description>
                  </View>
                  <View className="gap-4">
                    <Input
                      value={customValue}
                      onChangeText={setCustomValue}
                      placeholder={i18n.t("themePage.customThemePlaceholder")}
                      autoFocus
                      autoCorrect={false}
                      onSubmitEditing={handleSubmitCustom}
                      returnKeyType="done"
                    />
                    <Button
                      onPress={handleSubmitCustom}
                      isDisabled={!customValue.trim() || pickTheme.isPending}
                    >
                      <Button.Label>
                        {pickTheme.isPending &&
                        pickTheme.variables?.customTheme !== undefined
                          ? i18n.t("themePage.choosingPending")
                          : i18n.t("themePage.customThemeSubmit")}
                      </Button.Label>
                    </Button>
                  </View>
                </BottomSheet.Content>
              </BottomSheet.Portal>
            </BottomSheet>
          </View>
        </View>
      </Container>
    );
  }

  return (
    <Container title={i18n.t("themePage.title")}>
      <View className="items-center py-8 gap-y-2">
        <Avatar name={round.themeMaster.name} />
        <Text className="text-xl font-bold text-foreground">
          {i18n.t("themePage.waiting", {
            name: round.themeMaster.name,
          })}
        </Text>
        <Text className="text-lg text-foreground">
          {i18n.t("themePage.waitingSubtitle")}
        </Text>
      </View>
    </Container>
  );
}
