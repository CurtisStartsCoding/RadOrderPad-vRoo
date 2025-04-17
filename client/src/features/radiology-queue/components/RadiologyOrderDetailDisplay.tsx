import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { RadiologyOrder, RadiologyOrderStatus } from '../types/radiology-order-types';
import { formatDate, formatDateTime } from '../utils/date-utils';

/**
 * Props for the RadiologyOrderDetailDisplay component
 */
interface RadiologyOrderDetailDisplayProps {
  orderData: RadiologyOrder;
}

/**
 * RadiologyOrderDetailDisplay Component
 * 
 * Displays the details of a radiology order in a read-only format.
 */
export const RadiologyOrderDetailDisplay: React.FC<RadiologyOrderDetailDisplayProps> = ({
  orderData
}) => {
  /**
   * Get status badge variant based on status
   */
  const getStatusBadgeVariant = (status: RadiologyOrderStatus): 'default' | 'secondary' | 'success' | 'destructive' => {
    switch (status) {
      case RadiologyOrderStatus.PENDING_REVIEW:
        return 'default';
      case RadiologyOrderStatus.IN_PROGRESS:
        return 'secondary';
      case RadiologyOrderStatus.COMPLETED:
        return 'success';
      case RadiologyOrderStatus.CANCELLED:
        return 'destructive';
      default:
        return 'default';
    }
  };
  
  /**
   * Format status for display
   */
  const formatStatus = (status: RadiologyOrderStatus): string => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  };
  
  return (
    <div className="space-y-4">
      {/* Order Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center justify-between">
            <span>Order Information</span>
            <Badge variant={getStatusBadgeVariant(orderData.status)}>
              {formatStatus(orderData.status)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Order ID</p>
              <p>{orderData.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Modality</p>
              <p>{orderData.modality}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Body Part</p>
              <p>{orderData.bodyPart}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Contrast</p>
              <p>{orderData.contrast ? `Yes (${orderData.contrastType || 'Not specified'})` : 'No'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Created</p>
              <p>{formatDateTime(orderData.createdAt)} by {orderData.createdBy}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Last Updated</p>
              <p>{formatDateTime(orderData.updatedAt)} by {orderData.updatedBy}</p>
            </div>
          </div>
          
          {/* Override Information */}
          {orderData.overrideInfo?.isOverridden && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-sm font-medium text-amber-800">Override Information</p>
              <p className="text-sm text-amber-700">
                Overridden by {orderData.overrideInfo.overriddenBy} on {formatDateTime(orderData.overrideInfo.overriddenAt)}
              </p>
              <p className="text-sm text-amber-700">
                Reason: {orderData.overrideInfo.reason || 'No reason provided'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Patient Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Patient Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p>{orderData.patient.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Date of Birth</p>
              <p>{formatDate(orderData.patient.dob)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Medical Record Number</p>
              <p>{orderData.patient.mrn}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Patient ID</p>
              <p>{orderData.patient.pidn}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Insurance Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Insurance Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Provider</p>
              <p>{orderData.insurance.provider}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Member ID</p>
              <p>{orderData.insurance.memberId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Group Number</p>
              <p>{orderData.insurance.groupNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Primary Holder</p>
              <p>{orderData.insurance.primaryHolder} ({orderData.insurance.relationship})</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Verification Status</p>
              <Badge variant={orderData.insurance.verified ? 'success' : 'destructive'}>
                {orderData.insurance.verified ? 'Verified' : 'Not Verified'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Clinical Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Clinical Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Clinical Indications</p>
              <ul className="list-disc pl-5 mt-1">
                {orderData.clinicalIndications.map((indication, index) => (
                  <li key={index}>{indication}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">ICD-10 Codes</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {orderData.icd10Codes.map((code, index) => (
                  <Badge key={index} variant="outline">
                    {code.code}: {code.description}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">CPT Codes</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {orderData.cptCodes.map((code, index) => (
                  <Badge key={index} variant="outline">
                    {code.code}: {code.description}
                  </Badge>
                ))}
              </div>
            </div>
            
            {orderData.instructions && (
              <div>
                <p className="text-sm font-medium text-gray-500">Special Instructions</p>
                <p className="mt-1">{orderData.instructions}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Documents */}
      {orderData.documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {orderData.documents.map((doc) => (
                <li key={doc.id} className="py-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-gray-500">
                        {doc.type.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())} • 
                        Uploaded by {doc.uploadedBy} on {formatDateTime(doc.uploadedAt)}
                      </p>
                    </div>
                    <a
                      href={doc.url}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Document
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};