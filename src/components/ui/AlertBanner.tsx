import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fontSize, fontWeight, radius, spacing } from "@/design-system";

export interface AlertBannerProps {
  variant: "success" | "warning" | "error" | "info" | "amber" | "red";
  title: string;
  message?: string;
  onDismiss?: () => void;
  action?: { label: string; onPress: () => void };
}

export function AlertBanner({ variant, title, message, onDismiss, action }: AlertBannerProps) {
  const tone = toneStyles[variant];

  return (
    <View style={[styles.container, tone.container]}>
      <View style={[styles.accent, tone.accent]} />
      <View style={styles.copy}>
        <Text style={[styles.title, tone.text]}>{title}</Text>
        {message ? <Text style={[styles.message, tone.text]}>{message}</Text> : null}
        {action ? (
          <Pressable onPress={action.onPress} style={styles.action}>
            <Text style={[styles.actionText, tone.text]}>{action.label}</Text>
          </Pressable>
        ) : null}
      </View>
      {onDismiss ? (
        <Pressable accessibilityRole="button" onPress={onDismiss} style={styles.dismiss}>
          <Ionicons color={tone.iconColor} name="close" size={18} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: radius.lg, flexDirection: "row", gap: spacing.md, overflow: "hidden" },
  accent: { width: spacing.xs },
  copy: { flex: 1, gap: spacing.xs, paddingVertical: spacing.md },
  title: { fontSize: fontSize.md, fontWeight: fontWeight.bold },
  message: { fontSize: fontSize.sm },
  action: { alignSelf: "flex-start", paddingVertical: spacing.xs },
  actionText: { fontSize: fontSize.sm, fontWeight: fontWeight.bold },
  dismiss: { alignItems: "center", justifyContent: "center", paddingRight: spacing.md },
  successContainer: { backgroundColor: colors.success.bg },
  successAccent: { backgroundColor: colors.success.text },
  successText: { color: colors.success.text },
  warningContainer: { backgroundColor: colors.warning.bg },
  warningAccent: { backgroundColor: colors.warning.text },
  warningText: { color: colors.warning.text },
  errorContainer: { backgroundColor: colors.error.bg },
  errorAccent: { backgroundColor: colors.error.text },
  errorText: { color: colors.error.text },
  infoContainer: { backgroundColor: colors.info.bg },
  infoAccent: { backgroundColor: colors.info.text },
  infoText: { color: colors.info.text },
  amberContainer: { backgroundColor: colors.warning.bg },
  amberAccent: { backgroundColor: colors.primaryDark },
  amberText: { color: colors.warning.text },
  redContainer: { backgroundColor: colors.error.bg },
  redAccent: { backgroundColor: colors.error.text },
  redText: { color: colors.error.text },
});

const toneStyles = {
  success: { container: styles.successContainer, accent: styles.successAccent, text: styles.successText, iconColor: colors.success.text },
  warning: { container: styles.warningContainer, accent: styles.warningAccent, text: styles.warningText, iconColor: colors.warning.text },
  error: { container: styles.errorContainer, accent: styles.errorAccent, text: styles.errorText, iconColor: colors.error.text },
  info: { container: styles.infoContainer, accent: styles.infoAccent, text: styles.infoText, iconColor: colors.info.text },
  amber: { container: styles.amberContainer, accent: styles.amberAccent, text: styles.amberText, iconColor: colors.warning.text },
  red: { container: styles.redContainer, accent: styles.redAccent, text: styles.redText, iconColor: colors.error.text },
};
