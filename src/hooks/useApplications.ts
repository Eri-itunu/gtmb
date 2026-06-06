import { useCallback, useEffect, useMemo, useState } from "react";
import type { Application } from "@/api/types";
import { useApplicationsStore } from "@/store/applicationsStore";
import { useUIStore } from "@/store/uiStore";

const DEBOUNCE_MS = 300;
const FETCH_DELAY_MS = 900;
const REFRESH_DELAY_MS = 700;

export const useApplications = () => {
  const filterChip = useUIStore((state) => state.filterChip);
  const searchQuery = useUIStore((state) => state.searchQuery);
  const sourceApplications = useApplicationsStore((state) => state.applications);
  const [applications, setApplications] = useState<Application[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setApplications(sourceApplications);
      setIsLoading(false);
    }, FETCH_DELAY_MS);

    return () => clearTimeout(timer);
  }, [sourceApplications]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const refetch = useCallback(() => {
    setIsRefetching(true);

    setTimeout(() => {
      setApplications(sourceApplications);
      setIsRefetching(false);
    }, REFRESH_DELAY_MS);
  }, [sourceApplications]);

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

  return {
    applications: filteredApplications,
    data: applications,
    isLoading,
    isError: false,
    isRefetching,
    refetch,
  };
};
