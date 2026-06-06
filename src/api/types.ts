export type ApplicationStatus = "draft" | "submitted" | "under_review" | "approved" | "rejected" | "disbursed";

export interface Application {
  id: string;
  applicationNumber: string;
  mortgageType: "Home Purchase" | "Equity Release" | "Refinance" | "Commercial Property" | "Construction";
  status: ApplicationStatus;
  propertyAddress: string;
  applicantName: string;
  loanAmountKobo: number;
  tenureMonths: number;
  annualInterestRate: number;
  progressPercent: number;
  nudgeText: string;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  approvedAt?: string;
  disbursedAt?: string;
  approvedTerms?: ApprovedTerms;
  rejectionReasons?: RejectionReason[];
  timeline: TimelineEvent[];
}

export interface ApprovedTerms {
  approvedAmountKobo: number;
  tenureMonths: number;
  annualInterestRate: number;
  monthlyRepaymentKobo: number;
  disbursedAt: string;
  offerLetterUrl?: string;
}

export interface RejectionReason {
  code: string;
  title: string;
  description: string;
}

export interface TimelineEvent {
  id: string;
  label: string;
  description?: string;
  timestamp?: string;
  status: "done" | "active" | "pending" | "error";
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: { page: number; limit: number; total: number; pages: number };
}
