import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { AdminOrderData } from "../types";
import { formatDate } from "../utils/date-utils";

/**
 * Props for the OrderSummaryDisplay component
 */
interface OrderSummaryDisplayProps {
  /** Order data to display */
  orderData: AdminOrderData;
}

/**
 * OrderSummaryDisplay Component
 * 
 * Displays a read-only summary of the order, including modality,
 * body part, clinical indications, and validation results.
 */
export const OrderSummaryDisplay: React.FC<OrderSummaryDisplayProps> = ({
  orderData
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Modality</h4>
            <p className="text-sm">{orderData.modality}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Body Part</h4>
            <p className="text-sm">{orderData.bodyPart}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Contrast</h4>
            <p className="text-sm">
              {orderData.contrast ? `Yes (${orderData.contrastType || 'Not specified'})` : 'No'}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Created</h4>
            <p className="text-sm">{formatDate(orderData.createdAt)}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Clinical Indications</h4>
          <ul className="list-disc list-inside text-sm">
            {orderData.clinicalIndications.map((indication, index) => (
              <li key={index}>{indication}</li>
            ))}
          </ul>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-500 mb-1">ICD-10 Codes</h4>
          <div className="flex flex-wrap gap-2">
            {orderData.icd10Codes.map((code, index) => (
              <div key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                {code.code}: {code.description}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-500 mb-1">CPT Codes</h4>
          <div className="flex flex-wrap gap-2">
            {orderData.cptCodes.map((code, index) => (
              <div key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                {code.code}: {code.description}
              </div>
            ))}
          </div>
        </div>
        
        {orderData.instructions && (
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Special Instructions</h4>
            <p className="text-sm">{orderData.instructions}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};