import Toggle from "./Toggle";

interface Props {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

export default function ToggleRow({ label, description, checked, onChange }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <span className="font-['Inter'] text-sm font-semibold text-[var(--s-text)]">
          {label}
        </span>
        <span className="font-['Inter'] text-xs text-[var(--s-text-dim)]">
          {description}
        </span>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}
