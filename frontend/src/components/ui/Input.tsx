import type { InputHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, className, ...props }: InputProps) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-[var(--muted)]">
      <span>{label}</span>
      <input
        className={cn(
          "rounded-2xl border border-[var(--line)] bg-white/90 px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--brand)] focus:ring-4 focus:ring-orange-100",
          className
        )}
        {...props}
      />
    </label>
  );
}
