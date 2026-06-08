export const palette = {
  amber: { 50: "#FFFBEB", 300: "#FCD34D", 400: "#FBBF24", 500: "#F59E0B", 600: "#D97706" },
  navy: { 50: "#EFF6FF", 500: "#1E3A5F", 700: "#0F2340", 900: "#071629" },
  teal: { 50: "#F0FDFA", 400: "#2DD4BF", 500: "#14B8A6", 600: "#0D9488" },
  success: { bg: "#ECFDF5", text: "#065F46", border: "#A7F3D0" },
  warning: { bg: "#FFFBEB", text: "#92400E", border: "#FCD34D" },
  error: { bg: "#FEF2F2", text: "#991B1B", border: "#FECACA" },
  info: { bg: "#EFF6FF", text: "#1E40AF", border: "#BFDBFE" },
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },
  secondary: {
    50:"#0D7A5C", 100:"#b5ddd2ff", 200:"#117A55", 300:"#145A3D", 400:"#0A6650"
  },
  white: "#FFFFFF",
  black: "#000000",

};

export const colors = {
  primary: palette.amber[500],
  primaryDark: palette.amber[600],
  appHeader: "#0A5C45",
  secondary: palette.secondary[400],
  background: palette.gray[50],
  surface: palette.white,
  border: palette.gray[200],
  textPrimary: palette.gray[900],
  textSecondary: palette.gray[500],
  textDisabled: palette.gray[400],
  navy: palette.navy,
  teal: palette.teal,
  gray: palette.gray,
  success: palette.success,
  warning: palette.warning,
  error: palette.error,
  info: palette.info,
};
