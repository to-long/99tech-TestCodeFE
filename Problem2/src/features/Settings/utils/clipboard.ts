/**
 * Best-effort copy to clipboard. Swallows errors silently — call sites
 * should still toggle their "copied" UI state regardless of the result.
 */
export function copyToClipboard(text: string): void {
  try {
    navigator.clipboard?.writeText(text).catch(() => {});
  } catch {
    // clipboard not available; nothing we can do
  }
}
