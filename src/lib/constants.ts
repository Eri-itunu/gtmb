import type { ApplicationStatus } from "@/api/types";

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
  disbursed: "Disbursed",
};

export const FILTER_OPTIONS: { label: string; value: ApplicationStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Under Review", value: "under_review" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export const WORKFLOW_STEPS = ["Draft", "Submitted", "Under Review", "Decision", "Disbursed"];

export const API_STATUS_CODES = {
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  validation: 422,
  serverError: 500,
};
