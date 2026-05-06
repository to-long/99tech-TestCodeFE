import "../src/index.css";

import type { Preview, ReactRenderer } from "@storybook/react-vite";
import { withThemeByClassName } from "@storybook/addon-themes";
import { IntlProvider } from "react-intl";
import { messages } from "../src/intl";
import type { Decorator } from "@storybook/react-vite";

const IntlDecorator: Decorator = (Story, context) => {
  const locale = (context.globals.locale ?? "en") as "en" | "zh" | "th";
  return (
    <IntlProvider
      locale={locale}
      messages={messages[locale]}
      defaultLocale="en"
    >
      <Story />
    </IntlProvider>
  );
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "main",
      values: [
        { name: "main", value: "#E8F0ED" },
        { name: "card", value: "#ffffff" },
        { name: "dark-main", value: "#0D1510" },
        { name: "dark-card", value: "#162119" },
      ],
    },
  },
  globalTypes: {
    locale: {
      description: "Active translation locale",
      defaultValue: "en",
      toolbar: {
        title: "Locale",
        icon: "globe",
        items: [
          { value: "en", title: "English" },
          { value: "zh", title: "中文" },
          { value: "th", title: "ไทย" },
        ],
      },
    },
  },
  decorators: [
    IntlDecorator,
    withThemeByClassName<ReactRenderer>({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "light",
      parentSelector: "html",
    }),
  ],
};

export default preview;
