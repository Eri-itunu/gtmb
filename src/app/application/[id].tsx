import { router, useLocalSearchParams } from "expo-router";
import { ApplicationDetailView } from "@/components/mortgage/ApplicationDetailView";
import { AppHeader } from "@/components/ui/AppHeader";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { useApplication } from "@/hooks/useApplication";

export default function ApplicationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: application, isLoading, isError, refetch } = useApplication(id);

  if (isLoading) return <LoadingState message="Loading application..." variant="applicationDetail" />;
  if (isError || !application) return <ErrorState message="We could not load this application." onRetry={() => refetch()} />;

  return (
    <>
      <AppHeader
        title={application.applicationNumber}
        headerSubtitle="Application Details"
        status={application.status}
        showBackButton
        onBackPress={() => router.back()}
      />
      <ApplicationDetailView application={application} />
    </>
  );
}
