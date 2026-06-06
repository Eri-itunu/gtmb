import { ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, fontSize, radius, shadows, spacing } from "@/design-system";

export interface LoadingStateProps {
  message?: string;
  variant?: "center" | "dashboard" | "applicationDetail" | "repayments" | "profile" | "form";
}

export function LoadingState({ message = "Loading...", variant = "center" }: LoadingStateProps) {
  if (variant === "dashboard") return <DashboardSkeleton />;
  if (variant === "applicationDetail") return <ApplicationDetailSkeleton />;
  if (variant === "repayments") return <RepaymentsSkeleton />;
  if (variant === "profile") return <ProfileSkeleton />;
  if (variant === "form") return <FormSkeleton />;

  return (
    <View style={styles.container}>
      <SkeletonBlock width={96} height={12} />
      <SkeletonBlock width={180} height={12} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

function DashboardSkeleton() {
  return (
    <ScrollView contentContainerStyle={styles.screen} contentInsetAdjustmentBehavior="automatic">
      <View style={styles.tealHeader}>
        <View style={styles.headerRow}>
          <View style={styles.headerCopy}>
            <SkeletonBlock tone="dark" width={90} height={10} />
            <SkeletonBlock tone="dark" width={190} height={18} />
          </View>
          <SkeletonBlock tone="dark" width={40} height={40} radiusValue={radius.full} />
        </View>
        <View style={styles.tabRow}>
          <SkeletonBlock tone="dark" width={92} height={12} />
          <SkeletonBlock tone="dark" width={82} height={12} />
          <SkeletonBlock tone="dark" width={86} height={12} />
        </View>
      </View>
      <View style={styles.body}>
        <SkeletonBlock width="100%" height={48} />
        <View style={styles.chipRow}>
          <SkeletonBlock width={48} height={30} radiusValue={radius.full} />
          <SkeletonBlock width={74} height={30} radiusValue={radius.full} />
          <SkeletonBlock width={112} height={30} radiusValue={radius.full} />
        </View>
        <ApplicationCardSkeleton showProgress />
        <ApplicationCardSkeleton />
        <ApplicationCardSkeleton accent="success" />
      </View>
    </ScrollView>
  );
}

function ApplicationDetailSkeleton() {
  return (
    <ScrollView contentContainerStyle={styles.screen} contentInsetAdjustmentBehavior="automatic">
      <View style={styles.detailHeader}>
        <View style={styles.headerRow}>
          <SkeletonBlock tone="dark" width={36} height={36} radiusValue={radius.full} />
          <View style={styles.headerCopy}>
            <SkeletonBlock tone="dark" width={128} height={16} />
            <SkeletonBlock tone="dark" width={106} height={10} />
          </View>
        </View>
        <SkeletonBlock tone="dark" width={116} height={30} radiusValue={radius.full} />
      </View>
      <View style={styles.stepperShell}>
        <SkeletonBlock width="100%" height={52} />
      </View>
      <View style={styles.body}>
        <SectionSkeleton rows={2} />
        <SectionSkeleton rows={6} />
        <SectionSkeleton rows={5} />
      </View>
    </ScrollView>
  );
}

function RepaymentsSkeleton() {
  return (
    <ScrollView contentContainerStyle={styles.body} contentInsetAdjustmentBehavior="automatic">
      <View style={styles.pageTitleBlock}>
        <SkeletonBlock width={190} height={24} />
        <SkeletonBlock width="82%" height={14} />
      </View>
      <SectionSkeleton rows={4} />
      <SectionSkeleton rows={3} />
    </ScrollView>
  );
}

function ProfileSkeleton() {
  return (
    <ScrollView contentContainerStyle={styles.body} contentInsetAdjustmentBehavior="automatic">
      <View style={styles.profileCard}>
        <SkeletonBlock width={76} height={76} radiusValue={radius.full} />
        <SkeletonBlock width={180} height={22} />
        <SkeletonBlock width={118} height={14} />
      </View>
      <SectionSkeleton rows={3} />
    </ScrollView>
  );
}

function FormSkeleton() {
  return (
    <ScrollView contentContainerStyle={styles.screen} contentInsetAdjustmentBehavior="automatic">
      <View style={styles.detailHeader}>
        <View style={styles.headerRow}>
          <SkeletonBlock tone="dark" width={36} height={36} radiusValue={radius.full} />
          <View style={styles.headerCopy}>
            <SkeletonBlock tone="dark" width={148} height={18} />
            <SkeletonBlock tone="dark" width={82} height={10} />
          </View>
        </View>
      </View>
      <View style={styles.stepperShell}>
        <SkeletonBlock width="100%" height={52} />
      </View>
      <View style={styles.body}>
        <SectionSkeleton rows={5} />
        <View style={styles.estimateSkeleton}>
          <SkeletonBlock width={170} height={10} tone="teal" />
          <SkeletonBlock width={150} height={26} tone="teal" />
          <SkeletonBlock width="90%" height={10} tone="teal" />
        </View>
      </View>
    </ScrollView>
  );
}

function ApplicationCardSkeleton({ showProgress = false, accent }: { showProgress?: boolean; accent?: "success" }) {
  return (
    <View style={[styles.card, accent === "success" && styles.successCard]}>
      <View style={styles.topRow}>
        <View style={styles.cardCopy}>
          <SkeletonBlock width={140} height={14} />
          <SkeletonBlock width={104} height={18} />
          <SkeletonBlock width={154} height={11} />
        </View>
        <SkeletonBlock width={104} height={24} radiusValue={radius.full} />
      </View>
      {showProgress ? (
        <View style={styles.progressGroup}>
          <View style={styles.progressHeader}>
            <SkeletonBlock width={124} height={9} />
            <SkeletonBlock width={62} height={9} />
          </View>
          <SkeletonBlock width="100%" height={5} radiusValue={radius.full} />
        </View>
      ) : null}
      <SkeletonBlock width="68%" height={11} />
    </View>
  );
}

function SectionSkeleton({ rows }: { rows: number }) {
  return (
    <View style={styles.card}>
      <SkeletonBlock width={150} height={18} />
      {Array.from({ length: rows }).map((_, index) => (
        <View key={index} style={styles.skeletonRow}>
          <SkeletonBlock width="36%" height={12} />
          <SkeletonBlock width="42%" height={12} />
        </View>
      ))}
    </View>
  );
}

function SkeletonBlock({
  width,
  height,
  radiusValue = radius.md,
  tone = "light",
}: {
  width: number | `${number}%`;
  height: number;
  radiusValue?: number;
  tone?: "light" | "dark" | "teal";
}) {
  return <View style={[styles.skeleton, styles[`${tone}Skeleton`], { borderRadius: radiusValue, height, width }]} />;
}

const styles = StyleSheet.create({
  container: { alignItems: "center", gap: spacing.md, justifyContent: "center", padding: spacing["3xl"] },
  message: { color: colors.textSecondary, fontSize: fontSize.md },
  screen: { backgroundColor: colors.background, flexGrow: 1 },
  tealHeader: { backgroundColor: colors.teal[600], gap: spacing.lg, paddingBottom: spacing.lg, paddingHorizontal: spacing.xl, paddingTop: spacing["3xl"] },
  detailHeader: { alignItems: "flex-start", backgroundColor: colors.teal[600], gap: spacing.lg, paddingBottom: spacing.xl, paddingHorizontal: spacing.xl, paddingTop: spacing["3xl"] },
  headerRow: { alignItems: "center", flexDirection: "row", gap: spacing.md, justifyContent: "space-between" },
  headerCopy: { flex: 1, gap: spacing.sm },
  tabRow: { flexDirection: "row", gap: spacing.xl },
  body: { backgroundColor: colors.background, flexGrow: 1, gap: spacing.lg, padding: spacing.lg },
  chipRow: { flexDirection: "row", gap: spacing.sm },
  stepperShell: { backgroundColor: colors.surface, borderBottomColor: colors.border, borderBottomWidth: 1, padding: spacing.lg },
  pageTitleBlock: { gap: spacing.sm },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, gap: spacing.md, padding: spacing.lg, ...shadows.sm },
  successCard: { borderColor: colors.success.border },
  profileCard: { alignItems: "center", backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, gap: spacing.md, padding: spacing["2xl"], ...shadows.sm },
  topRow: { alignItems: "flex-start", flexDirection: "row", gap: spacing.md, justifyContent: "space-between" },
  cardCopy: { flex: 1, gap: spacing.sm },
  progressGroup: { gap: spacing.xs },
  progressHeader: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  skeletonRow: { alignItems: "center", borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: "row", justifyContent: "space-between", paddingVertical: spacing.xs },
  estimateSkeleton: { backgroundColor: colors.teal[50], borderRadius: radius.md, gap: spacing.sm, padding: spacing.lg },
  skeleton: { overflow: "hidden" },
  lightSkeleton: { backgroundColor: colors.gray[200] },
  darkSkeleton: { backgroundColor: "rgba(255,255,255,0.26)" },
  tealSkeleton: { backgroundColor: "rgba(13,148,136,0.18)" },
});
