import { forwardRef } from "react";
import { cn } from "../utils";

const buttonBaseClasses = `
  inline-flex items-center justify-center gap-2
  font-medium transition-all duration-200
  relative overflow-hidden
  disabled:opacity-50 disabled:cursor-not-allowed
  active:scale-[0.97]
`;

const buttonClasses = {
  primary: `
    bg-gradient-to-r from-[var(--gradient-primary)] to-[var(--accent-hover)]
    text-[var(--text-inverse)]
    shadow-md hover:shadow-lg
  `,
  secondary: `
    bg-[var(--bg-elevated)]
    text-[var(--text-primary)]
    border border-[var(--border)]
    shadow-sm hover:shadow-md
    hover:bg-[var(--bg-hover)] hover:border-[var(--text-muted)]
  `,
  ghost: `
    bg-transparent
    text-[var(--text-secondary)]
    hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]
  `,
  danger: `
    bg-[var(--error)]
    text-[var(--text-inverse)]
    shadow-md hover:shadow-lg
    hover:bg-[var(--error-hover)]
  `,
  glass: `
    bg-[var(--glass-bg)]
    text-[var(--slate-200)]
    border border-[var(--glass-border-strong)]
    shadow-md hover:shadow-lg hover:bg-[var(--glass-bg-strong)]
  `,
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "glass";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    const disabledOrLoading = disabled || loading;

    const sizeClasses = {
      sm: "px-3 py-1.5 text-xs h-8",
      md: "px-4 py-2 text-sm h-10",
      lg: "px-6 py-3 text-base h-12",
    };

    return (
      <button
        ref={ref}
        className={cn(
          buttonBaseClasses,
          "rounded-md",
          buttonClasses[variant],
          sizeClasses[size],
          disabledOrLoading && "cursor-not-allowed opacity-50",
          className
        )}
        disabled={disabledOrLoading}
        {...props}
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : null}
        <span className="flex items-center gap-2">{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };