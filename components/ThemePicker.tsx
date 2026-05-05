import { LoadingButton } from "@/components/LoadingButton";
import { ThemeTile } from "@/components/ThemeTile";
import { usePickTheme } from "@/hooks/useRoundMutations";
import { Theme } from "@/types/room";
import { splitEmoji } from "@/utils/splitEmoji";
import i18n from "@/utils/translation";
import { useHeaderHeight } from "@react-navigation/elements";
import { Button, Input } from "heroui-native";
import { useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

type ThemePickerProps = {
  themes: Theme[];
  pin: string;
  roundId: string;
  userId: string;
  userName: string;
};

export function ThemePicker({
  themes,
  pin,
  roundId,
  userId,
  userName,
}: ThemePickerProps) {
  const pickTheme = usePickTheme();
  const headerHeight = useHeaderHeight();
  const [customValue, setCustomValue] = useState("");
  const [selectedThemeId, setSelectedThemeId] = useState<number | null>(null);
  const [isCustomSelected, setIsCustomSelected] = useState(false);
  const customInputRef = useRef<TextInput>(null);

  const shuffledThemes = useMemo(
    () => [...themes].sort(() => Math.random() - 0.5),
    [themes],
  );

  function selectTheme(id: number) {
    setSelectedThemeId(id);
    setIsCustomSelected(false);
    setCustomValue("");
    customInputRef.current?.blur();
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
        userId,
        userName,
        pin,
      });
      return;
    }
    if (selectedThemeId === null) return;
    pickTheme.mutate({
      roundId,
      themeId: selectedThemeId,
      userId,
      userName,
      pin,
    });
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
    <KeyboardAvoidingView
      className="flex-1 w-full"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={headerHeight}
    >
      <View className="items-center justify-center px-4 min-h-20">
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

      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-row flex-wrap justify-center gap-3"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {shuffledThemes.map((theme) => (
          <ThemeTile
            key={theme.id}
            theme={theme}
            isSelected={!isCustomSelected && selectedThemeId === theme.id}
            disabled={pickTheme.isPending}
            onPress={() => selectTheme(theme.id)}
          />
        ))}
      </ScrollView>

      <View className="pt-4 bg-background">
        <View className="flex-row items-center mb-4 gap-x-3">
          <View className="flex-1 h-px bg-foreground/10" />
          <Text className="text-sm text-foreground/50">
            {i18n.t("themePage.orSeparator")}
          </Text>
          <View className="flex-1 h-px bg-foreground/10" />
        </View>

        <Input
          ref={customInputRef}
          value={customValue}
          onChangeText={handleCustomChange}
          onFocus={selectCustom}
          placeholder={i18n.t("themePage.customThemePlaceholder")}
          autoCorrect={false}
          returnKeyType="done"
        />

        <View className="pt-6">
          <LoadingButton
            onPress={handleValidate}
            isLoading={pickTheme.isPending}
            isDisabled={isValidateDisabled}
          >
            <Button.Label>{i18n.t("themePage.validateButton")}</Button.Label>
          </LoadingButton>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
