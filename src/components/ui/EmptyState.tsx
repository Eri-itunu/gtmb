import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fontSize, fontWeight, spacing } from "@/design-system";
import { Button } from "./Button";

export interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: ReactNode;
  action?: { label: string; onPress: () => void };
}

export function EmptyState({ title, message, icon, action }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {action ? <Button label={action.label} onPress={action.onPress} variant="secondary" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", gap: spacing.md, justifyContent: "center", padding: spacing["3xl"] },
  icon: { alignItems: "center", justifyContent: "center" },
  title: { color: colors.textPrimary, fontSize: fontSize.lg, fontWeight: fontWeight.bold, textAlign: "center" },
  message: { color: colors.textSecondary, fontSize: fontSize.md, textAlign: "center" },
});
