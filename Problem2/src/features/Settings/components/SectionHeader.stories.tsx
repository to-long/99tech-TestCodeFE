import type { Meta, StoryObj } from "@storybook/react-vite";
import SectionHeader from "./SectionHeader";

const meta = {
  title: "Settings/SectionHeader",
  component: SectionHeader,
  args: {
    label: "Slippage Tolerance",
    tooltip: "Maximum price change you're willing to accept.",
  },
  decorators: [
    (Story) => (
      <div className="w-[380px] rounded-2xl bg-[var(--s-card)] p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongTooltip: Story = {
  args: {
    label: "Multi-hop Trades",
    tooltip:
      "Route trades through multiple pools to find the best price — adds complexity but can save on slippage.",
  },
};
