import { Search } from "lucide-react";

interface Props {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

export default function TokenSearchInput({ value, placeholder, onChange }: Props) {
  return (
    <div className="px-5 pb-2">
      <div className="flex h-11 items-center gap-2.5 rounded-lg border border-[var(--s-border)] bg-[var(--s-field)] px-3.5">
        <Search size={16} className="text-[var(--s-text-sub)]" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoFocus
          className="flex-1 bg-transparent font-['Geist'] text-sm text-[var(--s-text)] outline-none placeholder:text-[var(--s-text-dim)]"
        />
      </div>
    </div>
  );
}
