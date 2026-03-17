import { Image } from "expo-image";

const sizes = {
  normal: { width: 50, height: 50, borderRadius: 5 },
  small: { width: 20, height: 20, borderRadius: 5 },
};

type AvatarProps = {
  name: string;
  size?: keyof typeof sizes;
};

export function Avatar({ name, size = "normal" }: AvatarProps) {
  return (
    <Image
      style={sizes[size]}
      source={`https://api.dicebear.com/8.x/fun-emoji/svg?seed=${name}`}
      contentFit="cover"
      transition={1000}
    />
  );
}
