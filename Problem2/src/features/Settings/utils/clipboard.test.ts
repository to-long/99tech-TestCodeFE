import { describe, expect, it, vi, afterEach } from "vitest";
import { copyToClipboard } from "./clipboard";

const originalClipboard = navigator.clipboard;

afterEach(() => {
  Object.defineProperty(navigator, "clipboard", {
    value: originalClipboard,
    configurable: true,
  });
});

function stubClipboard(impl: { writeText: () => Promise<void> } | undefined) {
  Object.defineProperty(navigator, "clipboard", {
    value: impl,
    configurable: true,
  });
}

describe("copyToClipboard", () => {
  it("calls navigator.clipboard.writeText with the given text", () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    stubClipboard({ writeText });

    copyToClipboard("hello");

    expect(writeText).toHaveBeenCalledWith("hello");
  });

  it("swallows promise rejection", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("nope"));
    stubClipboard({ writeText });

    expect(() => copyToClipboard("x")).not.toThrow();
    // Allow the rejection to settle
    await Promise.resolve();
  });

  it("does not throw when clipboard is undefined", () => {
    stubClipboard(undefined);
    expect(() => copyToClipboard("x")).not.toThrow();
  });
});
