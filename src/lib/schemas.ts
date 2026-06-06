import { z } from "zod";

export const onboardingSchema = z.object({
  userName: z.string().trim().min(3, "Please enter your full name."),
});

export const propertySchema = z.object({
  propertyAddress: z.string().trim().min(5, "Enter a valid property address."),
  loanAmount: z.coerce.number().positive("Loan amount is required."),
});

export const personalDetailsSchema = z.object({
  bvn: z.string().length(11, "BVN must be 11 digits."),
  monthlyIncome: z.coerce.number().positive("Monthly income is required."),
});

export const mortgageApplicationSchema = propertySchema.merge(personalDetailsSchema).extend({
  tenureMonths: z.coerce.number().min(12).max(360),
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
