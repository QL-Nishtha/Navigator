export type ThemeKey = "lunar-dark" | "lunar-light";

export interface AuthTheme {
  key: ThemeKey;
  isDark: boolean;
  bg: string;
  panelBg: string;
  primary: string;
  accent1: string;
  accent2?: string;
  accent3?: string;
  text: string;
  textMuted: string;
  textFaint: string;
  border: string;
  inputBg: string;
  inputBorder: string;
  inputBorderFocus: string;
  buttonBg: string;
  buttonText: string;
  divider: string;
  labelColor: string;
}

export const AUTH_THEMES: Record<ThemeKey, AuthTheme> = {
  "lunar-dark": {
    key: "lunar-dark",
    isDark: true,
    bg: "#05070D",
    panelBg: "#08090F",
    primary: "#FFFFFF",
    accent1: "#4E93AF",
    accent2: "#7BB8D0",
    accent3: "#A8D6E8",
    text: "#FFFFFF",
    textMuted: "rgba(200,212,236,0.65)",
    textFaint: "rgba(200,212,236,0.28)",
    border: "rgba(255,255,255,0.08)",
    inputBg: "rgba(255,255,255,0.05)",
    inputBorder: "rgba(255,255,255,0.10)",
    inputBorderFocus: "rgba(88,236,255,0.50)",
    buttonBg: "#FFFFFF",
    buttonText: "#05070D",
    divider: "rgba(255,255,255,0.08)",
    labelColor: "rgba(200,212,236,0.55)",
  },
  "lunar-light": {
    key: "lunar-light",
    isDark: false,
    bg: "#F0F2F8",
    panelBg: "#FFFFFF",
    primary: "#1A1C24",
    accent1: "#1E4FAA",
    accent2: "#1060C8",
    accent3: "#2870CC",
    text: "#1A1C24",
    textMuted: "rgba(28,32,50,0.75)",
    textFaint: "rgba(28,32,50,0.42)",
    border: "rgba(28,32,50,0.08)",
    inputBg: "#F7F8FC",
    inputBorder: "rgba(28,32,50,0.12)",
    inputBorderFocus: "rgba(30,79,170,0.45)",
    buttonBg: "#1A1C24",
    buttonText: "#FFFFFF",
    divider: "rgba(28,32,50,0.08)",
    labelColor: "rgba(28,32,50,0.55)",
  },
};
