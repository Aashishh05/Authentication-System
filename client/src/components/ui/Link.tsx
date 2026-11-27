import { motion } from "framer-motion";
import { Link as RouterLink, type LinkProps as RouterLinkProps } from "react-router-dom";
import { cn } from "../utils";

const linkBaseClasses = `
  inline-flex items-center justify-center
  gap-2
  rounded-md
  px-3 py-2
  text-sm font-medium
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-offset-2
  disabled:cursor-not-allowed disabled:opacity-50
`;

const linkVariants = {
	default: `
		text-primary hover:text-primary/80
		focus:ring-primary
	`,
	glass: `
		text-foreground hover:bg-glass-bg-strong
		border border-glass-border hover:border-glass-border-strong
		focus:ring-primary
	`,
	outline: `
		text-foreground
		border border-border hover:bg-muted/50
		focus:ring-primary
	`,
};

export interface LinkProps extends RouterLinkProps {
	variant?: "default" | "glass" | "outline";
}

const LinkComponent = ({ variant = "default", className, ...props }: LinkProps) => {
	return (
		<motion.div
			whileHover={{ scale: 0.98 }}
			whileTap={{ scale: 0.97 }}
			style={{ display: "inline-block" }}
		>
			<RouterLink
				className={cn(linkBaseClasses, linkVariants[variant], className)}
				{...props}
			/>
		</motion.div>
	);
};

LinkComponent.displayName = "Link";

export { LinkComponent as Link };

export type { LinkProps };