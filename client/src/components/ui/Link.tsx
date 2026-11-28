import { Link as RouterLink, type LinkProps as RouterLinkProps } from "react-router-dom";
import { cn } from "../utils";

const linkBaseClasses = `
  inline-flex items-center justify-center
  gap-2
  rounded-md
  px-3 py-2 text-sm font-medium
  transition-all duration-200
  disabled:cursor-not-allowed disabled:opacity-50
  active:scale-[0.97]
`;

const linkVariants = {
  default: `
    text-accent hover:text-accent-hover
    focus:ring-2 focus:ring-offset-2 focus:ring-accent
  `,
  glass: `
    text-text-secondary hover:bg-bg-hover hover:text-text-primary
    focus:ring-2 focus:ring-offset-2 focus:ring-accent
  `,
  outline: `
    text-text-primary hover:bg-bg-hover
    border border-border
    focus:ring-2 focus:ring-offset-2 focus:ring-accent
  `,
};

export interface LinkProps extends RouterLinkProps {
	variant?: "default" | "glass" | "outline";
}

const LinkComponent = ({ variant = "default", className, ...props }: LinkProps) => {
	return (
		<RouterLink
			className={cn(linkBaseClasses, linkVariants[variant], className)}
			{...props}
		/>
	);
};

LinkComponent.displayName = "Link";

export { LinkComponent as Link };