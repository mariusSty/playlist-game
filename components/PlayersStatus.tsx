import { Avatar } from "@/components/Avatar";
import { User } from "@/types/room";
import { Text, View } from "react-native";

type PlayersStatusProps = {
  users: User[];
  validatedUserIds: string[];
  notValidatedLabel: string;
  validatedLabel: string;
};

export function PlayersStatus({
  users,
  validatedUserIds,
  notValidatedLabel,
  validatedLabel,
}: PlayersStatusProps) {
  return (
    <View className="w-full gap-2">
      <View className="flex-row gap-2">
        <Text className="text-xl text-foreground">{notValidatedLabel}</Text>
        {users
          .filter((user) => !validatedUserIds.includes(user.id))
          .map((user) => (
            <Avatar key={user.id} name={user.name} size="small" />
          ))}
      </View>
      <View className="flex-row gap-2">
        <Text className="text-xl text-foreground">{validatedLabel}</Text>
        {users
          .filter((user) => validatedUserIds.includes(user.id))
          .map((user) => (
            <Avatar key={user.id} name={user.name} size="small" />
          ))}
      </View>
    </View>
  );
}
