export { default as Header } from "./components/Header";
export { default as Logo } from "./components/Logo";
export { default as LanguageSelector } from "./components/LanguageSelector";
export { default as ThemeSwitcher } from "./components/ThemeSwitcher";
export {
  useGlobalStore,
  setLanguage,
  setTheme,
  toggleTheme,
  LOCALE_MAP,
} from "./store/useGlobalStore";
export type { Language } from "./store/useGlobalStore";
