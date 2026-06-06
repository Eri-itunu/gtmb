import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fontSize, fontWeight, radius, spacing } from "@/design-system";

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "main" | "mainBorder";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
}

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "lg",
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
      ]}
    >
      {loading ? <ActivityIndicator color={variant === "secondary" || variant === "mainBorder" || variant === "ghost" ? colors.primary : colors.surface} /> : null}
      {!loading && leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}
      <Text style={[styles.label, labelStyles[variant]]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center",
  },
  primary: { backgroundColor: colors.primary, borderColor: colors.primary },
  secondary: { backgroundColor: colors.surface, borderColor: colors.primary },
  main: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  mainBorder: { backgroundColor: colors.surface, borderColor: colors.secondary },
  ghost: { backgroundColor: "transparent", borderColor: "transparent" },
  danger: { backgroundColor: colors.error.text, borderColor: colors.error.text },
  sm: { minHeight: 36, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  md: { minHeight: 44, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  lg: { minHeight: 52, paddingHorizontal: spacing.xl, paddingVertical: spacing.lg },
  fullWidth: { alignSelf: "stretch" },
  disabled: { opacity: 0.55 },
  pressed: { opacity: 0.85 },
  icon: { alignItems: "center", justifyContent: "center" },
  label: { fontSize: fontSize.md, fontWeight: fontWeight.semibold },
  primaryLabel: { color: colors.surface },
  secondaryLabel: { color: colors.primary },
  ghostLabel: { color: colors.navy[700] },
  mainLabel: { color: "#ffff" },
  mainBorderLabel: { color: colors.secondary },
  dangerLabel: { color: colors.surface },
});

const variantStyles = {
  primary: styles.primary,
  secondary: styles.secondary,
  ghost: styles.ghost,
  danger: styles.danger,
  main: styles.main,
  mainBorder: styles.mainBorder,
};

const labelStyles = {
  primary: styles.primaryLabel,
  secondary: styles.secondaryLabel,
  ghost: styles.ghostLabel,
  danger: styles.dangerLabel,
  main: styles.mainLabel,
  mainBorder: styles.mainBorderLabel,
};
