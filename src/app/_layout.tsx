import { useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { colors, spacing } from "@/design-system";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

function RootChrome() {
  const { isConnected, isInternetReachable } = useNetworkStatus();
  const isOffline = !isConnected || !isInternetReachable;
  const insets = useSafeAreaInsets();
  const RootView = Platform.OS === "ios" ? KeyboardAvoidingView : View;
  const rootViewProps = Platform.OS === "ios" ? { behavior: "padding" as const } : {};

  return (
    <RootView {...rootViewProps} style={styles.container}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="application/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="application/new" options={{ headerShown: false }} />
      </Stack>
      {isOffline ? (
        <View style={[styles.banner, { paddingTop: insets.top + spacing.sm }]}>
          <AlertBanner
            variant="warning"
            title="You are offline"
            message="You appear to be offline. Your draft is safe on this device."
          />
        </View>
      ) : null}
    </RootView>
  );
}

export default function RootLayout() {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 60_000,
          },
        },
      }),
    []
  );

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <RootChrome />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  banner: {
    left: 0,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 20,
  },
});
