import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl } from "@test/renderWithIntl";
import LanguageSelector from "./LanguageSelector";
import { useGlobalStore, setLanguage } from "../store/useGlobalStore";

beforeEach(() => {
  setLanguage("EN");
});

describe("LanguageSelector", () => {
  it("shows the current language in the trigger", () => {
    renderWithIntl(<LanguageSelector />);
    expect(screen.getByText("EN")).toBeInTheDocument();
  });

  it("opens a dropdown listing all languages", async () => {
    renderWithIntl(<LanguageSelector />);
    await userEvent.click(screen.getByRole("button", { name: /EN/i }));
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("中文")).toBeInTheDocument();
    expect(screen.getByText("ไทย")).toBeInTheDocument();
  });

  it("selecting a language updates the global store", async () => {
    renderWithIntl(<LanguageSelector />);
    await userEvent.click(screen.getByRole("button", { name: /EN/i }));
    await userEvent.click(screen.getByText("中文"));
    expect(useGlobalStore.getState().language).toBe("ZH");
  });
});
