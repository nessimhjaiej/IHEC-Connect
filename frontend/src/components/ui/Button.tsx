import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "../../utils/cn";

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-[var(--text)] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(20,33,61,0.15)] transition hover:-translate-y-0.5 hover:bg-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-70",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
