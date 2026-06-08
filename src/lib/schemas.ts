import { z } from "zod";
import { containsUnsafeInput, sanitizeAddressInput, sanitizeDigitsInput, sanitizeMoneyInput, sanitizeTextInput } from "@/lib/inputSanitization";

export const onboardingSchema = z.object({
  userName: z.string().trim().min(3, "Please enter your full name."),
});

const NAIRA_REGEX = /^[\d,]+$/;
const MORTGAGE_TYPES = ["Home Purchase", "Refinance", "Equity Release"] as const;
const PROPERTY_TYPES = ["Residential"] as const;

export const newApplicationSchema = z.object({
  mortgageType: z
    .string()
    .min(1, "Please select a mortgage type")
    .refine((value) => sanitizeTextInput(value, 40) === value, "Please select a valid mortgage type")
    .refine((value) => MORTGAGE_TYPES.includes(value as (typeof MORTGAGE_TYPES)[number]), "Please select a valid mortgage type"),
  loanAmount: z
    .string()
    .min(1, "Loan amount is required")
    .refine((value) => sanitizeMoneyInput(value) === value, "Enter digits and commas only")
    .regex(NAIRA_REGEX, "Enter a valid amount")
    .refine((value) => Number(value.replace(/,/g, "")) >= 1_000_000, "Minimum loan amount is ₦1,000,000")
    .refine((value) => Number(value.replace(/,/g, "")) <= 500_000_000, "Maximum loan amount is ₦500,000,000"),
  tenure: z
    .string()
    .min(1, "Tenure is required")
    .refine((value) => sanitizeDigitsInput(value) === value, "Tenure must be a number")
    .refine((value) => Number(value) >= 1, "Minimum tenure is 1 year")
    .refine((value) => Number(value) <= 30, "Maximum tenure is 30 years"),
  propertyType: z
    .string()
    .min(1, "Please select a property type")
    .refine((value) => sanitizeTextInput(value, 40) === value, "Please select a valid property type")
    .refine((value) => PROPERTY_TYPES.includes(value as (typeof PROPERTY_TYPES)[number]), "Please select a valid property type"),
  propertyAddress: z
    .string()
    .trim()
    .min(10, "Enter a full property address (min 10 characters)")
    .max(180, "Property address is too long")
    .refine((value) => sanitizeAddressInput(value) === value, "Remove unsafe symbols from the address")
    .refine((value) => !containsUnsafeInput(value), "Remove scripts, SQL keywords, or unsafe symbols from the address"),
});

export type NewApplicationFormValues = z.infer<typeof newApplicationSchema>;
