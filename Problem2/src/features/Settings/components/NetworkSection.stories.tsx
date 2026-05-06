import type { Meta, StoryObj } from "@storybook/react-vite";
import NetworkSection from "./NetworkSection";

const meta = {
  title: "Settings/NetworkSection",
  component: NetworkSection,
  decorators: [
    (Story) => (
      <div className="w-[380px] rounded-2xl bg-[var(--s-card)] p-5">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NetworkSection>;

export default meta;
export const Default: StoryObj<typeof meta> = {};
