import { useState } from "react";
import { useSwapStore, setDeadline } from "../../SwapToken/store/useSwapStore";
import { useT } from "../../../shared/hooks/useT";
import SectionHeader from "./SectionHeader";

export default function DeadlineSection() {
  const t = useT();
  const deadline = useSwapStore((s) => s.deadline);
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(String(deadline));

  function commit() {
    const parsed = parseInt(input, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setDeadline(parsed);
    } else {
      setInput(String(deadline));
    }
    setEditing(false);
  }

  return (
    <div className="flex flex-col gap-3">
      <SectionHeader label={t("settings.deadline")} tooltip={t("settings.deadlineTip")} />
      <div
        className="flex h-11 cursor-text items-center justify-between rounded-lg bg-[var(--s-field)] px-3.5"
        onClick={() => {
          setEditing(true);
          setInput(String(deadline));
        }}
      >
        {editing ? (
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => e.key === "Enter" && commit()}
            autoFocus
            className="w-16 bg-transparent font-['Inter'] text-[15px] font-medium text-[var(--s-text)] outline-none"
          />
        ) : (
          <span className="font-['Inter'] text-[15px] font-medium text-[var(--s-text)]">
            {deadline}
          </span>
        )}
        <span className="font-['Inter'] text-sm text-[var(--s-text-dim)]">
          {t("settings.deadlineUnit")}
        </span>
      </div>
    </div>
  );
}
