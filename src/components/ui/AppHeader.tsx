import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Animated, LayoutChangeEvent, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { ApplicationStatus } from "@/api/types";
import { StatusBadge } from "@/components/ui/StatusBadge";

const HEADER_GREEN = "#0A5C45";
const WHITE = "#FFFFFF";
const WHITE_70 = "rgba(255,255,255,0.70)";
const WHITE_20 = "rgba(255,255,255,0.20)";
const AMBER = "#F59E0B";
const INDICATOR_H = 3;

export interface DashboardTab {
  key: string;
  label: string;
  badge?: number;
}

export interface AppHeaderProps {
  userName?: string;
  subtitle?: string;
  title?: string;
  headerSubtitle?: string;
  status?: ApplicationStatus;
  showBackButton?: boolean;
  onBackPress?: () => void;
  tabs?: DashboardTab[];
  activeTab?: string;
  onTabPress?: (key: string) => void;
  onAvatarPress?: () => void;
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getAvatarShade = (name: string): string => {
  const shades = ["#0D7A5C", "#0F8A68", "#117A55", "#145A3D", "#0A6650"];
  return shades[name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % shades.length];
};

export function AppHeader({
  userName,
  subtitle = "",
  title,
  headerSubtitle,
  status,
  showBackButton = false,
  onBackPress,
  tabs = [],
  activeTab,
  onTabPress,
  onAvatarPress,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const isInner = showBackButton;
  const displayName = userName ?? "";
  const initials = useMemo(() => getInitials(displayName), [displayName]);
  const avatarShade = useMemo(() => getAvatarShade(displayName), [displayName]);
  const tabLayouts = useRef<Record<string, { x: number; width: number }>>({});
  const [indicatorX] = useState(() => new Animated.Value(0));
  const [indicatorW] = useState(() => new Animated.Value(0));
  const scrollRef = useRef<ScrollView>(null);

  const animateIndicator = useCallback(
    (key?: string) => {
      if (!key) return;
      const layout = tabLayouts.current[key];
      if (!layout) return;
      Animated.parallel([
        Animated.spring(indicatorX, {
          toValue: layout.x,
          useNativeDriver: false,
          damping: 20,
          stiffness: 200,
        }),
        Animated.spring(indicatorW, {
          toValue: layout.width,
          useNativeDriver: false,
          damping: 20,
          stiffness: 200,
        }),
      ]).start();
      scrollRef.current?.scrollTo({ x: Math.max(0, layout.x - 16), animated: true });
    },
    [indicatorW, indicatorX]
  );

  useEffect(() => {
    animateIndicator(activeTab);
  }, [activeTab, animateIndicator]);

  const handleTabLayout = (key: string) => (event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    tabLayouts.current[key] = { x, width };
    if (key === activeTab) {
      indicatorX.setValue(x);
      indicatorW.setValue(width);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top, backgroundColor: HEADER_GREEN }} />
      <View style={styles.headerContent}>

        {isInner ? (
          <View style={styles.innerRow}>
            <TouchableOpacity accessibilityLabel="Go back" accessibilityRole="button" activeOpacity={0.8} onPress={onBackPress ?? router.back} style={styles.backButton}>
              <Ionicons color={WHITE} name="chevron-back" size={24} />
            </TouchableOpacity>
            <View style={styles.innerTitleBlock}>
              <Text numberOfLines={1} style={styles.innerTitle}>{title}</Text>
              {headerSubtitle ? <Text numberOfLines={1} style={styles.innerSubtitle}>{headerSubtitle}</Text> : null}
              {status ? (
                <View style={styles.innerStatus}>
                  <StatusBadge status={status} size="sm" />
                </View>
              ) : null}
            </View>
          </View>
        ) : (
          <>
            <View style={styles.topRow}>
              <View style={styles.greetingBlock}>
                <Text style={styles.welcomeLabel} numberOfLines={1}>Welcome back,</Text>
                <Text adjustsFontSizeToFit numberOfLines={1} style={styles.nameText}>{displayName}</Text>
                <Text style={styles.subtitleText} numberOfLines={2}>{subtitle}</Text>
              </View>
              <TouchableOpacity
                accessibilityLabel={`${displayName}'s profile`}
                accessibilityRole="button"
                activeOpacity={0.8}
                onPress={onAvatarPress}
             
              >
                <View style={[styles.avatar, { backgroundColor: avatarShade }]}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
              </TouchableOpacity>
            </View>
            {tabs.length && activeTab && onTabPress ? (
              <View style={styles.tabsWrapper}>
                <ScrollView ref={scrollRef} bounces={false} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContent}>
                  {tabs.map((tab) => {
                    const isActive = tab.key === activeTab;
                    return (
                      <TouchableOpacity
                        accessibilityLabel={tab.label}
                        accessibilityRole="tab"
                        accessibilityState={{ selected: isActive }}
                        activeOpacity={0.7}
                        key={tab.key}
                        onLayout={handleTabLayout(tab.key)}
                        onPress={() => onTabPress(tab.key)}
                        style={styles.tab}
                      >
                        <View style={styles.tabLabelRow}>
                          <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.label}</Text>
                          {tab.badge !== undefined && tab.badge > 0 ? (
                            <View style={styles.badge}>
                              <Text style={styles.badgeText}>{tab.badge > 99 ? "99+" : tab.badge}</Text>
                            </View>
                          ) : null}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                  <Animated.View style={[styles.indicator, { left: indicatorX, width: indicatorW }]} />
                </ScrollView>
              </View>
            ) : null}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: HEADER_GREEN,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
      },
      android: { elevation: 6 },
    }),
  },
  headerContent: { backgroundColor: HEADER_GREEN, overflow: "hidden", paddingTop: 16 },
  decorCircle: { backgroundColor: WHITE_20, borderRadius: 100, height: 200, position: "absolute", right: -50, top: -70, width: 200 },
  topRow: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", paddingBottom: 4, paddingHorizontal: 20 },
  greetingBlock: { flex: 1, marginRight: 16 },
  welcomeLabel: { color: WHITE_70, fontSize: 13, fontWeight: "400", letterSpacing: 0.3, marginBottom: 2 },
  nameText: { color: WHITE, fontSize: 22, fontWeight: "700", letterSpacing: -0.3, marginBottom: 4 },
  subtitleText: { color: WHITE_70, fontSize: 13, lineHeight: 18 },
  avatarRing: { alignItems: "center", borderColor: AMBER, borderRadius: 26, borderWidth: 2, height: 52, justifyContent: "center", padding: 2, width: 52 },
  avatar: { alignItems: "center", borderRadius: 22, height: 44, justifyContent: "center", width: 44 },
  avatarText: { color: WHITE, fontSize: 16, fontWeight: "700", letterSpacing: 0.5 },
  tabsWrapper: {},
  tabsContent: { flexDirection: "row", paddingHorizontal: 20 },
  tab: { alignItems: "center", justifyContent: "center", marginRight: 24, paddingHorizontal: 4, paddingVertical: 12 },
  tabLabelRow: { alignItems: "center", flexDirection: "row", gap: 6 },
  tabLabel: { color: WHITE_70, fontSize: 14, fontWeight: "500", letterSpacing: 0.1 },
  tabLabelActive: { color: WHITE, fontWeight: "700" },
  badge: { alignItems: "center", backgroundColor: "#EF4444", borderRadius: 10, height: 18, justifyContent: "center", minWidth: 18, paddingHorizontal: 4 },
  badgeText: { color: WHITE, fontSize: 10, fontWeight: "700" },
  indicator: { backgroundColor: AMBER, borderRadius: INDICATOR_H / 2, bottom: 0, height: INDICATOR_H, position: "absolute" },
  innerRow: { alignItems: "flex-start", flexDirection: "row", gap: 12, minHeight: 56, paddingBottom: 16, paddingHorizontal: 16 },
  backButton: { alignItems: "center", backgroundColor: "rgba(255,255,255,0.16)", borderRadius: 18, height: 36, justifyContent: "center", width: 36 },
  innerTitleBlock: { alignItems: "flex-start", flex: 1, gap: 2 },
  innerTitle: { color: WHITE, fontSize: 17, fontWeight: "700", textAlign: "left" },
  innerSubtitle: { color: WHITE_70, fontSize: 12, fontWeight: "500", textAlign: "left" },
  innerStatus: { alignItems: "flex-start", paddingTop: 6 },
});
