import * as React from "react";
import { Edit, UserCog } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Patient } from "../types/patient-types";
import { PatientInfoSection } from "./PatientInfoSection";
import { 
  isTemporaryPatient,
  hasRealPatientInfo,
  getPatientCardBgClass,
  getPatientActionButtonClass,
  getPatientActionButtonTitle
} from "../utils/patient-card-utils";

/**
 * PatientInfoCard Component
 * 
 * A compact card showing patient information.
 * Highlights temporary patients and provides an edit/add button.
 */
interface PatientInfoCardProps {
  patient: Patient | null | undefined;
  onEditPatient?: () => void;
}

export const PatientInfoCard = ({ patient, onEditPatient }: PatientInfoCardProps) => {
  // Default to a placeholder if patient data is missing
  const displayPatient = patient || {
    id: 0,
    name: "Unknown Patient",
    dob: "Unknown",
    mrn: "N/A",
    pidn: "N/A",
  };

  // Determine patient status using utility functions
  const isTemporary = isTemporaryPatient(patient);
  const hasRealInfo = hasRealPatientInfo(patient);
  const cardBgClass = getPatientCardBgClass(isTemporary);
  const buttonClass = getPatientActionButtonClass(isTemporary);
  const buttonTitle = getPatientActionButtonTitle(isTemporary, hasRealInfo);

  return (
    <div className={`border rounded-lg overflow-hidden transition-colors ${cardBgClass}`}>
      <div className="px-3 py-2 flex items-center justify-between gap-2">
        {/* Patient info section */}
        <PatientInfoSection patient={displayPatient} />

        {/* Action button */}
        {(isTemporary || onEditPatient) && (
          <Button
            size="sm"
            variant="outline"
            className={`text-xs px-2 py-1 h-7 ml-2 flex-shrink-0 transition-colors ${buttonClass}`}
            onClick={onEditPatient}
            disabled={!onEditPatient}
            title={buttonTitle}
          >
            {isTemporary ? (
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