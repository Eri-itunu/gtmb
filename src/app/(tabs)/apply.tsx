import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { FormField } from "@/components/ui/FormField";
import { LoadingState } from "@/components/ui/LoadingState";
import { ProgressStepper } from "@/components/ui/ProgressStepper";
import { ScreenWrapper } from "@/components/ui/ScreenWrapper";
import { colors, fontSize, fontWeight, radius, shadows, spacing } from "@/design-system";
import { useDraftForm } from "@/hooks/useDraftForm";

export default function ApplyScreen() {
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const [form, setForm] = useState({ propertyAddress: "", loanAmount: "", monthlyIncome: "" });
  const { savedDraft, clearDraft } = useDraftForm("new", form);

  if (isLoading) return <LoadingState message="Preparing application form..." variant="form" />;
  if (error) return <ErrorState message={error} />;

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>New mortgage application</Text>
          <Text style={styles.subtitle}>Start with the property and financing basics.</Text>
        </View>
        <ProgressStepper
          steps={[
            { id: "property", label: "Property", state: "active" },
            { id: "income", label: "Income", state: "pending" },
            { id: "documents", label: "Documents", state: "pending" },
            { id: "review", label: "Review", state: "pending" },
          ]}
        />
        {savedDraft ? <AlertBanner variant="info" title="Draft autosaved" message="Your latest changes are stored locally." action={{ label: "Clear", onPress: clearDraft }} /> : null}
        <View style={styles.formCard}>
          <FormField
            label="Property address"
            onChangeText={(propertyAddress) => setForm((current) => ({ ...current, propertyAddress }))}
            placeholder="Street, city, state"
            required
            value={form.propertyAddress}
          />
          <FormField
            keyboardType="numeric"
            label="Requested loan amount"
            onChangeText={(loanAmount) => setForm((current) => ({ ...current, loanAmount }))}
            placeholder="15000000"
            required
            value={form.loanAmount}
          />
          <FormField
            keyboardType="numeric"
            label="Monthly income"
            masked
            onChangeText={(monthlyIncome) => setForm((current) => ({ ...current, monthlyIncome }))}
            placeholder="Your verified income"
            required
            value={form.monthlyIncome}
          />
          <Button label="Continue" onPress={() => undefined} />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background, flexGrow: 1, gap: spacing.lg, padding: spacing.lg },
  header: { gap: spacing.sm },
  title: { color: colors.textPrimary, fontSize: fontSize["2xl"], fontWeight: fontWeight.bold },
  subtitle: { color: colors.textSecondary, fontSize: fontSize.md },
  formCard: { backgroundColor: colors.surface, borderRadius: radius.lg, gap: spacing.lg, padding: spacing.lg, ...shadows.md },
});
