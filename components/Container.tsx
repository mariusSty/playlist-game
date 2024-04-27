import { Text, View } from "react-native";

type ContainerProps = {
  children: React.ReactNode;
  title: string;
};

export default function Container({ children, title }: ContainerProps) {
  return (
    <View className="flex-1 items-center justify-around">
      <Text className="text-white text-3xl font-bold">{title}</Text>
      {children}
    </View>
  );
}
