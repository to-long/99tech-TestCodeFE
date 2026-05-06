export const SLIPPAGE_PRESETS = [
  { value: 0.1, label: "0.1%" },
  { value: 0.5, label: "0.5%" },
  { value: 1.0, label: "1.0%" },
] as const;

export const REFRESH_RATES = [
  { value: 5, label: "5s" },
  { value: 10, label: "10s" },
  { value: 30, label: "30s" },
  { value: 60, label: "60s" },
] as const;
