import * as React from "react";

/**
 * Badge variants
 */
export type BadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "success";

/**
 * Badge props
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

/**
 * Badge component
 * 
 * A small visual indicator for status, labels, or categories.
 */
export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    // Determine the appropriate class based on the variant
    const variantClasses = {
      default: "bg-primary text-primary-foreground hover:bg-primary/80",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      success: "bg-green-100 text-green-800 hover:bg-green-200"
    };

    return (
      <div
        ref={ref}
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variantClasses[variant]} ${className}`}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";