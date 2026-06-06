import { StyleSheet, Text, View } from "react-native";
import type { ApplicationStatus } from "@/api/types";
import { colors, fontSize, fontWeight, radius, spacing } from "@/design-system";
import { APPLICATION_STATUS_LABELS } from "@/lib/constants";

export type { ApplicationStatus };

export interface StatusBadgeProps {
  status: ApplicationStatus;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  return (
    <View style={[styles.base, styles[status], styles[size]]}>
      <View style={[styles.dot, styles[`${status}Dot`]]} />
      <Text style={[styles.label, styles[`${status}Text`], styles[`${size}Text`]]}>{APPLICATION_STATUS_LABELS[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: "center", borderRadius: radius.full, borderWidth: 1, flexDirection: "row", gap: spacing.xs, justifyContent: "center" },
  sm: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  md: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  dot: { borderRadius: radius.full, height: 6, width: 6 },
  smText: { fontSize: fontSize.xs },
  mdText: { fontSize: fontSize.sm },
  label: { fontWeight: fontWeight.semibold },
  draft: { backgroundColor: colors.gray[100], borderColor: colors.border },
  submitted: { backgroundColor: colors.info.bg, borderColor: colors.info.border },
  under_review: { backgroundColor: colors.warning.bg, borderColor: colors.warning.border },
  approved: { backgroundColor: colors.success.bg, borderColor: colors.success.border },
  rejected: { backgroundColor: colors.error.bg, borderColor: colors.error.border },
  disbursed: { backgroundColor: colors.teal[50], borderColor: colors.teal[400] },
  draftText: { color: colors.textSecondary },
  submittedText: { color: colors.info.text },
  under_reviewText: { color: colors.warning.text },
  approvedText: { color: colors.success.text },
  rejectedText: { color: colors.error.text },
  disbursedText: { color: colors.teal[600] },
  draftDot: { backgroundColor: colors.textSecondary },
  submittedDot: { backgroundColor: colors.info.text },
  under_reviewDot: { backgroundColor: colors.warning.text },
  approvedDot: { backgroundColor: colors.success.text },
  rejectedDot: { backgroundColor: colors.error.text },
  disbursedDot: { backgroundColor: colors.teal[600] },
});
