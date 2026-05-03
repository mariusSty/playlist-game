import { useTrackPreview } from "@/hooks/useTrackPreview";
import {
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import { useThemeColor } from "heroui-native";
import { Pause, Play } from "lucide-react-native";
import { useEffect } from "react";
import { ActivityIndicator, Pressable } from "react-native";

setAudioModeAsync({ playsInSilentMode: true });

type PlayPauseButtonProps = {
  trackId: string | null;
  size?: number;
};

export function PlayPauseButton({ trackId, size = 20 }: PlayPauseButtonProps) {
  const backgroundColor = useThemeColor("background");
  const { previewUrl, isPreviewLoading } = useTrackPreview(trackId);
  const player = useAudioPlayer(previewUrl);
  const status = useAudioPlayerStatus(player);
  const isPlaying = status.playing;

  useEffect(() => {
    if (status.didJustFinish) {
      player.seekTo(0);
    }
  }, [status.didJustFinish]);

  function handlePress() {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  }

  if (!trackId) return null;

  return (
    <Pressable
      onPress={handlePress}
      disabled={isPreviewLoading || !previewUrl}
      className="p-2 rounded-full bg-foreground"
    >
      {isPreviewLoading ? (
        <ActivityIndicator size={size} color={backgroundColor} />
      ) : isPlaying ? (
        <Pause size={size} color={backgroundColor} />
      ) : (
        <Play size={size} color={backgroundColor} />
      )}
    </Pressable>
  );
}
