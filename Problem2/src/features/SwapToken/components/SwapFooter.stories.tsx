import type { Meta, StoryObj } from "@storybook/react-vite";
import SwapFooter from "./SwapFooter";

const meta = {
  title: "SwapToken/SwapFooter",
  component: SwapFooter,
  decorators: [
    (Story) => (
      <div className="w-[380px] rounded-2xl bg-[var(--s-card)] p-5">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SwapFooter>;

export default meta;
export const Default: StoryObj<typeof meta> = {};
