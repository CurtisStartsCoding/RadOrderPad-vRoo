import * as React from "react";

/**
 * Select props
 */
export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /**
   * The value of the select
   */
  value?: string;
  
  /**
   * Callback when the value changes
   */
  onValueChange?: (value: string) => void;
}

/**
 * Select component
 * 
 * A control that allows the user to select a value from a list of options.
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, value, onValueChange, ...props }, ref) => {
    // Handle change event
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      if (onValueChange) {
        onValueChange(event.target.value);
      }
    };
    
    return (
      <select
        ref={ref}
        value={value}
        onChange={handleChange}
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ""}`}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";

/**
 * SelectTrigger props
 */
export interface SelectTriggerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The ID of the select element
   */
  id?: string;
}

/**
 * SelectTrigger component
 */
export const SelectTrigger = React.forwardRef<HTMLDivElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ""}`}
        {...props}
      >
        {children}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 opacity-50"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

/**
 * SelectValue props
 */
export interface SelectValueProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Placeholder text to display when no value is selected
   */
  placeholder?: string;
}

/**
 * SelectValue component
 */
export const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ className, children, placeholder, ...props }, ref) => {
    return (
      <span ref={ref} className={`block truncate ${className || ""}`} {...props}>
        {children || placeholder}
      </span>
    );
  }
);
SelectValue.displayName = "SelectValue";

/**
 * SelectContent component
 */
export const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80 ${className || ""}`}
      {...props}
    >
      <div className="max-h-[var(--radix-select-content-available-height)] overflow-auto">
        {children}
      </div>
    </div>
  );
});
SelectContent.displayName = "SelectContent";

/**
 * SelectItem props
 */
export interface SelectItemProps
  extends React.OptionHTMLAttributes<HTMLOptionElement> {
  /**
   * The value of the item
   */
  value: string;
}

/**
 * SelectItem component
 */
export const SelectItem = React.forwardRef<HTMLOptionElement, SelectItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <option
        ref={ref}
        className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className || ""}`}
        {...props}
      >
        {children}
      </option>
    );
  }
);
SelectItem.displayName = "SelectItem";