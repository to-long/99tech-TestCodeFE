import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import ToggleRow from "./ToggleRow";

const meta = {
  title: "Settings/ToggleRow",
  component: ToggleRow,
  args: {
    label: "Expert Mode",
    description: "Allow high-slippage trading",
    checked: false,
    onChange: () => {},
  },
  decorators: [
    (Story) => (
      <div className="w-[340px] rounded-2xl bg-[var(--s-card)] p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ToggleRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ExpertMode: Story = {};

export const Multihop: Story = {
  args: {
    label: "Multi-hop Trades",
    description: "Route through multiple pools",
    checked: true,
  },
};

export const Interactive: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(args.checked);
    return <ToggleRow {...args} checked={checked} onChange={setChecked} />;
  },
};
