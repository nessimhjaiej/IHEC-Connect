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
          "rounded-2xl border border-slate-200 bg-white px-4 py-2.5 outline-none transition focus:border-[#5f56d8] focus:ring-4 focus:ring-[#e7e4ff]",
          className
        )}
        {...props}
      />
    </label>
  );
}
