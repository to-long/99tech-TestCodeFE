import type { Meta, StoryObj } from "@storybook/react-vite";
import TokenBadge from "./TokenBadge";
import { TOKENS } from "../data/tokens";

const meta = {
  title: "SwapToken/TokenBadge",
  component: TokenBadge,
  args: { token: TOKENS[0], onClick: () => {} },
} satisfies Meta<typeof TokenBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ETH: Story = { args: { token: TOKENS[0] } };
export const USDC: Story = { args: { token: TOKENS[1] } };
export const WBTC: Story = { args: { token: TOKENS[2] } };
