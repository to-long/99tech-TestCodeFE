import type { Meta, StoryObj } from "@storybook/react-vite";
import SlippageSection from "./SlippageSection";

const meta = {
  title: "Settings/SlippageSection",
  component: SlippageSection,
  decorators: [
    (Story) => (
      <div className="w-[380px] rounded-2xl bg-[var(--s-card)] p-5">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SlippageSection>;

export default meta;
export const Default: StoryObj<typeof meta> = {};
