import { ProgressStepper, type Step } from "@/components/ui/ProgressStepper";
import { WORKFLOW_STEPS } from "@/lib/constants";

export interface WorkflowStepperProps {
  currentStage: number;
  status: "active" | "rejected" | "approved" | "disbursed";
}

export function WorkflowStepper({ currentStage, status }: WorkflowStepperProps) {
  const steps: Step[] = WORKFLOW_STEPS.map((label, index) => {
    const stage = index + 1;
    if (status === "rejected" && stage === 4) return { id: label, label, state: "error" };
    if (status === "rejected" && stage === 5) return { id: label, label, state: "pending" };
    if (stage < currentStage) return { id: label, label, state: "done" };
    if (stage === currentStage) return { id: label, label, state: status === "disbursed" ? "done" : "active" };
    return { id: label, label, state: "pending" };
  });

  return <ProgressStepper steps={steps} />;
}
