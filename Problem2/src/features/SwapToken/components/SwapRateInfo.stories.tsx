import type { Meta, StoryObj } from "@storybook/react-vite";
import SwapRateInfo from "./SwapRateInfo";

const meta = {
  title: "SwapToken/SwapRateInfo",
  component: SwapRateInfo,
  decorators: [
    (Story) => (
      <div className="w-[380px] rounded-2xl bg-[var(--s-card)] p-5">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SwapRateInfo>;

export default meta;
export const Default: StoryObj<typeof meta> = {};
