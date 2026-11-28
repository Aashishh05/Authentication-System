import { forwardRef } from "react";
import { cn } from "../utils";

const cardBaseClasses = `
  bg-bg-elevated
  border border-border
  rounded-md
  shadow-md
  overflow-hidden
`;

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
	hoverable?: boolean;
	floating?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
	({ className, hoverable = false, floating = false, ...props }, ref) => {
		const variants = [
			hoverable && "hover:shadow-lg transition-shadow duration-300",
			floating && "floating",
		].filter(Boolean).join(" ");

		return (
			<div
				ref={ref}
				className={cn(cardBaseClasses, variants, className)}
				{...props}
			/>
		);
	},
);

Card.displayName = "Card";

export { Card };