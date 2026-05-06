import {
  useSwapStore,
  setExpertMode,
  setMultihopTrades,
} from "../../SwapToken/store/useSwapStore";
import { useT } from "../../../shared/hooks/useT";
import SettingsHeader from "./SettingsHeader";
import SlippageSection from "./SlippageSection";
import DeadlineSection from "./DeadlineSection";
import NetworkSection from "./NetworkSection";
import RefreshRateSection from "./RefreshRateSection";
import ApiEndpointSection from "./ApiEndpointSection";
import ToggleRow from "./ToggleRow";

export default function SettingsPanel() {
  const t = useT();
  const expertMode = useSwapStore((s) => s.expertMode);
  const multihopTrades = useSwapStore((s) => s.multihopTrades);

  return (
    <div className="w-[380px] rounded-2xl bg-[var(--s-card)] shadow-[0_8px_24px_var(--s-shadow)] transition-colors duration-300">
      <SettingsHeader />
      <div className="flex flex-col gap-4 px-5 pb-5 pt-3">
        <SlippageSection />
        <DeadlineSection />
        <NetworkSection />
        <RefreshRateSection />
        <ApiEndpointSection />
        <ToggleRow
          label={t("settings.expertMode")}
          description={t("settings.expertModeDesc")}
          checked={expertMode}
          onChange={setExpertMode}
        />
        <ToggleRow
          label={t("settings.multihop")}
          description={t("settings.multihopDesc")}
          checked={multihopTrades}
          onChange={setMultihopTrades}
        />
      </div>
    </div>
  );
}
