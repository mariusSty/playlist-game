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
      <View className="flex-row items-center w-full">
        <View className="w-8">
          <LeaveGameButton />
        </View>
        <Text className="flex-1 text-3xl font-bold text-center dark:text-white">
          {title}
        </Text>
        <View className="w-8" />
      </View>
      <View className="justify-around flex-1 w-full">{children}</View>
    </View>
  );
}
