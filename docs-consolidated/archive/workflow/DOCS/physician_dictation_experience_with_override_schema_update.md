Okay, here is the combined Markdown file containing the modified component code, helper file content, and a Readme section explaining how to use it.

```markdown
# Radiology Order Interface - Combined Code Package

This file contains the source code for the React components and essential configuration/helper files required to replicate the described radiology order dictation, validation, and signature workflow.

## Structure

EDIT: See physician_dictation_colors_style_guide.md for the style guide and React Components and essential configuration/helper files

The code for each file is enclosed within delimiters:

```
--- START OF FILE path/to/FileName.extension ---
[Code for the file]
--- END OF FILE path/to/FileName.extension ---
```
--- START OF FILE src/components/common/OrderProgressIndicator.tsx ---

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming utils file is in src/lib

interface OrderProgressIndicatorProps {
  currentStep: number; // 1, 2, or 3
}

const OrderProgressIndicator = ({ currentStep }: OrderProgressIndicatorProps) => {
  const steps = [
    { id: 1, name: 'Dictation' },
    { id: 2, name: 'Validation' },
    { id: 3, name: 'Signature' },
  ];

  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center space-x-2 sm:space-x-3">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={cn('flex items-center', stepIdx !== steps.length - 1 ? 'pr-2 sm:pr-3' : '')}>
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

export default OrderProgressIndicator;

--- END OF FILE src/components/common/OrderProgressIndicator.tsx ---

--- START OF FILE src/components/interface/InitialPatientIdentifier.tsx ---

import { useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth"; // Corrected path
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, User, Calendar, Clipboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast"; // Corrected path
import { cn } from "@/lib/utils"; // Import cn utility

// Define the structure of the patient info passed to onContinue
interface PatientInfoPayload {
  name: string;
  identifier: string;
  identifierType: "mrn" | "dob";
  age?: number; // Age is optional
  gender?: string; // Gender is optional
}

interface InitialPatientIdentifierProps {
  onContinue: (patientInfo: PatientInfoPayload) => void;
}

const InitialPatientIdentifier = ({ onContinue }: InitialPatientIdentifierProps) => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Form states
  const [name, setName] = useState("");
  const [identifierType, setIdentifierType] = useState<"mrn" | "dob">("mrn");
  const [identifier, setIdentifier] = useState("");
  const [age, setAge] = useState<string>(""); // Keep as string for input control
  const [gender, setGender] = useState<string>(""); // Store selected value

  // Refs for focusing inputs on validation error
  const nameInputRef = useRef<HTMLInputElement>(null);
  const identifierInputRef = useRef<HTMLInputElement>(null);

  // Validation function
  const validateForm = (): boolean => {
    // Name is required
    if (!name.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter the patient's full name.",
        variant: "destructive",
      });
      nameInputRef.current?.focus();
      return false;
    }

    // Identifier is required
    if (!identifier.trim()) {
      toast({
        title: "Missing Information",
        description: `Please enter the patient's ${identifierType === "mrn" ? "MRN" : "Date of Birth"}.`,
        variant: "destructive",
      });
      identifierInputRef.current?.focus();
      return false;
    }

    // If DOB selected, validate date format (simple MM/DD/YYYY or YYYY-MM-DD)
    if (identifierType === "dob") {
      // Basic regex - consider a library like date-fns for robust validation
      const dobRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$|^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
      if (!dobRegex.test(identifier.trim())) {
        toast({
          title: "Invalid Date Format",
          description: "Please enter Date of Birth as MM/DD/YYYY or YYYY-MM-DD.",
          variant: "destructive",
        });
        identifierInputRef.current?.focus();
        return false;
      }
      // Add more robust date validation here if needed (e.g., check valid day for month)
    }

    // Validate age if entered
     if (age.trim()) {
        const ageNum = parseInt(age, 10);
        if (isNaN(ageNum) || ageNum < 0 || ageNum > 130) {
             toast({
                title: "Invalid Age",
                description: "Please enter a valid age between 0 and 130.",
                variant: "destructive",
            });
            // Optionally focus age input: document.getElementById('patientAge')?.focus();
            return false;
        }
     }


    return true; // Form is valid
  };

  // Handle continue button click
  const handleContinue = () => {
    if (!validateForm()) return;

    // Convert age to number if provided, otherwise undefined
    const ageNumber = age.trim() ? parseInt(age, 10) : undefined;

    // Prepare payload
    const patientInfo: PatientInfoPayload = {
      name: name.trim(),
      identifier: identifier.trim(),
      identifierType,
      age: ageNumber,
      // Use selected gender value, default to undefined if empty or "not_specified"
      gender: gender && gender !== "not_specified" ? gender : undefined
    };

    onContinue(patientInfo);
  };

  // Handle pressing Enter key in inputs to trigger continue
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleContinue();
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-2xl mx-auto">
        {/* Card container */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border-b border-gray-200">
            <div className="flex flex-col mb-2 sm:mb-0">
              <h1 className="text-lg font-semibold text-gray-900">New Radiology Order</h1>
              <div className="mt-1 px-2 py-1 bg-blue-50 rounded-md text-xs text-blue-700 font-medium inline-flex self-start">
                Step 1 of 3: Patient Identification
              </div>
            </div>
            <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 self-start sm:self-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              HIPAA Protected
            </Badge>
          </div>

          {/* Form Content */}
          <div className="p-5">
            <div className="mb-5">
              <p className="text-sm text-gray-600">
                Enter minimal patient identifiers to start the order. Full patient details can be imported or completed later if necessary.
              </p>
            </div>

            <div className="space-y-5">
              {/* Patient Name Input */}
              <div className="space-y-1">
                <Label htmlFor="patientName" className="flex items-center text-sm font-medium text-gray-700">
                  <User className="h-4 w-4 mr-2 text-gray-400" />
                  Patient Full Name <span className="text-red-500 ml-1">*</span>
                </Label>
                {/* Input wrapper for focus ring */}
                <div className="border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
                  <Input
                    id="patientName"
                    ref={nameInputRef}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter patient's full name"
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                    className="border-0 shadow-none focus-visible:ring-0 h-10 px-3"
                    required
                  />
                </div>
              </div>

              {/* Identifier Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Identifier Type Selector */}
                <div className="space-y-1">
                  <Label htmlFor="identifierType" className="flex items-center text-sm font-medium text-gray-700">
                    <Clipboard className="h-4 w-4 mr-2 text-gray-400" />
                    Identifier Type <span className="text-red-500 ml-1">*</span>
                  </Label>
                  {/* Select wrapper for focus ring */}
                   <div className="border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
                     <Select
                       value={identifierType}
                       onValueChange={(value: "mrn" | "dob") => {
                         setIdentifierType(value);
                         setIdentifier(""); // Clear identifier when type changes
                       }}
                     >
                       <SelectTrigger id="identifierType" className="border-0 shadow-none focus:ring-0 h-10 px-3">
                         <SelectValue placeholder="Select identifier type" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="mrn">Medical Record Number (MRN)</SelectItem>
                         <SelectItem value="dob">Date of Birth</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                </div>

                {/* Identifier Input */}
                <div className="space-y-1">
                  <Label htmlFor="identifier" className="flex items-center text-sm font-medium text-gray-700">
                    {identifierType === "mrn" ? (
                      <Clipboard className="h-4 w-4 mr-2 text-gray-400" />
                    ) : (
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    )}
                    {identifierType === "mrn" ? "MRN" : "Date of Birth"} <span className="text-red-500 ml-1">*</span>
                  </Label>
                  {/* Input wrapper for focus ring */}
                  <div className="border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
                    <Input
                      id="identifier"
                      ref={identifierInputRef}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={identifierType === "mrn" ? "Enter MRN" : "MM/DD/YYYY"}
                      onKeyDown={handleKeyDown}
                      type="text" // Keep as text to allow formatting characters
                      autoComplete="off"
                      className="border-0 shadow-none focus-visible:ring-0 h-10 px-3"
                      required
                    />
                  </div>
                  {identifierType === "dob" && (
                    <p className="text-xs text-gray-500 mt-1">Use MM/DD/YYYY or YYYY-MM-DD format.</p>
                  )}
                </div>
              </div>

              {/* Optional Demographics Section */}
              <div className="mt-5 pt-5 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  Optional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Age Input */}
                  <div className="space-y-1">
                    <Label htmlFor="patientAge" className="text-sm font-medium text-gray-700">
                      Age (Years)
                    </Label>
                    {/* Input wrapper for focus ring */}
                    <div className="border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
                      <Input
                        id="patientAge"
                        value={age}
                        onChange={(e) => setAge(e.target.value.replace(/[^0-9]/g, ''))} // Allow only numbers
                        placeholder="Optional"
                        type="number" // Use number type for better mobile input
                        min="0"
                        max="130" // Reasonable upper limit
                        className="border-0 shadow-none focus-visible:ring-0 h-10 px-3"
                        onKeyDown={handleKeyDown}
                      />
                    </div>
                  </div>

                  {/* Gender Selector */}
                  <div className="space-y-1">
                    <Label htmlFor="patientGender" className="text-sm font-medium text-gray-700">
                      Gender
                    </Label>
                    {/* Select wrapper for focus ring */}
                    <div className="border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
                      <Select
                        value={gender}
                        onValueChange={setGender}
                      >
                        <SelectTrigger id="patientGender" className="border-0 shadow-none focus:ring-0 h-10 px-3">
                          <SelectValue placeholder="Select gender (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not_specified">Not specified</SelectItem>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <div className="flex justify-end items-center mt-8">
                <Button
                  onClick={handleContinue}
                  className="inline-flex items-center shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 text-base font-medium rounded-lg transition-colors"
                  style={{ minWidth: '200px', touchAction: 'manipulation' }}
                >
                  Continue to Dictation
                </Button>
              </div>

              {/* Physician Attribution */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  Order will be attributed to: <span className="font-medium">{user ? `${user.firstName || ''} ${user.lastName || user.name || 'Current User'}` : "Current Physician"}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitialPatientIdentifier;

--- END OF FILE src/components/interface/InitialPatientIdentifier.tsx ---

--- START OF FILE src/components/interface/PatientInfoCard.tsx ---

import { Calendar, User, UserCog, Edit, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Patient } from "@/lib/types";
import { cn } from "@/lib/utils"; // Import cn utility

interface PatientInfoCardProps {
  patient: Patient | null | undefined; // Allow null or undefined
  onEditPatient?: () => void; // Callback when edit/add is clicked
}

/**
 * A compact card showing patient information.
 * Highlights temporary patients and provides an edit/add button.
 */
const PatientInfoCard = ({ patient, onEditPatient }: PatientInfoCardProps) => {
  // Default to a placeholder if patient data is missing
  const displayPatient = patient || {
    id: 0,
    name: "Unknown Patient",
    dob: "Unknown",
    mrn: "N/A",
    pidn: "N/A",
  };

  // Check if this represents a temporary or default patient state
  const isTemporaryPatient = displayPatient.id === 0 || !patient;
  const hasRealInfo = displayPatient.name !== "Unknown Patient" && displayPatient.dob !== "Unknown";

  // Apply distinct background for temporary patients
  const cardBgClass = isTemporaryPatient ? "bg-amber-50 border-amber-200" : "bg-white border-gray-200";

  return (
    <div className={cn("border rounded-lg overflow-hidden transition-colors", cardBgClass)}>
      <div className="px-3 py-2 flex items-center justify-between gap-2">
        {/* Left side: Patient info */}
        <div className="flex items-center space-x-2 overflow-hidden"> {/* Added overflow-hidden */}
          <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full flex-shrink-0 border border-gray-200">
            <User className="h-4 w-4 text-gray-600" />
          </div>

          <div className="overflow-hidden"> {/* Added overflow-hidden */}
            <div className="flex items-center">
              <h2 className="text-sm font-semibold text-gray-900 truncate" title={displayPatient.name}>
                {displayPatient.name}
              </h2>
              {/* Show temporary badge only if it's temporary AND lacks real info */}
              {isTemporaryPatient && !hasRealInfo && (
                <div className="ml-2 flex items-center text-amber-700 flex-shrink-0">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  <span className="text-xs font-medium">Temporary</span>
                </div>
              )}
            </div>

            <div className="flex items-center text-xs text-gray-600 mt-0.5 space-x-3 flex-wrap"> {/* Added flex-wrap */}
              <div className="flex items-center flex-shrink-0">
                <Calendar className="mr-1 h-3 w-3 text-gray-500" />
                <span>{displayPatient.dob}</span>
              </div>

              <div className="flex items-center flex-shrink-0">
                <span className="font-medium text-gray-500 mr-1">PIDN:</span>
                <span className="truncate" title={displayPatient.pidn || displayPatient.mrn || 'N/A'}>
                    {displayPatient.pidn || displayPatient.mrn || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side: Action button - Show if temporary or edit callback exists */}
        {(isTemporaryPatient || onEditPatient) && (
          <Button
            size="sm"
            variant="outline"
            className={cn(
              "text-xs px-2 py-1 h-7 ml-2 flex-shrink-0 transition-colors",
              isTemporaryPatient
                ? "border-amber-300 text-amber-700 bg-amber-100 hover:bg-amber-200 hover:text-amber-900"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            )}
            onClick={onEditPatient} // Trigger the callback
            disabled={!onEditPatient} // Disable if no callback provided
            title={isTemporaryPatient ? (hasRealInfo ? "Edit Patient Info" : "Add Patient Info") : "Edit Patient Info"}
          >
            {isTemporaryPatient ? (
              hasRealInfo ? (
                <>
                  <Edit className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">Edit</span>
                </>
              ) : (
                <>
                  <UserCog className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">Add Patient</span>
                </>
              )
            ) : (
               <>
                  <Edit className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">Edit</span>
               </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PatientInfoCard;

--- END OF FILE src/components/interface/PatientInfoCard.tsx ---

--- START OF FILE src/components/interface/ClinicalContextPanel.tsx ---

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Image as ImageIcon, Stethoscope, FlaskConical, Pill } from "lucide-react"; // Import icons
import { ClinicalHistoryItem, Patient } from "@/lib/types"; // Import types
import { formatDate } from "@/lib/utils"; // Import utility
import { Badge } from "@/components/ui/badge"; // Import Badge
import { cn } from "@/lib/utils"; // Import cn utility

interface ClinicalContextPanelProps {
  patient: Patient | null | undefined; // Use the full Patient object
  isCollapsed: boolean;
  onCollapseToggle: () => void;
}

// Helper component to display a list of history items
const HistoryList = ({ items, type }: { items: ClinicalHistoryItem[], type: string }) => {
  if (!items || items.length === 0) {
    return <p className="text-xs text-center text-gray-500 py-4">No {type} history available.</p>;
  }

  return (
    <ul className="space-y-2 max-h-60 overflow-y-auto pr-1"> {/* Added max-height and scroll */}
      {items.map((item) => (
        <li key={item.id} className="p-2 bg-white border border-gray-200 rounded-md shadow-sm">
          <div className="flex justify-between items-start text-xs mb-1">
            <span className="font-medium text-gray-800 break-words mr-2">{item.description}</span>
            <span className="text-gray-500 whitespace-nowrap flex-shrink-0">{formatDate(item.date, false)}</span> {/* Hide time */}
          </div>
          {item.code && (
            <Badge variant="outline" className="text-xs font-mono mr-1 mb-1">
              {item.code}
            </Badge>
          )}
           {item.value && (
            <p className="text-xs text-gray-700">
              Result: <span className="font-medium">{item.value}</span>
              {item.reference && <span className="text-gray-500 ml-1">({item.reference})</span>}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
};


const ClinicalContextPanel = ({ patient, isCollapsed, onCollapseToggle }: ClinicalContextPanelProps) => {
  const patientId = patient?.id; // Get patient ID
  const [activeTab, setActiveTab] = useState("imaging");

  // Fetch all clinical history for this patient
  // Enable only if there's a valid patient ID (not 0 or null/undefined)
  const { data: clinicalHistory, isLoading: isLoadingHistory } = useQuery<ClinicalHistoryItem[]>({
    queryKey: [`/api/patients/${patientId}/clinical-history`],
    enabled: !!patientId && patientId !== 0, // Only fetch for real patients
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Group history by type
  const groupedHistory = {
    imaging: clinicalHistory?.filter(item => item.type === 'imaging') || [],
    diagnosis: clinicalHistory?.filter(item => item.type === 'diagnosis') || [],
    lab: clinicalHistory?.filter(item => item.type === 'lab') || [],
    medication: clinicalHistory?.filter(item => item.type === 'medication') || []
  };

  // If collapsed or no valid patient, render nothing
  if (isCollapsed || !patientId || patientId === 0) {
    return null;
  }

  return (
    // Use a container that appears above the content, maybe fixed or absolutely positioned
    // This example uses a fixed overlay style similar to the original ClinicalContextPanelx
     <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-start justify-center pt-16 md:pt-20 px-4">
      <Card
        className={cn(
            "w-full max-w-lg shadow-xl transition-all duration-300 ease-in-out",
            "transform-gpu scale-100 opacity-100", // Simple appear animation
            "max-h-[calc(100vh-10rem)] overflow-hidden flex flex-col" // Max height and flex column
        )}
      >
        {/* Card Header */}
        <CardHeader className="py-3 px-4 border-b flex flex-row items-center justify-between flex-shrink-0">
          <CardTitle className="text-base sm:text-lg font-medium flex items-center">
            Clinical Context: <span className="text-primary ml-1 truncate max-w-[150px] sm:max-w-xs" title={patient?.name}>{patient?.name}</span>
            <span className="text-xs text-gray-500 ml-2 font-normal hidden sm:inline">(FHIR Data)</span>
          </CardTitle>
          <button
            onClick={onCollapseToggle}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
            aria-label="Close clinical context"
          >
            <X size={18} />
          </button>
        </CardHeader>

        {/* Card Content with Tabs */}
        <CardContent className="px-4 py-3 overflow-y-auto flex-grow"> {/* Allow content to scroll */}
          <Tabs defaultValue="imaging" onValueChange={setActiveTab} value={activeTab}>
            {/* Tab Triggers */}
            <TabsList className="grid grid-cols-4 w-full h-11">
              <TabsTrigger value="imaging" className="text-xs px-1"><ImageIcon className="h-4 w-4 mr-1 inline-block"/>Imaging</TabsTrigger>
              <TabsTrigger value="diagnosis" className="text-xs px-1"><Stethoscope className="h-4 w-4 mr-1 inline-block"/>Diagnoses</TabsTrigger>
              <TabsTrigger value="lab" className="text-xs px-1"><FlaskConical className="h-4 w-4 mr-1 inline-block"/>Labs</TabsTrigger>
              <TabsTrigger value="medication" className="text-xs px-1"><Pill className="h-4 w-4 mr-1 inline-block"/>Meds</TabsTrigger>
            </TabsList>

            {/* Loading State */}
            {isLoadingHistory ? (
              <div className="py-10 text-center text-sm text-gray-500">Loading clinical history...</div>
            ) : (
              <>
                {/* Tab Content Panels */}
                <TabsContent value="imaging" className="mt-3">
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                    <HistoryList items={groupedHistory.imaging} type="imaging" />
                  </div>
                </TabsContent>

                <TabsContent value="diagnosis" className="mt-3">
                   <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                    <HistoryList items={groupedHistory.diagnosis} type="diagnosis" />
                  </div>
                </TabsContent>

                <TabsContent value="lab" className="mt-3">
                   <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                    <HistoryList items={groupedHistory.lab} type="lab" />
                  </div>
                </TabsContent>

                <TabsContent value="medication" className="mt-3">
                   <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                    <HistoryList items={groupedHistory.medication} type="medication" />
                  </div>
                </TabsContent>
              </>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClinicalContextPanel;


--- END OF FILE src/components/interface/ClinicalContextPanel.tsx ---

--- START OF FILE src/components/interface/DictationForm.tsx ---

import { useState, useRef, useEffect, useCallback } from "react";
import { ProcessedDictation, Patient } from "@/lib/types";
import { useToast } from "@/hooks/use-toast"; // Corrected path
import { AlertCircle, Mic, RefreshCw, AlertTriangle, X, Plus, ShieldAlert, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils"; // Import cn utility

interface DictationFormProps {
  dictationText: string;
  setDictationText: (text: string) => void;
  patient: Patient | null | undefined; // Allow null/undefined
  // Renamed prop to reflect it triggers a request
  onProcessRequest: (text: string) => void;
  // Added prop for loading state
  isProcessing: boolean;
  validationFeedback?: string;
  onClearFeedback?: () => void;
  attemptCount?: number;
  onOverride?: () => void;
}

// Define interfaces for Web Speech API manually if needed
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number; // Standard property
}
interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}
interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
  isFinal: boolean;
}
interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}
// Type for the SpeechRecognition constructor
type SpeechRecognitionAPI = {
  new (): SpeechRecognition;
};
// Type for the SpeechRecognition instance
type SpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string; // Optional: set language
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event | any) => void) | null; // Use any for broader compatibility
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};


const DictationForm = ({
  dictationText,
  setDictationText,
  patient,
  onProcessRequest, // Use renamed prop
  isProcessing, // Use loading state prop
  validationFeedback,
  onClearFeedback,
  attemptCount = 0,
  onOverride
}: DictationFormProps) => {
  const { toast } = useToast();
  // Removed local isProcessing state, now controlled by parent
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef<string>(""); // Store final transcript separately

  // --- Speech Recognition Logic (Keep as is) ---
  const setupSpeechRecognition = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition as SpeechRecognitionAPI | undefined;
    if (!SpeechRecognition) { console.warn("Speech recognition not supported by this browser."); return; }
    try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true; recognition.interimResults = true;
        recognition.onstart = () => { setIsRecording(true); finalTranscriptRef.current = dictationText; };
        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let interimTranscript = ''; let currentFinalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) { currentFinalTranscript += event.results[i][0].transcript; }
                else { interimTranscript += event.results[i][0].transcript; }
            }
            const fullTranscript = finalTranscriptRef.current + currentFinalTranscript + interimTranscript;
            setDictationText(fullTranscript);
            if (currentFinalTranscript) { finalTranscriptRef.current += currentFinalTranscript; }
        };
        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            let errorMessage = "An unknown voice recognition error occurred.";
            if (event.error === 'no-speech') { errorMessage = "No speech detected. Please try speaking again."; }
            else if (event.error === 'audio-capture') { errorMessage = "Microphone error. Please check your microphone connection and permissions."; }
            else if (event.error === 'not-allowed') { errorMessage = "Microphone access denied. Please allow microphone access in your browser settings."; }
            toast({ title: "Voice Recognition Error", description: errorMessage, variant: "destructive" });
            setIsRecording(false);
        };
        recognition.onend = () => { if (isRecording) { setIsRecording(false); } };
        recognitionRef.current = recognition;
    } catch (e) { console.error("Failed to initialize SpeechRecognition:", e); toast({ title: "Initialization Error", description: "Could not start voice recognition service.", variant: "destructive" }); }
  }, [setDictationText, toast, dictationText, isRecording]);

  useEffect(() => { setupSpeechRecognition(); return () => { recognitionRef.current?.stop(); }; }, [setupSpeechRecognition]);

  const toggleRecording = () => {
    if (!recognitionRef.current) { toast({ title: "Voice Recognition Not Available", description: "Your browser doesn't support voice recognition...", variant: "destructive" }); return; }
    if (isRecording) { recognitionRef.current.stop(); }
    else {
       try {
            finalTranscriptRef.current = dictationText.endsWith('\n') || dictationText === "" ? dictationText : dictationText + '\n';
            setDictationText(finalTranscriptRef.current);
            recognitionRef.current.start();
            toast({ title: "Voice Recognition Activated", description: "Speak clearly. Tap the mic again to stop.", duration: 3000 });
       } catch (e) { console.error("Error starting recognition:", e); toast({ title: "Error Starting Recognition", description: "Could not start voice input...", variant: "destructive" }); setIsRecording(false); }
    }
  };
  // --- End Speech Recognition Logic ---

  // Renamed function to clarify it triggers the request via prop
  const triggerProcessRequest = () => {
    if (dictationText.trim().length < 20) {
      toast({ title: "Dictation Too Short", description: "Please provide more detail (min 20 characters).", variant: "destructive" });
      textareaRef.current?.focus();
      return;
    }
    onClearFeedback?.(); // Clear previous feedback
    onProcessRequest(dictationText); // Call the parent's processing function
  };

  const focusTextarea = () => { textareaRef.current?.focus(); };
  const clearDictation = () => { setDictationText(""); finalTranscriptRef.current = ""; textareaRef.current?.focus(); };

  const addAdditionalClarification = () => {
    const currentText = dictationText.trimEnd();
    const separator = "\n--------Additional Clarification----------\n";
    const textToAdd = (currentText.length > 0 && !currentText.endsWith('\n')) ? separator : separator.trimStart();
    const newText = currentText + textToAdd;
    setDictationText(newText);
    finalTranscriptRef.current = newText;
    setTimeout(() => { if (textareaRef.current) { textareaRef.current.focus(); const endPosition = newText.length; textareaRef.current.selectionStart = endPosition; textareaRef.current.selectionEnd = endPosition; textareaRef.current.scrollTop = textareaRef.current.scrollHeight; } }, 0);
  };

  const handleOverrideRequest = () => { onOverride?.(); };

  return (
    <Card className="bg-white border border-gray-200 shadow-sm mt-2">
      <CardHeader className="pb-2 pt-3 px-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-base font-medium text-gray-900">Clinical Dictation</span>
            <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-800 border-amber-200 text-xs">
              <AlertCircle className="h-3 w-3 mr-1" /> HIPAA Protected
            </Badge>
          </div>
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Include clinical indications, relevant history, and requested study details.
          {dictationText.trim().length > 0 && ( <span className="ml-1 text-blue-600 font-medium"> Edit or use voice input to append. </span> )}
        </p>
      </CardHeader>
      <CardContent className="pt-2 px-4 pb-4">
        {validationFeedback && (
          <div className="mb-4 border border-red-300 rounded-md overflow-hidden bg-red-50">
            <div className="px-4 py-2 flex justify-between items-center border-b border-red-200">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-red-600 mr-2 flex-shrink-0" />
                <h3 className="text-sm font-medium text-red-800">Issues with Dictation</h3>
              </div>
              {onClearFeedback && ( <button onClick={onClearFeedback} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors" aria-label="Clear feedback"> <X className="h-4 w-4" /> </button> )}
            </div>
            <div className="px-4 py-3 text-sm text-red-900">
              <p>{validationFeedback}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" className="h-8 text-xs border-red-300 text-red-700 hover:bg-red-100" onClick={addAdditionalClarification}> <Plus className="h-3 w-3 mr-1" /> Add Clarification </Button>
                {attemptCount >= 3 && onOverride && ( <Button type="button" variant="outline" size="sm" className="h-8 text-xs bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200" onClick={handleOverrideRequest}> <ShieldAlert className="h-3 w-3 mr-1" /> Override Validation </Button> )}
              </div>
            </div>
          </div>
        )}
        <div className="border border-gray-300 rounded-md bg-white overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all" onClick={focusTextarea} >
          <Textarea
            ref={textareaRef} value={dictationText}
            onChange={(e) => { setDictationText(e.target.value); finalTranscriptRef.current = e.target.value; }}
            className="w-full min-h-[280px] sm:min-h-[240px] p-4 border-0 shadow-none focus-visible:ring-0 resize-y text-gray-800 text-base rounded-none"
            placeholder="Example: '55-year-old female with newly diagnosed breast cancer...'"
            autoComplete="off" autoCorrect="on" spellCheck="true"
          />
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-t border-gray-200">
            <div className="flex space-x-2">
              <Button type="button" variant="outline" size="sm" className="h-8 px-2 text-xs" onClick={clearDictation} disabled={isProcessing || dictationText.length === 0}> <RefreshCw className="h-3 w-3 mr-1" /> Clear </Button>
              <Button type="button" variant={isRecording ? "destructive" : "outline"} size="sm" className={cn("h-8 px-2 text-xs transition-colors", isRecording ? 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200' : '')} onClick={toggleRecording} disabled={isProcessing || !recognitionRef.current} title={isRecording ? "Stop voice input" : "Start voice input"}> <Mic className={cn("h-3 w-3 mr-1", isRecording ? 'animate-pulse text-red-600' : '')} /> {isRecording ? 'Recording...' : 'Voice Input'} </Button>
            </div>
            <div className="text-xs text-gray-500"> {dictationText.length} characters </div>
          </div>
        </div>
        <div className="flex justify-end items-center mt-6">
          <Button
            onClick={triggerProcessRequest} // Use the renamed handler
            disabled={dictationText.trim().length < 20 || isProcessing || isRecording}
            className="inline-flex items-center justify-center shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 h-12 sm:h-14 text-sm sm:text-base font-medium rounded-lg transition-all"
            style={{ minWidth: '160px', touchAction: 'manipulation' }}
            title={dictationText.trim().length < 20 ? "Minimum 20 characters required" : "Process dictation for validation"}
          >
            {isProcessing ? ( <> <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Processing... </> ) : ( "Process Order" )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DictationForm;

--- END OF FILE src/components/interface/DictationForm.tsx ---

--- START OF FILE src/components/interface/OverrideDialog.tsx ---

import { useState, useRef, useEffect, useCallback } from "react";
import { Shield, AlertCircle, X, Mic, Square, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose, // Import DialogClose for cancel button
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast"; // Import useToast
import { cn } from "@/lib/utils"; // Import cn utility

// Re-define SpeechRecognition types locally for this component
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}
interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}
interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
  isFinal: boolean;
}
interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}
type SpeechRecognitionAPI = { new (): SpeechRecognition };
type SpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event | any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};


interface OverrideDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (justification: string) => void;
}

const MIN_JUSTIFICATION_LENGTH = 20;

const OverrideDialog = ({ isOpen, onClose, onConfirm }: OverrideDialogProps) => {
  const [justification, setJustification] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef<string>(""); // Store final transcript
  const { toast } = useToast();

  // --- Speech Recognition Logic (Similar to DictationForm) ---
  const setupSpeechRecognition = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition as SpeechRecognitionAPI | undefined;
    if (!SpeechRecognition) return;

    try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = () => setIsRecording(true);

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let interimTranscript = '';
            let currentFinalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    currentFinalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            const fullTranscript = finalTranscriptRef.current + currentFinalTranscript + interimTranscript;
            setJustification(fullTranscript);
            if (currentFinalTranscript) {
                 finalTranscriptRef.current += currentFinalTranscript;
            }
        };

        recognition.onerror = (event: any) => {
            console.error('Justification Speech recognition error:', event.error);
            toast({ title: "Voice Input Error", description: `Mic error: ${event.error}. Please type.`, variant: "destructive" });
            setIsRecording(false);
        };

        recognition.onend = () => {
             if (isRecording) setIsRecording(false); // Update state if stopped
        };
        recognitionRef.current = recognition;
    } catch(e) {
        console.error("Failed to init speech recognition for override:", e);
    }
  }, [toast, isRecording]); // Added isRecording dependency

  useEffect(() => {
    if (isOpen) {
        setupSpeechRecognition(); // Setup when dialog opens
    } else {
        // Cleanup on close
        recognitionRef.current?.stop();
        setIsRecording(false);
        setJustification(""); // Reset justification text
        finalTranscriptRef.current = "";
    }
    // Cleanup function
    return () => {
      recognitionRef.current?.stop();
    };
  }, [isOpen, setupSpeechRecognition]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast({ title: "Voice Input Not Available", variant: "destructive" });
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
        try {
            // Start with current text + space if needed
            finalTranscriptRef.current = justification.endsWith(' ') || justification === "" ? justification : justification + ' ';
            setJustification(finalTranscriptRef.current);
            recognitionRef.current.start();
        } catch (e) {
             toast({ title: "Could not start voice input", variant: "destructive" });
             setIsRecording(false);
        }
    }
  };
  // --- End Speech Recognition Logic ---


  const handleConfirm = () => {
    const trimmedJustification = justification.trim();
    if (trimmedJustification.length < MIN_JUSTIFICATION_LENGTH) {
       toast({
           title: "Justification Required",
           description: `Please provide a clinical justification of at least ${MIN_JUSTIFICATION_LENGTH} characters.`,
           variant: "destructive"
       });
      return;
    }
    onConfirm(trimmedJustification);
    // No need to reset justification here, useEffect on isOpen=false handles it
  };

  // Handle changes in the textarea, update final transcript ref
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setJustification(e.target.value);
      finalTranscriptRef.current = e.target.value;
  }

  // Use Dialog primitive for better control over open state
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        {/* Dialog Header */}
        <DialogHeader className="pr-10"> {/* Add padding to prevent overlap with close button */}
          <DialogTitle className="flex items-center text-lg">
            <Shield className="h-5 w-5 text-amber-500 mr-2" />
            Clinical Validation Override
          </DialogTitle>
          <DialogDescription className="text-sm">
            Provide justification before proceeding with the override.
          </DialogDescription>
        </DialogHeader>

         {/* Close button positioned absolutely */}
         <DialogClose asChild>
            <button
                onClick={onClose}
                className="absolute top-3 right-3 p-1 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                aria-label="Close"
            >
                <X className="h-5 w-5" />
            </button>
         </DialogClose>


        {/* Dialog Body */}
        <div className="py-4 px-1 space-y-4"> {/* Added px-1 for slight padding */}
          {/* Warning Box */}
          <div className="flex items-start bg-amber-50 p-3 rounded-md border border-amber-200">
            <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-semibold mb-1">Validation Override Warning</p>
              <p>
                Overriding may not align with appropriate use criteria, potentially leading to:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
                <li>Insurance denial or payment issues</li>
                <li>Unnecessary radiation or procedure risks</li>
                <li>Increased patient cost</li>
                <li>Quality review audit flags</li>
              </ul>
            </div>
          </div>

          {/* Justification Input Area */}
          <div>
            <Label htmlFor="override-justification" className="block text-sm font-medium text-gray-700 mb-1">
              Clinical Justification <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
                <Textarea
                    id="override-justification"
                    value={justification}
                    onChange={handleTextChange} // Use controlled input handler
                    placeholder="Explain clinical necessity for overriding system recommendations (e.g., prior imaging results, specific patient factors)..."
                    className="w-full min-h-[120px] border-gray-300 focus-visible:ring-primary pr-10" // Add padding for mic button
                    rows={4}
                />
                {/* Mic Button */}
                <Button
                    type="button"
                    variant={isRecording ? "destructive" : "ghost"}
                    size="icon"
                    className={cn(
                        "absolute bottom-2 right-2 h-7 w-7 rounded-full",
                        isRecording ? "bg-red-100 text-red-600 hover:bg-red-200" : "text-gray-500 hover:bg-gray-100"
                    )}
                    onClick={toggleRecording}
                    disabled={!recognitionRef.current}
                    title={isRecording ? "Stop Recording" : "Record Justification"}
                >
                    {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
            </div>
            <div className="text-xs text-gray-500 mt-1 flex justify-between">
              <span>Required - included in patient record.</span>
              <span className={cn(justification.trim().length < MIN_JUSTIFICATION_LENGTH ? "text-red-500" : "text-green-600")}>
                {justification.trim().length} / {MIN_JUSTIFICATION_LENGTH} min characters
              </span>
            </div>
          </div>
        </div>

        {/* Dialog Footer */}
        <DialogFooter className="mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="default" // Keep default variant, style with class
            disabled={justification.trim().length < MIN_JUSTIFICATION_LENGTH}
            onClick={handleConfirm}
            className="bg-amber-600 hover:bg-amber-700 text-white disabled:bg-amber-300" // Amber styling for confirm
          >
            Confirm Override
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OverrideDialog;

--- END OF FILE src/components/interface/OverrideDialog.tsx ---

--- START OF FILE src/components/interface/ValidationView.tsx ---

import { ProcessedDictation, MedicalCode } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ClipboardCheck, AlertTriangle, AlertCircle, FileText, Briefcase, Tag, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator"; // Keep if used elsewhere, not used in current layout
import { cn } from "@/lib/utils";

interface ValidationViewProps {
  dictationText: string;
  validationResult: ProcessedDictation;
  onBack: () => void;
  onSign: () => void;
}

const ValidationView = ({
  dictationText,
  validationResult,
  onBack,
  onSign
}: ValidationViewProps) => {

  // Determine if the order was overridden
  const isOverridden = validationResult.overridden === true;

  // Format compliance score for display (e.g., "3/9")
  const displayComplianceScore = validationResult.complianceScore !== undefined ? // Check for undefined explicitly
    `${validationResult.complianceScore}/9` :
    null; // Handle case where score might be missing

  return (
    <Card className="bg-white mt-6 border border-gray-200 shadow-sm">
      {/* Card Header */}
      <CardHeader className="pb-2 pt-3 px-4 border-b border-gray-100">
        <CardTitle className="text-lg font-medium flex items-center flex-wrap gap-x-2 gap-y-1"> {/* Allow wrapping */}
          <ClipboardCheck className="h-5 w-5 mr-1 text-primary flex-shrink-0" />
          <span>Order Validation Summary</span>
          {/* Conditional Badges: Show Override first if applicable */}
          {isOverridden ? (
            <Badge variant="destructive" className="bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200 text-xs">
              <ShieldAlert className="h-3 w-3 mr-1" />
              Override Applied
            </Badge>
          ) : (
            // Only show Compliant if NOT overridden and status is valid
            validationResult.validationStatus === 'valid' && (
              <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200 text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                AUC Compliant
              </Badge>
            )
          )}
           {/* Display original score next to status badge */}
           {displayComplianceScore && (
                <Badge variant="secondary" className="text-xs">
                 Original Score: {displayComplianceScore}
               </Badge>
            )}
        </CardTitle>
      </CardHeader>

      {/* Card Content */}
      <CardContent className="px-4 py-5 sm:p-6 space-y-6">

        {/* Original Validation Feedback (Always show if present) */}
        {validationResult.feedback && (
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-2 flex items-center">
              <AlertTriangle className={`h-4 w-4 mr-2 ${isOverridden ? 'text-amber-600' : 'text-red-600'}`} />
              Original Validation Feedback
            </h3>
            <div className={cn(
                "p-3 rounded-md border text-sm",
                isOverridden ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-red-50 border-red-200 text-red-900'
            )}>
              <p>{validationResult.feedback}</p>
            </div>
          </div>
        )}

         {/* Display Override Justification if present */}
         {isOverridden && validationResult.overrideJustification && (
           <div>
             <h3 className="text-md font-medium text-gray-900 mb-2 flex items-center">
               <ShieldAlert className="h-4 w-4 mr-2 text-amber-600" />
               Override Justification Provided
             </h3>
             <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
               <p className="text-sm text-amber-900 italic">"{validationResult.overrideJustification}"</p>
             </div>
           </div>
         )}

        {/* Clinical Information Section */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-2 flex items-center">
            <FileText className="h-4 w-4 mr-2 text-gray-600" />
            Clinical Information Provided
          </h3>
          <div className="bg-gray-50 p-3 rounded-md border border-gray-100 max-h-40 overflow-y-auto">
            {/* Display full dictation text */}
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{dictationText || "No dictation provided."}</p>
          </div>
        </div>

        {/* Coding & Billing Information */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-2 flex items-center">
            <Tag className="h-4 w-4 mr-2 text-gray-600" />
            Extracted Coding & Billing Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ICD-10 Codes */}
            <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">ICD-10 Diagnosis Codes</p>
              {(validationResult.diagnosisCodes && validationResult.diagnosisCodes.length > 0) ? (
                <ul className="space-y-1.5">
                  {validationResult.diagnosisCodes.map((code: MedicalCode, index: number) => (
                    <li key={`${code.code}-${index}`} className="text-sm leading-tight">
                      <span className="font-mono text-primary font-medium mr-2">{code.code}</span>
                      <span className="text-gray-700">{code.description}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic">None identified.</p>
              )}
            </div>
            {/* CPT Codes */}
            <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">CPT Procedure Codes</p>
              {(validationResult.procedureCodes && validationResult.procedureCodes.length > 0) ? (
                <ul className="space-y-1.5">
                  {validationResult.procedureCodes.map((code: MedicalCode, index: number) => (
                    <li key={`${code.code}-${index}`} className="text-sm leading-tight">
                      <span className="font-mono text-primary font-medium mr-2">{code.code}</span>
                      <span className="text-gray-700">{code.description}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic">None identified.</p>
              )}
            </div>
          </div>
        </div>

        {/* Guidelines & AUC Compliance Summary */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-2 flex items-center">
            <Briefcase className="h-4 w-4 mr-2 text-gray-600" />
            Guidelines & AUC Compliance Check
          </h3>
          <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
            {/* Appropriateness Status */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-700">Appropriateness Validation:</p>
               {isOverridden ? (
                 <div className="flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-1 rounded-full border border-amber-300 text-xs">
                   <ShieldAlert className="h-3.5 w-3.5" />
                   <span className="font-medium">Override Applied</span>
                 </div>
               ) : validationResult.validationStatus === 'valid' ? (
                 <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full border border-green-200 text-xs">
                   <CheckCircle className="h-3.5 w-3.5" />
                   <span className="font-medium">Compliant</span>
                 </div>
               ) : (
                 <div className="flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full border border-red-200 text-xs">
                   <AlertCircle className="h-3.5 w-3.5" />
                   <span className="font-medium">Non-Compliant</span>
                 </div>
               )}
            </div>
            {/* Guideline Checks */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
              {['ACR Guidelines', 'CMS AUC', 'NCCN Guidelines', 'Medicare AUC'].map(guideline => (
                <div key={guideline} className="flex items-center">
                  <span className="text-gray-600">{guideline}</span>
                  {isOverridden ? (
                    <ShieldAlert className="h-3.5 w-3.5 text-amber-500 ml-2 flex-shrink-0" title="Overridden" />
                  ) : validationResult.validationStatus === 'valid' ? (
                    <CheckCircle className="h-3.5 w-3.5 text-green-500 ml-2 flex-shrink-0" title="Compliant" />
                  ) : (
                     <AlertCircle className="h-3.5 w-3.5 text-red-500 ml-2 flex-shrink-0" title="Non-Compliant" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            onClick={onBack}
            className="min-h-[44px] px-6"
          >
            {isOverridden ? "Back to Dictation" : "Edit Dictation"}
          </Button>
          <Button
            onClick={onSign}
            // Allow signing even if overridden (status was forced to 'valid' locally)
            // disabled={validationResult.validationStatus !== 'valid'} // This check works due to local state forcing
            className={cn(
                "min-h-[44px] px-6 transition-colors",
                isOverridden ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-primary hover:bg-primary/90 text-primary-foreground'
            )}
          >
            {isOverridden ? "Sign Overridden Order" : "Sign Order"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ValidationView;

--- END OF FILE src/components/interface/ValidationView.tsx ---

--- START OF FILE src/components/interface/SignatureForm.tsx ---
import { useState, useRef, useEffect, useCallback } from 'react';
import { Patient, ProcessedDictation, Order } from '@/lib/types'; // Added Order type
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SignatureFormProps {
  patient: Patient | null | undefined;
  dictationText: string;
  validationResult: ProcessedDictation;
  // Added orderId prop
  orderId: number; // Required: ID of the draft order to update
  onBack: () => void;
  onSubmitted: (orderId: number) => void;
}

const SignatureForm = ({
  patient,
  dictationText,
  validationResult,
  orderId, // Use the passed orderId
  onBack,
  onSubmitted
}: SignatureFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const isTemporaryPatient = !patient || patient.id === 0;
  const hasRequiredPatientInfo = Boolean( patient && patient.name && patient.name !== "Unknown Patient" && patient.dob && patient.dob !== "Unknown" );
  const isOverridden = validationResult.overridden === true;

  // --- Signature Canvas Logic (Keep as is) ---
  const getCanvasContext = useCallback((): CanvasRenderingContext2D | null => { const canvas = canvasRef.current; if (!canvas) return null; return canvas.getContext('2d'); }, []);
  const getCoordinates = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>): { x: number; y: number } | null => { const canvas = canvasRef.current; if (!canvas) return null; const rect = canvas.getBoundingClientRect(); let clientX, clientY; if ('touches' in e) { if (e.touches.length === 0) return null; clientX = e.touches[0].clientX; clientY = e.touches[0].clientY; } else { clientX = e.clientX; clientY = e.clientY; } const scaleX = canvas.width / rect.width; const scaleY = canvas.height / rect.height; return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY }; }, []);
  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => { if ('touches' in e) e.preventDefault(); const ctx = getCanvasContext(); const coords = getCoordinates(e); if (!ctx || !coords) return; setIsDrawing(true); setHasSignature(true); ctx.beginPath(); ctx.moveTo(coords.x, coords.y); }, [getCanvasContext, getCoordinates]);
  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => { if (!isDrawing) return; if ('touches' in e) e.preventDefault(); const ctx = getCanvasContext(); const coords = getCoordinates(e); if (!ctx || !coords) return; ctx.lineTo(coords.x, coords.y); ctx.stroke(); }, [isDrawing, getCanvasContext, getCoordinates]);
  const stopDrawing = useCallback(() => { const ctx = getCanvasContext(); if (!ctx || !isDrawing) return; ctx.closePath(); setIsDrawing(false); }, [isDrawing, getCanvasContext]);
  const clearSignature = useCallback(() => { const canvas = canvasRef.current; const ctx = getCanvasContext(); if (!canvas || !ctx) return; ctx.clearRect(0, 0, canvas.width, canvas.height); setHasSignature(false); }, [getCanvasContext]);
  useEffect(() => { const canvas = canvasRef.current; const ctx = getCanvasContext(); if (!canvas || !ctx) return; ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#000000'; const resizeCanvas = () => { const container = canvas.parentElement; if (!container) return; const currentDrawing = ctx.getImageData(0, 0, canvas.width, canvas.height); const ratio = Math.max(window.devicePixelRatio || 1, 1); canvas.width = container.clientWidth * ratio; canvas.height = 120 * ratio; canvas.style.width = `${container.clientWidth}px`; canvas.style.height = `120px`; ctx.scale(ratio, ratio); ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#000000'; if (hasSignature) { ctx.putImageData(currentDrawing, 0, 0); } }; resizeCanvas(); window.addEventListener('resize', resizeCanvas); return () => window.removeEventListener('resize', resizeCanvas); }, [getCanvasContext, clearSignature, hasSignature]);
  // --- End Signature Canvas Logic ---

  const handleSubmitOrder = async () => {
    if (!hasRequiredPatientInfo) { toast({ title: "Missing Patient Information", description: "Please identify the patient (Name and DOB required) before signing.", variant: "destructive" }); return; }
    if (!hasSignature || !fullName.trim()) { toast({ title: "Missing Signature Information", description: "Please sign and type your full name.", variant: "destructive" }); return; }
    if (!user) { toast({ title: "Authentication Error", description: "You must be logged in.", variant: "destructive" }); return; }
    if (!orderId) { toast({ title: "Order Error", description: "Cannot submit, order ID is missing. Please validate dictation first.", variant: "destructive" }); return; } // Check for orderId

    setIsSubmitting(true);

    try {
      // Prepare the UPDATE payload for the existing draft order
      // Focus on fields that need updating at the signature stage
      const updatePayload = {
        // Final Validation State
        final_cpt_code: validationResult.procedureCodes?.[0]?.code || validationResult.cptCode || null,
        final_cpt_code_description: validationResult.procedureCodes?.[0]?.description || validationResult.procedureDescription || null,
        final_icd10_codes: Array.from(new Set(validationResult.diagnosisCodes?.map(code => code.code).filter(Boolean) || [])).join(','),
        // final_icd10_code_descriptions: JSON.stringify(validationResult.diagnosisCodes?.reduce((acc, code) => { if (code.code && code.description) { acc[code.code] = code.description; } return acc; }, {} as Record<string, string>) || {}), // Stringify if DB expects text/json
        final_validation_status: validationResult.overridden ? 'override' : (validationResult.validationStatus || 'unknown'), // Explicitly set 'override'
        final_compliance_score: validationResult.complianceScore,
        final_validation_notes: validationResult.feedback || null, // Feedback from last validation
        validated_at: new Date().toISOString(), // Timestamp of final validation/override step completion

        // Override Info
        overridden: validationResult.overridden ?? false,
        override_justification: validationResult.overrideJustification || null,

        // Signature Info
        signed_by_user_id: user.id,
        signature_date: new Date().toISOString(),
        signer_name: fullName.trim(), // Send typed name for backend record keeping

        // Status Update
        status: 'pending_admin', // Move to admin queue

        // Include signature data if backend needs it directly
        // signatureDataUrl: canvasRef.current?.toDataURL('image/png'),

        // Patient info might need updating if identified locally
        // Only send if patient was temporary (id=0) and backend needs to create/link
        ...(isTemporaryPatient && patient && {
            patient_name_update: patient.name,
            patient_dob_update: patient.dob,
            // Potentially send MRN/PIDN if captured locally
        })
      };

      console.log(`Submitting Order Update Payload for Order ID ${orderId}:`, updatePayload);

      // API Call: UPDATE the existing order using its ID
      // Adjust endpoint as needed (e.g., PUT /api/orders/{orderId})
      const response = await apiRequest("PUT", `/api/orders/${orderId}`, updatePayload);

      const responseData = await response.json();

      if (!responseData.success) {
        throw new Error(responseData.message || "Failed to update and submit order.");
      }

      console.log("Order submitted successfully, ID:", orderId);

      // Handle signature upload confirmation if needed (might be separate call)
      // Example: await apiRequest("POST", `/api/uploads/confirm`, { filePath: signatureFilePath, orderId: orderId, documentType: 'signature' });

      toast({ title: "Order Submitted Successfully", description: "Order signed and sent for administrative finalization.", variant: "default", duration: 5000 });
      onSubmitted(orderId); // Notify parent with the existing order ID

    } catch (error) {
      console.error("Error submitting order:", error);
      toast({ title: "Submission Error", description: error instanceof Error ? error.message : "Failed to submit the order. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-white mt-6 border border-gray-200 shadow-sm">
      <CardContent className="px-4 py-5 sm:p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Digital Signature & Confirmation</h2>
        <div className={cn( "mb-6 p-4 rounded-md border", isOverridden ? "bg-amber-50 border-amber-200" : "bg-blue-50 border-blue-200" )}>
          <div className="flex items-start">
             <Info className={`h-5 w-5 mr-2 mt-0.5 flex-shrink-0 ${isOverridden ? 'text-amber-600' : 'text-blue-600'}`} />
              <p className={`text-sm ${isOverridden ? 'text-amber-800' : 'text-blue-800'}`}>
                {isOverridden ? ( <> By signing, I certify that although this order deviates from standard AUC guidelines (Final Score: {validationResult.complianceScore ?? 'N/A'}/9), it is medically necessary based on the clinical details and justification provided. I acknowledge this override. </>
                ) : ( <> By signing, I certify that this radiology study is medically necessary and appropriate according to AUC guidelines (Compliance Score: {validationResult.complianceScore ?? 'N/A'}/9). </> )}
              </p>
          </div>
        </div>
        <div className="mb-6">
          <Label className="block text-sm font-medium text-gray-700 mb-2"> Electronic Signature <span className="text-red-500">*</span> </Label>
          <div className="border border-gray-300 rounded-md p-2 bg-gray-50/50">
            <canvas ref={canvasRef} className="signature-pad w-full h-[120px] bg-white rounded" onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} onTouchCancel={stopDrawing} />
             <div className="flex justify-end mt-1"> <Button variant="ghost" size="sm" className="text-xs text-gray-600 hover:text-primary" onClick={clearSignature} disabled={!hasSignature || isSubmitting}> Clear Signature </Button> </div>
          </div>
        </div>
        <div className="mb-6">
          <Label htmlFor="signature-name" className="block text-sm font-medium text-gray-700 mb-1"> Type Full Name to Confirm <span className="text-red-500">*</span> </Label>
          <Input id="signature-name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary h-10" placeholder="Type your full legal name" disabled={isSubmitting} required />
        </div>
         {!hasRequiredPatientInfo && (
             <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-md">
                 <div className="flex items-start"> <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0"/> <div className="text-sm text-red-800"> <p className="font-medium">Patient Identification Required</p> <p className="mt-1">Please use the 'Back' button or the patient card to provide the patient's Name and Date of Birth before signing.</p> </div> </div>
             </div>
         )}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-8">
          <Button variant="outline" onClick={onBack} disabled={isSubmitting} className="w-full sm:w-auto min-h-[44px] px-6"> Back to Validation </Button>
          <Button
            onClick={handleSubmitOrder}
            disabled={isSubmitting || !hasSignature || !fullName.trim() || !hasRequiredPatientInfo || !orderId} // Also disable if orderId is missing
            className={cn( "w-full sm:w-auto inline-flex items-center justify-center min-h-[44px] px-6 text-base font-medium rounded-lg shadow-sm transition-colors", isOverridden ? "bg-amber-600 hover:bg-amber-700 text-white" : "bg-primary hover:bg-primary/90 text-primary-foreground", "disabled:opacity-50 disabled:cursor-not-allowed" )}
          >
            {isSubmitting ? ( <> <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" /> Submitting... </> ) : ( isOverridden ? "Submit Overridden Order" : "Submit Order" )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignatureForm;

--- END OF FILE src/components/interface/SignatureForm.tsx ---

--- START OF FILE src/components/interface/PatientIdentificationDictation.tsx ---

import { useState, useRef, useEffect, useCallback } from "react";
import { Mic, Square, AlertTriangle, User, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Import Input
import { Card, CardContent } from "@/components/ui/card"; // Keep if used, maybe for suggestions
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose, // Import DialogClose
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Define interfaces for Web Speech API manually if needed
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}
interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}
interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
  isFinal: boolean;
}
interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}
type SpeechRecognitionAPI = { new (): SpeechRecognition };
type SpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event | any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

interface PatientIdentificationDictationProps {
  onIdentify: (patientInfo: { name: string; dob: string }) => void;
  onCancel: () => void;
  open: boolean;
}

// Interface for patient suggestion
interface PatientSuggestion {
  name: string;
  dob: string; // Store as MM/DD/YYYY
  confidence: number;
}

const PatientIdentificationDictation = ({
  onIdentify,
  onCancel,
  open
}: PatientIdentificationDictationProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isParsing, setIsParsing] = useState(false); // Added parsing state
  const [error, setError] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef<string>(""); // Store final transcript
  const { toast } = useToast();

  // State for suggestions confirmation dialog
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [patientSuggestions, setPatientSuggestions] = useState<PatientSuggestion[]>([]);

  // --- Speech Recognition Setup ---
  const setupSpeechRecognition = useCallback(() => {
     const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition as SpeechRecognitionAPI | undefined;
     if (!SpeechRecognition) {
         console.warn("Speech recognition not supported");
         setError("Speech recognition not supported in this browser.");
         return;
     }
     try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        // recognition.lang = 'en-US';

        recognition.onstart = () => {
            console.log("Patient ID Speech recognition started");
            setIsListening(true);
            finalTranscriptRef.current = ""; // Reset transcript ref on start
            setTranscript("..."); // Placeholder while listening
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let interimTranscript = '';
            let currentFinalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    currentFinalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
             // Update final transcript ref only with the final parts
            if (currentFinalTranscript) {
                 finalTranscriptRef.current += currentFinalTranscript;
            }
            // Display combined final + interim
            setTranscript(finalTranscriptRef.current + interimTranscript);
        };

        recognition.onerror = (event: any) => {
            console.error('Patient ID Speech recognition error', event);
            setError(`Mic error: ${event.error}. Please try again or type.`);
            setIsListening(false);
        };

        recognition.onend = () => {
            console.log("Patient ID Speech recognition ended");
             if (isListening) { // Only set if it wasn't stopped manually via toggle
                 setIsListening(false);
                 // Automatically attempt parse when speech ends naturally
                 if (finalTranscriptRef.current.trim()) {
                     parsePatientInfo(finalTranscriptRef.current);
                 }
             }
        };
        recognitionRef.current = recognition;
     } catch(e) {
         console.error("Failed to init speech recognition for patient ID:", e);
         setError("Failed to initialize speech recognition.");
     }
  }, [isListening]); // Added isListening dependency

  useEffect(() => {
    if (open) {
      setupSpeechRecognition();
    } else {
      // Cleanup when dialog is closed
      recognitionRef.current?.stop();
      setIsListening(false);
      setTranscript("");
      setError("");
      setShowSuggestions(false);
      finalTranscriptRef.current = "";
    }
    return () => {
      recognitionRef.current?.stop(); // Ensure stop on unmount
    };
  }, [open, setupSpeechRecognition]);
  // --- End Speech Recognition Setup ---


  // --- Toggle Recording ---
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      setError("Speech recognition not available.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false); // Manually set state here as onend might be delayed
      // Parse the final transcript after manual stop
      if (finalTranscriptRef.current.trim()) {
          parsePatientInfo(finalTranscriptRef.current);
      }
    } else {
      setTranscript(""); // Clear previous transcript display
      setError("");
      finalTranscriptRef.current = ""; // Clear stored transcript
      try {
        recognitionRef.current.start();
        // onstart will set isListening to true
      } catch (e) {
         console.error("Error starting patient ID recognition:", e);
         setError("Could not start microphone.");
         setIsListening(false);
      }
    }
  };
  // --- End Toggle Recording ---


  // --- Parsing Logic ---
  const parsePatientInfo = useCallback(async (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) {
      setError("No text provided to parse.");
      return;
    }

    setIsParsing(true);
    setError("");
    setShowSuggestions(false); // Hide previous suggestions

    console.log("Parsing text:", trimmedText);

    // Simple Heuristic Parsing (Replace with a more robust NLP approach if needed)
    // This is a basic example and prone to errors.
    const suggestions: PatientSuggestion[] = [];
    const words = trimmedText.toLowerCase().split(/\s+/);

    // Look for common DOB patterns (e.g., "born month day year", "dob mm/dd/yyyy")
    const dobKeywords = ["born", "dob", "birthdate", "date of birth"];
    let dobIndex = -1;
    for (const keyword of dobKeywords) {
        const kwIndex = trimmedText.toLowerCase().indexOf(keyword);
        if (kwIndex !== -1) {
            dobIndex = kwIndex + keyword.length;
            break;
        }
    }

    let namePart = trimmedText;
    let dobPart = "";

    if (dobIndex !== -1) {
        namePart = trimmedText.substring(0, dobIndex - dobKeywords.find(k => trimmedText.toLowerCase().includes(k))!.length).trim();
        dobPart = trimmedText.substring(dobIndex).trim();
    }

    // Try to extract DOB (very basic) - Needs significant improvement
    let extractedDob = "Unknown"; // Default
    const dateRegex = /(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/; // MM/DD/YYYY or similar
    const dateMatch = dobPart.match(dateRegex);
    if (dateMatch) {
        // Basic format, might need validation
        extractedDob = `${dateMatch[1].padStart(2, '0')}/${dateMatch[2].padStart(2, '0')}/${dateMatch[3]}`;
    } else {
        // Try month name matching (requires more complex logic)
        // Example: Look for "January 15 1980" -> extract
    }

    // Add the primary parsed suggestion
    if (namePart) {
         suggestions.push({ name: namePart, dob: extractedDob, confidence: 0.7 });
    }

    // Add fallback: use whole text as name, default DOB
    suggestions.push({ name: trimmedText, dob: "01/01/2000", confidence: 0.1 });


    // Simulate parsing delay if needed
    // await new Promise(resolve => setTimeout(resolve, 500));

    console.log("Generated Suggestions:", suggestions);
    setPatientSuggestions(suggestions.slice(0, 3)); // Show top suggestions
    setShowSuggestions(true);
    setIsParsing(false);

  }, []); // No dependencies needed for this simple version
  // --- End Parsing Logic ---


  // Handle selection of a suggestion
  const handleSelectSuggestion = (suggestion: PatientSuggestion) => {
    console.log("Suggestion selected:", suggestion);
    onIdentify({ name: suggestion.name, dob: suggestion.dob });
    setShowSuggestions(false); // Close suggestions dialog
    onCancel(); // Close main dialog as well
  };

  // Handle manual input confirmation (if suggestions are wrong)
  const handleManualInputConfirm = () => {
    // Use the current transcript directly as the name, provide a default DOB
    const name = transcript.trim() || "Manual Entry";
    const dob = "01/01/2000"; // Or prompt for DOB separately
    console.log("Manual input confirmed:", { name, dob });
    onIdentify({ name, dob });
    setShowSuggestions(false);
    onCancel();
  };


  return (
    <>
      {/* Main Identification Dialog */}
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Patient Identification</DialogTitle>
            <DialogDescription>
              Speak or type the patient's name and date of birth.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Recording Control & Status */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">
                {isListening ? (
                  <span className="flex items-center text-blue-600 animate-pulse">
                    <span className="mr-1">●</span> Recording...
                  </span>
                ) : (
                  <span>Press mic or type below</span>
                )}
              </span>
              <Button
                variant={isListening ? "destructive" : "outline"}
                size="icon" // Make it a square icon button
                className="h-9 w-9 p-0 flex-shrink-0"
                onClick={toggleRecording}
                disabled={isParsing || !recognitionRef.current}
                title={isListening ? "Stop recording" : "Start recording"}
              >
                {isListening ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            </div>

            {/* Transcript / Manual Input Area */}
            <div>
                 <Label htmlFor="patient-id-input" className="sr-only">Patient Name and DOB</Label>
                 <Input
                    id="patient-id-input"
                    type="text"
                    placeholder="Speak or type name and DOB..."
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm w-full h-10"
                    value={transcript}
                    onChange={(e) => {
                        setTranscript(e.target.value);
                        finalTranscriptRef.current = e.target.value; // Update ref on manual change
                    }}
                    disabled={isListening || isParsing}
                 />
                 <p className="text-xs text-gray-500 mt-1">
                    Example: "Jane Doe, date of birth January 1st 1990"
                 </p>
            </div>


            {/* Error Display */}
            {error && (
              <div className="text-sm text-red-600 flex items-start p-2 border border-red-200 rounded-md bg-red-50">
                <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Dialog Footer */}
          <DialogFooter className="sm:justify-between border-t pt-4 mt-2">
            <Button variant="ghost" onClick={onCancel} disabled={isParsing}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => parsePatientInfo(transcript)} // Trigger parse on button click
              disabled={!transcript.trim() || isParsing || isListening}
            >
              {isParsing ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" /> Parsing...
                </>
              ) : (
                "Identify Patient"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Suggestions Confirmation Dialog */}
      <Dialog open={showSuggestions} onOpenChange={setShowSuggestions}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Confirm Patient Information</DialogTitle>
            <DialogDescription>
              Select the best match for your input, or confirm manual entry.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto px-1 pb-2">
            {/* Original Input Display */}
            <div className="bg-gray-100 p-3 rounded-md text-sm border border-gray-200">
              <span className="font-semibold text-gray-700">Your Input:</span>
              <div className="italic mt-1 text-gray-600">{transcript}</div>
            </div>

            {/* Suggestions List */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-800">Possible Interpretations:</div>
              {patientSuggestions.length > 0 ? (
                patientSuggestions.map((suggestion, index) => (
                  <Card
                    key={index}
                    className="border border-gray-200 hover:border-primary rounded-md p-3 cursor-pointer transition-all flex items-center justify-between gap-2"
                    onClick={() => handleSelectSuggestion(suggestion)}
                  >
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center text-sm mb-1">
                        <User className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                        <span className="font-medium text-gray-900 truncate" title={suggestion.name}>{suggestion.name}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                        <span>{suggestion.dob}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="h-8 px-3 text-xs" onClick={(e) => {
                      e.stopPropagation(); // Prevent card click
                      handleSelectSuggestion(suggestion);
                    }}>
                      Select
                    </Button>
                  </Card>
                ))
              ) : (
                 <p className="text-sm text-gray-500 italic">No specific interpretations found.</p>
              )}
            </div>

            {/* Option to use raw text */}
             <div className="pt-2 border-t border-gray-200">
                 <p className="text-sm text-gray-600 mb-2">If none of the above are correct:</p>
                 <Button
                    variant="secondary"
                    size="sm"
                    className="w-full text-xs"
                    onClick={handleManualInputConfirm}
                 >
                    Use "{transcript.substring(0, 20)}{transcript.length > 20 ? '...' : ''}" as Name (DOB: 01/01/2000)
                 </Button>
             </div>

          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowSuggestions(false)}>
              Cancel Selection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PatientIdentificationDictation;

--- END OF FILE src/components/interface/PatientIdentificationDictation.tsx ---

--- START OF FILE src/components/interface/PhysicianInterface.tsx ---
--- START OF FILE src/components/interface/PhysicianInterface.tsx ---

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter"; // Assuming wouter is used for routing
import { ArrowLeft, Plus, UserPlus, Heart, Loader2 } from "lucide-react"; // Added Heart, Loader2
import OrderProgressIndicator from "@/components/common/OrderProgressIndicator"; // Adjust path
import DictationForm from "./DictationForm";
import ValidationView from "./ValidationView";
import SignatureForm from "./SignatureForm";
import OverrideDialog from "./OverrideDialog";
import PatientInfoCard from "./PatientInfoCard";
import PatientIdentificationDictation from "./PatientIdentificationDictation";
import ClinicalContextPanel from "./ClinicalContextPanel"; // Import the context panel
import { Button } from "@/components/ui/button";
import { Patient, ProcessedDictation, Order } from "@/lib/types"; // Added Order type
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient"; // Use centralized apiRequest
import { calculateAge } from "@/lib/utils";

// Props definition, patientId is optional for starting without a patient
export interface PhysicianInterfaceProps {
  initialPatientId?: number | string | null; // Allow string from URL params
}

// Interface for the validation API response (including orderId)
interface ValidationApiResponse {
    success: boolean;
    message?: string;
    orderId?: number; // ID of the draft/existing order
    validationResult?: ProcessedDictation; // The actual validation output
    // Include other fields from your actual API response if needed
}


const PhysicianInterface = ({ initialPatientId = null }: PhysicianInterfaceProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location, navigate] = useLocation(); // For navigation

  // Component State
  const [currentPatientId, setCurrentPatientId] = useState<number | null>(
    initialPatientId ? parseInt(initialPatientId.toString(), 10) : null
  );
  const [activePatient, setActivePatient] = useState<Patient | null>(null);
  const [isClinicalContextOpen, setIsClinicalContextOpen] = useState(false);
  const [orderStep, setOrderStep] = useState(1); // 1: Dictation, 2: Validation, 3: Signature
  const [dictationText, setDictationText] = useState("");
  const [validationResult, setValidationResult] = useState<ProcessedDictation | null>(null);
  const [validationFeedback, setValidationFeedback] = useState<string | undefined>(undefined);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isOverrideDialogOpen, setIsOverrideDialogOpen] = useState(false);
  const [isPatientIdentificationOpen, setIsPatientIdentificationOpen] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null); // Stores ID after first validation
  const [isProcessingValidation, setIsProcessingValidation] = useState(false); // Loading state for validation calls

  // Placeholder for when no patient is selected
  const placeholderPatient: Patient = {
    id: 0,
    name: "Unknown Patient",
    dob: "Unknown",
    mrn: `TEMP-${Date.now().toString().slice(-6)}`,
    pidn: `TEMP-${Date.now().toString().slice(-6)}`,
    gender: "unknown",
    radiologyGroupId: null,
    referringPracticeId: null,
    externalPatientId: null,
    encryptedData: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // --- Data Fetching ---
  const { data: fetchedPatient, isLoading: isLoadingPatient, error: patientError } = useQuery<Patient | null>({ // Allow null return
    queryKey: ['patient', currentPatientId],
    queryFn: async ({ queryKey }) => {
        const [, id] = queryKey;
        if (!id || id === 0) return null;
        try {
            // Use apiRequest which handles errors including 404
            const response = await apiRequest('GET', `/api/patients/${id}`);
            // apiRequest throws on non-ok, so if we get here, it's ok
            return await response.json();
        } catch (error: any) {
             if (error instanceof Error && error.message.startsWith('404:')) {
                 console.warn(`Patient with ID ${id} not found.`);
                 return null; // Return null if not found
             }
             console.error(`Failed to fetch patient ${id}:`, error);
             throw error; // Re-throw other errors for React Query
        }
    },
    enabled: !!currentPatientId && currentPatientId !== 0,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Update activePatient based on fetch results or placeholder
  useEffect(() => {
    if (currentPatientId && currentPatientId !== 0) {
      if (!isLoadingPatient) { // Only update when loading is finished
          if (fetchedPatient) {
            setActivePatient(fetchedPatient);
            console.log("Active patient set from fetched data:", fetchedPatient);
          } else {
             // Handle case where fetch finished but returned null (e.g., 404)
             console.warn(`Patient with ID ${currentPatientId} not found or fetch failed.`);
             toast({ title: "Patient Not Found", description: `Could not load patient data for ID ${currentPatientId}. Using temporary.`, variant: "destructive" });
             // Fallback to placeholder but keep the ID if user intended to use it? Or reset?
             setActivePatient({ ...placeholderPatient, id: currentPatientId }); // Keep ID but use placeholder details
             // OR: setCurrentPatientId(null); setActivePatient(placeholderPatient); // Reset completely
          }
      }
      // If still loading, activePatient remains null or previous value
    } else {
      setActivePatient(placeholderPatient);
      console.log("Active patient set to placeholder.");
    }
  }, [currentPatientId, fetchedPatient, isLoadingPatient, placeholderPatient, toast]);


  // --- Validation Mutation ---
  // Using React Query mutation for validation calls
  const validationMutation = useMutation<ValidationApiResponse, Error, { text: string; isOverrideAttempt?: boolean }>({
     mutationFn: async ({ text, isOverrideAttempt = false }) => {
        const patientAge = calculateAge(activePatient?.dob);
        const gender = activePatient?.gender || "unknown";

        const payload = {
            orderId: orderId, // Include orderId if it exists (for subsequent calls)
            dictationText: text,
            isOverrideValidation: isOverrideAttempt, // Flag for backend
            patientInfo: {
                age: patientAge,
                gender: gender,
                name: activePatient?.name,
                mrn: activePatient?.mrn || activePatient?.pidn || 'Unknown'
            }
        };
        console.log("Calling /api/orders/validate with payload:", payload);
        // IMPORTANT: Use the correct validation endpoint from your API setup
        const response = await apiRequest('POST', '/api/orders/validate', payload);
        return await response.json();
     },
     onMutate: () => {
        setIsProcessingValidation(true);
        setValidationFeedback(undefined); // Clear previous feedback
     },
     onSuccess: (data, variables) => {
        console.log("Validation API Raw Response:", data);

        if (!data.success || !data.validationResult) {
            throw new Error(data.message || "Validation failed: Invalid response from server.");
        }

        // Store the orderId if returned (especially from the first call)
        if (data.orderId && !orderId) {
            setOrderId(data.orderId);
            console.log("Draft Order ID established:", data.orderId);
        }

        // Process the result
        const result = data.validationResult;
        setValidationResult(result); // Store the full result

        // Logic based on the validation outcome
        if (result.validationStatus === 'valid' && !variables.isOverrideAttempt && !result.overridden) {
            // Successful validation (not an override check result)
            setOrderStep(2); // Move to validation view
            setAttemptCount(0); // Reset attempts on success
        } else if (variables.isOverrideAttempt) {
            // This was the result of the final override validation call
            // Update state but ensure override flags are set correctly
             setValidationResult(prevResult => ({
                ...(prevResult || result), // Use new result as base, or fallback if needed
                validationStatus: result.validationStatus, // Use the status from the override validation
                feedback: result.feedback, // Use the feedback from the override validation
                complianceScore: result.complianceScore, // Use score from override validation
                diagnosisCodes: result.diagnosisCodes, // Use codes from override validation
                procedureCodes: result.procedureCodes, // Use codes from override validation
                // --- Crucially, keep the override flags set ---
                overridden: true, // It *was* an override action
                overrideJustification: prevResult?.overrideJustification || "Justification missing", // Keep justification text
             }));
            setOrderStep(2); // Move to validation view
        } else {
            // Failed validation, stay on dictation page
            setValidationFeedback(result.feedback || "Validation requires review.");
            setAttemptCount(prev => prev + 1);
        }
     },
     onError: (error) => {
        console.error("Validation Mutation Error:", error);
        toast({
            title: "Processing Error",
            description: error instanceof Error ? error.message : "Validation request failed.",
            variant: "destructive",
        });
        // Keep user on dictation step on error
        setOrderStep(1);
     },
     onSettled: () => {
        setIsProcessingValidation(false); // Stop loading indicator
     }
  });


  // --- Handlers ---

  // Handle triggering validation from DictationForm
  const handleProcessDictation = useCallback((text: string) => {
    if (text.trim().length < 20) {
      toast({ title: "Dictation Too Short", description: "Please provide more detail (min 20 characters).", variant: "destructive" });
      return;
    }
    validationMutation.mutate({ text });
  }, [validationMutation, toast]); // Include toast

  // Clear validation feedback manually
  const handleClearFeedback = useCallback(() => {
    setValidationFeedback(undefined);
  }, []);

  // Open override dialog
  const handleOverrideRequest = useCallback(() => {
    setIsOverrideDialogOpen(true);
  }, []);

  // Confirm override action - NOW TRIGGERS FINAL VALIDATION
  const handleOverrideConfirm = useCallback((justification: string) => {
    if (!validationResult) return; // Should have a result from 3rd attempt

    console.log("Override confirmed, triggering final validation with justification:", justification);
    setIsOverrideDialogOpen(false); // Close dialog immediately

    // Construct the text for the final validation call
    // Assuming dictationText holds the cumulative text from previous attempts
    const combinedText = `${dictationText}\n--------Override Justification----------\n${justification}`;

    // Store justification temporarily in state to add it back after validation result returns
    // This ensures it's persisted even if the final validation feedback overwrites parts of validationResult
    setValidationResult(prev => ({ ...prev!, overrideJustification: justification }));

    // Trigger the validation mutation, flagging it as an override attempt
    validationMutation.mutate({ text: combinedText, isOverrideAttempt: true });

  }, [validationResult, dictationText, validationMutation]); // Dependencies

  // Go back from Validation/Signature to Dictation
  const handleBackToDictation = useCallback(() => {
    setOrderStep(1);
  }, []);

  // Proceed from Validation to Signature
  const handleSignOrder = useCallback(() => {
    setOrderStep(3);
  }, []);

  // Handle final order submission success
  const handleOrderSubmitted = useCallback((submittedOrderId: number) => {
    // Order ID is already set from validation steps
    // const isTemp = activePatient?.id === 0; // Check if patient was temporary

    toast({
      title: "Order Submitted Successfully", // Simplified message
      description: (
        <div className="flex flex-col space-y-2 text-sm">
          <p>Order signed and recorded.</p>
          <p>Order ID: {submittedOrderId}</p>
        </div>
      ),
      variant: "default",
      duration: 6000,
    });

    // Reset state for a new order after a delay
    setTimeout(() => {
      setOrderStep(1);
      setDictationText("");
      setValidationResult(null);
      setValidationFeedback(undefined);
      setAttemptCount(0);
      setOrderId(null); // Reset order ID
      // Reset patient to placeholder
      setCurrentPatientId(null);
      setActivePatient(placeholderPatient);
      console.log("Interface reset for new order.");
    }, 3000);

  }, [placeholderPatient, toast]); // Dependencies

  // Toggle clinical context panel visibility
  const toggleClinicalContext = useCallback(() => {
    if (!isClinicalContextOpen && (!currentPatientId || currentPatientId === 0)) {
         toast({ title: "No Patient Selected", description: "Identify a patient to view clinical context.", variant: "default", duration: 2000 });
         return;
    }
    setIsClinicalContextOpen(!isClinicalContextOpen);
  }, [isClinicalContextOpen, currentPatientId, toast]);

  // Handle opening the patient identification dialog
  const handleEditOrAddPatient = useCallback(() => {
    setIsPatientIdentificationOpen(true);
  }, []);

  // Handle result from patient identification dialog
  const handlePatientIdentified = useCallback((patientInfo: { name: string; dob: string }) => {
    console.log("Patient identified via dialog:", patientInfo);
    // Update the active patient state locally (still temporary until order submission)
    setActivePatient(prev => ({
      ...(prev || placeholderPatient),
      id: 0, // Still temporary
      name: patientInfo.name,
      dob: patientInfo.dob,
      mrn: prev?.mrn?.startsWith('TEMP-') ? undefined : prev?.mrn,
      pidn: prev?.pidn?.startsWith('TEMP-') ? undefined : prev?.pidn,
    }));
    toast({ title: "Patient Info Updated", description: `Using Name: ${patientInfo.name}, DOB: ${patientInfo.dob}`, variant: "default", duration: 3000 });
    setIsPatientIdentificationOpen(false);
  }, [placeholderPatient, toast]);


  // --- Render Logic ---

  // Loading state while fetching initial patient
  if (currentPatientId && currentPatientId !== 0 && isLoadingPatient) {
    return (
        <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-gray-600">Loading patient information...</span>
        </div>
    );
  }

   // Error state if initial patient fetch failed
   if (currentPatientId && currentPatientId !== 0 && patientError) {
     return (
       <div className="p-4 text-center text-red-600 bg-red-50 border border-red-200 rounded-md max-w-xl mx-auto mt-4">
         Error loading patient data: {patientError.message}. Please try again or select a different patient.
       </div>
     );
   }


  // Main component render
  return (
    <div className="py-2 sm:py-4 relative">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border-b border-gray-200 gap-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1">
              <h1 className="text-lg font-semibold text-gray-900 truncate" title={activePatient?.name}>
                Radiology Order: {activePatient?.name || 'Unknown Patient'}
              </h1>
              <div className="px-2 py-1 bg-blue-100 rounded-md text-xs text-blue-800 font-medium self-start">
                Step {orderStep} of 3: {orderStep === 1 ? 'Dictation' : orderStep === 2 ? 'Validation' : 'Signature'}
              </div>
            </div>
            <div className="flex items-center justify-end sm:justify-end space-x-3">
              <OrderProgressIndicator currentStep={orderStep} />
              <button
                className={cn(
                    "p-2 rounded-full transition-colors",
                    (!currentPatientId || currentPatientId === 0)
                       ? "text-gray-400 cursor-not-allowed"
                       : "text-gray-500 hover:text-primary hover:bg-gray-100",
                    isClinicalContextOpen && "bg-primary/10 text-primary"
                )}
                onClick={toggleClinicalContext}
                disabled={!currentPatientId || currentPatientId === 0}
                title={(!currentPatientId || currentPatientId === 0) ? "Identify patient to view context" : (isClinicalContextOpen ? "Hide Clinical Context" : "Show Clinical Context")}
                style={{ touchAction: 'manipulation' }}
              >
                <Heart size={20} />
              </button>
            </div>
          </div>

          {/* Main Workflow Area */}
          <div className="p-3 sm:p-4">
            <div className="mb-4">
              <PatientInfoCard
                patient={activePatient}
                onEditPatient={handleEditOrAddPatient}
              />
            </div>

            {orderStep === 1 && (
              <DictationForm
                dictationText={dictationText}
                setDictationText={setDictationText}
                patient={activePatient}
                // Pass the mutation trigger function instead of handleProcessDictation directly
                onProcessRequest={handleProcessDictation} // Renamed prop for clarity
                isProcessing={isProcessingValidation} // Pass loading state
                validationFeedback={validationFeedback}
                onClearFeedback={handleClearFeedback}
                attemptCount={attemptCount}
                onOverride={handleOverrideRequest}
              />
            )}

            {orderStep === 2 && validationResult && (
              <ValidationView
                dictationText={dictationText} // Pass original/cumulative dictation
                validationResult={validationResult} // Pass the final result (could be from override validation)
                onBack={handleBackToDictation}
                onSign={handleSignOrder}
              />
            )}

            {orderStep === 3 && validationResult && activePatient && orderId && ( // Ensure orderId exists before signature
              <SignatureForm
                patient={activePatient}
                dictationText={dictationText}
                validationResult={validationResult}
                orderId={orderId} // Pass the established orderId
                onBack={handleBackToDictation}
                onSubmitted={handleOrderSubmitted}
              />
            )}
             {/* Show message if trying to sign without an orderId */}
             {orderStep === 3 && !orderId && (
                 <div className="text-center text-red-600 p-4 border border-red-200 bg-red-50 rounded-md">
                     Cannot proceed to signature. Order ID is missing. Please go back and validate the dictation first.
                 </div>
             )}
          </div>
        </div>
      </div>

      {/* Clinical Context Panel */}
      <ClinicalContextPanel
          patient={activePatient}
          isCollapsed={!isClinicalContextOpen}
          onCollapseToggle={toggleClinicalContext}
      />

      {/* Override Dialog */}
      <OverrideDialog
        isOpen={isOverrideDialogOpen}
        onClose={() => setIsOverrideDialogOpen(false)}
        onConfirm={handleOverrideConfirm}
      />

      {/* Patient Identification Dialog */}
      <PatientIdentificationDictation
        open={isPatientIdentificationOpen}
        onCancel={() => setIsPatientIdentificationOpen(false)}
        onIdentify={handlePatientIdentified}
      />
    </div>
  );
};

export default PhysicianInterface;

--- END OF FILE src/components/interface/PhysicianInterface.tsx ---
