import type { Meta, StoryObj } from "@storybook/react-vite";
import TokenSelector from "./TokenSelector";

const meta = {
  title: "SelectToken/TokenSelector",
  component: TokenSelector,
  parameters: { layout: "fullscreen" },
  args: {
    selectedSymbol: "ETH",
    onSelect: () => {},
    onClose: () => {},
  },
} satisfies Meta<typeof TokenSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoneSelected: Story = {
  args: { selectedSymbol: "" },
};
