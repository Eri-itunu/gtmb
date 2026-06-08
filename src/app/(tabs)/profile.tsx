import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { ScreenWrapper } from "@/components/ui/ScreenWrapper";
import { colors, fontSize, fontWeight, radius, shadows, spacing } from "@/design-system";
import { useAuthStore } from "@/store/authStore";
import { useOnboardingStore } from "@/store/onboardingStore";
import { useUIStore } from "@/store/uiStore";

export default function ProfileScreen() {
  const userName = useOnboardingStore((state) => state.userName);
  const resetOnboarding = useOnboardingStore((state) => state.resetOnboarding);
  const logOut = useAuthStore((state) => state.logOut);
  const resetUI = useUIStore((state) => state.resetUI);
  const isLoading = false;
  const error = null;

  const handleLogout = async () => {
    await logOut();
    resetOnboarding();
    resetUI();
    router.replace("/" as never);
  };

  if (isLoading) return <LoadingState message="Loading profile..." variant="profile" />;
  if (error) return <ErrorState message="We could not load your profile." />;

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileCard}>
          <Avatar name={userName || "GlobalTrust Customer"} size="lg" />
          <View style={styles.profileCopy}>
            <Text style={styles.title}>{userName || "GlobalTrust Customer"}</Text>
            <Text style={styles.subtitle}>Mortgage customer</Text>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Settings</Text>
          <Button label="Message relationship manager" onPress={() => undefined} variant="secondary" />
          <Button label="Log out" onPress={handleLogout} variant="ghost" />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background, flexGrow: 1, gap: spacing.lg, padding: spacing.lg },
  profileCard: { alignItems: "center", backgroundColor: colors.surface, borderRadius: radius.lg, gap: spacing.md, padding: spacing["2xl"], ...shadows.md },
  profileCopy: { alignItems: "center", gap: spacing.xs },
  title: { color: colors.textPrimary, fontSize: fontSize["2xl"], fontWeight: fontWeight.bold },
  subtitle: { color: colors.textSecondary, fontSize: fontSize.md },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, gap: spacing.md, padding: spacing.lg, ...shadows.md },
  cardTitle: { color: colors.textPrimary, fontSize: fontSize.lg, fontWeight: fontWeight.bold },
});
