import { Avatar } from "@/components/Avatar";
import { Vote } from "@/types/room";
import i18n from "@/utils/translation";
import { CircleCheck, CircleX } from "lucide-react-native";
import { Text, View } from "react-native";

type VoteFeedbackProps = {
  vote: Vote;
  isCorrect: boolean;
};

export function VoteFeedback({ vote, isCorrect }: VoteFeedbackProps) {
  if (isCorrect) {
    return (
      <View className="flex-row items-center gap-2">
        <CircleCheck color="green" size={20} />
        <Text className="text-sm text-foreground">
          {i18n.t("revealPage.correctVote")}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-row items-center gap-2">
      <CircleX color="red" size={20} />
      <Text className="text-sm text-foreground">
        {i18n.t("revealPage.yourVote", { name: vote.guessedUser.name })}
      </Text>
      <Avatar name={vote.guessedUser.name} size="small" />
    </View>
  );
}
