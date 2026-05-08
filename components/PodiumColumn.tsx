import { Avatar } from "@/components/Avatar";
import { Result } from "@/types/room";
import { formatPoints } from "@/utils/result";
import { Text, View } from "react-native";

const PODIUM_HEIGHTS = { 1: 140, 2: 100, 3: 70 } as const;
const PODIUM_MEDALS = { 1: "🥇", 2: "🥈", 3: "🥉" } as const;

type PodiumPlace = keyof typeof PODIUM_HEIGHTS;

type PodiumColumnProps = {
  result: Result;
  place: PodiumPlace;
};

export function PodiumColumn({ result, place }: PodiumColumnProps) {
  return (
    <View className="items-center gap-2 flex-1 max-w-[120px]">
      <Text className="text-3xl">{PODIUM_MEDALS[place]}</Text>
      <Avatar name={result.user.name} />
      <Text
        className="text-base font-semibold text-foreground"
        numberOfLines={1}
      >
        {result.user.name}
      </Text>
      <View
        style={{ height: PODIUM_HEIGHTS[place] }}
        className="w-full bg-foreground/10 border border-foreground/20 rounded-t-2xl items-center justify-start pt-3 gap-1"
      >
        <Text className="text-2xl font-bold text-foreground">{place}</Text>
        <Text className="text-sm text-foreground opacity-70">
          {formatPoints(result.score)}
        </Text>
      </View>
    </View>
  );
}
