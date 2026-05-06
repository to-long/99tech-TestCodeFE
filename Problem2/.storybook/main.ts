import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx|mdx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-themes"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
  // Storybook's React-Vite builder doesn't auto-inherit the Tailwind v4 plugin
  // from `vite.config.ts`, so register it explicitly here. Without this, the
  // `@import "tailwindcss"` in `index.css` is left as-is and stories render
  // without any utility classes applied.
  viteFinal: async (cfg) =>
    mergeConfig(cfg, {
      plugins: [tailwindcss()],
    }),
};

export default config;
