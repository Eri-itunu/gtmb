import { StyleSheet, Text, View } from "react-native";
import { colors, fontSize, fontWeight, radius, shadows, spacing } from "@/design-system";
import { formatNaira } from "@/lib/formatters";

export interface RepaymentEstimatorProps {
  loanAmount: number;
  tenureMonths: number;
  annualInterestRate: number;
}

const calculateRepayment = (principalKobo: number, tenureMonths: number, annualInterestRate: number) => {
  const monthlyRate = annualInterestRate / 12;
  if (!monthlyRate || !tenureMonths) return principalKobo / Math.max(tenureMonths, 1);
  return (principalKobo * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
};

export function RepaymentEstimator({ loanAmount, tenureMonths, annualInterestRate }: RepaymentEstimatorProps) {
  const monthlyRepayment = calculateRepayment(loanAmount, tenureMonths, annualInterestRate);
  const totalRepayable = monthlyRepayment * tenureMonths;
  const totalInterest = totalRepayable - loanAmount;

  return (
    <View style={styles.card}>
      <View style={styles.accent} />
      <View style={styles.content}>
        <Text style={styles.title}>Repayment estimate</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Monthly repayment</Text>
          <Text style={styles.value}>{formatNaira(monthlyRepayment)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total repayable</Text>
          <Text style={styles.value}>{formatNaira(totalRepayable)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total interest</Text>
          <Text style={styles.value}>{formatNaira(totalInterest)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, flexDirection: "row", overflow: "hidden", ...shadows.md },
  accent: { backgroundColor: colors.teal[500], width: spacing.xs },
  content: { flex: 1, gap: spacing.md, padding: spacing.lg },
  title: { color: colors.textPrimary, fontSize: fontSize.lg, fontWeight: fontWeight.bold },
  row: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  label: { color: colors.textSecondary, fontSize: fontSize.sm },
  value: { color: colors.navy[700], fontSize: fontSize.md, fontWeight: fontWeight.bold },
});
