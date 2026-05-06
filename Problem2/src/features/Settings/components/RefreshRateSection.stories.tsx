import type { Meta, StoryObj } from "@storybook/react-vite";
import RefreshRateSection from "./RefreshRateSection";

const meta = {
  title: "Settings/RefreshRateSection",
  component: RefreshRateSection,
  decorators: [
    (Story) => (
      <div className="w-[380px] rounded-2xl bg-[var(--s-card)] p-5">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RefreshRateSection>;

export default meta;
export const Default: StoryObj<typeof meta> = {};
