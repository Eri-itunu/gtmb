import { useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, type FieldPath, type FieldPathValue, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, Text } from "react-native";
import type { Application } from "@/api/types";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { AppHeader } from "@/components/ui/AppHeader";
import { AutoSaveStatus, type AutoSaveState } from "@/components/ui/AutoSaveStatus";
import { Button } from "@/components/ui/Button";
import { DropdownField } from "@/components/ui/DropdownField";
import { FormField } from "@/components/ui/FormField";
import { ProgressStepper, type Step } from "@/components/ui/ProgressStepper";
import { colors, fontSize, fontWeight, spacing } from "@/design-system";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { newApplicationSchema, type NewApplicationFormValues } from "@/lib/schemas";
import { useApplicationsStore } from "@/store/applicationsStore";
import { useNewApplicationStore, type NewApplicationFormState } from "@/store/newApplicationStore";
import { useOnboardingStore } from "@/store/onboardingStore";
import { formatNaira } from "@/lib/formatters";

const MORTGAGE_TYPES = ["Home Purchase", "Refinance", "Equity Release"];
const TENURES = ["5 yrs", "10 yrs", "15 yrs", "20 yrs", "25 yrs", "30 yrs"];
const PROPERTY_TYPES = ["Residential"];
const APPLICATION_STEPS: Step[] = [
  { id: "personal", label: "Personal Info", state: "done" },
  { id: "loan", label: "Loan Details", state: "active" },
  { id: "employment", label: "Employment", state: "pending" },
  { id: "documents", label: "Documents", state: "pending" },
  { id: "review", label: "Review", state: "pending" },
];

const parseLoanAmountKobo = (value: string) => Math.max(0, Number(value.replace(/,/g, "")) || 0) * 100;
const parseTenureMonths = (value: string) => Math.max(0, Number(value.replace(" yrs", "")) || 0) * 12;

const buildDraftApplication = (formValues: NewApplicationFormState, applicantName: string): Application => {
  const now = new Date().toISOString();
  const timestamp = Date.now();

  return {
    id: `draft-${timestamp}`,
    applicationNumber: `GTM-DRAFT-${String(timestamp).slice(-6)}`,
    mortgageType: (formValues.mortgageType || "Home Purchase") as Application["mortgageType"],
    status: "draft",
    applicantName,
    propertyAddress: formValues.propertyAddress || "Address not provided",
    loanAmountKobo: parseLoanAmountKobo(formValues.loanAmount),
    tenureMonths: parseTenureMonths(formValues.tenure),
    annualInterestRate: 0.18,
    progressPercent: 20,
    nudgeText: "Draft saved - complete your application to submit",
    createdAt: now,
    updatedAt: now,
    timeline: [
      {
        id: "draft-created",
        label: "Draft Created",
        description: "Application draft saved locally",
        timestamp: now,
        status: "done",
      },
    ],
  };
};

