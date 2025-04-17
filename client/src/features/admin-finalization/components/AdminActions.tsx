import * as React from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { AlertCircle, Loader2, Send } from "lucide-react";

/**
 * Props for the AdminActions component
 */
interface AdminActionsProps {
  /** Function to send the order to radiology */
  onSendToRadiology: () => void;
  
  /** Whether the order is being sent to radiology */
  isSending: boolean;
  
  /** Whether the order can be sent to radiology */
  canSend?: boolean;
  
  /** Reasons why the order cannot be sent (if applicable) */
  blockers?: string[];
}

/**
 * AdminActions Component
 * 
 * Provides actions for admin staff to finalize and send orders to radiology.
 */
export const AdminActions: React.FC<AdminActionsProps> = ({
  onSendToRadiology,
  isSending,
  canSend = false,
  blockers = []
}) => {
  // Default blockers if none provided but canSend is false
  const displayBlockers = blockers.length > 0 
    ? blockers 
    : !canSend 
      ? ["EMR summary must be processed", "Insurance must be verified"] 
      : [];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Finalize Order</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!canSend && displayBlockers.length > 0 && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-amber-800">
                    Cannot send to radiology yet
                  </h4>
                  <ul className="mt-1 text-sm text-amber-700 list-disc list-inside">
                    {displayBlockers.map((blocker, index) => (
                      <li key={index}>{blocker}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end">
            <Button
              onClick={onSendToRadiology}
              disabled={!canSend || isSending}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send to Radiology
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};