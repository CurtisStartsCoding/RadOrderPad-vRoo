import * as React from "react";
import { AlertCircle, AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import { ValidationFeedbackBannerProps, ValidationStatus } from "../types";

/**
 * ValidationFeedbackBanner Component
 * 
 * Displays feedback about the validation status of the dictation.
 * Shows different icons and colors based on the validation status.
 * Provides options to override or add clarification when appropriate.
 */
export const ValidationFeedbackBanner: React.FC<ValidationFeedbackBannerProps> = ({
  feedback,
  attemptCount,
  onOverride,
  onAddClarification
}) => {
  // Determine the appropriate icon and color based on the validation status
  const getStatusConfig = () => {
    switch (feedback.status) {
      case ValidationStatus.SUCCESS:
        return {
          icon: <CheckCircle className="h-5 w-5" />,
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          textColor: "text-green-700",
          iconColor: "text-green-500"
        };
      case ValidationStatus.WARNING:
        return {
          icon: <AlertTriangle className="h-5 w-5" />,
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          textColor: "text-amber-700",
          iconColor: "text-amber-500"
        };
      case ValidationStatus.ERROR:
        return {
          icon: <XCircle className="h-5 w-5" />,
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-700",
          iconColor: "text-red-500"
        };
      case ValidationStatus.PROCESSING:
        return {
          icon: <Info className="h-5 w-5" />,
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          textColor: "text-blue-700",
          iconColor: "text-blue-500"
        };
      default:
        return {
          icon: <AlertCircle className="h-5 w-5" />,
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          textColor: "text-gray-700",
          iconColor: "text-gray-500"
        };
    }
  };

  const { icon, bgColor, borderColor, textColor, iconColor } = getStatusConfig();

  // Don't render anything if there's no feedback
  if (!feedback || feedback.status === ValidationStatus.NONE) {
    return null;
  }

  return (
    <div className={`rounded-md p-4 mb-4 border ${borderColor} ${bgColor}`}>
      <div className="flex">
        <div className={`flex-shrink-0 ${iconColor}`}>
          {icon}
        </div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${textColor}`}>
            {feedback.message}
          </h3>
          {feedback.details && (
            <div className={`mt-2 text-sm ${textColor}`}>
              <p>{feedback.details}</p>
            </div>
          )}
          {feedback.issues && feedback.issues.length > 0 && (
            <div className="mt-2">
              <ul className={`list-disc pl-5 space-y-1 text-sm ${textColor}`}>
                {feedback.issues.map((issue, index) => (
                  <li key={index}>{issue.message}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Action buttons for warning or error states */}
          {(feedback.status === ValidationStatus.WARNING || feedback.status === ValidationStatus.ERROR) && (
            <div className="mt-4 flex space-x-3">
              {onOverride && attemptCount >= 1 && (
                <button
                  type="button"
                  className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  onClick={onOverride}
                >
                  Override and Continue
                </button>
              )}
              {onAddClarification && (
                <button
                  type="button"
                  className={`inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  onClick={onAddClarification}
                >
                  Add Clarification
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};