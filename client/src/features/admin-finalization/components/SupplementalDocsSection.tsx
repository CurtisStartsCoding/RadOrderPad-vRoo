import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { Select, SelectItem } from "../../../components/ui/select";
import { Label } from "../../../components/ui/label";
import { Loader2, FileText, Beaker, Image, File } from "lucide-react";
import { SupplementalDocument } from "../types";
import { formatDateTime } from "../utils/date-utils";

/**
 * Props for the SupplementalDocsSection component
 */
interface SupplementalDocsSectionProps {
  /** Current supplemental paste text */
  pasteText: string;
  
  /** Function to set the paste text */
  setPasteText: (text: string) => void;
  
  /** Function to process the supplemental document */
  onProcess: (docType: string) => void;
  
  /** Whether the supplemental document is being processed */
  isProcessing: boolean;
  
  /** Existing supplemental documents if available */
  existingDocs?: SupplementalDocument[];
}

/**
 * SupplementalDocsSection Component
 * 
 * Provides an interface for pasting and processing supplemental documents.
 */
export const SupplementalDocsSection: React.FC<SupplementalDocsSectionProps> = ({
  pasteText,
  setPasteText,
  onProcess,
  isProcessing,
  existingDocs = []
}) => {
  // State for selected document type
  const [selectedType, setSelectedType] = React.useState<string>('lab_result');
  
  // Handle text change
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPasteText(e.target.value);
  };
  
  // Handle process click
  const handleProcessClick = () => {
    onProcess(selectedType);
  };
  
  // Get icon for document type
  const getDocIcon = (type: string) => {
    switch (type) {
      case 'lab_result':
        return <Beaker className="h-4 w-4 text-purple-500" />;
      case 'prior_imaging':
        return <Image className="h-4 w-4 text-blue-500" />;
      case 'clinical_note':
        return <FileText className="h-4 w-4 text-amber-500" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Format document type for display
  const formatDocType = (type: string): string => {
    switch (type) {
      case 'lab_result':
        return 'Lab Result';
      case 'prior_imaging':
        return 'Prior Imaging';
      case 'clinical_note':
        return 'Clinical Note';
      case 'other':
        return 'Other Document';
      default:
        return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Supplemental Documents</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Existing Documents */}
        {existingDocs.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Existing Documents</h4>
            <div className="space-y-2">
              {existingDocs.map((doc) => (
                <div key={doc.id} className="p-3 bg-gray-50 rounded-md">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      {getDocIcon(doc.type)}
                    </div>
                    <div className="ml-3 flex-grow">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-medium">
                          {formatDocType(doc.type)}
                        </h5>
                        <span className="text-xs text-gray-500">
                          {formatDateTime(doc.addedAt)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">
                        {doc.description || 'No description'}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Added by {doc.addedBy}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Add New Document */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-500">Add New Document</h4>
          
          <div className="space-y-2">
            <Label htmlFor="docType">Document Type</Label>
            <Select
              id="docType"
              value={selectedType}
              onValueChange={setSelectedType}
              disabled={isProcessing}
            >
              <SelectItem value="lab_result">Lab Result</SelectItem>
              <SelectItem value="prior_imaging">Prior Imaging</SelectItem>
              <SelectItem value="clinical_note">Clinical Note</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="supplementalText">Document Content</Label>
            <Textarea
              id="supplementalText"
              placeholder="Paste document content here..."
              value={pasteText}
              onChange={handleTextChange}
              className="min-h-[150px]"
              disabled={isProcessing}
            />
          </div>
          
          <div className="flex justify-end">
            <Button
              onClick={handleProcessClick}
              disabled={!pasteText.trim() || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Add Document'
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};