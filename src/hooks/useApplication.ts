import { useQuery } from "@tanstack/react-query";
import { toAppError } from "@/lib/appError";
import { useApplicationsStore } from "@/store/applicationsStore";

const DETAIL_FETCH_DELAY_MS = 1_250;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useApplication = (id: string) => {
  const application = useApplicationsStore((state) => state.applications.find((item) => item.id === id));

  const query = useQuery({
    queryKey: ["application", id, application?.updatedAt],
    queryFn: async () => {
      await delay(DETAIL_FETCH_DELAY_MS);
      if (!application) throw new Error("Application not found.");
      return application;
    },
    enabled: Boolean(id),
    staleTime: 15_000,
    retry: 1,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error ? toAppError(query.error) : null,
    refetch: query.refetch,
  };
};
