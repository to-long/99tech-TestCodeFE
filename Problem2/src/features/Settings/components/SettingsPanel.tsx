import SettingsHeader from "./SettingsHeader";
import SlippageSection from "./SlippageSection";
import NetworkSection from "./NetworkSection";
import RefreshRateSection from "./RefreshRateSection";
import ApiEndpointSection from "./ApiEndpointSection";

export default function SettingsPanel() {
  return (
    <div className="mx-auto w-full max-w-[380px] rounded-2xl bg-[var(--s-card)] shadow-[0_8px_24px_var(--s-shadow)] transition-colors duration-300">
      <SettingsHeader />
      <div className="flex flex-col gap-4 px-5 pb-5 pt-3">
        <SlippageSection />
        <NetworkSection />
        <RefreshRateSection />
        <ApiEndpointSection />
      </div>
    </div>
  );
}
