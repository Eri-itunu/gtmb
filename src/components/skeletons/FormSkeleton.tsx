import { StyleSheet, View } from "react-native";
import { radius, spacing } from "@/design-system";
import { PulseBox } from "./PulseBox";

export function FormSkeleton() {
  return (
    <View style={styles.container}>
      <PulseBox height={52} borderRadius={radius.md} />
      <PulseBox height={52} borderRadius={radius.md} />
      <PulseBox height={52} borderRadius={radius.md} />
      <PulseBox height={52} borderRadius={radius.md} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.lg, padding: spacing.lg },
});
