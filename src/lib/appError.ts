import { isApiError } from "@/api/client";
import type { AppError } from "@/types/errors";

export const toAppError = (error: unknown): AppError => {
  if (isApiError(error)) {
    if (error.code === "NETWORK_ERROR") return { kind: "network", message: error.message };
    if (error.code === "TIMEOUT") return { kind: "timeout", message: error.message };
    if (error.code === "UNAUTHORIZED" || error.code === "FORBIDDEN") return { kind: "auth", message: error.message };
    if (error.code === "VALIDATION_ERROR") return { kind: "validation", fields: {} };
    return { kind: "server", status: error.status ?? 500, message: error.message };
  }

  if (error instanceof Error) {
    return { kind: "server", status: 500, message: error.message };
  }

  return { kind: "server", status: 500, message: "An unexpected error occurred." };
};
