import { useIntl } from "react-intl";
import { useCallback } from "react";

/**
 * Thin sugar around `useIntl().formatMessage` so call sites can write
 * `t("key", { values })` instead of `intl.formatMessage({ id }, values)`.
 */
export function useT() {
  const intl = useIntl();
  return useCallback(
    (id: string, values?: Record<string, string | number>) =>
      intl.formatMessage({ id }, values),
    [intl],
  );
}
