import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import SwapInputCard from "./SwapInputCard";
import { TOKENS } from "../data/tokens";

const meta = {
  title: "SwapToken/SwapInputCard",
  component: SwapInputCard,
  args: {
    token: TOKENS[0],
    usdValue: 2468.9,
    offset: 0,
    swapping: false,
    amount: "1.5",
    variant: "from",
    onTokenClick: () => {},
    onAmountChange: () => {},
  },
  decorators: [
    (Story) => (
      <div className="w-[380px] rounded-2xl bg-[var(--s-card)] p-5">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SwapInputCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FromVariant: Story = {
  args: { variant: "from", amount: "1.5" },
};

export const FromVariantWithError: Story = {
  args: {
    variant: "from",
    amount: "9999",
    errorMessage: "Insufficient ETH balance",
  },
};

export const FromVariantEmptyError: Story = {
  args: {
    variant: "from",
    amount: "",
    errorMessage: "Enter an amount",
  },
};

export const ToVariant: Story = {
  args: {
    variant: "to",
    token: TOKENS[1],
    amount: 2494.26,
    usdValue: 2494.26,
  },
};

export const Interactive: Story = {
  render: (args) => {
    const [amount, setAmount] = useState("1.5");
    return (
      <SwapInputCard {...args} amount={amount} onAmountChange={setAmount} />
    );
  },
  args: { variant: "from" },
};
