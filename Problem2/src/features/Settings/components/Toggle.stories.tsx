import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import Toggle from "./Toggle";

const meta = {
  title: "Settings/Toggle",
  component: Toggle,
  args: { checked: false, onChange: () => {} },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Off: Story = {
  args: { checked: false },
};

export const On: Story = {
  args: { checked: true },
};

export const Interactive: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(args.checked);
    return <Toggle {...args} checked={checked} onChange={setChecked} />;
  },
};
