import { IntlProvider } from "react-intl";
import { useGlobalStore, LOCALE_MAP } from "./store/useGlobalStore";
import Header from "./components/Header";
import SwapForm from "./components/SwapForm";

import en from "./intl/en.json";
import zh from "./intl/zh.json";
import th from "./intl/th.json";

const messages: Record<string, Record<string, string>> = { en, zh, th };

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
