/**
 * Service for handling admin order operations
 */
declare class AdminOrderService {
    /**
     * Handle pasted EMR summary
     * @param orderId Order ID
     * @param pastedText Pasted EMR summary text
     * @param userId User ID
     * @returns Promise with result
     */
    handlePasteSummary(orderId: number, pastedText: string, userId: number): Promise<any>;
    /**
     * Handle pasted supplemental documents
     * @param orderId Order ID
     * @param pastedText Pasted supplemental text
     * @param userId User ID
     * @returns Promise with result
     */
    handlePasteSupplemental(orderId: number, pastedText: string, userId: number): Promise<any>;
    /**
     * Update patient information
     * @param orderId Order ID
     * @param patientData Patient data
     * @param userId User ID
     * @returns Promise with result
     */
    updatePatientInfo(orderId: number, patientData: any, userId: number): Promise<any>;
    /**
     * Update insurance information
     * @param orderId Order ID
     * @param insuranceData Insurance data
     * @param userId User ID
     * @returns Promise with result
     */
    updateInsuranceInfo(orderId: number, insuranceData: any, userId: number): Promise<any>;
    /**
     * Send order to radiology
     * @param orderId Order ID
     * @param userId User ID
     * @returns Promise with result
     */
    sendToRadiology(orderId: number, userId: number): Promise<any>;
    /**
     * Parse EMR summary text to extract patient and insurance information
     * @param text EMR summary text
     * @returns Parsed data
     */
    private parseEmrSummary;
}
declare const _default: AdminOrderService;
export default _default;
