import type { Meta, StoryObj } from "@storybook/react-vite";
import SettingsPanel from "./SettingsPanel";

const meta = {
  title: "Settings/SettingsPanel",
  component: SettingsPanel,
  parameters: { layout: "centered" },
} satisfies Meta<typeof SettingsPanel>;

export default meta;
export const Default: StoryObj<typeof meta> = {};
