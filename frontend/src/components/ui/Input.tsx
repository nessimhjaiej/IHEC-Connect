import type { InputHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, className, ...props }: InputProps) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <input
        className={cn(
          "rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none ring-brand-200 transition focus:ring-4",
          className
        )}
        {...props}
      />
    </label>
  );
}
