import { useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { colors, spacing } from "@/design-system";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

function RootChrome() {
  const { isConnected, isInternetReachable } = useNetworkStatus();
  const isOffline = !isConnected || !isInternetReachable;
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {isOffline ? (
        <View style={[styles.banner, { paddingTop: insets.top + spacing.sm }]}>
          <AlertBanner
            variant="warning"
            title="You are offline"
            message="Some mortgage updates may be delayed until your connection returns."
          />
        </View>
      ) : null}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="application/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="application/new" options={{ headerShown: false }} />
        <Stack.Screen name="applications/new" options={{ headerShown: false }} />
      </Stack>
    </View>
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
  banner: { paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
});
