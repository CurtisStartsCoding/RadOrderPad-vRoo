/**
 * Update order status to pending_radiology
 * @param orderId Order ID
 * @param userId User ID
 * @returns Promise with result
 */
export declare function updateOrderStatusToRadiology(orderId: number, userId: number): Promise<void>;
/**
 * Validate patient data for required fields
 * @param patient Patient data
 * @returns Array of missing field names
 */
export declare function validatePatientData(patient: any): string[];
/**
 * Validate insurance data for required fields
 * @param insurance Insurance data
 * @returns Array of missing field names
 */
export declare function validateInsuranceData(insurance: any): string[];
declare const _default: {
    updateOrderStatusToRadiology: typeof updateOrderStatusToRadiology;
    validatePatientData: typeof validatePatientData;
    validateInsuranceData: typeof validateInsuranceData;
};
export default _default;
