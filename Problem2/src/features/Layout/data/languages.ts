import type { Language } from "../store/useGlobalStore";

export interface LanguageOption {
  code: Language;
  label: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "EN", label: "English", flag: "🇬🇧" },
  { code: "ZH", label: "中文", flag: "🇨🇳" },
  { code: "TH", label: "ไทย", flag: "🇹🇭" },
];
