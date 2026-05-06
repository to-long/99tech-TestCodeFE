import type { Meta, StoryObj } from "@storybook/react-vite";
import LanguageOption from "./LanguageOption";
import { LANGUAGES } from "../data/languages";

const meta = {
  title: "Layout/LanguageOption",
  component: LanguageOption,
  args: { lang: LANGUAGES[0], isSelected: false, onSelect: () => {} },
  decorators: [
    (Story) => (
      <div className="w-[180px] rounded-[12px] bg-[var(--s-card)] p-2">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LanguageOption>;

export default meta;
type Story = StoryObj<typeof meta>;

export const English: Story = {};

export const Chinese: Story = { args: { lang: LANGUAGES[1] } };

export const Selected: Story = { args: { isSelected: true } };
