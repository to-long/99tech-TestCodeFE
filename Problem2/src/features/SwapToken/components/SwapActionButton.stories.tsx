import type { Meta, StoryObj } from "@storybook/react-vite";
import SwapActionButton from "./SwapActionButton";

const meta = {
  title: "SwapToken/SwapActionButton",
  component: SwapActionButton,
  decorators: [
    (Story) => (
      <div className="w-[380px] rounded-2xl bg-[var(--s-card)] p-5">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SwapActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Enabled: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};
