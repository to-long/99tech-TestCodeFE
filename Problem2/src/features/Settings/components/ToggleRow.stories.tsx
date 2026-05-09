import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import ToggleRow from "./ToggleRow";

const meta = {
  title: "Settings/ToggleRow",
  component: ToggleRow,
  args: {
    label: "Dark Mode",
    description: "Use dark color scheme",
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

export const Default: Story = {};

export const Checked: Story = {
  args: {
    label: "Auto Refresh",
    description: "Automatically refresh prices",
    checked: true,
  },
};

export const Interactive: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(args.checked);
    return <ToggleRow {...args} checked={checked} onChange={setChecked} />;
  },
};
