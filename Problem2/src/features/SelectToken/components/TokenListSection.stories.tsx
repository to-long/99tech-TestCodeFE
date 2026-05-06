import type { Meta, StoryObj } from "@storybook/react-vite";
import TokenListSection from "./TokenListSection";
import { TOKENS } from "../../SwapToken/data/tokens";

const meta = {
  title: "SelectToken/TokenListSection",
  component: TokenListSection,
  decorators: [
    // Mirror the wrapper used in `TokenSelector`: `flex flex-col` is what
    // makes each TokenRow button stretch to the container's full width
    // (default `align-items: stretch`). Without it the highlighted row
    // shrinks to fit its content.
    (Story) => (
      <div className="flex w-[380px] flex-col gap-1 rounded-2xl bg-[var(--s-card)] p-1.5">
        <Story />
      </div>
    ),
  ],
  args: { onSelect: () => {} },
} satisfies Meta<typeof TokenListSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MostUsed: Story = {
  args: {
    label: "MOST USED",
    tokens: TOKENS.slice(0, 3),
    selectedSymbol: "ETH",
  },
};

export const Available: Story = {
  args: {
    label: "AVAILABLE",
    tokens: TOKENS.slice(3, 8),
    selectedSymbol: "",
  },
};
