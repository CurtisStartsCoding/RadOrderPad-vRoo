import {
  handlePasteSummary,
  handlePasteSupplemental,
  updatePatientInfo,
  updateInsuranceInfo,
  sendToRadiology
} from './handlers';
import listPendingAdminOrders, {
  ListOptions,
  ListPendingAdminOrdersResponse
} from './list-pending-admin.service';
import {
  EmrSummaryResult,
  SupplementalDocResult,
  PatientUpdateData,
  PatientUpdateResult,
  InsuranceUpdateData,
  InsuranceUpdateResult,
  SendToRadiologyResult
} from './types';

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
  async handlePasteSummary(orderId: number, pastedText: string, userId: number): Promise<EmrSummaryResult> {
    return handlePasteSummary(orderId, pastedText, userId);
  }
  
  /**
   * Handle pasted supplemental documents
   * @param orderId Order ID
   * @param pastedText Pasted supplemental text
   * @param userId User ID
   * @returns Promise with result
   */
  async handlePasteSupplemental(orderId: number, pastedText: string, userId: number): Promise<SupplementalDocResult> {
    return handlePasteSupplemental(orderId, pastedText, userId);
  }
  
  /**
   * Update patient information
   * @param orderId Order ID
   * @param patientData Patient data
   * @param userId User ID
   * @returns Promise with result
   */
  async updatePatientInfo(orderId: number, patientData: PatientUpdateData, userId: number): Promise<PatientUpdateResult> {
    return updatePatientInfo(orderId, patientData, userId);
  }
  
  /**
   * Update insurance information
   * @param orderId Order ID
   * @param insuranceData Insurance data
   * @param userId User ID
   * @returns Promise with result
   */
  async updateInsuranceInfo(orderId: number, insuranceData: InsuranceUpdateData, userId: number): Promise<InsuranceUpdateResult> {
    return updateInsuranceInfo(orderId, insuranceData, userId);
  }
  
  /**
   * Send order to radiology
   * @param orderId Order ID
   * @param userId User ID
   * @returns Promise with result
   */
  async sendToRadiology(orderId: number, userId: number): Promise<SendToRadiologyResult> {
    return sendToRadiology(orderId, userId);
  }
  
  /**
   * List orders awaiting admin finalization
   * @param orgId Organization ID
   * @param options Pagination, sorting, and filtering options
   * @returns Promise with orders and pagination info
   */
  async listPendingAdminOrders(orgId: number, options: ListOptions): Promise<ListPendingAdminOrdersResponse> {
    return listPendingAdminOrders(orgId, options);
  }
}

export default new AdminOrderService();