import { api } from "./client";
import type { ApiResponse, Application, MortgageSubmissionPayload, PaginatedResponse } from "./types";

export const getApplications = async (): Promise<Application[]> => {
  const response = await api.get<PaginatedResponse<Application> | ApiResponse<Application[]>>("/applications");
  return response.data;
};

export const getApplication = async (id: string): Promise<Application> => {
  const response = await api.get<ApiResponse<Application>>(`/applications/${id}`);
  return response.data;
};

export const submitMortgageApplication = async (
  payload: MortgageSubmissionPayload,
  idempotencyKey: string
): Promise<Application> => {
  const response = await api.post<ApiResponse<Application>>("/applications", payload, {
    headers: { "Idempotency-Key": idempotencyKey },
  });
  return response.data;
};
