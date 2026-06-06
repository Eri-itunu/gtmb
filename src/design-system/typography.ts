import { fontSize, fontWeight, lineHeight } from "./tokens";

export const typography = {
  title: { fontSize: fontSize["3xl"], fontWeight: fontWeight.bold, lineHeight: fontSize["3xl"] * lineHeight.tight },
  heading: { fontSize: fontSize["2xl"], fontWeight: fontWeight.bold, lineHeight: fontSize["2xl"] * lineHeight.tight },
  subtitle: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold, lineHeight: fontSize.lg * lineHeight.normal },
  body: { fontSize: fontSize.md, fontWeight: fontWeight.regular, lineHeight: fontSize.md * lineHeight.normal },
  bodyMedium: { fontSize: fontSize.md, fontWeight: fontWeight.medium, lineHeight: fontSize.md * lineHeight.normal },
  caption: { fontSize: fontSize.sm, fontWeight: fontWeight.regular, lineHeight: fontSize.sm * lineHeight.normal },
  label: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, lineHeight: fontSize.sm * lineHeight.normal },
  tiny: { fontSize: fontSize.xs, fontWeight: fontWeight.medium, lineHeight: fontSize.xs * lineHeight.normal },
} as const;
