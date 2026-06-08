import { StyleSheet, Text, View } from "react-native";
import { colors, fontSize, fontWeight, radius, spacing } from "@/design-system";

export type AutoSaveState = "saved" | "saving" | "offline" | "failed";

export interface AutoSaveStatusProps {
  state: AutoSaveState;
  onRetry?: () => void;
}

const COPY: Record<AutoSaveState, string> = {
  saved: "Saved locally",
  saving: "Saving...",
  offline: "Offline - saved on this device",
  failed: "Failed to sync - retry available",
};

export function AutoSaveStatus({ state, onRetry }: AutoSaveStatusProps) {
  return (
    <View style={[styles.container, styles[`${state}Container`]]}>
      <Text style={[styles.text, styles[`${state}Text`]]}>{COPY[state]}</Text>
      {state === "failed" && onRetry ? (
        <Text accessibilityRole="button" onPress={onRetry} style={[styles.text, styles.retryText]}>
          Retry
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: radius.full,
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  text: { fontSize: fontSize.xs, fontWeight: fontWeight.semibold },
  savedContainer: { backgroundColor: colors.success.bg },
  savedText: { color: colors.success.text },
  savingContainer: { backgroundColor: colors.info.bg },
  savingText: { color: colors.info.text },
  offlineContainer: { backgroundColor: colors.warning.bg },
  offlineText: { color: colors.warning.text },
  failedContainer: { backgroundColor: colors.error.bg },
  failedText: { color: colors.error.text },
  retryText: { color: colors.error.text, textDecorationLine: "underline" },
});
