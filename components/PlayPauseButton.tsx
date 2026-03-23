import {
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import { Pause, Play } from "lucide-react-native";
import { useEffect } from "react";
import { Pressable, useColorScheme } from "react-native";

setAudioModeAsync({ playsInSilentMode: true });

type PlayPauseButtonProps = {
  previewUrl: string | null;
  size?: number;
};

export function PlayPauseButton({
  previewUrl,
  size = 20,
}: PlayPauseButtonProps) {
  const colorScheme = useColorScheme();
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

  if (!previewUrl) return null;

  return (
    <Pressable onPress={handlePress} className="p-2 rounded-full bg-foreground">
      {isPlaying ? (
        <Pause size={size} color={colorScheme === "dark" ? "black" : "white"} />
      ) : (
        <Play size={size} color={colorScheme === "dark" ? "black" : "white"} />
      )}
    </Pressable>
  );
}
