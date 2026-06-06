
/**
 * DashboardTabs
 *
 * Horizontal tab strip that sits directly below AppHeader.
 * - White (or light) background
 * - Amber underline on the active tab
 * - Scrollable when there are more tabs than fit the screen width
 * - Press ripple on Android via TouchableNativeFeedback
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  LayoutChangeEvent,
  Platform,
} from "react-native";

// ─── Design tokens ────────────────────────────────────────────────────────────

const AMBER = "#F59E0B";
const NAVY = "#0F2340";
const GRAY_500 = "#6B7280";
const WHITE = "#FFFFFF";
const BORDER = "#E5E7EB";
const INDICATOR_HEIGHT = 3;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DashboardTab {
  key: string;
  label: string;
  /** Optional badge count shown as a red dot */
  badge?: number;
}

export interface DashboardTabsProps {
  tabs: DashboardTab[];
  activeKey: string;
  onTabPress: (key: string) => void;
  /** Background of the tab strip. Default: white */
  backgroundColor?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const DashboardTabs: React.FC<DashboardTabsProps> = ({
  tabs,
  activeKey,
  onTabPress,
  backgroundColor = WHITE,
}) => {
  // Store the measured x + width of each tab so we can slide the indicator
  const tabLayouts = useRef<Record<string, { x: number; width: number }>>({});
  const [indicatorX] = useState(() => new Animated.Value(0));
  const [indicatorW] = useState(() => new Animated.Value(0));
  const scrollRef = useRef<ScrollView>(null);

  const animateIndicator = useCallback(
    (key: string) => {
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

      // Scroll active tab into view
      scrollRef.current?.scrollTo({ x: Math.max(0, layout.x - 16), animated: true });
    },
    [indicatorW, indicatorX]
  );

  // Animate whenever activeKey changes
  useEffect(() => {
    animateIndicator(activeKey);
  }, [activeKey, animateIndicator]);

  const handleLayout = (key: string) => (e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    tabLayouts.current[key] = { x, width };
    // Initialise indicator position on first render of the active tab
    if (key === activeKey) {
      indicatorX.setValue(x);
      indicatorW.setValue(width);
    }
  };

  return (
    <View style={[styles.wrapper, { backgroundColor }]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >
        {tabs.map((tab) => {
          const isActive = tab.key === activeKey;

          return (
            <TouchableOpacity
              key={tab.key}
              activeOpacity={0.7}
              onPress={() => onTabPress(tab.key)}
              onLayout={handleLayout(tab.key)}
              style={[styles.tab, isActive && styles.tabActive]}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={tab.label}
            >
              <View style={styles.labelRow}>
                <Text
                  style={[styles.tabLabel, isActive && styles.tabLabelActive]}
                  numberOfLines={1}
                >
                  {tab.label}
                </Text>

                {/* Badge dot */}
                {tab.badge !== undefined && tab.badge > 0 ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {tab.badge > 99 ? "99+" : tab.badge}
                    </Text>
                  </View>
                ) : null}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Sliding amber underline indicator */}
        <Animated.View
          style={[
            styles.indicator,
            {
              left: indicatorX,
              width: indicatorW,
            },
          ]}
        />
      </ScrollView>

      {/* Bottom border line under the entire strip */}
      <View style={styles.bottomBorder} />
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },

  scrollContent: {
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "stretch",
  },

  tab: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },

  tabActive: {
    // Active tab gets a very faint amber tint on its background
    // handled via the indicator — keep background transparent here
  },

  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  tabLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: GRAY_500,
    letterSpacing: 0.1,
  },

  tabLabelActive: {
    color: NAVY,
    fontWeight: "700",
  },

  // Badge pill
  badge: {
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: WHITE,
    fontSize: 10,
    fontWeight: "700",
    lineHeight: 12,
  },

  // Amber sliding underline
  indicator: {
    position: "absolute",
    bottom: 0,
    height: INDICATOR_HEIGHT,
    backgroundColor: AMBER,
    borderRadius: INDICATOR_HEIGHT / 2,
  },

  bottomBorder: {
    height: 1,
    backgroundColor: BORDER,
  },
});
