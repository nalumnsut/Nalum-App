import "@/global.css";

import { Platform } from "react-native";

const palette = {
  black: "#000000",
  nearBlack: "#070707",
  charcoal: "#1A1A1A",
  charcoalRaised: "#242424",
  charcoalSelected: "#303030",
  border: "#333333",
  borderStrong: "#454545",
  white: "#FFFFFF",
  text: "#F5F5F5",
  textMuted: "#B6B6B6",
  textSubtle: "#818181",
  red: "#E50914",
  redPressed: "#B90710",
  redDark: "#86070D",
  errorSurface: "#210B0D",
  success: "#38D27A",
  successSurface: "#0E2217",
} as const;

export const Colors = {
  light: {
    text: palette.text,
    background: palette.black,
    backgroundElement: palette.charcoal,
    backgroundSelected: palette.charcoalSelected,
    textSecondary: palette.textMuted,
    textSubtle: palette.textSubtle,
    border: palette.border,
    borderStrong: palette.borderStrong,
    primary: palette.red,
    primaryPressed: palette.redPressed,
    primaryDark: palette.redDark,
    card: palette.nearBlack,
    cardRaised: palette.charcoalRaised,
    input: palette.charcoal,
    error: palette.red,
    errorSurface: palette.errorSurface,
    success: palette.success,
    successSurface: palette.successSurface,
    inverseText: palette.white,
  },
  dark: {
    text: palette.text,
    background: palette.black,
    backgroundElement: palette.charcoal,
    backgroundSelected: palette.charcoalSelected,
    textSecondary: palette.textMuted,
    textSubtle: palette.textSubtle,
    border: palette.border,
    borderStrong: palette.borderStrong,
    primary: palette.red,
    primaryPressed: palette.redPressed,
    primaryDark: palette.redDark,
    card: palette.nearBlack,
    cardRaised: palette.charcoalRaised,
    input: palette.charcoal,
    error: palette.red,
    errorSurface: palette.errorSurface,
    success: palette.success,
    successSurface: palette.successSurface,
    inverseText: palette.white,
  },
} as const;

export type ThemeMode = keyof typeof Colors;
export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: "Roboto",
    serif: "ui-serif",
    rounded: "Roboto",
    mono: "ui-monospace",
  },
  default: {
    sans: "Roboto",
    serif: "serif",
    rounded: "Roboto",
    mono: "monospace",
  },
  web: {
    sans: "var(--font-display)",
    serif: "var(--font-serif)",
    rounded: "var(--font-display)",
    mono: "var(--font-mono)",
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 24,
  six: 32,
  seven: 48,
  eight: 64,
} as const;

export const Radius = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 16,
  round: 999,
} as const;

export const Typography = {
  hero: {
    fontFamily: Fonts.sans,
    fontSize: 36,
    lineHeight: 42,
    fontWeight: "300",
  },
  title: {
    fontFamily: Fonts.sans,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700",
  },
  section: {
    fontFamily: Fonts.sans,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700",
  },
  body: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "400",
  },
  small: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400",
  },
  label: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
  },
  button: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "700",
  },
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80, web: 84 }) ?? 0;
export const MaxContentWidth = 1040;
