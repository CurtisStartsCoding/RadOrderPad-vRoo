import * as React from "react";

/**
 * Checkbox props
 */
export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Whether the checkbox is checked
   */
  checked?: boolean;
  
  /**
   * Callback when the checked state changes
   */
  onCheckedChange?: (checked: boolean) => void;
}

/**
 * Checkbox component
 * 
 * A control that allows the user to toggle between checked and not checked.
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    // Handle change event
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onCheckedChange) {
        onCheckedChange(event.target.checked);
      }
    };
    
    return (
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={handleChange}
          className={`h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary ${className || ""}`}
          {...props}
        />
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";