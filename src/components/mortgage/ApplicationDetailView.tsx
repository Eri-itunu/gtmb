import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import type { Application, TimelineEvent } from "@/api/types";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { Button } from "@/components/ui/Button";
import { ActivityTimeline } from "@/components/mortgage/ActivityTimeline";
import { RejectionReasonsList } from "@/components/mortgage/RejectionReasonsList";
import { WorkflowStepper } from "@/components/mortgage/WorkflowStepper";
import { colors, fontSize, fontWeight, radius, spacing } from "@/design-system";
import { formatDate, formatLoanTerm, formatNaira } from "@/lib/formatters";

const stageByStatus = {
  draft: 1,
  submitted: 2,
  under_review: 3,
  approved: 4,
  rejected: 4,
  disbursed: 5,
} as const;

export function ApplicationDetailView({ application }: { application: Application }) {
  const isApprovedView = application.status === "approved" || application.status === "disbursed";
  const workflowStatus = application.status === "rejected" ? "rejected" : "active";
  const workflowStage = isApprovedView ? 5 : stageByStatus[application.status];

  return (
    <ScrollView contentContainerStyle={styles.container} contentInsetAdjustmentBehavior="automatic">
      <View style={styles.stepperBand}>
        <WorkflowStepper currentStage={workflowStage} status={workflowStatus} />
      </View>

      <View style={styles.body}>
        {application.status === "under_review" ? (
          <>
            <LoanSummary application={application} />
            <TimelineSection events={application.timeline} />
            <ActionSection application={application} />
          </>
        ) : null}
        {isApprovedView ? (
          <>
            <StatusMessage application={application} />
            <ApprovedTermsSection application={application} />
            <RepaymentProgressSection application={application} />
            <ActionSection application={application} />
          </>
        ) : null}
        {application.status === "rejected" ? (
          <>
            <StatusMessage application={application} />
            <RejectionSection application={application} />
            <WhatYouCanDoSection />
            <ActionSection application={application} />
          </>
        ) : null}
        {application.status !== "under_review" && !isApprovedView && application.status !== "rejected" ? (
          <>
            <StatusMessage application={application} />
            <LoanSummary application={application} />
            <StateSection application={application} />
            <TimelineSection events={application.timeline} />
            <ActionSection application={application} />
          </>
        ) : null}
      </View>
    </ScrollView>
  );
}

function StatusMessage({ application }: { application: Application }) {
  if (application.status === "rejected") {
    return (
      <View style={styles.statusMessage}>
        <AlertBanner
          title="Application not approved"
          message="The credit committee reviewed your application and could not proceed at this time. See the reasons and next steps below."
          variant="error"
        />
      </View>
    );
  }

  if (application.status === "approved" || application.status === "disbursed") {
    return (
      <View style={styles.statusMessage}>
        <AlertBanner
          title="Congratulations!"
          message={`Your mortgage of ${formatNaira(application.approvedTerms?.approvedAmountKobo ?? application.loanAmountKobo)} has been approved and disbursed.`}
          variant="success"
        />
      </View>
    );
  }

  if (application.status === "draft") {
    return (
      <View style={styles.statusMessage}>
        <AlertBanner
          title="Draft application"
          message="Continue where you left off. Complete the remaining sections before submission."
          variant="warning"
        />
      </View>
    );
  }

  return (
    <View style={styles.statusMessage}>
      <AlertBanner
        title="Under review"
        message="Your relationship manager is reviewing this application. We will update the timeline as each check is completed."
        variant="warning"
      />
    </View>
  );
}

function LoanSummary({ application }: { application: Application }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Loan summary</Text>
      <InfoRow label="Amount requested" value={formatNaira(application.loanAmountKobo)} strong />
      <InfoRow label="Mortgage type" value={application.mortgageType} />
      <InfoRow label="Applicant" value={application.applicantName} />
      <InfoRow label="Tenure" value={formatLoanTerm(application.tenureMonths)} />
      <InfoRow label="Rate" value={`${(application.annualInterestRate * 100).toFixed(1)}% p.a.`} />
      <InfoRow label="Property" value={application.propertyAddress} />
      <InfoRow label="Updated" value={formatDate(application.updatedAt)} />
    </View>
  );
}

function StateSection({ application }: { application: Application }) {
  if (application.status === "draft") {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Draft progress</Text>
        <View style={styles.progressHeader}>
          <Text style={styles.muted}>{application.nudgeText}</Text>
          <Text style={styles.progressMeta}>{application.progressPercent}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${application.progressPercent}%` }]} />
        </View>
      </View>
    );
  }

  return null;
}

function ApprovedTermsSection({ application }: { application: Application }) {
  if (!application.approvedTerms) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Approved terms</Text>
      <InfoRow label="Approved amount" value={formatNaira(application.approvedTerms.approvedAmountKobo)} strong tone="success" />
      <InfoRow label="Interest rate" value={`${(application.approvedTerms.annualInterestRate * 100).toFixed(1)}% p.a.`} />
      <InfoRow label="Tenure" value={formatLoanTerm(application.approvedTerms.tenureMonths)} />
      <InfoRow label="Monthly repayment" value={formatNaira(application.approvedTerms.monthlyRepaymentKobo)} />
      <InfoRow label="Disbursed" value={formatDate(application.approvedTerms.disbursedAt)} />
    </View>
  );
}

function RepaymentProgressSection({ application }: { application: Application }) {
  if (!application.approvedTerms) return null;
  const repaidMonths = application.status === "disbursed" ? 9 : 0;
  const totalMonths = application.approvedTerms.tenureMonths;
  const repaidKobo = application.approvedTerms.monthlyRepaymentKobo * repaidMonths;
  const outstandingKobo = Math.max(0, application.approvedTerms.approvedAmountKobo - repaidKobo);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Repayment progress</Text>
      <View style={styles.repaymentBlock}>
        <View style={styles.progressHeader}>
          <Text style={styles.muted}>{formatNaira(repaidKobo)} repaid</Text>
          <Text style={styles.progressMeta}>{repaidMonths} of {totalMonths} months</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.min(100, (repaidMonths / totalMonths) * 100)}%` }]} />
        </View>
        <Text style={styles.hint}>{formatNaira(outstandingKobo)} outstanding</Text>
      </View>
    </View>
  );
}

