import { StyleSheet, Text, View } from "react-native";
import { colors, fontSize, fontWeight, spacing } from "@/design-system";
import { Button } from "./Button";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ title = "Something went wrong", message = "Please try again.", onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? <Button label="Retry" onPress={onRetry} variant="secondary" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", gap: spacing.md, justifyContent: "center", padding: spacing["3xl"] },
  title: { color: colors.textPrimary, fontSize: fontSize.lg, fontWeight: fontWeight.bold, textAlign: "center" },
  message: { color: colors.textSecondary, fontSize: fontSize.md, textAlign: "center" },
});
