import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeSwitcher from "./ThemeSwitcher";
import { useGlobalStore, setTheme } from "../store/useGlobalStore";

beforeEach(() => {
  setTheme("light");
});

describe("ThemeSwitcher", () => {
  it("toggles theme on click", async () => {
    render(<ThemeSwitcher />);
    expect(useGlobalStore.getState().theme).toBe("light");

    await userEvent.click(screen.getByRole("button"));
    expect(useGlobalStore.getState().theme).toBe("dark");

    await userEvent.click(screen.getByRole("button"));
    expect(useGlobalStore.getState().theme).toBe("light");
  });

  it("applies the .dark class on the html element when dark", async () => {
    render(<ThemeSwitcher />);
    await userEvent.click(screen.getByRole("button"));
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
