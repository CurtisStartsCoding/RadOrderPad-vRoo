import * as React from "react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { CheckCircle, AlertTriangle, ArrowLeft, FileSignature } from "lucide-react";
import { OrderData, ValidationResult, ValidationStatus } from "../types";

/**
 * ValidationView Component
 * 
 * Displays the validation results and order summary.
 * Allows the user to go back to dictation or proceed to signature.
 */
interface ValidationViewProps {
  /** Validation result */
  validationResult: ValidationResult;
  
  /** Order data */
  orderData: OrderData;
  
  /** Function to handle going back to dictation */
  onBackToDictation: () => void;
  
  /** Function to handle proceeding to signature */
  onProceedToSignature: () => void;
}

export const ValidationView: React.FC<ValidationViewProps> = ({
  validationResult,
  orderData,
  onBackToDictation,
  onProceedToSignature
}) => {
  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <div className={`p-4 rounded-md ${
        validationResult.status === ValidationStatus.SUCCESS 
          ? "bg-green-50 border border-green-200" 
          : "bg-amber-50 border border-amber-200"
      }`}>
        <div className="flex">
          <div className={`flex-shrink-0 ${
            validationResult.status === ValidationStatus.SUCCESS 
              ? "text-green-500" 
              : "text-amber-500"
          }`}>
            {validationResult.status === ValidationStatus.SUCCESS 
              ? <CheckCircle className="h-5 w-5" /> 
              : <AlertTriangle className="h-5 w-5" />
            }
          </div>
          <div className="ml-3">
            <h3 className={`text-sm font-medium ${
              validationResult.status === ValidationStatus.SUCCESS 
                ? "text-green-800" 
                : "text-amber-800"
            }`}>
              {validationResult.message}
            </h3>
            {validationResult.details && (
              <div className={`mt-2 text-sm ${
                validationResult.status === ValidationStatus.SUCCESS 
                  ? "text-green-700" 
                  : "text-amber-700"
              }`}>
                <p>{validationResult.details}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Order Summary */}
      <Card className="p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
        
        <div className="space-y-4">
          {/* Patient Information */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
              Patient Information
            </h4>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="text-sm font-medium">{orderData.patient.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">DOB</p>
                  <p className="text-sm font-medium">{orderData.patient.dob}</p>
                </div>
                {orderData.patient.mrn && (
                  <div>
                    <p className="text-xs text-gray-500">MRN</p>
                    <p className="text-sm font-medium">{orderData.patient.mrn}</p>
                  </div>
                )}
                {orderData.patient.pidn && (
                  <div>
                    <p className="text-xs text-gray-500">PIDN</p>
                    <p className="text-sm font-medium">{orderData.patient.pidn}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Order Details */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
              Order Details
            </h4>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Modality</p>
                  <p className="text-sm font-medium">{orderData.modality}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Body Part</p>
                  <p className="text-sm font-medium">{orderData.bodyPart}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Contrast</p>
                  <p className="text-sm font-medium">
                    {orderData.contrast 
                      ? `Yes${orderData.contrastType ? ` (${orderData.contrastType})` : ''}` 
                      : 'No'
                    }
                  </p>
                </div>
                {orderData.instructions && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">Special Instructions</p>
                    <p className="text-sm font-medium">{orderData.instructions}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Clinical Indications */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
              Clinical Indications
            </h4>
            <div className="bg-gray-50 p-3 rounded-md">
              <ul className="list-disc pl-5 space-y-1">
                {orderData.clinicalIndications.map((indication, index) => (
                  <li key={index} className="text-sm">{indication}</li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Codes */}
          <div className="grid grid-cols-2 gap-4">
            {/* ICD-10 Codes */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                ICD-10 Codes
              </h4>
              <div className="bg-gray-50 p-3 rounded-md">
                <ul className="space-y-1">
                  {orderData.icd10Codes.map((code, index) => (
                    <li key={index} className="text-sm">
                      <span className="font-medium">{code.code}</span>: {code.description}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* CPT Codes */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                CPT Codes
              </h4>
              <div className="bg-gray-50 p-3 rounded-md">
                <ul className="space-y-1">
                  {orderData.cptCodes.map((code, index) => (
                    <li key={index} className="text-sm">
                      <span className="font-medium">{code.code}</span>: {code.description}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBackToDictation}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dictation
        </Button>
        
        <Button
          variant="default"
          onClick={onProceedToSignature}
          className="flex items-center"
        >
          Proceed to Signature
          <FileSignature className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};