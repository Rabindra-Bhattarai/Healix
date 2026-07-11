import { ReactNode } from "react";

type Variant = "success" | "error" | "warning" | "neutral" | "primary";

const variantClasses: Record<Variant, string> = {
  success: "bg-secondary/10 text-secondary",
  error: "bg-error/10 text-error",
  warning: "bg-tertiary/10 text-tertiary",
  neutral: "bg-surface-container-high text-on-surface-variant",
  primary: "bg-primary/10 text-primary",
};

export default function Badge({
  children,
  variant = "neutral",
}: {
  children: ReactNode;
  variant?: Variant;
}) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-medium ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}
