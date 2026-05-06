import { IntlProvider } from "react-intl";
import { useGlobalStore, LOCALE_MAP } from "./features/Layout/store/useGlobalStore";
import Header from "./features/Layout/components/Header";
import SwapForm from "./features/SwapToken/components/SwapForm";
import { messages } from "./intl";

export default function App() {
  const language = useGlobalStore((s) => s.language);
  const locale = LOCALE_MAP[language];

  return (
    <IntlProvider messages={messages[locale]} locale={locale} defaultLocale="en">
      <div className="flex h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 items-center justify-center overflow-hidden bg-[var(--s-main)] transition-colors duration-300">
          <SwapForm />
        </main>
      </div>
    </IntlProvider>
  );
}
