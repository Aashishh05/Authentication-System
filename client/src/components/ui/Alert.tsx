import { motion } from "framer-motion";
import { cn } from "../utils";

const alertBaseClasses = `
  flex items-start gap-3
  p-4 rounded-xl
  text-sm font-medium
  border-l-4
`;

const alertVariants = {
	default: `
		bg-muted/50
		border-l-primary
		text-foreground
	`,
	info: `
		bg-blue-50/50
		border-l-blue-500
		text-blue-950
	`,
	success: `
		bg-green-50/50
		border-l-green-500
		text-green-950
	`,
	warning: `
		bg-amber-50/50
		border-l-amber-500
		text-amber-950
	`,
	error: `
		bg-red-50/50
		border-l-red-500
		text-red-950
	`,
};

export interface AlertProps {
	variant?: "default" | "info" | "success" | "warning" | "error";
	className?: string;
	children?: React.ReactNode;
}

const Alert = ({ variant = "default", className, children }: AlertProps) => {
	return (
		<motion.div
			className={cn(alertBaseClasses, alertVariants[variant], className)}
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			{children}
		</motion.div>
	);
};

Alert.displayName = "Alert";

export { Alert };