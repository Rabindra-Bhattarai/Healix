import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "outline";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-primary text-on-primary hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 disabled:pointer-events-none",
  secondary:
    "bg-surface-container border border-outline-variant text-on-surface hover:bg-surface-container-high disabled:opacity-50 disabled:pointer-events-none",
  outline:
    "bg-transparent border border-outline-variant text-on-surface hover:bg-surface-container-low disabled:opacity-50 disabled:pointer-events-none",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 rounded-lg font-body-md font-semibold h-11 px-6 transition-all ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
