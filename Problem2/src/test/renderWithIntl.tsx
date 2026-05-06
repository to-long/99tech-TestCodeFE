import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { messages } from "../intl";

/**
 * Wrap a component in `IntlProvider` with the merged English message map so
 * components calling `useIntl()` / `useT()` work in tests without bespoke
 * boilerplate. Defaults to `en`; pass `locale: "zh"` or `"th"` to test
 * localized strings.
 */
export function renderWithIntl(
  ui: ReactElement,
  { locale = "en" }: { locale?: "en" | "zh" | "th" } = {},
) {
  return render(
    <IntlProvider messages={messages[locale]} locale={locale} defaultLocale="en">
      {ui}
    </IntlProvider>,
  );
}
