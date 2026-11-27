import { motion } from "framer-motion";
import { forwardRef } from "react";
import { cn } from "../utils";

const cardBaseClasses = `
  w-full max-w-sm
  bg-glass-bg-strong backdrop-blur-md
  border border-glass-border-strong
  rounded-2xl
  shadow-glass-shadow-strong
  overflow-hidden
  position-relative
`;

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
	hoverable?: boolean;
	floating?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
	({ className, hoverable = false, floating = false, children, ...props }, ref) => {
		const variants = [
			hoverable && "hover:shadow-glass-shadow-xl transition-all duration-300",
			floating && "floating",
		].filter(Boolean).join(" ");

		return (
			<motion.div
				ref={ref}
				className={cn(cardBaseClasses, variants, className)}
				{...props}
				whileHover={hoverable ? { y: -4, shadowColor: "rgba(0, 0, 0, 0.15)" } : undefined}
				whileTap={{ scale: 0.99 }}
			/>
		);
	},
);

Card.displayName = "Card";

export { Card };