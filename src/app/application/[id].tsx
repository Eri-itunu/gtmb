import { router, useLocalSearchParams } from "expo-router";
import { AsyncBoundary } from "@/components/AsyncBoundary";
import { ApplicationDetailView } from "@/components/mortgage/ApplicationDetailView";
import { ApplicationDetailSkeleton } from "@/components/skeletons/ApplicationDetailSkeleton";
import { AppHeader } from "@/components/ui/AppHeader";
import { useApplication } from "@/hooks/useApplication";

export default function ApplicationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useApplication(id);

  return (
    <AsyncBoundary
      query={{
        data: query.data,
        error: query.error,
        isLoading: query.isLoading,
        refetch: () => {
          void query.refetch();
        },
      }}
      skeleton={<ApplicationDetailSkeleton />}
    >
      {(application) => (
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
      )}
    </AsyncBoundary>
  );
}
