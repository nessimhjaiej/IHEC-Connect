import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "../../utils/cn";

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-xl bg-[#5f56d8] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(95,86,216,0.25)] transition hover:bg-[#564ec8] disabled:cursor-not-allowed disabled:opacity-70",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
