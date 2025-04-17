import * as React from "react";
import { Calendar, User, AlertTriangle } from "lucide-react";
import { Patient } from "../types/patient-types";
import { hasRealPatientInfo, isTemporaryPatient } from "../utils/patient-card-utils";

/**
 * PatientInfoSection Component
 * 
 * Displays patient information including avatar, name, and details.
 * Shows a temporary badge for patients without complete information.
 */
interface PatientInfoSectionProps {
  patient: Patient;
}

export const PatientInfoSection = ({ patient }: PatientInfoSectionProps) => {
  const isTemporary = isTemporaryPatient(patient);
  const hasRealInfo = hasRealPatientInfo(patient);

  return (
    <div className="flex items-center space-x-2 overflow-hidden">
      {/* Patient avatar */}
      <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full flex-shrink-0 border border-gray-200">
        <User className="h-4 w-4 text-gray-600" />
      </div>

      <div className="overflow-hidden">
        {/* Name and temporary badge */}
        <div className="flex items-center">
          <h2 className="text-sm font-semibold text-gray-900 truncate" title={patient.name}>
            {patient.name}
          </h2>
          {isTemporary && !hasRealInfo && (
            <div className="ml-2 flex items-center text-amber-700 flex-shrink-0">
              <AlertTriangle className="h-3 w-3 mr-1" />
              <span className="text-xs font-medium">Temporary</span>
            </div>
          )}
        </div>

        {/* Patient details */}
        <div className="flex items-center text-xs text-gray-600 mt-0.5 space-x-3 flex-wrap">
          <div className="flex items-center flex-shrink-0">
            <Calendar className="mr-1 h-3 w-3 text-gray-500" />
            <span>{patient.dob}</span>
          </div>
          <div className="flex items-center flex-shrink-0">
            <span className="font-medium text-gray-500 mr-1">PIDN:</span>
            <span className="truncate" title={patient.pidn || patient.mrn || 'N/A'}>
              {patient.pidn || patient.mrn || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};