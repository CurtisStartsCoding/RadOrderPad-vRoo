/**
 * Interface for order filter parameters
 */
export interface OrderFilters {
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
export interface PaginationResult {
    total: number;
    page: number;
    limit: number;
    pages: number;
}
/**
 * Interface for incoming orders result
 */
export interface IncomingOrdersResult {
    orders: any[];
    pagination: PaginationResult;
}
/**
 * Interface for order details
 */
export interface OrderDetails {
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
export interface OrderStatusUpdateResult {
    success: boolean;
    orderId: number;
    previousStatus: string;
    newStatus: string;
    message: string;
}
/**
 * Interface for information request result
 */
export interface InformationRequestResult {
    success: boolean;
    orderId: number;
    requestId: number;
    message: string;
}
