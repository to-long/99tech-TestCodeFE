import { describe, expect, it, beforeEach } from "vitest";
import {
  useGlobalStore,
  setLanguage,
  setTheme,
  toggleTheme,
  LOCALE_MAP,
} from "./useGlobalStore";

describe("useGlobalStore", () => {
  beforeEach(() => {
    // Reset to defaults
    setLanguage("EN");
    setTheme("light");
  });

  it("starts with EN + light defaults", () => {
    const state = useGlobalStore.getState();
    expect(state.language).toBe("EN");
    expect(state.theme).toBe("light");
  });

  it("setLanguage updates the store", () => {
    setLanguage("ZH");
    expect(useGlobalStore.getState().language).toBe("ZH");
    setLanguage("TH");
    expect(useGlobalStore.getState().language).toBe("TH");
  });

  it("setTheme updates the store and toggles the html dark class", () => {
    setTheme("dark");
    expect(useGlobalStore.getState().theme).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    setTheme("light");
    expect(useGlobalStore.getState().theme).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("toggleTheme flips between light and dark", () => {
    expect(useGlobalStore.getState().theme).toBe("light");
    toggleTheme();
    expect(useGlobalStore.getState().theme).toBe("dark");
    toggleTheme();
    expect(useGlobalStore.getState().theme).toBe("light");
  });

  it("LOCALE_MAP exposes ICU locales for each Language", () => {
    expect(LOCALE_MAP).toEqual({ EN: "en", ZH: "zh", TH: "th" });
  });
});
