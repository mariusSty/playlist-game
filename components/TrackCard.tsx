import { Avatar } from "@/components/Avatar";
import { PlayPauseButton } from "@/components/PlayPauseButton";
import { Track } from "@/types/room";
import i18n from "@/utils/translation";
import { Image } from "expo-image";
import { ReactNode } from "react";
import { Text, View } from "react-native";

type TrackCardProps = {
  track: Track;
  pickedBy?: { name: string };
  header?: ReactNode;
  children?: ReactNode;
};

export function TrackCard({ track, pickedBy, header, children }: TrackCardProps) {
  return (
    <View className="w-full gap-3 p-3 border border-foreground rounded-xl">
      {pickedBy && (
        <View className="flex-row items-center gap-2">
          <Avatar name={pickedBy.name} size="small" />
          <Text className="text-base font-bold text-foreground">
            {pickedBy.name}
          </Text>
          <Text className="text-sm text-foreground">
            {i18n.t("revealPage.chose")}
          </Text>
        </View>
      )}
      {header}
      <View className="flex-row items-center gap-3">
        <View>
          <Image
            source={track.cover}
            style={{ width: 64, height: 64, borderRadius: 8 }}
            contentFit="cover"
            transition={200}
          />
          <View className="absolute inset-0 items-center justify-center">
            <PlayPauseButton previewUrl={track.previewUrl} size={16} />
          </View>
        </View>
        <View className="flex-1 gap-1">
          <Text
            className="text-base font-bold text-foreground"
            numberOfLines={1}
          >
            {track.title}
          </Text>
          <Text className="text-sm text-foreground" numberOfLines={1}>
            {track.artist}
          </Text>
          <Text className="text-xs text-foreground" numberOfLines={1}>
            {track.album}
          </Text>
        </View>
        {children}
      </View>
    </View>
  );
}
