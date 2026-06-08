import type { TimelineEvent } from "@/api/types";
import { StyleSheet, Text, View } from "react-native";
import { colors, fontSize, fontWeight, radius, spacing } from "@/design-system";
import { formatDate } from "@/lib/formatters";

export interface ActivityTimelineProps {
  events: TimelineEvent[];
}

export function ActivityTimeline({ events }: ActivityTimelineProps) {
  return (
    <View style={styles.timeline}>
      {events.map((event, index) => {
        const isLast = index === events.length - 1;
        const timestamp = event.timestampLabel ?? (event.timestamp ? formatDate(event.timestamp) : "Pending");

        return (
          <View key={event.id} style={styles.item}>
            <View style={styles.rail}>
              <View style={[styles.dot, styles[`${event.status}Dot`]]} />
              {!isLast ? <View style={[styles.line, event.status === "done" && styles.doneLine]} /> : null}
            </View>
            <View style={styles.copy}>
              <Text
                selectable
                style={[
                  styles.title,
                  event.status === "active" && styles.activeTitle,
                  event.status === "pending" && styles.pendingTitle,
                  event.status === "error" && styles.errorTitle,
                ]}
              >
                {event.label}
              </Text>
              {event.description ? <Text selectable style={styles.description}>{event.description}</Text> : null}
              {event.timestampLabel !== null ? <Text selectable style={styles.timestamp}>{timestamp}</Text> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  timeline: { gap: 0 },
  item: { flexDirection: "row", gap: spacing.md },
  rail: { alignItems: "center", width: 28 },
  dot: { borderRadius: radius.full, height: 20, width: 20 },
  doneDot: { backgroundColor: colors.teal[600] },
  activeDot: { backgroundColor: colors.primary },
  pendingDot: { backgroundColor: colors.gray[200] },
  errorDot: { backgroundColor: colors.error.text },
  line: { backgroundColor: colors.gray[200], flex: 1, minHeight: 54, width: 3 },
  doneLine: { backgroundColor: colors.teal[600] },
  copy: { flex: 1, gap: 4, paddingBottom: spacing.lg },
  title: { color: colors.textPrimary, fontSize: fontSize.lg, fontWeight: fontWeight.bold, lineHeight: 24 },
  activeTitle: { color: colors.primaryDark },
  pendingTitle: { color: colors.textDisabled },
  errorTitle: { color: colors.error.text },
  description: { color: colors.textSecondary, fontSize: fontSize.md, lineHeight: 22 },
  timestamp: { color: colors.textDisabled, fontSize: fontSize.sm, lineHeight: 20 },
});
