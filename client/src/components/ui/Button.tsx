import { motion } from "framer-motion";
import { forwardRef } from "react";
import { cn } from "../utils";

const buttonBaseClasses = `
  inline-flex items-center justify-center gap-2
  font-medium rounded-lg transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
  relative overflow-hidden
`;

const buttonClasses = {
  primary: `
    bg-gradient-to-r from-[#2563eb] to-[#7c3aed]
    text-white
    shadow-lg shadow-[#2563eb]/20
    hover:shadow-xl hover:shadow-[#2563eb]/30
  `,
  secondary: `
    bg-white/10 backdrop-blur-md
    border border-white/20
    text-slate-200
    hover:bg-white/15
    hover:border-white/30
    shadow-md shadow-black/5
  `,
  ghost: `
    bg-transparent
    text-slate-300
    hover:bg-white/5
    hover:text-white
  `,
  danger: `
    bg-red-500/20
    border border-red-500/30
    text-red-300
    hover:bg-red-500/30
  `,
  glass: `
    bg-white/10 backdrop-blur-md
    border border-white/20
    text-slate-200
    hover:bg-white/15
    shadow-md shadow-black/5
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
      sm: "px-3 py-1.5 text-sm",
      md: "px-5 py-2.5 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <motion.button
        ref={ref}
        className={cn(buttonBaseClasses, buttonClasses[variant], sizeClasses[size], className)}
        disabled={disabledOrLoading}
        {...props}
        whileTap={!disabledOrLoading ? { scale: 0.97 } : undefined}
      >
        {loading ? (
          <motion.span
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
            layoutId="spinner"
          />
        ) : null}
        <span className="flex items-center gap-2">{children}</span>
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonBaseClasses, buttonClasses };