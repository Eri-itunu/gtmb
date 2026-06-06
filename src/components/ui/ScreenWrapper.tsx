import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/design-system";

interface ScreenWrapperProps {
  children: React.ReactNode;
  backgroundColor?: string;
  /**
   * Which edges to apply safe area padding to.
   * Default: top + bottom. Pass [] to opt out entirely (e.g. full-bleed hero screens).
   */
  edges?: ("top" | "bottom" | "left" | "right")[];
  /**
   * Extra padding added on top of the safe area inset.
   * Useful for screens with a custom header that needs breathing room.
   */
  extraTopPadding?: number;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  backgroundColor = colors.background,
  edges = ["top"],
  extraTopPadding = 0,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          paddingTop: edges.includes("top") ? insets.top + extraTopPadding : extraTopPadding,
          paddingBottom: edges.includes("bottom") ? insets.bottom : 0,
          paddingLeft: edges.includes("left") ? insets.left : 0,
          paddingRight: edges.includes("right") ? insets.right : 0,
        },
      ]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={backgroundColor}
        translucent
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
