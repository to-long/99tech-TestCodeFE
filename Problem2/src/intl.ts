import layoutEn from "./features/Layout/intl/en.json";
import layoutZh from "./features/Layout/intl/zh.json";
import layoutTh from "./features/Layout/intl/th.json";
import swapEn from "./features/SwapToken/intl/en.json";
import swapZh from "./features/SwapToken/intl/zh.json";
import swapTh from "./features/SwapToken/intl/th.json";
import settingsEn from "./features/Settings/intl/en.json";
import settingsZh from "./features/Settings/intl/zh.json";
import settingsTh from "./features/Settings/intl/th.json";
import selectTokenEn from "./features/SelectToken/intl/en.json";
import selectTokenZh from "./features/SelectToken/intl/zh.json";
import selectTokenTh from "./features/SelectToken/intl/th.json";

/** Merged translation messages keyed by locale. */
export const messages: Record<string, Record<string, string>> = {
  en: { ...layoutEn, ...swapEn, ...settingsEn, ...selectTokenEn },
  zh: { ...layoutZh, ...swapZh, ...settingsZh, ...selectTokenZh },
  th: { ...layoutTh, ...swapTh, ...settingsTh, ...selectTokenTh },
};
