import { StyleSheet, View } from "react-native";
import { radius, spacing } from "@/design-system";
import { PulseBox } from "./PulseBox";

export function ApplicationsListSkeleton() {
  return (
    <View style={styles.container}>
      <PulseBox height={120} borderRadius={radius.lg} />
      <PulseBox height={120} borderRadius={radius.lg} />
      <PulseBox height={120} borderRadius={radius.lg} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.md, padding: spacing.lg },
});
