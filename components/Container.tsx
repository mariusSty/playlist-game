import { LeaveGameButton } from "@/components/LeaveGameButton";
import { ReactNode } from "react";
import { Text, View } from "react-native";

type ContainerProps = {
  children: ReactNode;
  title: string;
};

export default function Container({ children, title }: ContainerProps) {
  return (
    <View className="items-center flex-1 gap-8 p-8">
      <View className="w-full gap-4">
        <View className="w-8">
          <LeaveGameButton />
        </View>
        <Text className="w-full text-3xl font-bold text-center text-foreground">
          {title}
        </Text>
        <View className="w-8" />
      </View>
      <View className="justify-around flex-1 w-full">{children}</View>
    </View>
  );
}
