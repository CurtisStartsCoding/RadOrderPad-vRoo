import { queryPhiDb, getPhiDbClient } from '../config/db';
import { OrderStatus } from '../models';

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
class RadiologyOrderService {
  /**
   * Get incoming orders queue for radiology group
   * @param orgId Radiology organization ID
   * @param filters Filter parameters
   * @returns Promise with orders list
   */
  async getIncomingOrders(orgId: number, filters: OrderFilters = {}): Promise<IncomingOrdersResult> {
    try {
      // Build the query
      let query = `
        SELECT o.id, o.order_number, o.status, o.priority, o.modality, o.body_part, 
               o.final_cpt_code, o.final_cpt_code_description, o.final_validation_status,
               o.created_at, o.updated_at, o.patient_name, o.patient_dob, o.patient_gender,
               o.referring_physician_name, o.referring_organization_id
        FROM orders o
        WHERE o.radiology_organization_id = $1
      `;
      
      const queryParams: any[] = [orgId];
      let paramIndex = 2;
      
      // Add status filter - default to pending_radiology
      if (filters.status) {
        query += ` AND o.status = $${paramIndex}`;
        queryParams.push(filters.status);
        paramIndex++;
      } else {
        query += ` AND o.status = $${paramIndex}`;
        queryParams.push(OrderStatus.PENDING_RADIOLOGY);
        paramIndex++;
      }
      
      // Add referring organization filter
      if (filters.referringOrgId) {
        query += ` AND o.referring_organization_id = $${paramIndex}`;
        queryParams.push(filters.referringOrgId);
        paramIndex++;
      }
      
      // Add priority filter
      if (filters.priority) {
        query += ` AND o.priority = $${paramIndex}`;
        queryParams.push(filters.priority);
        paramIndex++;
      }
      
      // Add modality filter
      if (filters.modality) {
        query += ` AND o.modality = $${paramIndex}`;
        queryParams.push(filters.modality);
        paramIndex++;
      }
      
      // Add date range filter
      if (filters.startDate) {
        query += ` AND o.created_at >= $${paramIndex}`;
        queryParams.push(filters.startDate.toISOString());
        paramIndex++;
      }
      
      if (filters.endDate) {
        query += ` AND o.created_at <= $${paramIndex}`;
        queryParams.push(filters.endDate.toISOString());
        paramIndex++;
      }
      
      // Add validation status filter
      if (filters.validationStatus) {
        query += ` AND o.final_validation_status = $${paramIndex}`;
        queryParams.push(filters.validationStatus);
        paramIndex++;
      }
      
      // Add sorting
      if (filters.sortBy) {
        const validSortColumns = [
          'created_at', 'priority', 'modality', 'final_validation_status', 'patient_name'
        ];
        
        const sortBy = validSortColumns.includes(filters.sortBy) 
          ? filters.sortBy 
          : 'created_at';
        
        const sortOrder = filters.sortOrder === 'asc' ? 'ASC' : 'DESC';
        
        query += ` ORDER BY o.${sortBy} ${sortOrder}`;
      } else {
        // Default sorting: priority DESC (STAT first), then created_at DESC (newest first)
        query += ` ORDER BY 
          CASE WHEN o.priority = 'stat' THEN 0 ELSE 1 END,
          CASE WHEN o.final_validation_status = 'override' THEN 0 ELSE 1 END,
          o.created_at DESC`;
      }
      
      // Add pagination
      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const offset = (page - 1) * limit;
      
      query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      queryParams.push(limit, offset);
      
      // Execute the query
      const result = await queryPhiDb(query, queryParams);
      
      // Get total count for pagination
      let countQuery = `
        SELECT COUNT(*) as total
        FROM orders o
        WHERE o.radiology_organization_id = $1
        AND o.status = $2
      `;
      
      const countParams = [orgId, filters.status || OrderStatus.PENDING_RADIOLOGY];
      
      // Add the same filters as the main query
      let countParamIndex = 3;
      if (filters.referringOrgId) {
        countQuery += ` AND o.referring_organization_id = $${countParamIndex}`;
        countParams.push(filters.referringOrgId);
        countParamIndex++;
      }
      
      if (filters.priority) {
        countQuery += ` AND o.priority = $${countParamIndex}`;
        countParams.push(filters.priority);
        countParamIndex++;
      }
      
      if (filters.modality) {
        countQuery += ` AND o.modality = $${countParamIndex}`;
        countParams.push(filters.modality);
        countParamIndex++;
      }
      
      if (filters.startDate) {
        countQuery += ` AND o.created_at >= $${countParamIndex}`;
        countParams.push(filters.startDate.toISOString());
        countParamIndex++;
      }
      
      if (filters.endDate) {
        countQuery += ` AND o.created_at <= $${countParamIndex}`;
        countParams.push(filters.endDate.toISOString());
        countParamIndex++;
      }
      
      if (filters.validationStatus) {
        countQuery += ` AND o.final_validation_status = $${countParamIndex}`;
        countParams.push(filters.validationStatus);
        countParamIndex++;
      }
      
      const countResult = await queryPhiDb(countQuery, countParams);
      const totalCount = parseInt(countResult.rows[0].total);
      
      return {
        orders: result.rows,
        pagination: {
          total: totalCount,
          page,
          limit,
          pages: Math.ceil(totalCount / limit)
        }
      };
    } catch (error) {
      console.error('Error in getIncomingOrders:', error);
      throw error;
    }
  }
  
