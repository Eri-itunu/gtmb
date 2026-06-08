import type { ReactNode } from "react";
import { DefaultEmptyState } from "@/components/DefaultEmptyState";
import { ErrorState } from "@/components/ErrorState";
import type { AppError } from "@/types/errors";

export interface AsyncBoundaryQuery<T> {
  data: T | undefined;
  isLoading: boolean;
  error: AppError | null;
  refetch: () => void;
}

export interface AsyncBoundaryProps<T> {
  query: AsyncBoundaryQuery<T>;
  skeleton: ReactNode;
  empty?: ReactNode;
  isEmpty?: (data: T) => boolean;
  children: (data: T) => ReactNode;
}


export function AsyncBoundary<T>({ query, skeleton, empty, isEmpty, children }: AsyncBoundaryProps<T>) {
  if (query.isLoading) return <>{skeleton}</>;
  if (query.error) return <ErrorState error={query.error} onRetry={query.refetch} />;
  if (query.data !== undefined && isEmpty?.(query.data)) return <>{empty ?? <DefaultEmptyState />}</>;
  if (query.data !== undefined) return <>{children(query.data)}</>;
  return null;
}
