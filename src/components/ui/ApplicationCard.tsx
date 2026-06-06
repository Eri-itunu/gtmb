import { Pressable, StyleSheet, Text, View } from "react-native";
import type { ApplicationStatus } from "@/api/types";
import { colors, fontSize, fontWeight, radius, shadows, spacing } from "@/design-system";
import { formatNaira, formatRelativeDate } from "@/lib/formatters";
import { StatusBadge } from "./StatusBadge";

export interface ApplicationCardProps {
  id: string;
  applicantName: string;
  applicationNumber: string;
  mortgageType: string;
  propertyAddress: string;
  loanAmount: number;
  status: ApplicationStatus;
  progressPercent: number;
  nudgeText: string;
  updatedAt: string;
  onPress: () => void;
}

export function ApplicationCard({
  applicationNumber,
  mortgageType,
  loanAmount,
  status,
  progressPercent,
  nudgeText,
  updatedAt,
  onPress,
}: ApplicationCardProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.topRow}>
        <Text numberOfLines={1} style={styles.title}>{mortgageType}</Text>
        <StatusBadge status={status} size="sm" />
      </View>
      <View style={styles.metaRow}>
        <View style={styles.metaCopy}>
          <Text style={styles.amount}>{formatNaira(loanAmount)}</Text>
          <Text selectable style={styles.applicationNumber}>Ref: {applicationNumber}</Text>
        </View>
        <Text style={styles.updated}>{formatRelativeDate(updatedAt)}</Text>
      </View>
      {status === "under_review" ? (
        <View style={styles.progressWrap}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Application progress</Text>
            <Text style={styles.progressValue}>Step 3 of 5</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.max(0, Math.min(100, progressPercent))}%` }]} />
          </View>
        </View>
      ) : null}
      <Text style={[styles.nudge, status === "draft" && styles.warningNudge, (status === "approved" || status === "disbursed") && styles.successNudge]}>{nudgeText}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    gap: spacing.md,
    padding: spacing.lg,
    ...shadows.md,
  },
  pressed: { opacity: 0.88 },
  topRow: { alignItems: "flex-start", flexDirection: "row", gap: spacing.md, justifyContent: "space-between" },
  title: { color: colors.textPrimary, flex: 1, fontSize: fontSize.md, fontWeight: fontWeight.bold },
  metaRow: { alignItems: "flex-start", flexDirection: "row", gap: spacing.md, justifyContent: "space-between" },
  metaCopy: { flex: 1, gap: spacing.xs },
  amount: { color: colors.navy[700], fontSize: fontSize.lg, fontWeight: fontWeight.bold },
  applicationNumber: { color: colors.textSecondary, fontSize: fontSize.sm },
  updated: { color: colors.textSecondary, fontSize: fontSize.xs },
  progressWrap: { gap: spacing.xs },
  progressHeader: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  progressLabel: { color: colors.textSecondary, fontSize: fontSize.xs },
  progressValue: { color: colors.teal[600], fontSize: fontSize.xs, fontWeight: fontWeight.semibold },
  progressTrack: { backgroundColor: colors.gray[200], borderRadius: radius.full, height: spacing.xs, overflow: "hidden" },
  progressFill: { backgroundColor: colors.teal[600], borderRadius: radius.full, height: spacing.xs },
  nudge: { color: colors.textSecondary, fontSize: fontSize.sm },
  warningNudge: { color: colors.warning.text, fontWeight: fontWeight.semibold },
  successNudge: { color: colors.success.text, fontWeight: fontWeight.semibold },
});
