/**
 * Interface for order filter parameters
 */
interface OrderFilters {
    status?: string;
    referringOrgId?: number;
    priority?: string;
    modality?: string;
    startDate?: Date;
    endDate?: Date;
    validationStatus?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}
/**
 * Interface for pagination result
 */
interface PaginationResult {
    total: number;
    page: number;
    limit: number;
    pages: number;
}
/**
 * Interface for incoming orders result
 */
interface IncomingOrdersResult {
    orders: any[];
    pagination: PaginationResult;
}
/**
 * Interface for order details
 */
interface OrderDetails {
    order: any;
    patient: any;
    insurance: any[];
    clinicalRecords: any[];
    documentUploads: any[];
    validationAttempts: any[];
    orderHistory: any[];
}
/**
 * Interface for order status update result
 */
interface OrderStatusUpdateResult {
    success: boolean;
    orderId: number;
    previousStatus: string;
    newStatus: string;
    message: string;
}
/**
 * Interface for information request result
 */
interface InformationRequestResult {
    success: boolean;
    orderId: number;
    requestId: number;
    message: string;
}
/**
 * Service for handling radiology order operations
 */
declare class RadiologyOrderService {
    /**
     * Get incoming orders queue for radiology group
     * @param orgId Radiology organization ID
     * @param filters Filter parameters
     * @returns Promise with orders list
     */
    getIncomingOrders(orgId: number, filters?: OrderFilters): Promise<IncomingOrdersResult>;
    /**
     * Get full details of an order
     * @param orderId Order ID
     * @param orgId Radiology organization ID
     * @returns Promise with order details
     */
    getOrderDetails(orderId: number, orgId: number): Promise<OrderDetails>;
    /**
     * Export order data in specified format
     * @param orderId Order ID
     * @param format Export format (pdf, csv, json)
     * @param orgId Radiology organization ID
     * @returns Promise with exported data
     */
    exportOrder(orderId: number, format: string, orgId: number): Promise<any>;
    /**
     * Update order status
     * @param orderId Order ID
     * @param newStatus New status
     * @param userId User ID
     * @param orgId Radiology organization ID
     * @returns Promise with result
     */
    updateOrderStatus(orderId: number, newStatus: string, userId: number, orgId: number): Promise<OrderStatusUpdateResult>;
    /**
     * Request additional information from referring group
     * @param orderId Order ID
     * @param requestedInfoType Type of information requested
     * @param requestedInfoDetails Details of the request
     * @param userId User ID
     * @param orgId Radiology organization ID
     * @returns Promise with result
     */
    requestInformation(orderId: number, requestedInfoType: string, requestedInfoDetails: string, userId: number, orgId: number): Promise<InformationRequestResult>;
    /**
     * Generate CSV export of order data
     * @param orderDetails Order details object
     * @returns CSV string
     */
    private generateCsvExport;
    /**
     * Generate PDF export of order data
     * @param orderDetails Order details object
     * @returns PDF buffer
     */
    private generatePdfExport;
}
declare const _default: RadiologyOrderService;
export default _default;
