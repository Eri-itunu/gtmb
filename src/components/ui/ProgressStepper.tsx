import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fontSize, fontWeight, radius, spacing } from "@/design-system";

export interface Step {
  id: string;
  label: string;
  state: "done" | "active" | "pending" | "error";
  timestamp?: string;
}

export interface ProgressStepperProps {
  steps: Step[];
  orientation?: "horizontal" | "vertical";
}

const STEP_WIDTH = 60;
const NODE_SIZE = 28;

export function ProgressStepper({ steps, orientation = "horizontal" }: ProgressStepperProps) {
  if (orientation === "vertical") {
    return (
      <View style={styles.vertical}>
        {steps.map((step, index) => (
          <View key={step.id} style={styles.verticalRow}>
            <View style={styles.verticalRail}>
              <Node state={step.state} index={index} />
              {index < steps.length - 1 ? <View style={styles.verticalLine} /> : null}
            </View>
            <View style={styles.verticalCopy}>
              <Text style={[styles.label, step.state === "active" && styles.activeLabel, step.state === "pending" && styles.pendingLabel]}>{step.label}</Text>
              {step.timestamp ? <Text style={styles.timestamp}>{step.timestamp}</Text> : null}
            </View>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.horizontal}>
      <View style={styles.horizontalRail} />
      {steps.map((step, index) => (
        <View key={step.id} style={styles.horizontalItem}>
          <Node state={step.state} index={index} />
          <Text numberOfLines={2} style={[styles.horizontalLabel, step.state === "active" && styles.activeLabel, step.state === "pending" && styles.pendingLabel]}>
            {step.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

function Node({ state, index }: { state: Step["state"]; index: number }) {
  const showCheck = state === "done";
  const showError = state === "error";

  return (
    <View style={[styles.node, styles[`${state}Node`]]}>
      {showCheck ? <Ionicons color={colors.surface} name="checkmark" size={14} /> : null}
      {showError ? <Ionicons color={colors.surface} name="close" size={14} /> : null}
      {!showCheck && !showError ? <Text style={[styles.nodeText, state === "active" && styles.activeNodeText]}>{index + 1}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  horizontal: { flexDirection: "row", justifyContent: "space-between", minHeight: 54, position: "relative", width: "100%" },
  horizontalRail: { backgroundColor: colors.border, height: 1, left: STEP_WIDTH / 2, position: "absolute", right: STEP_WIDTH / 2, top: NODE_SIZE / 2 },
  horizontalItem: { alignItems: "center", gap: spacing.sm, width: STEP_WIDTH },
  horizontalLabel: { color: colors.textPrimary, fontSize: fontSize.xs, fontWeight: fontWeight.medium, textAlign: "center" },
  vertical: { gap: spacing.xs },
  verticalRow: { flexDirection: "row", gap: spacing.md },
  verticalRail: { alignItems: "center" },
  verticalLine: { backgroundColor: colors.border, flex: 1, minHeight: spacing["2xl"], width: 1 },
  verticalCopy: { flex: 1, gap: spacing.xs, paddingBottom: spacing.md },
  label: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: fontWeight.semibold },
  timestamp: { color: colors.textSecondary, fontSize: fontSize.sm },
  activeLabel: { color: colors.navy[700], fontWeight: fontWeight.bold },
  pendingLabel: { color: colors.textDisabled },
  node: { alignItems: "center", borderRadius: radius.full, height: 28, justifyContent: "center", width: 28 },
  doneNode: { backgroundColor: colors.teal[600], borderColor: colors.teal[600], borderWidth: 1 },
  activeNode: { backgroundColor: colors.primary, borderColor: colors.primary, borderWidth: 1 },
  pendingNode: { backgroundColor: colors.gray[200], borderColor: colors.gray[200], borderWidth: 1 },
  errorNode: { backgroundColor: colors.error.text, borderColor: colors.error.text, borderWidth: 1 },
  nodeText: { color: colors.textSecondary, fontSize: fontSize.xs, fontWeight: fontWeight.bold },
  activeNodeText: { color: colors.surface },
});
