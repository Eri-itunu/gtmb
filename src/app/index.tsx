import { useEffect, useState } from "react";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { colors, fontSize, fontWeight, radius, shadows, spacing } from "@/design-system";
import { onboardingSchema } from "@/lib/schemas";
import { useOnboardingStore } from "@/store/onboardingStore";

export default function OnboardingScreen() {
  const hasOnboarded = useOnboardingStore((state) => state.hasOnboarded);
  const setUserName = useOnboardingStore((state) => state.setUserName);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (hasOnboarded) router.replace("/(tabs)/dashboard" as never);
  }, [hasOnboarded]);

  const handleSubmit = () => {
    const result = onboardingSchema.safeParse({ userName: name });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Please enter your full name.");
      return;
    }
    setUserName(result.data.userName);
    router.replace("/(tabs)/dashboard" as never);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.decorCircle} pointerEvents="none" />
      <View style={styles.decorCircleSmall} pointerEvents="none" />
      <View style={styles.wordmark}>
        <Text style={styles.logo}>GlobalTrust</Text>
        <Text style={styles.logoSub}>Mortgage Bank</Text>
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>Welcome to GlobalTrust</Text>
        <Text style={styles.subtitle}>Nigeria&apos;s trusted mortgage partner</Text>
      </View>
      <View style={styles.form}>
        <FormField
          error={error}
          label="Full name"
          onChangeText={(text) => {
            setName(text);
            setError("");
          }}
          placeholder="Enter your full name"
          required
          value={name}
        />
        <Button fullWidth label="Get Started" onPress={handleSubmit} size="lg" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.teal[600], flexGrow: 1, gap: spacing["3xl"], justifyContent: "center", overflow: "hidden", padding: spacing["2xl"] },
  decorCircle: {
    backgroundColor: "rgba(255,255,255,0.20)",
    borderRadius: 100,
    height: 200,
    position: "absolute",
    right: -50,
    top: -70,
    width: 200,
  },
  decorCircleSmall: {
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: 70,
    bottom: 64,
    height: 140,
    left: -46,
    position: "absolute",
    width: 140,
  },
  wordmark: { alignItems: "center", gap: spacing.xs },
  logo: { color: colors.surface, fontSize: fontSize["3xl"], fontWeight: fontWeight.bold },
  logoSub: { color: colors.surface, fontSize: fontSize.md, fontWeight: fontWeight.semibold, opacity: 0.82 },
  copy: { alignItems: "center", gap: spacing.sm },
  title: { color: colors.surface, fontSize: fontSize["2xl"], fontWeight: fontWeight.bold, textAlign: "center" },
  subtitle: { color: colors.teal[50], fontSize: fontSize.md, textAlign: "center" },
  form: { backgroundColor: colors.surface, borderRadius: radius.lg, gap: spacing.lg, padding: spacing.lg, ...shadows.md },
});
