import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Application } from "@/api/types";
import { toAppError } from "@/lib/appError";
import { useApplicationsStore } from "@/store/applicationsStore";
import { useUIStore } from "@/store/uiStore";

const DEBOUNCE_MS = 300;
const FETCH_DELAY_MS = 900;
const EMPTY_APPLICATIONS: Application[] = [];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useApplications = () => {
  const filterChip = useUIStore((state) => state.filterChip);
  const searchQuery = useUIStore((state) => state.searchQuery);
  const sourceApplications = useApplicationsStore((state) => state.applications);
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const query = useQuery({
    queryKey: ["applications", sourceApplications.length, sourceApplications.map((application) => application.updatedAt).join("|")],
    queryFn: async () => {
      await delay(FETCH_DELAY_MS);
      return sourceApplications;
    },
    staleTime: 30_000,
    retry: 1,
  });

  const applications = query.data ?? EMPTY_APPLICATIONS;

  const filteredApplications = useMemo(() => {
    const normalizedSearch = debouncedSearch.trim().toLowerCase();

    const filtered = applications.filter((application: Application) => {
      const matchesFilter = filterChip === "all" || application.status === filterChip;
      const matchesSearch =
        !normalizedSearch ||
        application.propertyAddress.toLowerCase().includes(normalizedSearch) ||
        application.applicantName.toLowerCase().includes(normalizedSearch) ||
        application.mortgageType.toLowerCase().includes(normalizedSearch) ||
        application.applicationNumber.toLowerCase().includes(normalizedSearch);
      return matchesFilter && matchesSearch;
    });

    if (filterChip !== "all" || normalizedSearch) return filtered;

    const preferredStatuses = ["under_review", "draft", "approved"] as const;
    const preferredApplications = preferredStatuses
      .map((status) => filtered.find((application) => application.status === status))
      .filter((application): application is Application => Boolean(application));
    const preferredIds = new Set(preferredApplications.map((application) => application.id));
    return [...preferredApplications, ...filtered.filter((application) => !preferredIds.has(application.id))];
  }, [applications, debouncedSearch, filterChip]);

  const data = query.data ? { applications: query.data } : undefined;

  return {
    applications: filteredApplications,
    data,
    rawApplications: query.data,
    isLoading: query.isLoading,
    error: query.error ? toAppError(query.error) : null,
    isRefetching: query.isRefetching,
    refetch: query.refetch,
  };
};
