import { useRef } from "react";
import { useSwapStore } from "../store/useSwapStore";
import { usePriceFetcher } from "../hooks/usePriceFetcher";
import { useFlipHeight } from "../hooks/useFlipHeight";
import SettingsPanel from "../../Settings/components/SettingsPanel";
import SwapCardBody from "./SwapCardBody";
import SwapTokenSelectorOverlay from "./SwapTokenSelectorOverlay";

/**
 * Top-level swap entry point. Owns the 3D flip between the swap form (front)
 * and settings panel (back), plus the global token-selector overlay.
 */
export default function SwapForm() {
  const settingsOpen = useSwapStore((s) => s.settingsOpen);

  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const height = useFlipHeight(frontRef, backRef, settingsOpen);

  usePriceFetcher();

  return (
    <>
      <div className="w-[380px] [perspective:1200px]">
        <div
          className="relative transition-all duration-500 [transform-style:preserve-3d]"
          style={{
            transform: settingsOpen ? "rotateY(180deg)" : "rotateY(0deg)",
            height: height ?? "auto",
          }}
        >
          <div
            ref={frontRef}
            className="absolute inset-x-0 top-0 [backface-visibility:hidden]"
          >
            <SwapCardBody />
          </div>
          <div
            ref={backRef}
            className="absolute inset-x-0 top-0 [backface-visibility:hidden] [transform:rotateY(180deg)]"
          >
            <SettingsPanel />
          </div>
        </div>
      </div>

      <SwapTokenSelectorOverlay />
    </>
  );
}
