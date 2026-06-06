import { StyleSheet, Text, View } from "react-native";
import { colors, fontSize, fontWeight, radius, spacing } from "@/design-system";

export interface RejectionReasonsListProps {
  reasons: { code: string; title: string; description: string }[];
}

export function RejectionReasonsList({ reasons }: RejectionReasonsListProps) {
  return (
    <View style={styles.container}>
      {reasons.map((reason) => (
        <View key={reason.code} style={styles.card}>
          <Text style={styles.title}>{reason.title}</Text>
          <Text style={styles.description}>{reason.description}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.md },
  card: {
    backgroundColor: colors.error.bg,
    borderColor: colors.error.border,
    borderLeftColor: colors.error.text,
    borderLeftWidth: spacing.xs,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  title: { color: colors.error.text, fontSize: fontSize.md, fontWeight: fontWeight.bold },
  description: { color: colors.textPrimary, fontSize: fontSize.sm },
});
