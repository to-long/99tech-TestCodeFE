import type { Meta, StoryObj } from "@storybook/react-vite";
import ApiEndpointSection from "./ApiEndpointSection";

const meta = {
  title: "Settings/ApiEndpointSection",
  component: ApiEndpointSection,
  decorators: [
    (Story) => (
      <div className="w-[380px] rounded-2xl bg-[var(--s-card)] p-5">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ApiEndpointSection>;

export default meta;
export const Default: StoryObj<typeof meta> = {};
