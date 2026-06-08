import { Ionicons } from "@expo/vector-icons";
import { EmptyState } from "@/components/ui/EmptyState";
import { ScreenWrapper } from "@/components/ui/ScreenWrapper";
import { colors } from "@/design-system";

export default function SupportScreen() {
  return (
    <ScreenWrapper>
      <EmptyState
        icon={<Ionicons color={colors.textDisabled} name="headset-outline" size={40} />}
        title="Support"
        message="Support tools and relationship manager messages will appear here."
      />
    </ScreenWrapper>
  );
}