function RejectionSection({ application }: { application: Application }) {
  return (
    <View style={styles.plainSection}>
      <Text style={styles.sectionTitle}>Rejection reasons</Text>
      <RejectionReasonsList reasons={application.rejectionReasons ?? []} />
    </View>
  );
}

function WhatYouCanDoSection() {
  return (
    <View style={styles.plainSection}>
      <Text style={styles.sectionTitle}>What you can do</Text>
      <View style={styles.nextStepBlock}>
        <Text style={styles.nextStepText}>Speak with a mortgage advisor to review your affordability profile, reduce existing liabilities, or prepare a stronger application for a lower loan amount.</Text>
      </View>
    </View>
  );
}

function TimelineSection({ events }: { events: TimelineEvent[] }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Activity timeline</Text>
      <ActivityTimeline events={events} />
    </View>
  );
}

function ActionSection({ application }: { application: Application }) {
  if (application.status === "rejected") {
    return (
      <View style={styles.actions}>
        <Button fullWidth label="Speak to a mortgage advisor" onPress={() => undefined} variant="primary" />
        <Button fullWidth label="Download rejection letter" onPress={() => undefined} variant="mainBorder" />
        <Button fullWidth label="Start a new application" onPress={() => router.push("/application/new" as never)} variant="main" />
      </View>
    );
  }

  if (application.status === "approved" || application.status === "disbursed") {
    return (
      <View style={styles.actions}>
        <Button fullWidth label="Make repayment" onPress={() => undefined} variant="main" />
        <Button fullWidth label="Download offer letter" onPress={() => undefined} variant="mainBorder" />
      </View>
    );
  }

  if (application.status === "draft") {
    return (
      <View style={styles.actions}>
        <Button fullWidth label="Continue application" onPress={() => router.push("/application/new" as never)} />
        <Button fullWidth label="Save as Draft" onPress={() => undefined} variant="secondary" />
      </View>
    );
  }

  return (
    <View style={styles.actions}>
      <Button fullWidth label="Message relationship manager" onPress={() => undefined} variant="mainBorder" />
      <Button fullWidth label="Withdraw application" onPress={() => undefined} variant="dangerBorder" />
      
    </View>
  );
}

function InfoRow({ label, value, strong = false, tone }: { label: string; value: string; strong?: boolean; tone?: "success" }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text selectable style={[styles.infoValue, strong && styles.infoStrong, tone === "success" && styles.successText]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background, flexGrow: 1 },
  stepperBand: { backgroundColor: colors.surface, borderBottomColor: colors.border, borderBottomWidth: 1, paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
  body: { gap: spacing.xl, paddingVertical: spacing.lg },
  statusMessage: { paddingHorizontal: spacing.lg },
  section: { gap: spacing.md, paddingHorizontal: spacing.lg, backgroundColor:"#ffff", paddingVertical: spacing.lg },
  plainSection: { gap: spacing.md, paddingHorizontal: spacing.lg },
  sectionTitle: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: fontWeight.bold },
  infoRow: { borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: "row", gap: spacing.md, justifyContent: "space-between", paddingVertical: spacing.sm },
  infoLabel: { color: colors.textSecondary, fontSize: fontSize.sm },
  infoValue: { color: colors.textPrimary, flex: 1, fontSize: fontSize.sm, fontWeight: fontWeight.semibold, textAlign: "right" },
  infoStrong: { fontSize: fontSize.md, fontWeight: fontWeight.bold },
  successText: { color: colors.success.text },
  nextStepBlock: { backgroundColor: colors.success.bg, borderColor: colors.success.border, borderRadius: radius.md, borderWidth: 1, padding: spacing.lg },
  nextStepText: { color: colors.success.text, fontSize: fontSize.sm, fontWeight: fontWeight.medium },
  repaymentBlock: { gap: spacing.sm, paddingTop: spacing.sm },
  progressHeader: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  muted: { color: colors.textSecondary, fontSize: fontSize.sm },
  progressMeta: { color: colors.teal[600], fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
  progressTrack: { backgroundColor: colors.gray[200], borderRadius: radius.full, height: spacing.sm, overflow: "hidden" },
  progressFill: { backgroundColor: colors.teal[600], borderRadius: radius.full, height: spacing.sm },
  hint: { color: colors.textDisabled, fontSize: fontSize.xs },
  actions: { gap: spacing.sm, paddingHorizontal: spacing.lg },
});
