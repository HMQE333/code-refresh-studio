import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormButtonProps {
  title: string;
  disabled?: boolean;
  fullWidth?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
}

export default function FormButton({
  title,
  disabled = false,
  fullWidth = true,
  iconLeft,
  iconRight,
  className,
}: FormButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={cn(
        "flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed",
        fullWidth && "w-full",
        className
      )}
    >
      {iconLeft}
      {title}
      {iconRight}
    </button>
  );
}
