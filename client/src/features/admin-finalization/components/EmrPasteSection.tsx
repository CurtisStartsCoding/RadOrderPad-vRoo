import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { Loader2 } from "lucide-react";
import { EmrSummary } from "../types";
import { formatDateTime } from "../utils/date-utils";

/**
 * Props for the EmrPasteSection component
 */
interface EmrPasteSectionProps {
  /** Current EMR paste text */
  pasteText: string;
  
  /** Function to set the paste text */
  setPasteText: (text: string) => void;
  
  /** Function to process the EMR paste */
  onProcess: () => void;
  
  /** Whether the EMR paste is being processed */
  isProcessing: boolean;
  
  /** Existing EMR summary if available */
  existingEmrSummary?: EmrSummary;
}

/**
 * EmrPasteSection Component
 * 
 * Provides an interface for pasting and processing EMR summaries.
 */
export const EmrPasteSection: React.FC<EmrPasteSectionProps> = ({
  pasteText,
  setPasteText,
  onProcess,
  isProcessing,
  existingEmrSummary
}) => {
  // Handle text change
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPasteText(e.target.value);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>EMR Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {existingEmrSummary?.processedText ? (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-md">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Processed EMR Summary</h4>
              <p className="text-sm whitespace-pre-wrap">{existingEmrSummary.processedText}</p>
              {existingEmrSummary.processedAt && (
                <p className="text-xs text-gray-500 mt-2">
                  Processed on {formatDateTime(existingEmrSummary.processedAt)}
                  {existingEmrSummary.processedBy && ` by ${existingEmrSummary.processedBy}`}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-500">Update EMR Summary</h4>
              <Textarea
                placeholder="Paste updated EMR summary here..."
                value={pasteText}
                onChange={handleTextChange}
                className="min-h-[150px]"
                disabled={isProcessing}
              />
              <div className="flex justify-end">
                <Button
                  onClick={onProcess}
                  disabled={!pasteText.trim() || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Process Updated EMR'
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Paste the EMR summary text below and click "Process" to extract relevant information.
            </p>
            <Textarea
              placeholder="Paste EMR summary here..."
              value={pasteText}
              onChange={handleTextChange}
              className="min-h-[200px]"
              disabled={isProcessing}
            />
            <div className="flex justify-end">
              <Button
                onClick={onProcess}
                disabled={!pasteText.trim() || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Process EMR'
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};