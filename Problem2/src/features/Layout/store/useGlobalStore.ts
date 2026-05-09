import { createStore } from "@lib/zustand/createStore";

export type Language = "EN" | "ZH" | "TH";
type Theme = "light" | "dark";

export const LOCALE_MAP: Record<Language, string> = {
  EN: "en",
  ZH: "zh",
  TH: "th",
};

interface GlobalState {
  language: Language;
  theme: Theme;
}

const ACTIONS = {
  setLanguage: "global/language:set",
  setTheme: "global/theme:set",
} as const;

export const useGlobalStore = createStore<GlobalState>(
  () => ({
    language: "EN",
    theme: "light",
  }),
  "GlobalStore",
);

export function setLanguage(language: Language): void {
  useGlobalStore.setState({ language }, false, ACTIONS.setLanguage);
}

function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function setTheme(theme: Theme): void {
  useGlobalStore.setState({ theme }, false, ACTIONS.setTheme);
  applyTheme(theme);
}

export function toggleTheme(): void {
  const next = useGlobalStore.getState().theme === "light" ? "dark" : "light";
  useGlobalStore.setState({ theme: next }, false, ACTIONS.setTheme);
  applyTheme(next);
}

// Apply initial theme
applyTheme(useGlobalStore.getState().theme);
