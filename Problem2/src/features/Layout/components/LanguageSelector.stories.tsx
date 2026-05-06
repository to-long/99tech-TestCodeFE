import type { Meta, StoryObj } from "@storybook/react-vite";
import LanguageSelector from "./LanguageSelector";

const meta = {
  title: "Layout/LanguageSelector",
  component: LanguageSelector,
  decorators: [
    // Use `items-start` so the inner `.relative` (LanguageSelector's
    // positioning context) doesn't stretch to the decorator's height —
    // otherwise the dropdown's `top-full` lands at the bottom of the
    // stretched container instead of just below the trigger.
    // `pb-64` reserves room below for the open dropdown.
    (Story) => (
      <div className="flex items-start justify-end bg-background p-4 pb-64">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LanguageSelector>;

export default meta;
export const Default: StoryObj<typeof meta> = {};
