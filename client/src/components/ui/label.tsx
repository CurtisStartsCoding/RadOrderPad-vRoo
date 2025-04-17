import * as React from "react";

/**
 * Label props
 */
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /**
   * Whether the label is required
   */
  required?: boolean;
}

/**
 * Label component
 * 
 * A text label for form controls.
 */
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ""}`}
        {...props}
      >
        {children}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    );
  }
);
Label.displayName = "Label";