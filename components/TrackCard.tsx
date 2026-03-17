import { Track } from "@/types/room";
import { Image } from "expo-image";
import { ReactNode } from "react";
import { Text, View } from "react-native";

type TrackCardProps = {
  track: Track;
  header?: ReactNode;
  children?: ReactNode;
};

export function TrackCard({ track, header, children }: TrackCardProps) {
  return (
    <View className="w-full gap-3 p-3 border border-black rounded-xl dark:border-white">
      {header}
      <View className="flex-row items-center gap-3">
        <Image
          source={track.cover}
          style={{ width: 64, height: 64, borderRadius: 8 }}
          contentFit="cover"
          transition={200}
        />
        <View className="flex-1 gap-1">
          <Text
            className="text-base font-bold dark:text-white"
            numberOfLines={1}
          >
            {track.title}
          </Text>
          <Text className="text-sm dark:text-white/70" numberOfLines={1}>
            {track.artist}
          </Text>
          <Text className="text-xs dark:text-white/50" numberOfLines={1}>
            {track.album}
          </Text>
        </View>
        {children}
      </View>
    </View>
  );
}
