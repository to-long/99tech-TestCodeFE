import type { Meta, StoryObj } from "@storybook/react-vite";
import SwapHeader from "./SwapHeader";

const meta = {
  title: "SwapToken/SwapHeader",
  component: SwapHeader,
  decorators: [
    (Story) => (
      <div className="w-[380px] rounded-2xl bg-[var(--s-card)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SwapHeader>;

export default meta;
export const Default: StoryObj<typeof meta> = {};
