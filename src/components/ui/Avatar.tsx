import { StyleSheet, Text, View } from "react-native";
import { colors, fontSize, fontWeight, radius } from "@/design-system";

export interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({ name, size = "md" }: AvatarProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <View style={[styles.base, styles[size]]}>
      <Text style={[styles.text, styles[`${size}Text`]]}>{initials || "GT"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: "center", backgroundColor: colors.navy[700], borderRadius: radius.full, justifyContent: "center" },
  sm: { height: 32, width: 32 },
  md: { height: 44, width: 44 },
  lg: { height: 64, width: 64 },
  text: { color: colors.surface, fontWeight: fontWeight.bold },
  smText: { fontSize: fontSize.xs },
  mdText: { fontSize: fontSize.md },
  lgText: { fontSize: fontSize.xl },
});
