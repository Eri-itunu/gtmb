import { ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, radius, shadows, spacing } from "@/design-system";
import { PulseBox } from "./PulseBox";

const DARK_PULSE = "rgba(255,255,255,0.26)";

export function ApplicationDetailSkeleton() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={styles.greenInsetScroll} contentContainerStyle={styles.screen} contentInsetAdjustmentBehavior="automatic">
      <View style={styles.skeletonHeader}>
        <StatusBar backgroundColor={colors.appHeader} barStyle="light-content" translucent />
        <View style={[styles.statusBarFill, { height: insets.top }]} />
        <View style={styles.detailHeaderContent}>
          <View style={styles.headerRow}>
            <PulseBox color={DARK_PULSE} width={36} height={36} borderRadius={radius.full} />
            <View style={styles.headerCopy}>
              <PulseBox color={DARK_PULSE} width={128} height={16} />
              <PulseBox color={DARK_PULSE} width={106} height={10} />
            </View>
          </View>
          <PulseBox color={DARK_PULSE} width={116} height={30} borderRadius={radius.full} />
        </View>
      </View>
      <View style={styles.stepperShell}>
        <PulseBox height={52} />
      </View>
      <View style={styles.body}>
        <SectionSkeleton rows={2} />
        <SectionSkeleton rows={6} />
        <SectionSkeleton rows={5} />
      </View>
    </ScrollView>
  );
}

function SectionSkeleton({ rows }: { rows: number }) {
  return (
    <View style={styles.card}>
      <PulseBox width={150} height={18} />
      {Array.from({ length: rows }).map((_, index) => (
        <View key={index} style={styles.skeletonRow}>
          <PulseBox width="36%" height={12} />
          <PulseBox width="42%" height={12} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  greenInsetScroll: { backgroundColor: colors.appHeader },
  screen: { backgroundColor: colors.background, flexGrow: 1 },
  skeletonHeader: { backgroundColor: colors.appHeader, overflow: "hidden" },
  statusBarFill: { backgroundColor: colors.appHeader },
  detailHeaderContent: { alignItems: "flex-start", backgroundColor: colors.appHeader, gap: spacing.lg, paddingBottom: spacing.xl, paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  headerRow: { alignItems: "center", flexDirection: "row", gap: spacing.md, justifyContent: "space-between" },
  headerCopy: { flex: 1, gap: spacing.sm },
  stepperShell: { backgroundColor: colors.surface, borderBottomColor: colors.border, borderBottomWidth: 1, padding: spacing.lg },
  body: { backgroundColor: colors.background, flexGrow: 1, gap: spacing.lg, padding: spacing.lg },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, gap: spacing.md, padding: spacing.lg, ...shadows.sm },
  skeletonRow: { alignItems: "center", borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: "row", justifyContent: "space-between", paddingVertical: spacing.xs },
});
