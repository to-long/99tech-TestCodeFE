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
    label: "Price Refresh Rate",
    tooltip:
      "How often exchange rates are automatically fetched from the price API to keep your swap quotes up to date.",
  },
};
