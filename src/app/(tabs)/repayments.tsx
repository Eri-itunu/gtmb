import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { ScreenWrapper } from "@/components/ui/ScreenWrapper";
import { RepaymentEstimator } from "@/components/mortgage/RepaymentEstimator";
import { colors, fontSize, fontWeight, radius, shadows, spacing } from "@/design-system";
import { useApplications } from "@/hooks/useApplications";
import { formatDate, formatNaira } from "@/lib/formatters";

const NEXT_REPAYMENT_DUE_ISO = "2025-02-01T00:00:00.000Z";

export default function RepaymentsScreen() {
  const { data, isLoading, isError, refetch } = useApplications();
  const disbursed = data?.find((application) => application.status === "disbursed" || application.approvedTerms);

  if (isLoading) return <LoadingState message="Loading repayment tracker..." variant="repayments" />;
  if (isError) return <ErrorState message="We could not load repayment information." onRetry={() => refetch()} />;

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Repayment tracker</Text>
          <Text style={styles.subtitle}>Monitor estimated repayments for approved facilities.</Text>
        </View>
        {disbursed ? (
          <>
            <RepaymentEstimator loanAmount={disbursed.loanAmountKobo} tenureMonths={disbursed.tenureMonths} annualInterestRate={disbursed.annualInterestRate} />
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Next repayment</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Amount</Text>
                <Text style={styles.value}>{formatNaira(disbursed.approvedTerms?.monthlyRepaymentKobo ?? 0)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Due date</Text>
                <Text style={styles.value}>{formatDate(NEXT_REPAYMENT_DUE_ISO)}</Text>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>No active repayment plan</Text>
            <Text style={styles.label}>Approved and disbursed applications will appear here.</Text>
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background, flexGrow: 1, gap: spacing.lg, padding: spacing.lg },
  header: { gap: spacing.sm },
  title: { color: colors.textPrimary, fontSize: fontSize["2xl"], fontWeight: fontWeight.bold },
  subtitle: { color: colors.textSecondary, fontSize: fontSize.md },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, gap: spacing.md, padding: spacing.lg, ...shadows.md },
  cardTitle: { color: colors.textPrimary, fontSize: fontSize.lg, fontWeight: fontWeight.bold },
  row: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  label: { color: colors.textSecondary, fontSize: fontSize.md },
  value: { color: colors.navy[700], fontSize: fontSize.md, fontWeight: fontWeight.bold },
});
