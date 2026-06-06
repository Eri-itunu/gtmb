import type { TimelineEvent } from "@/api/types";
import { ProgressStepper } from "@/components/ui/ProgressStepper";
import { formatDate } from "@/lib/formatters";

export interface ActivityTimelineProps {
  events: TimelineEvent[];
}

export function ActivityTimeline({ events }: ActivityTimelineProps) {
  return (
    <ProgressStepper
      orientation="vertical"
      steps={events.map((event) => ({
        id: event.id,
        label: event.description ? `${event.label} - ${event.description}` : event.label,
        state: event.status,
        timestamp: event.timestamp ? formatDate(event.timestamp) : "Pending",
      }))}
    />
  );
}