  /**
   * Get full details of an order
   * @param orderId Order ID
   * @param orgId Radiology organization ID
   * @returns Promise with order details
   */
  async getOrderDetails(orderId: number, orgId: number): Promise<OrderDetails> {
    try {
      // 1. Get the order
      const orderResult = await queryPhiDb(
        `SELECT o.*
         FROM orders o
         WHERE o.id = $1 AND o.radiology_organization_id = $2`,
        [orderId, orgId]
      );
      
      if (orderResult.rows.length === 0) {
        throw new Error(`Order ${orderId} not found or not authorized`);
      }
      
      const order = orderResult.rows[0];
      
      // 2. Get patient information
      const patientResult = await queryPhiDb(
        `SELECT p.*
         FROM patients p
         WHERE p.id = $1`,
        [order.patient_id]
      );
      
      const patient = patientResult.rows.length > 0 ? patientResult.rows[0] : null;
      
      // 3. Get insurance information
      const insuranceResult = await queryPhiDb(
        `SELECT i.*
         FROM patient_insurance i
         WHERE i.patient_id = $1
         ORDER BY i.is_primary DESC`,
        [order.patient_id]
      );
      
      const insurance = insuranceResult.rows;
      
      // 4. Get clinical records
      const clinicalRecordsResult = await queryPhiDb(
        `SELECT cr.*
         FROM patient_clinical_records cr
         WHERE cr.order_id = $1
         ORDER BY cr.added_at DESC`,
        [orderId]
      );
      
      const clinicalRecords = clinicalRecordsResult.rows;
      
      // 5. Get document uploads (links only)
      const documentUploadsResult = await queryPhiDb(
        `SELECT du.id, du.document_type, du.filename, du.file_path, du.mime_type, du.uploaded_at
         FROM document_uploads du
         WHERE du.order_id = $1
         ORDER BY du.uploaded_at DESC`,
        [orderId]
      );
      
      const documentUploads = documentUploadsResult.rows;
      
      // 6. Get validation attempts (summary)
      const validationAttemptsResult = await queryPhiDb(
        `SELECT va.id, va.attempt_number, va.validation_outcome, va.generated_compliance_score,
                va.created_at
         FROM validation_attempts va
         WHERE va.order_id = $1
         ORDER BY va.attempt_number ASC`,
        [orderId]
      );
      
      const validationAttempts = validationAttemptsResult.rows;
      
      // 7. Get order history
      const orderHistoryResult = await queryPhiDb(
        `SELECT oh.*
         FROM order_history oh
         WHERE oh.order_id = $1
         ORDER BY oh.created_at DESC`,
        [orderId]
      );
      
      const orderHistory = orderHistoryResult.rows;
      
      // Combine all data into a comprehensive order package
      return {
        order,
        patient,
        insurance,
        clinicalRecords,
        documentUploads,
        validationAttempts,
        orderHistory
      };
    } catch (error) {
      console.error('Error in getOrderDetails:', error);
      throw error;
    }
  }
  
