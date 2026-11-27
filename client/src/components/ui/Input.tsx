import { forwardRef } from "react";
import { cn } from "../utils";

const inputBaseClasses = `
  w-full
  px-4 py-3
  text-base
  font-medium
  rounded-xl
  border
  transition-all duration-200
  placeholder:text-muted-foreground/60
  focus:outline-none focus:ring-2 focus:ring-offset-2
  disabled:cursor-not-allowed disabled:opacity-50
  bg-glass-bg
  backdrop-blur-md
`;

const inputVariants = {
	default: `
		border-border
		text-foreground
		hover:bg-glass-bg-strong
		focus:border-primary focus:ring-primary/20
	`,
	error: `
		border-destructive
		text-foreground
		focus:border-destructive focus:ring-destructive/20
	`,
	success: `
		border-green-500
		text-foreground
		focus:border-green-500 focus:ring-green-500/20
	`,
};

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	variant?: "default" | "error" | "success";
	grade?: "sm" | "md" | "lg";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className, variant = "default", grade = "md", ...props }, ref) => {
		const sizeClasses = {
			sm: "px-3 py-2 text-sm",
			md: "px-4 py-3 text-base",
			lg: "px-5 py-4 text-lg",
		};

		return (
			<input
				ref={ref}
				className={cn(inputBaseClasses, inputVariants[variant], sizeClasses[grade], className)}
				{...props}
			/>
		);
	},
);

Input.displayName = "Input";

export { Input };