import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Patient } from "../../physician-order/types/patient-types";
import { Pencil, Save, X } from "lucide-react";

/**
 * Props for the PatientInfoEditor component
 */
interface PatientInfoEditorProps {
  /** Patient data to display/edit */
  patient: Patient;
  
  /** Whether the component is in edit mode */
  isEditing: boolean;
  
  /** Whether the patient info is being updated */
  isUpdating: boolean;
  
  /** Function to toggle edit mode */
  onToggleEdit: () => void;
  
  /** Function to update patient info */
  onUpdatePatient: (patient: Patient) => void;
}

/**
 * PatientInfoEditor Component
 * 
 * Displays and allows editing of patient information.
 */
export const PatientInfoEditor: React.FC<PatientInfoEditorProps> = ({
  patient,
  isEditing,
  isUpdating,
  onToggleEdit,
  onUpdatePatient
}) => {
  // Local state for edited patient data
  const [editedPatient, setEditedPatient] = React.useState<Patient>(patient);
  
  // Reset edited patient when the original patient changes
  React.useEffect(() => {
    setEditedPatient(patient);
  }, [patient]);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedPatient(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle save
  const handleSave = () => {
    onUpdatePatient(editedPatient);
  };
  
  // Handle cancel
  const handleCancel = () => {
    setEditedPatient(patient);
    onToggleEdit();
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Patient Information</CardTitle>
        {!isEditing ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleEdit}
            className="h-8 w-8 p-0"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="h-8 w-8 p-0"
              disabled={isUpdating}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="h-8 w-8 p-0"
              disabled={isUpdating}
            >
              <Save className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={editedPatient.name}
                onChange={handleInputChange}
                disabled={isUpdating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                name="dob"
                value={editedPatient.dob}
                onChange={handleInputChange}
                disabled={isUpdating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mrn">Medical Record Number</Label>
              <Input
                id="mrn"
                name="mrn"
                value={editedPatient.mrn}
                onChange={handleInputChange}
                disabled={isUpdating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pidn">Patient ID Number</Label>
              <Input
                id="pidn"
                name="pidn"
                value={editedPatient.pidn}
                onChange={handleInputChange}
                disabled={isUpdating}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Full Name</h4>
              <p className="text-sm">{patient.name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Date of Birth</h4>
              <p className="text-sm">{patient.dob}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Medical Record Number</h4>
              <p className="text-sm">{patient.mrn || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Patient ID Number</h4>
              <p className="text-sm">{patient.pidn || 'N/A'}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};