export function NewApplicationForm() {
  const store = useNewApplicationStore();
  const addApplication = useApplicationsStore((state) => state.addApplication);
  const userName = useOnboardingStore((state) => state.userName);
  const [showSavedBanner, setShowSavedBanner] = useState(false);
  const [autoSaveState, setAutoSaveState] = useState<AutoSaveState>(store.lastSavedAt ? "saved" : "saving");
  const { isConnected, isInternetReachable } = useNetworkStatus();
  const isOffline = !isConnected || !isInternetReachable;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<NewApplicationFormValues>({
    resolver: zodResolver(newApplicationSchema),
    defaultValues: {
      mortgageType: store.mortgageType,
      loanAmount: store.loanAmount,
      tenure: store.tenure,
      propertyType: store.propertyType,
      propertyAddress: store.propertyAddress,
    },
    mode: "onTouched",
  });

  const parsedLoanAmountKobo = useMemo(() => parseLoanAmountKobo(store.loanAmount), [store.loanAmount]);
  const parsedTenureMonths = useMemo(() => parseTenureMonths(store.tenure), [store.tenure]);

  const updateAutoSaveState = () => {
    setAutoSaveState("saving");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setAutoSaveState(isOffline ? "offline" : "saved");
    }, 450);
  };

  const syncField = <K extends FieldPath<NewApplicationFormValues>>(key: K, value: FieldPathValue<NewApplicationFormValues, K>) => {
    store.setField(key, value);
    store.setField("lastSavedAt", new Date().toISOString());
    setValue(key, value, { shouldValidate: true });
    updateAutoSaveState();
  };
  const monthlyRepayment = useMemo(() => {
    const monthlyRate = 0.18 / 12;
    const months = parsedTenureMonths;
    const amountKobo = parsedLoanAmountKobo;
    const repayment = (amountKobo * monthlyRate) / (1 - (1 + monthlyRate) ** -months);
    return Number.isFinite(repayment) ? repayment : 0;
  }, [parsedLoanAmountKobo, parsedTenureMonths]);
  const onContinue = () => undefined;

  const onSaveDraft = () => {
    const lastSavedAt = new Date().toISOString();
    store.setField("lastSavedAt", lastSavedAt);
    addApplication(buildDraftApplication({ ...store, lastSavedAt }, userName || "GlobalTrust Customer"));
    setShowSavedBanner(true);
    setTimeout(() => {
      store.resetForm();
      router.back();
    }, 2_000);
  };

  return (
    <View style={styles.screen}>
      <AppHeader title="New Application" headerSubtitle="Step 2 of 5" showBackButton />
      <View style={styles.stepperBand}>
        <ProgressStepper steps={APPLICATION_STEPS} />
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.formContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            {showSavedBanner ? (
              <AlertBanner title="Draft saved" message="Your application draft was saved successfully." variant="success" />
            ) : null}

            {/* <AutoSaveStatus state={autoSaveState} onRetry={onSaveDraft} /> */}

            <AlertBanner title="Application auto-saved" message="Your progress is saved automatically as you fill in the form." variant="amber" />
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="mortgageType"
              render={() => (
                <DropdownField
                  error={errors.mortgageType?.message}
                  label="Mortgage Type"
                  onSelect={(value) => syncField("mortgageType", value)}
                  options={MORTGAGE_TYPES}
                  required
                  value={store.mortgageType}
                />
              )}
            />

            <View style={styles.row}>
              <View style={styles.loanAmountColumn}>
                <Controller
                  control={control}
                  name="loanAmount"
                  render={() => (
                    <FormField
                      error={errors.loanAmount?.message}
                      keyboardType="numeric"
                      label="Loan Amount (₦)"
                      onChangeText={(value) => syncField("loanAmount", value)}
                      placeholder="e.g. 15,000,000"
                      required
                      value={store.loanAmount}
                    />
                  )}
                />
              </View>
              <View style={styles.tenureColumn}>
                <Controller
                  control={control}
                  name="tenure"
                  render={() => (
                    <DropdownField
                      error={errors.tenure?.message}
                      label="Tenure"
                      onSelect={(value) => syncField("tenure", value)}
                      options={TENURES}
                      required
                      value={store.tenure}
                    />
                  )}
                />
              </View>
            </View>

            <Controller
              control={control}
              name="propertyType"
              render={() => (
                <DropdownField
                  error={errors.propertyType?.message}
                  label="Property Type"
                  onSelect={(value) => syncField("propertyType", value)}
                  options={PROPERTY_TYPES}
                  required
                  value={store.propertyType}
                />
              )}
            />

            <Controller
              control={control}
              name="propertyAddress"
              render={() => (
                <FormField
                  error={errors.propertyAddress?.message}
                  label="Property Address"
                  multiline
                  numberOfLines={3}
                  onChangeText={(value) => syncField("propertyAddress", value)}
                  placeholder="Enter full property address"
                  required
                  value={store.propertyAddress}
                />
              )}
            />
          </View>

          <View style={styles.estimate}>
            <Text style={styles.estimateLabel}>Estimated monthly repayment</Text>
            <Text selectable style={styles.estimateAmount}>{formatNaira(monthlyRepayment)}</Text>
            <Text style={styles.estimateHint}>Based on 18% p.a. indicative rate. Final terms are subject to assessment.</Text>
          </View>
          <View style={styles.actions}>
            <Button fullWidth label="Continue to Employment" onPress={handleSubmit(onContinue)} variant="main" />
            <Button fullWidth label="Save as Draft" onPress={onSaveDraft} variant="mainBorder" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  flex: { flex: 1 },
  stepperBand: { backgroundColor: colors.surface, borderBottomColor: colors.border, borderBottomWidth: 1, paddingHorizontal: spacing.sm, paddingVertical: spacing.lg },
  formContent: { gap: spacing.lg, paddingBottom: spacing["4xl"], paddingTop: spacing.lg },
  section: { gap: spacing.lg, paddingHorizontal: spacing.lg },
  row: { flexDirection: "row", gap: spacing.md },
  loanAmountColumn: { flex: 1.5 },
  tenureColumn: { flex: 1 },
  actions: { gap: spacing.sm, paddingHorizontal: spacing.lg },
  estimate: { backgroundColor: colors.teal[50], gap: spacing.xs, padding: spacing.lg },
  estimateLabel: { color: colors.teal[600], fontSize: fontSize.xs, fontWeight: fontWeight.bold, textAlign: "left", textTransform: "uppercase" },
  estimateAmount: { color: colors.teal[600], fontSize: fontSize["2xl"], fontWeight: fontWeight.bold, textAlign: "left" },
  estimateHint: { color: colors.textSecondary, fontSize: fontSize.sm, textAlign: "left" },
});
