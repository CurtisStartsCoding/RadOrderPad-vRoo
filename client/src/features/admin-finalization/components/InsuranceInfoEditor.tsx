import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Checkbox } from "../../../components/ui/checkbox";
import { Select, SelectItem } from "../../../components/ui/select";
import { Pencil, Save, X, Loader2 } from "lucide-react";
import { InsuranceInfo } from "../types";

/**
 * Props for the InsuranceInfoEditor component
 */
interface InsuranceInfoEditorProps {
  /** Insurance information */
  insurance: InsuranceInfo;
  
  /** Whether the insurance information is being edited */
  isEditing: boolean;
  
  /** Whether the insurance information is being updated */
  isUpdating: boolean;
  
  /** Function to toggle edit mode */
  onToggleEdit: () => void;
  
  /** Function to update insurance information */
  onUpdateInsurance: (insurance: InsuranceInfo) => void;
}

/**
 * InsuranceInfoEditor Component
 * 
 * Provides an interface for viewing and editing insurance information.
 */
export const InsuranceInfoEditor: React.FC<InsuranceInfoEditorProps> = ({
  insurance,
  isEditing,
  isUpdating,
  onToggleEdit,
  onUpdateInsurance
}) => {
  // State for edited insurance information
  const [editedInsurance, setEditedInsurance] = React.useState<InsuranceInfo>(insurance);
  
  // Update edited insurance when insurance changes
  React.useEffect(() => {
    setEditedInsurance(insurance);
  }, [insurance]);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedInsurance(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle relationship change
  const handleRelationshipChange = (value: string) => {
    // Ensure value is one of the allowed relationship types
    const relationship = value as 'self' | 'spouse' | 'child' | 'other';
    setEditedInsurance(prev => ({
      ...prev,
      relationship
    }));
  };
  
  // Handle verified change
  const handleVerifiedChange = (checked: boolean) => {
    setEditedInsurance(prev => ({
      ...prev,
      verified: checked
    }));
  };
  
  // Handle save click
  const handleSaveClick = () => {
    onUpdateInsurance(editedInsurance);
  };
  
  // Handle cancel click
  const handleCancelClick = () => {
    setEditedInsurance(insurance);
    onToggleEdit();
  };
  
  // Format relationship for display
  const formatRelationship = (relationship: 'self' | 'spouse' | 'child' | 'other'): string => {
    return relationship.charAt(0).toUpperCase() + relationship.slice(1);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Insurance Information</CardTitle>
        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleEdit}
            className="h-8 px-2"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancelClick}
              disabled={isUpdating}
              className="h-8 px-2"
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSaveClick}
              disabled={isUpdating}
              className="h-8 px-2"
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="provider">Insurance Provider</Label>
                <Input
                  id="provider"
                  name="provider"
                  value={editedInsurance.provider}
                  onChange={handleInputChange}
                  disabled={isUpdating}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="memberId">Member ID</Label>
                <Input
                  id="memberId"
                  name="memberId"
                  value={editedInsurance.memberId}
                  onChange={handleInputChange}
                  disabled={isUpdating}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="groupNumber">Group Number</Label>
                <Input
                  id="groupNumber"
                  name="groupNumber"
                  value={editedInsurance.groupNumber || ''}
                  onChange={handleInputChange}
                  disabled={isUpdating}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="primaryHolder">Primary Holder</Label>
                <Input
                  id="primaryHolder"
                  name="primaryHolder"
                  value={editedInsurance.primaryHolder}
                  onChange={handleInputChange}
                  disabled={isUpdating}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="relationship">Relationship to Primary</Label>
                <Select
                  id="relationship"
                  value={editedInsurance.relationship}
                  onValueChange={handleRelationshipChange}
                  disabled={isUpdating}
                >
                  <SelectItem value="self">Self</SelectItem>
                  <SelectItem value="spouse">Spouse</SelectItem>
                  <SelectItem value="child">Child</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="verified"
                  checked={editedInsurance.verified}
                  onCheckedChange={handleVerifiedChange}
                  disabled={isUpdating}
                />
                <Label htmlFor="verified" className="font-medium">
                  Insurance Verified
                </Label>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Provider</h3>
                <p className="mt-1">{insurance.provider}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Member ID</h3>
                <p className="mt-1">{insurance.memberId}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Group Number</h3>
                <p className="mt-1">{insurance.groupNumber || 'N/A'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Primary Holder</h3>
                <p className="mt-1">{insurance.primaryHolder}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Relationship</h3>
                <p className="mt-1">{formatRelationship(insurance.relationship)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Verification Status</h3>
                <p className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    insurance.verified
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {insurance.verified ? 'Verified' : 'Pending'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};