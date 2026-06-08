import { StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { colors, fontSize, fontWeight, spacing } from "@/design-system";
import type { AppError } from "@/types/errors";

export interface ErrorStateProps {
  error: AppError;
  onRetry: () => void;
}

const ERROR_MESSAGES: Record<AppError["kind"], string> = {
  network: "No internet connection. Check your network and try again.",
  timeout: "This is taking longer than usual. Please retry.",
  server: "Something went wrong on our end. Please try again.",
  auth: "Your session has expired. Please log in again.",
  validation: "Please check your inputs and try again.",
};

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>{ERROR_MESSAGES[error.kind]}</Text>
      <Button label="Try Again" onPress={onRetry} variant="secondary" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", gap: spacing.md, justifyContent: "center", padding: spacing["3xl"] },
  title: { color: colors.textPrimary, fontSize: fontSize.lg, fontWeight: fontWeight.bold, textAlign: "center" },
  message: { color: colors.textSecondary, fontSize: fontSize.md, textAlign: "center" },
});
