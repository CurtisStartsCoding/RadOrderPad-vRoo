import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { AlertTriangle } from "lucide-react";

/**
 * OverrideDialog Component
 * 
 * A dialog for confirming override of validation warnings/errors.
 * Allows the physician to provide a reason for the override.
 */
interface OverrideDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  
  /** The current override reason */
  reason: string;
  
  /** Function to update the override reason */
  setReason: (reason: string) => void;
  
  /** Function to handle override confirmation */
  onConfirm: () => void;
  
  /** Function to handle override cancellation */
  onCancel: () => void;
}

export const OverrideDialog: React.FC<OverrideDialogProps> = ({
  open,
  reason,
  setReason,
  onConfirm,
  onCancel
}) => {
  // Determine if the confirm button should be disabled
  const isConfirmDisabled = !reason.trim();
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-amber-700">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Confirm Override
          </DialogTitle>
          <DialogDescription>
            You are about to override validation warnings. Please provide a reason for this override.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="bg-amber-50 p-3 rounded-md border border-amber-200 text-sm text-amber-700">
            <p className="font-medium">Important:</p>
            <p className="mt-1">
              Overriding validation warnings may result in incorrect order information.
              This action will be logged and may require additional review.
            </p>
          </div>
          
          <div>
            <label htmlFor="override-reason" className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Override
            </label>
            <textarea
              id="override-reason"
              className="w-full h-24 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Please explain why you are overriding the validation warnings..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            variant="default" 
            onClick={onConfirm}
            disabled={isConfirmDisabled}
            className="bg-amber-600 hover:bg-amber-700"
          >
            Confirm Override
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};