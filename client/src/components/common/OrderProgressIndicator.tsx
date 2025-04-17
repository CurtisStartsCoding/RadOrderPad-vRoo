import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * OrderProgressIndicator Component
 * 
 * This component displays the current step in the order workflow process.
 * It shows a visual indicator for each step (Dictation, Validation, Signature)
 * and highlights the current step.
 */
interface OrderProgressIndicatorProps {
  currentStep: number; // 1, 2, or 3
}

export const OrderProgressIndicator = ({ currentStep }: OrderProgressIndicatorProps) => {
  const steps = [
    { id: 1, name: "Dictation" },
    { id: 2, name: "Validation" },
    { id: 3, name: "Signature" },
  ];

  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center space-x-2 sm:space-x-3">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={cn("flex items-center", stepIdx !== steps.length - 1 ? "pr-2 sm:pr-3" : "")}>
            {step.id < currentStep ? (
              // Completed step
              <>
                <div className="relative flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-primary">
                  <Check className="h-3 w-3 sm:h-4 sm:w-4 text-white" aria-hidden="true" />
                </div>
                {/* Connector line for completed steps */}
                {stepIdx !== steps.length - 1 && (
                  <div className="ml-2 sm:ml-3 h-0.5 w-4 sm:w-6 bg-primary" aria-hidden="true" />
                )}
              </>
            ) : step.id === currentStep ? (
              // Current step
              <>
                <div className="relative flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full border-2 border-primary bg-white">
                  <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-primary" aria-hidden="true" />
                </div>
                {/* Connector line for upcoming steps */}
                {stepIdx !== steps.length - 1 && (
                  <div className="ml-2 sm:ml-3 h-0.5 w-4 sm:w-6 bg-gray-200" aria-hidden="true" />
                )}
              </>
            ) : (
              // Upcoming step
              <>
                <div className="relative flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                  {/* Optional: Add a smaller dot for upcoming steps */}
                  <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-gray-200" aria-hidden="true" />
                </div>
                {/* Connector line for upcoming steps */}
                {stepIdx !== steps.length - 1 && (
                  <div className="ml-2 sm:ml-3 h-0.5 w-4 sm:w-6 bg-gray-200" aria-hidden="true" />
                )}
              </>
            )}
            {/* Hidden step name for accessibility */}
            <span className="sr-only">{step.name}</span>
          </li>
        ))}
      </ol>
    </nav>
  );
};