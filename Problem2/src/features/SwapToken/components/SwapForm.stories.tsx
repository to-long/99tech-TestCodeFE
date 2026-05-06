import type { Meta, StoryObj } from "@storybook/react-vite";
import SwapForm from "./SwapForm";

const meta = {
  title: "SwapToken/SwapForm",
  component: SwapForm,
  parameters: { layout: "centered" },
} satisfies Meta<typeof SwapForm>;

export default meta;
export const Default: StoryObj<typeof meta> = {};
