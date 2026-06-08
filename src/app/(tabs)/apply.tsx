import { Ionicons } from "@expo/vector-icons";
import { EmptyState } from "@/components/ui/EmptyState";
import { ScreenWrapper } from "@/components/ui/ScreenWrapper";
import { colors } from "@/design-system";

export default function ApplyScreen() {
  return (
    <ScreenWrapper>
      <EmptyState
        icon={<Ionicons color={colors.textDisabled} name="folder-open-outline" size={40} />}
        title="My Apps"
        message="Your saved application workspace will appear here."
      />
    </ScreenWrapper>
  );
}
