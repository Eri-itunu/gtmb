import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { FlatList, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, fontSize, fontWeight, radius, shadows, spacing } from "@/design-system";

interface DropdownFieldProps {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

export function DropdownField({ label, value, options, onSelect, placeholder = "Select an option", required = false, error }: DropdownFieldProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (selectedValue: string) => {
    onSelect(selectedValue);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>
      <TouchableOpacity accessibilityRole="button" activeOpacity={0.78} onPress={() => setIsOpen(true)} style={[styles.field, error && styles.fieldError]}>
        <Text numberOfLines={1} style={[styles.value, !value && styles.placeholder]}>{value || placeholder}</Text>
        <Ionicons color={colors.textSecondary} name="chevron-down" size={18} />
      </TouchableOpacity>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Modal animationType="slide" onRequestClose={() => setIsOpen(false)} transparent visible={isOpen}>
        <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
          <Pressable style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const isSelected = item === value;
                return (
                  <TouchableOpacity activeOpacity={0.78} onPress={() => handleSelect(item)} style={styles.option}>
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{item}</Text>
                    {isSelected ? <Ionicons color={colors.teal[600]} name="checkmark" size={20} /> : null}
                  </TouchableOpacity>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  label: { color: colors.textPrimary, fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
  required: { color: colors.error.text },
  field: {
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
  fieldError: { borderColor: colors.error.text },
  value: { color: colors.textPrimary, flex: 1, fontSize: fontSize.md },
  placeholder: { color: colors.textDisabled },
  error: { color: colors.error.text, fontSize: fontSize.sm },
  overlay: { backgroundColor: "rgba(0,0,0,0.5)", flex: 1, justifyContent: "flex-end" },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "72%",
    paddingBottom: spacing["2xl"],
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    ...shadows.lg,
  },
  sheetHandle: { alignSelf: "center", backgroundColor: colors.gray[300], borderRadius: radius.full, height: 4, marginBottom: spacing.lg, width: 44 },
  sheetTitle: { color: colors.textPrimary, fontSize: fontSize.lg, fontWeight: fontWeight.bold, marginBottom: spacing.sm },
  option: { alignItems: "center", borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: "row", justifyContent: "space-between", minHeight: 52, paddingVertical: spacing.md },
  optionText: { color: colors.textPrimary, flex: 1, fontSize: fontSize.md },
  optionTextSelected: { color: colors.teal[600], fontWeight: fontWeight.bold },
});
