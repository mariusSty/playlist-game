import { cn } from "@/utils/cn";
import { View } from "react-native";

export type RoundPhase = "theme" | "song" | "vote" | "reveal";

const STEPS: RoundPhase[] = ["theme", "song", "vote", "reveal"];

export function RoundStepper({ currentPhase }: { currentPhase: RoundPhase }) {
  const currentIndex = STEPS.indexOf(currentPhase);

  return (
    <View className="flex-row gap-2 w-full">
      {STEPS.map((phase, index) => (
        <View
          key={phase}
          className={cn(
            "flex-1 h-1 rounded-full",
            index <= currentIndex ? "bg-foreground" : "bg-foreground/20",
          )}
        />
      ))}
    </View>
  );
}
