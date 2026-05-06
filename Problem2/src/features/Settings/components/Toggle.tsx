interface Props {
  checked: boolean;
  onChange: (value: boolean) => void;
}

export default function Toggle({ checked, onChange }: Props) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative h-[24px] w-[40px] cursor-pointer rounded-full p-1 transition-all duration-200 ${
        checked ? "bg-[#5749F4] hover:bg-[#4538D4]" : "bg-[#C5C5CB] hover:bg-[#B0B0B8]"
      } hover:shadow-[0_0_0_3px_#5749F415]`}
    >
      <div
        className="h-3 w-5 rounded-full bg-white transition-transform duration-200"
        style={{ transform: checked ? "translateX(12px)" : "translateX(0)" }}
      />
    </button>
  );
}
