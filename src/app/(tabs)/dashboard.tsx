import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, TextInput, View, Text } from "react-native";
import { AsyncBoundary } from "@/components/AsyncBoundary";
import { ApplicationsListSkeleton } from "@/components/skeletons/ApplicationsListSkeleton";
import { AppHeader } from "@/components/ui/AppHeader";
import { ApplicationCard } from "@/components/ui/ApplicationCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { colors, radius, shadows, spacing, fontSize, fontWeight, palette } from "@/design-system";
import { useApplications } from "@/hooks/useApplications";
import { useOnboardingStore } from "@/store/onboardingStore";
import { useUIStore } from "@/store/uiStore";
import { ApplicationStatus } from "@/api/types";
import { FILTER_OPTIONS } from "@/lib/constants";


const TABS = [
  { key: "applications", label: "Applications" },
  { key: "repayments",   label: "Repayments" },
  { key: "documents",    label: "Documents" },
];


export default function DashboardScreen() {
  const userName      = useOnboardingStore((state) => state.userName);
  const setSearchQuery = useUIStore((state) => state.setSearchQuery);
  const setFilterChip  = useUIStore((state) => state.setFilterChip);
  const filterChip = useUIStore((state) => state.filterChip);
  const searchQuery = useUIStore((state) => state.searchQuery);
  const [activeTab, setActiveTab] = useState("applications");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const query = useApplications();

  const handleTabPress = (key: string) => {
    setActiveTab(key);
    setSearchQuery("");
    setFilterChip("all");
  };

  return (
    <View style={styles.screen}>
      
      <AppHeader
        userName={userName}
        tabs={TABS}
        activeTab={activeTab}
        onTabPress={handleTabPress}
        onAvatarPress={() => router.push("/profile" as never)}
      />

      
      {activeTab === "applications" && (
        <AsyncBoundary
          query={{
            data: query.data,
            error: query.error,
            isLoading: query.isLoading,
            refetch: () => {
              void query.refetch();
            },
          }}
          skeleton={<ApplicationsListSkeleton />}
          empty={<EmptyApplications />}
          isEmpty={(data) => data.applications.length === 0}
        >
          {() => (
            <FlatList
              ListHeaderComponent={
                <View style={styles.header}>
                  <View style={[styles.searchShell, isSearchFocused && styles.searchShellFocused]}>
                    <Ionicons color={colors.textDisabled} name="search" size={18} />
                    <TextInput
                      onBlur={() => setIsSearchFocused(false)}
                      onChangeText={setSearchQuery}
                      onFocus={() => setIsSearchFocused(true)}
                      placeholder="Search by property or applicant"
                      placeholderTextColor={colors.textDisabled}
                      style={styles.searchInput}
                      value={searchQuery}
                    />
                  </View>
                  <FlatList
                    data={FILTER_OPTIONS}
                    horizontal
                    keyExtractor={(item) => item.value}
                    renderItem={({ item }) => (
                      <Pressable
                        onPress={() => setFilterChip(item.value as ApplicationStatus | "all")}
                        style={[styles.chip, filterChip === item.value && styles.chipActive]}
                      >
                        <Text style={[styles.chipText, filterChip === item.value && styles.chipTextActive]}>{item.label}</Text>
                      </Pressable>
                    )}
                    showsHorizontalScrollIndicator={false}
                    style={styles.chipList}
                  />
                </View>
              }
              ListEmptyComponent={
                <EmptyState
                  action={{ label: "Start application", onPress: () => router.push("/application/new" as never) }}
                  title="No applications found"
                  message="Try a different filter or begin a new mortgage application."
                />
              }
              contentContainerStyle={styles.listContent}
              data={query.applications}
              keyExtractor={(item) => item.id}
              onRefresh={query.refetch}
              refreshing={query.isRefetching}
              renderItem={({ item }) => (
                <ApplicationCard
                  applicantName={item.applicantName}
                  applicationNumber={item.applicationNumber}
                  id={item.id}
                  loanAmount={item.loanAmountKobo}
                  mortgageType={item.mortgageType}
                  nudgeText={item.nudgeText}
                  onPress={() => router.push(`/application/${item.id}` as never)}
                  progressPercent={item.progressPercent}
                  propertyAddress={item.propertyAddress}
                  status={item.status}
                  updatedAt={item.updatedAt}
                />
              )}
            />
          )}
        </AsyncBoundary>
      )}

      {activeTab === "repayments" && (
        <EmptyState
          title="No repayments yet"
          message="Repayment details will appear here once your mortgage is disbursed."
          icon={<Ionicons name="card-outline" size={40} color={colors.textDisabled} />}
        />
      )}

      {activeTab === "documents" && (
        <EmptyState
          title="No documents yet"
          message="Documents related to your applications will appear here."
          icon={<Ionicons name="document-outline" size={40} color={colors.textDisabled} />}
        />
      )}

      {/* FAB */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Start new application"
        onPress={() => router.push("/application/new" as never)}
        style={styles.fab}
      >
        <Ionicons color={colors.surface} name="add" size={28} />
      </Pressable>
    </View>
  );
}

function EmptyApplications() {
  return (
    <EmptyState
      action={{ label: "Start New Application", onPress: () => router.push("/application/new" as never) }}
      title="No applications yet"
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    gap: spacing.md,
    padding: spacing.lg,
    paddingBottom: spacing["4xl"] + 56 + spacing.lg,
  },
  header: { gap: spacing.md, paddingBottom: spacing.sm },
  fab: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    bottom: spacing["2xl"],
    height: 56,
    justifyContent: "center",
    position: "absolute",
    right: spacing["2xl"],
    width: 56,
    ...shadows.lg,
  },
  searchShell: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  searchShellFocused: { borderColor: colors.success.text },
  searchInput: { color: colors.textPrimary, flex: 1, fontSize: fontSize.md },
  chipList: { flexGrow: 0 },
  chip: {
    // backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.full,
    borderWidth: 1,
    marginRight: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chipActive: { backgroundColor: palette.secondary[100], borderColor: colors.secondary },
  chipText: { color: palette.gray[500], fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
  chipTextActive: { color: colors.secondary },
});
