import { Text, View } from "@/components/Themed";
import { StyleSheet } from "react-native";

type ContainerProps = {
  children: React.ReactNode;
  title: string;
};

export default function Container({ children, title }: ContainerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