  /**
   * Export order data in specified format
   * @param orderId Order ID
   * @param format Export format (pdf, csv, json)
   * @param orgId Radiology organization ID
   * @returns Promise with exported data
   */
  async exportOrder(orderId: number, format: string, orgId: number): Promise<any> {
    try {
      // Get the order details
      const orderDetails = await this.getOrderDetails(orderId, orgId);
      
      // Export based on format
      if (format === 'json') {
        return orderDetails;
      } else if (format === 'csv') {
        return this.generateCsvExport(orderDetails);
      } else if (format === 'pdf') {
        return this.generatePdfExport(orderDetails);
      } else {
        throw new Error(`Unsupported export format: ${format}`);
      }
    } catch (error) {
      console.error('Error in exportOrder:', error);
      throw error;
    }
  }
  
  /**
   * Update order status
   * @param orderId Order ID
   * @param newStatus New status
   * @param userId User ID
   * @param orgId Radiology organization ID
   * @returns Promise with result
   */
  async updateOrderStatus(
    orderId: number, 
    newStatus: string, 
    userId: number, 
    orgId: number
  ): Promise<OrderStatusUpdateResult> {
    // Get a client for transaction
    const client = await getPhiDbClient();
    
    try {
      // Start transaction
      await client.query('BEGIN');
      
      // 1. Verify order exists and belongs to the radiology group
      const orderResult = await client.query(
        `SELECT o.id, o.status, o.radiology_organization_id
         FROM orders o
         WHERE o.id = $1`,
        [orderId]
      );
      
      if (orderResult.rows.length === 0) {
        throw new Error(`Order ${orderId} not found`);
      }
      
      const order = orderResult.rows[0];
      
      if (order.radiology_organization_id !== orgId) {
        throw new Error(`Unauthorized: Order ${orderId} does not belong to your organization`);
      }
      
      // 2. Update the order status
      const previousStatus = order.status;
      
      await client.query(
        `UPDATE orders
         SET status = $1, updated_at = NOW(), updated_by_user_id = $2
         WHERE id = $3`,
        [newStatus, userId, orderId]
      );
      
      // 3. Log the event in order_history
      await client.query(
        `INSERT INTO order_history
         (order_id, user_id, event_type, previous_status, new_status, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [orderId, userId, `status_updated_to_${newStatus}`, previousStatus, newStatus]
      );
      
      // Commit transaction
      await client.query('COMMIT');
      
      // TODO: Implement notification to referring group (future enhancement)
      
      return {
        success: true,
        orderId,
        previousStatus,
        newStatus,
        message: `Order status updated to ${newStatus}`
      };
    } catch (error) {
      // Rollback transaction on error
      await client.query('ROLLBACK');
      console.error('Error in updateOrderStatus:', error);
      throw error;
    } finally {
      // Release client back to pool
      client.release();
    }
  }
  
  /**
   * Request additional information from referring group
   * @param orderId Order ID
   * @param requestedInfoType Type of information requested
   * @param requestedInfoDetails Details of the request
   * @param userId User ID
   * @param orgId Radiology organization ID
   * @returns Promise with result
   */
  async requestInformation(
    orderId: number,
    requestedInfoType: string,
    requestedInfoDetails: string,
    userId: number,
    orgId: number
  ): Promise<InformationRequestResult> {
    try {
      // 1. Verify order exists and belongs to the radiology group
      const orderResult = await queryPhiDb(
        `SELECT o.id, o.referring_organization_id, o.radiology_organization_id
         FROM orders o
         WHERE o.id = $1`,
        [orderId]
      );
      
      if (orderResult.rows.length === 0) {
        throw new Error(`Order ${orderId} not found`);
      }
      
      const order = orderResult.rows[0];
      
      if (order.radiology_organization_id !== orgId) {
        throw new Error(`Unauthorized: Order ${orderId} does not belong to your organization`);
      }
      
      // 2. Create information request
      const result = await queryPhiDb(
        `INSERT INTO information_requests
         (order_id, requested_by_user_id, requesting_organization_id, target_organization_id,
          requested_info_type, requested_info_details, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
         RETURNING id`,
        [
          orderId,
          userId,
          orgId,
          order.referring_organization_id,
          requestedInfoType,
          requestedInfoDetails,
          'pending'
        ]
      );
      
      const requestId = result.rows[0].id;
      
      // 3. Log the event in order_history
      await queryPhiDb(
        `INSERT INTO order_history
         (order_id, user_id, event_type, details, created_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [
          orderId,
          userId,
          'information_requested',
          `Requested information: ${requestedInfoType}`
        ]
      );
      
      // TODO: Implement notification to referring group (future enhancement)
      
      return {
        success: true,
        orderId,
        requestId,
        message: 'Information request created successfully'
      };
    } catch (error) {
      console.error('Error in requestInformation:', error);
      throw error;
    }
  }
  
  /**
   * Generate CSV export of order data
   * @param orderDetails Order details object
   * @returns CSV string
   */
  private generateCsvExport(orderDetails: OrderDetails): string {
    try {
      // Extract data from order details
      const { order, patient, insurance } = orderDetails;
      
      // Create a flattened object for CSV export
      const flatData: Record<string, any> = {
        // Order information
        order_id: order.id,
        order_number: order.order_number,
        status: order.status,
        priority: order.priority,
        modality: order.modality,
        body_part: order.body_part,
        laterality: order.laterality,
        cpt_code: order.final_cpt_code,
        cpt_description: order.final_cpt_code_description,
        icd10_codes: order.final_icd10_codes,
        icd10_descriptions: order.final_icd10_code_descriptions,
        clinical_indication: order.clinical_indication,
        validation_status: order.final_validation_status,
        compliance_score: order.final_compliance_score,
        contrast_indicated: order.is_contrast_indicated ? 'Yes' : 'No',
        
        // Patient information
        patient_id: patient?.id,
        patient_mrn: patient?.mrn,
        patient_first_name: patient?.first_name,
        patient_last_name: patient?.last_name,
        patient_dob: patient?.date_of_birth,
        patient_gender: patient?.gender,
        patient_address: patient?.address_line1,
        patient_address2: patient?.address_line2,
        patient_city: patient?.city,
        patient_state: patient?.state,
        patient_zip: patient?.zip_code,
        patient_phone: patient?.phone_number,
        patient_email: patient?.email,
        
        // Insurance information (primary only)
        insurance_provider: insurance?.[0]?.insurer_name,
        insurance_policy_number: insurance?.[0]?.policy_number,
        insurance_group_number: insurance?.[0]?.group_number,
        insurance_plan_type: insurance?.[0]?.plan_type,
        
        // Referring information
        referring_physician: order.referring_physician_name,
        referring_physician_npi: order.referring_physician_npi,
        
        // Dates
        created_at: order.created_at,
        updated_at: order.updated_at
      };
      
      // Create CSV header and data
      const header = Object.keys(flatData);
      
      // Generate CSV manually
      let csvString = header.join(',') + '\n';
      
      // Add the data row
      const values = header.map(key => {
        const value = flatData[key];
        // Handle values that might contain commas or quotes
        if (value === null || value === undefined) {
          return '';
        } else if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        } else {
          return String(value);
        }
      });
      
      csvString += values.join(',');
      
      return csvString;
    } catch (error) {
      console.error('Error generating CSV export:', error);
      throw new Error('Failed to generate CSV export');
    }
  }
  
  /**
   * Generate PDF export of order data
   * @param orderDetails Order details object
   * @returns PDF buffer
   */
  private generatePdfExport(orderDetails: OrderDetails): Buffer {
    try {
      // This is a placeholder implementation
      // In a real implementation, you would use a PDF generation library like jsPDF
      // to create a properly formatted PDF document
      
      // For now, we'll just return a simple JSON representation as a string
      // In a real implementation, this would be replaced with actual PDF generation code
      
      // Placeholder for PDF generation
      const pdfContent = JSON.stringify(orderDetails, null, 2);
      
      // Convert string to Buffer (in a real implementation, this would be the PDF buffer)
      return Buffer.from(pdfContent);
    } catch (error) {
      console.error('Error generating PDF export:', error);
      throw new Error('Failed to generate PDF export');
    }
  }
}

export default new RadiologyOrderService();