import { Avatar } from "@/components/Avatar";
import { Pick } from "@/types/room";
import { CircleCheck, CircleX } from "lucide-react-native";
import { Text, View } from "react-native";

type PickVotersListProps = {
  pick: Pick;
};

export function PickVotersList({ pick }: PickVotersListProps) {
  const correctVoters = pick.votes.filter(
    (v) => v.guessedUser.id === pick.user.id
  );
  const incorrectVoters = pick.votes.filter(
    (v) => v.guessedUser.id !== pick.user.id
  );

  return (
    <View className="gap-2">
      {correctVoters.length > 0 && (
        <View className="flex-row items-start gap-2">
          <CircleCheck color="green" size={20} />
          <View className="flex-row flex-wrap gap-2 flex-1">
            {correctVoters.map((vote) => (
              <View key={vote.id} className="flex-row items-center gap-1">
                <Avatar name={vote.guessUser.name} size="small" />
                <Text className="text-sm text-foreground">
                  {vote.guessUser.name}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
      {incorrectVoters.length > 0 && (
        <View className="flex-row items-start gap-2">
          <CircleX color="red" size={20} />
          <View className="flex-row flex-wrap gap-2 flex-1">
            {incorrectVoters.map((vote) => (
              <View key={vote.id} className="flex-row items-center gap-1">
                <Avatar name={vote.guessUser.name} size="small" />
                <Text className="text-sm text-foreground">
                  {vote.guessUser.name}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
