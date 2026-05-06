import type { Meta, StoryObj } from "@storybook/react-vite";
import TokenRow from "./TokenRow";
import { TOKENS } from "../../SwapToken/data/tokens";

const meta = {
  title: "SelectToken/TokenRow",
  component: TokenRow,
  args: {
    token: TOKENS[0],
    isSelected: false,
    onSelect: () => {},
  },
  decorators: [
    // `flex flex-col` mirrors the production parent so the TokenRow button
    // stretches to full width (default `align-items: stretch`).
    (Story) => (
      <div className="flex w-[368px] flex-col rounded-2xl bg-[var(--s-card)] p-1.5">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TokenRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unselected: Story = {};

export const Selected: Story = {
  args: { isSelected: true },
};

export const SmallBalance: Story = {
  args: { token: TOKENS[2] },
};
