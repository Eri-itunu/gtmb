import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, type FieldPath, type FieldPathValue, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import type { Application } from "@/api/types";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { AppHeader } from "@/components/ui/AppHeader";
import { Button } from "@/components/ui/Button";
import { DropdownField } from "@/components/ui/DropdownField";
import { FormField } from "@/components/ui/FormField";
import { ProgressStepper, type Step } from "@/components/ui/ProgressStepper";
import { colors, fontSize, fontWeight, radius, spacing } from "@/design-system";
import { newApplicationSchema, type NewApplicationFormValues } from "@/lib/schemas";
import { useApplicationsStore } from "@/store/applicationsStore";
import { useNewApplicationStore, type NewApplicationFormState } from "@/store/newApplicationStore";
import { useOnboardingStore } from "@/store/onboardingStore";
import { formatNaira } from "@/lib/formatters";

const MORTGAGE_TYPES = ["Home Purchase", "Refinance", "Equity Release"];
const TENURES = ["5 yrs", "10 yrs", "15 yrs", "20 yrs", "25 yrs", "30 yrs"];
const PROPERTY_TYPES = ["Residential"];
const APPLICATION_STEP_DEFS = [
  { id: "personal", label: "Personal Info" },
  { id: "loan", label: "Loan Details" },
  { id: "employment", label: "Employment" },
  { id: "documents", label: "Documents" },
  { id: "review", label: "Review" },
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
  const [currentStep, setCurrentStep] = useState(1);

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
  const applicationSteps: Step[] = useMemo(
    () =>
      APPLICATION_STEP_DEFS.map((step, index) => ({
        id: step.id,
        label: step.label,
        state: index < currentStep ? "done" : index === currentStep ? "active" : "pending",
      })),
    [currentStep]
  );

  const syncField = <K extends FieldPath<NewApplicationFormValues>>(key: K, value: FieldPathValue<NewApplicationFormValues, K>) => {
    store.setField(key, value);
    setValue(key, value, { shouldValidate: true });
  };
  const monthlyRepayment = useMemo(() => {
    const monthlyRate = 0.18 / 12;
    const months = parsedTenureMonths
    const amountKobo = parsedLoanAmountKobo
    const repayment = (amountKobo * monthlyRate) / (1 - (1 + monthlyRate) ** -months);
    return Number.isFinite(repayment) ? repayment : 0;
  }, [parsedLoanAmountKobo, parsedTenureMonths]);
  const goNext = () => setCurrentStep((step) => Math.min(APPLICATION_STEP_DEFS.length - 1, step + 1));
  const goBack = () => setCurrentStep((step) => Math.max(0, step - 1));

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
      <AppHeader title="New Application" headerSubtitle={`Step ${currentStep + 1} of ${APPLICATION_STEP_DEFS.length}`} showBackButton />
      <View style={styles.stepperBand}>
        <ProgressStepper steps={applicationSteps} />
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.formContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {showSavedBanner ? (
            <AlertBanner title="Draft saved" message="Your application draft was saved successfully." variant="success" />
          ) : null}

          <AlertBanner
            title="Application auto-saved"
            message="Your progress is saved automatically as you fill in the form."
            variant="info"
          />

          {currentStep === 0 ? (
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Personal information</Text>
              <Text style={styles.sectionCopy}>Your profile name, contact record, and customer identity are already linked to this application.</Text>
            </View>
          ) : null}

          {currentStep === 1 ? (
            <>
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

              <View style={styles.estimate}>
                <Text style={styles.estimateLabel}>Estimated monthly repayment</Text>
                <Text selectable style={styles.estimateAmount}>{formatNaira(monthlyRepayment)}</Text>
                <Text style={styles.estimateHint}>Based on 18% p.a. indicative rate. Final terms are subject to assessment.</Text>
              </View>
            </>
          ) : null}

          {currentStep === 2 ? (
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Employment</Text>
              <Text style={styles.sectionCopy}>Employment and income verification fields would be collected here before document upload.</Text>
            </View>
          ) : null}

          {currentStep === 3 ? (
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Documents</Text>
              <Text style={styles.sectionCopy}>Identity, bank statement, income evidence, title document, and valuation upload controls would appear here.</Text>
            </View>
          ) : null}

          {currentStep === 4 ? (
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Review</Text>
              <Text style={styles.sectionCopy}>Review your mortgage type, requested amount, tenure, property type, and address before submission.</Text>
            </View>
          ) : null}

          <View style={styles.actions}>
            {currentStep > 0 ? <Button fullWidth label="Back" onPress={goBack} variant="mainBorder" /> : null}
            <Button
              fullWidth
              label={currentStep === APPLICATION_STEP_DEFS.length - 1 ? "Review Application" : `Continue to ${APPLICATION_STEP_DEFS[currentStep + 1].label}`}
              onPress={currentStep === 1 ? handleSubmit(goNext) : goNext}
              variant="main"
            />
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
  formContent: { gap: spacing.lg, padding: spacing.lg, paddingBottom: spacing["4xl"] },
  row: { flexDirection: "row", gap: spacing.md },
  loanAmountColumn: { flex: 1.5 },
  tenureColumn: { flex: 1 },
  actions: { gap: spacing.sm },
  estimate: { backgroundColor: colors.teal[50], borderRadius: radius.md, gap: spacing.xs, padding: spacing.lg },
  estimateLabel: { color: colors.teal[600], fontSize: fontSize.xs, fontWeight: fontWeight.bold, textAlign: "left", textTransform: "uppercase" },
  estimateAmount: { color: colors.teal[600], fontSize: fontSize["2xl"], fontWeight: fontWeight.bold, textAlign: "left" },
  estimateHint: { color: colors.textSecondary, fontSize: fontSize.sm, textAlign: "left" },
  sectionCard: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, gap: spacing.sm, padding: spacing.lg },
  sectionTitle: { color: colors.textPrimary, fontSize: fontSize.lg, fontWeight: fontWeight.bold },
  sectionCopy: { color: colors.textSecondary, fontSize: fontSize.md },
});
