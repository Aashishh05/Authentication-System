import { cn } from "../utils";

const labelBaseClasses = `
  text-sm font-medium
  text-foreground
  leading-none
  peer-disabled:cursor-not-allowed
  peer-disabled:opacity-70
`;

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = ({ className, ...props }: LabelProps) => {
	return <label className={cn(labelBaseClasses, className)} {...props} />;
};

Label.displayName = "Label";

export { Label };