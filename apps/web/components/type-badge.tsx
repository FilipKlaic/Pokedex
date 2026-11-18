import { textColorOn, typeColor } from "@/lib/type-colors";

type TypeBadgeProps = {
  type: string;
  size?: "sm" | "md";
};

export function TypeBadge({ type, size = "sm" }: TypeBadgeProps) {
  const background = typeColor(type);
  const sizing = size === "md" ? "px-3 py-1 text-xs" : "px-2 py-0.5 text-[10px]";

  return (
    <span
      className={`inline-flex items-center justify-center rounded-md font-semibold uppercase tracking-wider ${sizing}`}
      style={{ backgroundColor: background, color: textColorOn(background) }}
    >
      {type}
    </span>
  );
}
