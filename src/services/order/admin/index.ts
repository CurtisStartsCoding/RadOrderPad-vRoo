import {
  handlePasteSummary,
  handlePasteSupplemental,
  updatePatientInfo,
  updateInsuranceInfo,
  sendToRadiology
} from './handlers';

/**
 * Service for handling admin order operations
 */
class AdminOrderService {
  /**
   * Handle pasted EMR summary
   * @param orderId Order ID
   * @param pastedText Pasted EMR summary text
   * @param userId User ID
   * @returns Promise with result
   */
  async handlePasteSummary(orderId: number, pastedText: string, userId: number) {
    return handlePasteSummary(orderId, pastedText, userId);
  }
  
  /**
   * Handle pasted supplemental documents
   * @param orderId Order ID
   * @param pastedText Pasted supplemental text
   * @param userId User ID
   * @returns Promise with result
   */
  async handlePasteSupplemental(orderId: number, pastedText: string, userId: number) {
    return handlePasteSupplemental(orderId, pastedText, userId);
  }
  
  /**
   * Update patient information
   * @param orderId Order ID
   * @param patientData Patient data
   * @param userId User ID
   * @returns Promise with result
   */
  async updatePatientInfo(orderId: number, patientData: any, userId: number) {
    return updatePatientInfo(orderId, patientData, userId);
  }
  
  /**
   * Update insurance information
   * @param orderId Order ID
   * @param insuranceData Insurance data
   * @param userId User ID
   * @returns Promise with result
   */
  async updateInsuranceInfo(orderId: number, insuranceData: any, userId: number) {
    return updateInsuranceInfo(orderId, insuranceData, userId);
  }
  
  /**
   * Send order to radiology
   * @param orderId Order ID
   * @param userId User ID
   * @returns Promise with result
   */
  async sendToRadiology(orderId: number, userId: number) {
    return sendToRadiology(orderId, userId);
  }
}

export default new AdminOrderService();