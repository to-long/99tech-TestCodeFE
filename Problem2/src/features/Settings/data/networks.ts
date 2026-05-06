export interface Network {
  id: string;
  name: string;
  gas: string;
  color: string;
  icon: string;
}

export const NETWORKS: Network[] = [
  { id: "ethereum", name: "Ethereum", gas: "~$2.45", color: "#627EEA", icon: "Ξ" },
  { id: "polygon", name: "Polygon", gas: "~$0.02", color: "#8247E5", icon: "P" },
  { id: "bnb", name: "BNB Chain", gas: "~$0.15", color: "#F3BA2F", icon: "B" },
  { id: "optimism", name: "Optimism", gas: "~$0.08", color: "#FF0420", icon: "O" },
  { id: "arbitrum", name: "Arbitrum", gas: "~$0.12", color: "#28A0F0", icon: "A" },
];

export function getNetwork(id: string): Network {
  return NETWORKS.find((n) => n.id === id) ?? NETWORKS[0];
}
