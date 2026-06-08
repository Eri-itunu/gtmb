import { StyleSheet, Text, View } from "react-native";
import { colors, fontSize, fontWeight, radius, spacing } from "@/design-system";

export function DefaultEmptyState() {
  return (
    <View style={styles.container}>
      <View style={styles.illustration}>
        <View style={styles.illustrationLine} />
        <View style={[styles.illustrationLine, styles.shortLine]} />
      </View>
      <Text style={styles.title}>Nothing here yet.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", gap: spacing.md, justifyContent: "center", padding: spacing["3xl"] },
  illustration: {
    alignItems: "center",
    backgroundColor: colors.gray[100],
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    height: 88,
    justifyContent: "center",
    width: 112,
  },
  illustrationLine: { backgroundColor: colors.gray[300], borderRadius: radius.full, height: 10, width: 64 },
  shortLine: { width: 42 },
  title: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: fontWeight.semibold, textAlign: "center" },
});
