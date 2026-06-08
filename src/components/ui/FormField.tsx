import type { ReactNode } from "react";
import { useState } from "react";
import type { KeyboardTypeOptions, TextInputProps } from "react-native";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { colors, fontSize, fontWeight, radius, spacing } from "@/design-system";

export interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  hint?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  editable?: boolean;
  required?: boolean;
  maxLength?: number;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  masked?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  autoCapitalize?: TextInputProps["autoCapitalize"];
  autoCorrect?: boolean;
}

export function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  hint,
  secureTextEntry,
  keyboardType,
  editable = true,
  required = false,
  maxLength,
  leftIcon,
  rightIcon,
  masked = false,
  multiline = false,
  numberOfLines,
  autoCapitalize,
  autoCorrect,
}: FormFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>
      <View style={[styles.inputShell, isFocused && editable && styles.inputShellFocused, error && styles.inputShellError, !editable && styles.inputShellDisabled]}>
        {leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}
        <TextInput
          editable={editable}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          keyboardType={keyboardType}
          maxLength={maxLength}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onBlur={() => setIsFocused(false)}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          placeholderTextColor={colors.textDisabled}
          secureTextEntry={secureTextEntry}
          style={[styles.input, multiline && styles.multilineInput]}
          value={masked ? "•".repeat(value.length) : value}
        />
        {rightIcon ? <View style={styles.icon}>{rightIcon}</View> : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!error && hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  label: { color: colors.textPrimary, fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
  required: { color: colors.error.text },
  inputShell: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  inputShellFocused: { borderColor: colors.success.text },
  inputShellError: { borderColor: colors.error.text },
  inputShellDisabled: { backgroundColor: colors.gray[100] },
  input: { color: colors.textPrimary, flex: 1, fontSize: fontSize.md, minHeight: 44 },
  multilineInput: { minHeight: 92, paddingTop: spacing.md, textAlignVertical: "top" },
  icon: { alignItems: "center", justifyContent: "center" },
  error: { color: colors.error.text, fontSize: fontSize.sm },
  hint: { color: colors.textSecondary, fontSize: fontSize.sm },
});
