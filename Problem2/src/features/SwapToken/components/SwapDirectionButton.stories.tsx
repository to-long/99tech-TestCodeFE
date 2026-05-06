import type { Meta, StoryObj } from "@storybook/react-vite";
import SwapDirectionButton from "./SwapDirectionButton";

const meta = {
  title: "SwapToken/SwapDirectionButton",
  component: SwapDirectionButton,
  args: { swapping: false, onClick: () => {} },
  decorators: [
    (Story) => (
      <div className="relative h-20 w-20 bg-[var(--s-card)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SwapDirectionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {};

export const Swapping: Story = {
  args: { swapping: true },
};
