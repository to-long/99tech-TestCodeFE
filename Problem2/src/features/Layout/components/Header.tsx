import Logo from "./Logo";
import LanguageSelector from "./LanguageSelector";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Header() {
  return (
    <header className="relative z-10 flex items-center justify-between overflow-visible border-b border-border bg-background px-3 py-2.5 transition-colors duration-300 sm:px-6">
      <Logo />
      <div className="flex items-center gap-2">
        <LanguageSelector />
        <ThemeSwitcher />
      </div>
    </header>
  );
}
