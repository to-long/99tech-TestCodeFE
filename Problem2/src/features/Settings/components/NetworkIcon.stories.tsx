import type { Meta, StoryObj } from "@storybook/react-vite";
import NetworkIcon from "./NetworkIcon";
import { NETWORKS } from "../data/networks";

const meta = {
  title: "Settings/NetworkIcon",
  component: NetworkIcon,
} satisfies Meta<typeof NetworkIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ethereum: Story = {
  args: { network: NETWORKS[0] },
};

export const Polygon: Story = {
  args: { network: NETWORKS[1] },
};

export const Small: Story = {
  args: { network: NETWORKS[0], size: "sm" },
};

export const AllNetworks: Story = {
  args: { network: NETWORKS[0] },
  render: () => (
    <div className="flex gap-3">
      {NETWORKS.map((n) => (
        <div key={n.id} className="flex flex-col items-center gap-1">
          <NetworkIcon network={n} />
          <span className="text-xs text-[var(--s-text-sub)]">{n.name}</span>
        </div>
      ))}
    </div>
  ),
};
