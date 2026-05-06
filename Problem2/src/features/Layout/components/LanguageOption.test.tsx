import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LanguageOption from "./LanguageOption";

const lang = { code: "EN" as const, label: "English", flag: "🇬🇧" };

describe("LanguageOption", () => {
  it("renders flag, label, and code", () => {
    render(<LanguageOption lang={lang} isSelected={false} onSelect={() => {}} />);
    expect(screen.getByText("🇬🇧")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("EN")).toBeInTheDocument();
  });

  it("invokes onSelect when clicked", async () => {
    const onSelect = vi.fn();
    render(<LanguageOption lang={lang} isSelected={false} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole("button"));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("renders a check icon when selected", () => {
    const { container } = render(
      <LanguageOption lang={lang} isSelected onSelect={() => {}} />,
    );
    // lucide-react Check is an SVG inside the button
    expect(container.querySelector("svg")).toBeTruthy();
  });
});
