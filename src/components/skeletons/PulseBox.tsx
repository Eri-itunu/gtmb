import { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { radius } from "@/design-system";

interface PulseBoxProps {
  height: number;
  width?: number | `${number}%`;
  borderRadius?: number;
  color?: string;
}

export function PulseBox({ height, width = "100%", borderRadius = radius.md, color = "#E5E7EB" }: PulseBoxProps) {
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { duration: 700, toValue: 1, useNativeDriver: true }),
        Animated.timing(opacity, { duration: 700, toValue: 0.45, useNativeDriver: true }),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return <Animated.View style={[styles.box, { backgroundColor: color, borderRadius, height, opacity, width }]} />;
}

const styles = StyleSheet.create({
  box: {},
});
