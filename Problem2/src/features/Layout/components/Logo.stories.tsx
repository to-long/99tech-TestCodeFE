import type { Meta, StoryObj } from "@storybook/react-vite";
import Logo from "./Logo";

const meta = {
  title: "Layout/Logo",
  component: Logo,
  decorators: [
    (Story) => (
      <div className="bg-background p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Logo>;

export default meta;
export const Default: StoryObj<typeof meta> = {};
