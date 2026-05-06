import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import TokenSearchInput from "./TokenSearchInput";

const meta = {
  title: "SelectToken/TokenSearchInput",
  component: TokenSearchInput,
  args: {
    value: "",
    placeholder: "Search by name or address",
    onChange: () => {},
  },
  decorators: [
    (Story) => (
      <div className="w-[380px] rounded-2xl bg-[var(--s-card)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TokenSearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const Prefilled: Story = {
  args: { value: "ETH" },
};

export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <TokenSearchInput {...args} value={value} onChange={setValue} />;
  },
};
