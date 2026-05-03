import { Avatar } from "@/components/Avatar";
import Container from "@/components/Container";
import { LoadingButton } from "@/components/LoadingButton";
import { useRound } from "@/hooks/useRound";
import { usePickTheme } from "@/hooks/useRoundMutations";
import { useThemes } from "@/hooks/useThemes";
import { useUserStore } from "@/stores/user-store";
import i18n from "@/utils/translation";
import { useLocalSearchParams } from "expo-router";
import { Button, Input } from "heroui-native";
import { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

function splitEmoji(label: string): { emoji: string; text: string } {
  const idx = label.indexOf(" ");
  if (idx === -1) return { emoji: "", text: label };
  return { emoji: label.slice(0, idx), text: label.slice(idx + 1) };
}

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
  const [customValue, setCustomValue] = useState("");
  const [selectedThemeId, setSelectedThemeId] = useState<number | null>(null);
  const [isCustomSelected, setIsCustomSelected] = useState(false);

  const shuffledThemes = useMemo(
    () => (themes ? [...themes].sort(() => Math.random() - 0.5) : []),
    [themes],
  );

  function selectTheme(id: number) {
    setSelectedThemeId(id);
    setIsCustomSelected(false);
    setCustomValue("");
  }

  function selectCustom() {
    setSelectedThemeId(null);
    setIsCustomSelected(true);
  }

  function handleCustomChange(value: string) {
    setCustomValue(value);
    if (!isCustomSelected) selectCustom();
  }

  function handleValidate() {
    if (isCustomSelected) {
      const trimmed = customValue.trim();
      if (!trimmed) return;
      pickTheme.mutate({
        roundId,
        customTheme: trimmed,
        userId: user.id,
        userName: user.name,
        pin,
      });
      return;
    }
    if (selectedThemeId === null) return;
    pickTheme.mutate({
      roundId,
      themeId: selectedThemeId,
      userId: user.id,
      userName: user.name,
      pin,
    });
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

  if (!isThemeMaster) {
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

  const selectedTheme = shuffledThemes.find((t) => t.id === selectedThemeId);
  const trimmedCustom = customValue.trim();
  const previewLabel = isCustomSelected
    ? trimmedCustom || null
    : selectedTheme
      ? splitEmoji(i18n.t(`themePage.themes.${selectedTheme.key}`)).text
      : null;
  const isValidateDisabled =
    pickTheme.isPending ||
    (isCustomSelected ? !trimmedCustom : selectedThemeId === null);

  return (
    <Container title={i18n.t("themePage.title")}>
      <View className="flex-1 w-full">
        <View className="items-center justify-center px-4 py-6 min-h-28">
          <Text
            className={
              previewLabel
                ? "text-2xl font-bold text-center text-foreground"
                : "text-lg text-center text-foreground/50"
            }
          >
            {previewLabel ?? i18n.t("themePage.selectPrompt")}
          </Text>
        </View>

        <View className="flex-row flex-wrap justify-center gap-3">
          {shuffledThemes.map((theme) => {
            const { emoji } = splitEmoji(
              i18n.t(`themePage.themes.${theme.key}`),
            );
            const isSelected =
              !isCustomSelected && selectedThemeId === theme.id;
            return (
              <Pressable
                key={theme.id}
                onPress={() => selectTheme(theme.id)}
                disabled={pickTheme.isPending}
                className={`w-[22%] aspect-square rounded-2xl border-2 ${
                  isSelected
                    ? "border-foreground bg-foreground/10"
                    : "border-foreground/10 bg-foreground/5"
                }`}
              >
                <View className="items-center justify-center flex-1">
                  <Text>{emoji}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View className="w-full h-px my-6 bg-foreground/10" />

        <Input
          value={customValue}
          onChangeText={handleCustomChange}
          onFocus={selectCustom}
          placeholder={i18n.t("themePage.customThemePlaceholder")}
          autoCorrect={false}
          returnKeyType="done"
        />

        <View className="pt-6 mt-auto">
          <LoadingButton
            onPress={handleValidate}
            isLoading={pickTheme.isPending}
            isDisabled={isValidateDisabled}
          >
            <Button.Label>{i18n.t("themePage.validateButton")}</Button.Label>
          </LoadingButton>
        </View>
      </View>
    </Container>
  );
}
