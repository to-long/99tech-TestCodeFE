import { useState } from "react";
import { Link, Copy, Check } from "lucide-react";
import { useSwapStore } from "../../SwapToken/store/useSwapStore";
import { useT } from "@shared/hooks/useT";
import { copyToClipboard } from "../utils/clipboard";
import SectionHeader from "./SectionHeader";

const COPIED_FEEDBACK_MS = 1500;

export default function ApiEndpointSection() {
  const t = useT();
  const apiEndpoint = useSwapStore((s) => s.apiEndpoint);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    copyToClipboard(apiEndpoint);
    setCopied(true);
    setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS);
  }

  return (
    <div className="flex flex-col gap-2">
      <SectionHeader
        label={t("settings.apiEndpoint")}
        tooltip={t("settings.apiEndpointTip")}
      />
      <div className="flex h-11 items-center gap-2 rounded-lg bg-[var(--s-field)] px-3.5">
        <Link size={14} className="shrink-0 text-[var(--s-text-sub)]" />
        <span className="flex-1 truncate font-['Geist'] text-[13px] text-[var(--s-text)]">
          {apiEndpoint}
        </span>
        <button
          onClick={handleCopy}
          className="shrink-0 cursor-pointer transition-colors duration-200"
        >
          {copied ? (
            <Check size={14} className="text-[var(--s-btn)]" />
          ) : (
            <Copy size={14} className="text-[var(--s-text-sub)]" />
          )}
        </button>
      </div>
    </div>
  );
}
