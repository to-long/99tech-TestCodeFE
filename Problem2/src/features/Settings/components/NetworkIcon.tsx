import type { Network } from "../data/networks";

interface Props {
  network: Network;
  size?: "sm" | "md";
}

/** Small colored circle with the network's letter/symbol. */
export default function NetworkIcon({ network, size = "md" }: Props) {
  const dims = size === "sm" ? "h-3 w-3" : "h-6 w-6";
  const text = size === "sm" ? "text-[6px]" : "text-[8px]";
  return (
    <div
      className={`flex ${dims} items-center justify-center rounded-full border border-[var(--s-border-icon)]`}
      style={{ backgroundColor: network.color }}
    >
      <span className={`${text} font-bold text-white`}>{network.icon}</span>
    </div>
  );
}
