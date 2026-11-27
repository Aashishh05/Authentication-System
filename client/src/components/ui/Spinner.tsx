import { motion } from "framer-motion";
import { cn } from "../utils";

export interface SpinnerProps {
	size?: "xs" | "sm" | "md" | "lg";
	className?: string;
}

const Spinner = ({ size = "md", className }: SpinnerProps) => {
	const sizeClasses = {
		xs: "w-3 h-3",
		sm: "w-4 h-4",
		md: "w-5 h-5",
		lg: "w-6 h-6",
	};

	const spinVariants = {
		animate: {
			rotate: 360,
		},
	};

	return (
		<motion.div
			className={cn("border-2 border-current border-t-transparent rounded-full", sizeClasses[size], className)}
			variants={spinVariants}
			animate="animate"
			transition={{
				duration: 0.8,
				repeat: Infinity,
				ease: "linear",
			}}
		/>
	);
};

Spinner.displayName = "Spinner";

export { Spinner };