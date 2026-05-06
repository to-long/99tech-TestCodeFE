import { ArrowUpDown } from "lucide-react";

interface Props {
  swapping: boolean;
  onClick: () => void;
}

/** Round button that flips between the from/to cards and triggers the swap animation. */
export default function SwapDirectionButton({ swapping, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="absolute left-1/2 top-[97px] z-10 flex h-8 w-8 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full bg-[var(--s-btn)] shadow-[0_4px_8px_#2D5E3A30] hover:bg-[var(--s-btn-hover)] hover:shadow-[0_4px_12px_#2D5E3A50]"
      style={{
        transition: swapping ? "transform 400ms cubic-bezier(.4,0,.2,1)" : "none",
        rotate: swapping ? "180deg" : "0deg",
      }}
    >
      <ArrowUpDown size={14} className="text-white" />
    </button>
  );
}
