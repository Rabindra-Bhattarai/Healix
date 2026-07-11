import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  prefix?: string;
  rightSlot?: React.ReactNode;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, prefix, rightSlot, containerClassName = "", className = "", id, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <div className={`flex flex-col gap-2 w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="font-label-sm text-label-sm text-on-surface-variant"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center h-10 w-full rounded-lg border border-outline-variant bg-white focus-within:border-primary transition-colors">
          {prefix && (
            <span className="pl-4 pr-2 text-body-md text-on-surface-variant border-r border-outline-variant whitespace-nowrap">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`peer flex-1 h-full min-w-0 bg-transparent px-4 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 outline-none ${prefix ? "pl-2" : ""} ${rightSlot ? "pr-2" : ""} ${className}`}
            {...props}
          />
          {rightSlot && <span className="pr-3 flex items-center">{rightSlot}</span>}
        </div>
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
