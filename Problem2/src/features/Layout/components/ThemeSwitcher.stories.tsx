import type { Meta, StoryObj } from "@storybook/react-vite";
import ThemeSwitcher from "./ThemeSwitcher";

const meta = {
  title: "Layout/ThemeSwitcher",
  component: ThemeSwitcher,
  decorators: [
    (Story) => (
      <div className="bg-background p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ThemeSwitcher>;

export default meta;
export const Default: StoryObj<typeof meta> = {};
