import { useCallback, useEffect, useState } from "react";
import type { Application } from "@/api/types";
import { useApplicationsStore } from "@/store/applicationsStore";

const DETAIL_FETCH_DELAY_MS = 1_250;

interface ApplicationFetchState {
  id: string;
  data?: Application;
  isError: boolean;
}

export const useApplication = (id: string) => {
  const application = useApplicationsStore((state) => state.applications.find((item) => item.id === id));
  const [fetchState, setFetchState] = useState<ApplicationFetchState>({ id: "", data: undefined, isError: false });

  useEffect(() => {
    const timer = setTimeout(() => {
      setFetchState({ id, data: application, isError: !application });
    }, DETAIL_FETCH_DELAY_MS);

    return () => clearTimeout(timer);
  }, [application, id]);

  const refetch = useCallback(() => {
    setFetchState({ id: "", data: undefined, isError: false });

    setTimeout(() => {
      setFetchState({ id, data: application, isError: !application });
    }, DETAIL_FETCH_DELAY_MS);
  }, [application, id]);

  const isResolvedForCurrentId = fetchState.id === id;

  return {
    data: isResolvedForCurrentId ? fetchState.data : undefined,
    isLoading: !isResolvedForCurrentId,
    isError: isResolvedForCurrentId && fetchState.isError,
    refetch,
  };
};
