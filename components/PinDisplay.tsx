import i18n from "@/utils/translation";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { CloseButton, useThemeColor } from "heroui-native";
import { Check, Copy, Share2 } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Share, Text, View } from "react-native";

type PinDisplayProps = {
  pin: string;
};

export function PinDisplay({ pin }: PinDisplayProps) {
  const foregroundColor = useThemeColor("foreground");
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  async function handleCopy() {
    await Clipboard.setStringAsync(pin);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopied(true);
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied(false), 2000);
  }

  function handleShare() {
    Share.share({ message: i18n.t("startPage.shareMessage", { pin }) ?? "" });
  }

  return (
    <View className="items-center w-full gap-2 p-4 border border-foreground rounded-xl">
      <Text className="text-sm uppercase text-foreground/70">
        {i18n.t("startPage.pinLabel")}
      </Text>
      <Text className="font-bold tracking-widest text-foreground text-6xl">
        {pin}
      </Text>
      <View className="flex-row gap-3">
        <CloseButton onPress={handleCopy} variant="ghost">
          {copied ? (
            <Check size={24} color={foregroundColor} />
          ) : (
            <Copy size={24} color={foregroundColor} />
          )}
        </CloseButton>
        <CloseButton onPress={handleShare} variant="ghost">
          <Share2 size={24} color={foregroundColor} />
        </CloseButton>
      </View>
    </View>
  );
}
