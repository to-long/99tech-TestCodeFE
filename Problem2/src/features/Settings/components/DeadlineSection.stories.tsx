import type { Meta, StoryObj } from "@storybook/react-vite";
import DeadlineSection from "./DeadlineSection";

const meta = {
  title: "Settings/DeadlineSection",
  component: DeadlineSection,
  decorators: [
    (Story) => (
      <div className="w-[380px] rounded-2xl bg-[var(--s-card)] p-5">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DeadlineSection>;

export default meta;
export const Default: StoryObj<typeof meta> = {};
