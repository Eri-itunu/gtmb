import { z } from "zod";

export const onboardingSchema = z.object({
  userName: z.string().trim().min(3, "Please enter your full name."),
});

const NAIRA_REGEX = /^[\d,]+$/;

export const newApplicationSchema = z.object({
  mortgageType: z.string().min(1, "Please select a mortgage type"),
  loanAmount: z
    .string()
    .min(1, "Loan amount is required")
    .regex(NAIRA_REGEX, "Enter a valid amount")
    .refine((value) => Number(value.replace(/,/g, "")) >= 1_000_000, "Minimum loan amount is ₦1,000,000")
    .refine((value) => Number(value.replace(/,/g, "")) <= 500_000_000, "Maximum loan amount is ₦500,000,000"),
  tenure: z.string().min(1, "Please select a tenure"),
  propertyType: z.string().min(1, "Please select a property type"),
  propertyAddress: z.string().min(10, "Enter a full property address (min 10 characters)"),
});

export type NewApplicationFormValues = z.infer<typeof newApplicationSchema>;
