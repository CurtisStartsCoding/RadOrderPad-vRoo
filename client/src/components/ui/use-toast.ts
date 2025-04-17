import * as React from "react";

/**
 * Toast variant
 */
export type ToastVariant = "default" | "destructive";

/**
 * Toast props
 */
export interface ToastProps {
  /**
   * The title of the toast
   */
  title?: string;
  
  /**
   * The description of the toast
   */
  description?: string;
  
  /**
   * The variant of the toast
   */
  variant?: ToastVariant;
  
  /**
   * The duration of the toast in milliseconds
   */
  duration?: number;
}

/**
 * Toast context
 */
export interface ToastContextType {
  /**
   * Show a toast
   */
  toast: (props: ToastProps) => void;
}

/**
 * Toast context
 */
const ToastContext = React.createContext<ToastContextType>({
  toast: () => {}
});

/**
 * Toast provider props
 */
export interface ToastProviderProps {
  /**
   * The children of the provider
   */
  children: React.ReactNode;
}

/**
 * Toast provider
 * 
 * Provides the toast context to its children.
 */
export const ToastProvider = (props: ToastProviderProps): React.ReactElement => {
  // In a real implementation, this would manage a queue of toasts
  const toast = React.useCallback((toastProps: ToastProps) => {
    // For now, just log to console
    console.log('Toast:', toastProps);
    
    // In a real implementation, this would add the toast to a queue
    // and render it in a portal
    alert(`${toastProps.title}: ${toastProps.description}`);
  }, []);
  
  return React.createElement(
    ToastContext.Provider,
    { value: { toast } },
    props.children
  );
};

/**
 * Use toast hook
 * 
 * Returns the toast context.
 */
export const useToast = (): ToastContextType => {
  const context = React.useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};